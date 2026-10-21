// Checks the BUILT package (dist/), as consumers get it. Run after `pnpm build`
// via `pnpm test:dist` (the build script runs it as its last step).
//
// Static checks parse every dist file; the mount checks run mount-dist.mjs (see there
// and contract.mjs) in the production and the development Vue runtime.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { builtinModules } from 'node:module'
import os from 'node:os'
import path from 'node:path'

import { parseAst } from 'rolldown/parseAst'
import { describe, expect, it } from 'vitest'

import { defaultChanges } from './contract.mjs'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')) as {
  name: string
  exports: Record<string, unknown>
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

if (!fs.existsSync(dist)) {
  throw new Error('dist/ not found: run `pnpm build` first')
}

const distFiles = fs.readdirSync(dist)
const jsFiles = distFiles.filter(f => /\.m?js$/.test(f))
const dtsFiles = distFiles.filter(f => f.endsWith('.d.mts'))

type TNode = Record<string, unknown> & { type?: string }

function walk(node: unknown, visit: (n: TNode) => void) {
  if (!node || typeof node !== 'object') {
    return
  }
  if (Array.isArray(node)) {
    for (const child of node) {
      walk(child, visit)
    }
    return
  }
  visit(node as TNode)
  for (const value of Object.values(node)) {
    if (value && typeof value === 'object') {
      walk(value, visit)
    }
  }
}

function literal(node: unknown): string | undefined {
  const n = node as { type?: string; value?: unknown; literal?: unknown } | undefined
  if (n?.type === 'Literal' && typeof n.value === 'string') {
    return n.value
  }
  if (n?.type === 'TSLiteralType') {
    return literal(n.literal)
  }
  return undefined
}

function parse(file: string) {
  const code = fs.readFileSync(path.join(dist, file), 'utf8')
  return parseAst(
    code,
    { sourceType: 'module', lang: file.endsWith('.d.mts') ? 'dts' : 'js' },
    file
  )
}

/** import / export-from / dynamic import / import('x') type specifiers of a dist file */
function specifiersOf(file: string): string[] {
  const out: string[] = []
  walk(parse(file), n => {
    if (
      n.type === 'ImportDeclaration' ||
      n.type === 'ExportNamedDeclaration' ||
      n.type === 'ExportAllDeclaration' ||
      n.type === 'ImportExpression'
    ) {
      const value = literal(n.source)
      if (value !== undefined) {
        out.push(value)
      }
    } else if (n.type === 'TSImportType') {
      const value = literal(n.argument) ?? literal(n.source)
      if (value !== undefined) {
        out.push(value)
      }
    }
  })
  return out
}

function packageName(specifier: string) {
  const parts = specifier.split('/')
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
}

describe('dist imports', () => {
  const declared = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ])
  const builtins = new Set(builtinModules)
  const undeclaredIn = (file: string) =>
    specifiersOf(file).filter(spec => {
      if (spec.startsWith('./') || spec.startsWith('../')) {
        const resolved = path.join(dist, spec)
        return !fs.existsSync(resolved) && !fs.existsSync(resolved.replace(/\.(m?js)$/, '.d.mts'))
      }
      if (spec.startsWith('node:') || builtins.has(spec)) {
        return false
      }
      if (packageName(spec) === pkg.name) {
        // self-reference: must be a subpath the package exports
        const subpath = spec === pkg.name ? '.' : `.${spec.slice(pkg.name.length)}`
        return !(subpath in pkg.exports)
      }
      return !declared.has(packageName(spec))
    })

  it('dist contains the built entries and their declarations', () => {
    expect(jsFiles.length).toBeGreaterThan(0)
    expect(dtsFiles.length).toBeGreaterThan(0)
  })

  it.each(jsFiles)('%s: every bare import is a declared dependency or peerDependency', file => {
    expect(undeclaredIn(file)).toEqual([])
  })

  it.each(dtsFiles)(
    '%s: every bare type import is a declared dependency or peerDependency',
    file => {
      expect(undeclaredIn(file)).toEqual([])
    }
  )
})

function exportedFiles(): string[] {
  const files: string[] = []
  const collect = (value: unknown) => {
    if (typeof value === 'string') {
      files.push(path.normalize(path.join(root, value)))
    } else if (value && typeof value === 'object') {
      for (const nested of Object.values(value)) {
        collect(nested)
      }
    }
  }
  collect(pkg.exports)
  return files.filter(f => f.startsWith(dist + path.sep))
}

function resolveDistFile(from: string, spec: string): string | undefined {
  let base: string
  if (spec.startsWith('./') || spec.startsWith('../')) {
    base = path.join(path.dirname(from), spec)
  } else if (packageName(spec) === pkg.name) {
    return undefined // self-references go through package exports, all of which are entries
  } else {
    return undefined
  }
  const candidates = [
    base,
    base.replace(/\.m?js$/, '.d.mts'),
    `${base}.mjs`,
    `${base}.js`,
    `${base}.d.mts`,
  ]
  return candidates.find(c => fs.existsSync(c))
}

describe('dist files', () => {
  it('every file in dist is reachable from a package export (no stale chunks)', () => {
    const reached = new Set<string>()
    const queue = exportedFiles()
    for (let file = queue.pop(); file !== undefined; file = queue.pop()) {
      if (reached.has(file) || !fs.existsSync(file)) {
        continue
      }
      reached.add(file)
      for (const spec of specifiersOf(path.relative(dist, file))) {
        const target = resolveDistFile(file, spec)
        if (target) {
          queue.push(target)
        }
      }
    }
    const unreachable = distFiles.filter(f => !reached.has(path.join(dist, f)))
    expect(unreachable).toEqual([])
  })
})

describe('dist code', () => {
  it.each(jsFiles)('%s: no component is resolved by name at runtime', file => {
    // `resolveComponent('VuX')` happens when a template uses a component that is only
    // type-imported: it renders an unknown element instead of the component. vunor
    // imports every component it renders, so no name lookup is expected at all.
    const resolved: string[] = []
    walk(parse(file), n => {
      const callee = n.callee as { type?: string; name?: string } | undefined
      if (
        n.type === 'CallExpression' &&
        callee?.type === 'Identifier' &&
        (callee.name === 'resolveComponent' || callee.name === 'resolveDynamicComponent')
      ) {
        // a component object (`<component :is="Comp">`) is fine; a string is a name lookup
        const name = literal((n.arguments as unknown[])[0])
        if (name !== undefined) {
          resolved.push(name)
        }
      }
    })
    expect(resolved).toEqual([])
  })

  it.each(jsFiles)('%s: no build-time constant is left unresolved', file => {
    const constants = new Set<string>()
    walk(parse(file), n => {
      if (n.type === 'Identifier' && typeof n.name === 'string' && /^__\w+__$/.test(n.name)) {
        constants.add(n.name)
      }
    })
    expect([...constants]).toEqual([])
  })
})

interface TStateRead {
  actual: unknown
  exposed: Record<string, unknown>
}
interface TCase {
  messages?: string[]
  [key: string]: unknown
}
interface TReport {
  nodeEnv: string
  vueProdLoaded: boolean
  entries: Array<TCase & { entry: string; ok?: boolean }>
  attrs: Array<TCase & { name: string; skip?: string }>
  state: Array<TCase & { name: string; attr: string; mode: string; reached?: boolean }>
  contract: Array<
    TCase & {
      name: string
      kind: string
      key: string
      excluded?: string
      found?: boolean
      reached?: boolean
    }
  >
  behaviour: Array<TCase & { name: string; expected: Record<string, unknown> }>
  defaults: Record<
    string,
    TCase & { props: Record<string, string> | string; falseDefaults?: string[] }
  >
  modelState: Array<
    TCase & {
      name: string
      mode: string
      controlled?: boolean
      excluded?: string
      before?: TStateRead
      after?: TStateRead
      emitted?: number
      parentChange?: boolean
    }
  >
  emits: Array<TCase & { name: string; check: 'source' | 'sweep'; ignored?: number }>
  toggles: Array<
    TCase & {
      name: string
      gesture?: string
      excluded?: string
      emits?: boolean
      realBrowserOnly?: string
      mountEmitted?: unknown[]
      expected?: { shown: boolean[]; emitted: unknown[][] }
      steps?: Array<{ gesture: string; shown: boolean; emitted: unknown[] }>
    }
  >
  uncontrolled: Array<
    TCase & {
      name: string
      key: string
      controlled: string
      excluded?: string
      found?: boolean
      reached?: boolean
      uncontrolled?: boolean
    }
  >
}

const baselineFile = path.join(import.meta.dirname, 'defaults-baseline.json')
const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8')) as Record<
  string,
  Record<string, { props: Record<string, string> | string }> | undefined
>
const changelogFile = path.resolve(root, '../../CHANGELOG.md')
const changelog = fs.existsSync(changelogFile) ? fs.readFileSync(changelogFile, 'utf8') : ''

interface TPin {
  to: string
  text: string
}
type TDefaultChanges = Record<string, Record<string, TPin>>
type TSnapshot = Record<string, string> | string | undefined

const EMPTY_RENDER = new Set(['undefined', '""', '{}'])
const UNSET_BOOLEAN = new Set(['false', 'undefined'])

/** Whether two serialized snapshot values render the same */
function sameDefault(
  key: string,
  now: string,
  expected: string,
  falseDefaults: Set<string>
): boolean {
  if (now === expected) {
    return true
  }
  // an empty class / style renders nothing, like an absent one
  if (/\[attr\]\.(class|style)$/.test(key)) {
    return EMPTY_RENDER.has(now) && EMPTY_RENDER.has(expected)
  }
  // a prop whose definition defaults to `false` (a Boolean without default, or
  // `default: false`) behaves the same absent or false. Elsewhere `undefined` can mean
  // "uncontrolled" (Reka's `open`, `modelValue`), so false -> undefined is a change.
  return (
    falseDefaults.has(key.replace(/#\d+/, '')) &&
    UNSET_BOOLEAN.has(now) &&
    UNSET_BOOLEAN.has(expected)
  )
}

/** Differences of a defaults snapshot from 0.3.2 that are not the pinned intended changes */
function defaultDiffs(
  before: TSnapshot,
  now: TSnapshot,
  pinned: Record<string, TPin>,
  pairKeys: string[],
  falseDefaults: Set<string>
): string[] {
  if (typeof before === 'string' || typeof now === 'string' || !before || !now) {
    // rendered vs not rendered: only as a pinned `<render>` change
    const rendered = typeof now === 'string' ? now : 'rendered'
    const expected = '<render>' in pinned ? pinned['<render>'].to : before
    return rendered === expected ? [] : [`<render>: ${JSON.stringify(before)} -> ${rendered}`]
  }
  const changed: string[] = []
  for (const key of new Set([...Object.keys(before), ...Object.keys(now), ...pairKeys])) {
    // an absent key and an `undefined` value are the same default
    const was = before[key] ?? 'undefined'
    const value = now[key] ?? 'undefined'
    // a pin applies to every instance (`Name#2.prop` uses the `Name.prop` pin)
    const pin = pinned[key] ?? pinned[key.replace(/#\d+/, '')]
    const expected = pin ? pin.to : was
    if (!sameDefault(key, value, expected, falseDefaults)) {
      changed.push(`${key}: ${was} -> ${value}${pin ? ` (pinned: ${expected})` : ''}`)
    }
  }
  return changed
}

/** what every exposed value must be: the root's actual state */
function consistent(read?: TStateRead) {
  return Object.fromEntries(Object.keys(read?.exposed ?? {}).map(k => [k, read?.actual]))
}

function mountDist(nodeEnv: 'production' | 'development'): TReport {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vunor-dist-'))
  const outFile = path.join(outDir, `${nodeEnv}.json`)
  try {
    execFileSync(process.execPath, [path.join(import.meta.dirname, 'mount-dist.mjs'), outFile], {
      cwd: root,
      env: { ...process.env, NODE_ENV: nodeEnv },
      stdio: 'ignore',
    })
    return JSON.parse(fs.readFileSync(outFile, 'utf8')) as TReport
  } finally {
    fs.rmSync(outDir, { recursive: true, force: true })
  }
}

describe.each(['production', 'development'] as const)('dist under the %s Vue runtime', nodeEnv => {
  const report = mountDist(nodeEnv)

  it(`loads the ${nodeEnv} build of vue`, () => {
    expect(report.nodeEnv).toBe(nodeEnv)
    expect(report.vueProdLoaded).toBe(nodeEnv === 'production')
  })

  it.each(report.entries.map(r => [r.entry, r] as const))('entry %s imports', (_name, r) => {
    expect(r.messages).toEqual([])
    expect(r.ok).toBe(true)
  })

  it.each(report.attrs.filter(r => !r.skip).map(r => [r.name, r] as const))(
    '%s: class, style, id, data-*, aria-* and @click reach the root element',
    (_name, r) => {
      // any Vue warning or console message fails the case
      expect(r.messages).toEqual([])
      expect(r.isElement).toBe(true)
      expect({
        class: r.class,
        style: r.style,
        id: r.id,
        data: r.data,
        aria: r.aria,
        clicks: r.clicks,
      }).toEqual({ class: true, style: true, id: true, data: true, aria: true, clicks: 1 })
    }
  )

  // a state attribute vunor computes never replaces one passed by the consumer or
  // injected by a Reka as-child parent (contract.mjs `stateAttrs`, `asChildParents`)
  it.each(report.state.map(r => [r.name, r.attr, r.mode, r] as const))(
    '%s: `%s` (%s) is preserved on the rendered element',
    (_name, _attr, _mode, r) => {
      expect(r.messages).toEqual([])
      expect(r.reached, `rendered: ${JSON.stringify(r.rendered)}`).toBe(true)
    }
  )

  it.each(report.contract.filter(r => !r.excluded).map(r => [r.name, r.kind, r.key, r] as const))(
    '%s: %s `%s` reaches the wrapped component',
    (_name, _kind, _key, r) => {
      expect(r.messages).toEqual([])
      expect(r.found).toBe(true)
      expect(r.reached).toBe(true)
    }
  )

  // Default usage must render the wrapped components exactly as 0.3.2 did, unless the
  // change is intended: listed in contract.mjs `defaultChanges` AND in the CHANGELOG
  it.each(Object.entries(report.defaults))(
    '%s: default usage matches 0.3.2 (or a CHANGELOG-listed change)',
    (name, r) => {
      expect(r.messages).toEqual([])
      const before = baseline[nodeEnv]?.[name]?.props
      expect(
        before,
        `no 0.3.2 baseline for ${name}: re-record defaults-baseline.json`
      ).toBeDefined()
      if (typeof before === 'string' && before.startsWith('unmeasurable')) {
        return // documented in record-defaults-baseline.mjs
      }
      const changes = defaultChanges as TDefaultChanges
      const pinned = { ...changes['*'], ...changes[name] }
      const changed = defaultDiffs(
        before,
        r.props,
        pinned,
        Object.keys(changes[name] ?? {}),
        new Set(r.falseDefaults)
      )
      expect(changed).toEqual([])
      for (const [key, { text }] of Object.entries(pinned)) {
        expect(changelog, `${name} ${key}: CHANGELOG must mention "${text}"`).toContain(text)
      }
    }
  )

  // every `defaultX` works when `X` is not passed: the wrapped root stays uncontrolled
  it.each(
    report.uncontrolled.filter(r => !r.excluded).map(r => [r.name, r.key, r.controlled, r] as const)
  )('%s: `%s` works when `%s` is not passed (root uncontrolled)', (_name, _key, _controlled, r) => {
    expect(r.messages).toEqual([])
    expect(r.found).toBe(true)
    expect(r.reached).toBe(true)
    expect(r.uncontrolled, `root ${r.controlled} = ${String(r.controlledValue)}`).toBe(true)
  })

  // what a wrapper exposes about a model equals the root's actual state in every mode;
  // one toggle flips it once; a parent change (cleared model, changed default) never
  // makes the wrapper emit (contract.mjs `modelStateNotExposed`)
  it.each(report.modelState.filter(r => !r.excluded).map(r => [r.name, r] as const))(
    '%s: exposed state equals the root state',
    (_name, r) => {
      expect(r.messages).toEqual([])
      expect(r.before?.exposed).toEqual(consistent(r.before))
      if (!r.after) {
        return
      }
      expect(r.after.exposed).toEqual(consistent(r.after))
      if (r.parentChange) {
        expect(r.emitted).toBe(0)
        if (r.mode === 'default changed') {
          // Reka reads defaultX once
          expect(r.after.actual).toEqual(r.before?.actual)
        }
      } else if (r.controlled) {
        expect(r.after.actual).toEqual(r.before?.actual)
      } else {
        expect(r.after.actual).toBe(!r.before?.actual)
        if (r.mode === 'v-model') {
          expect(r.emitted).toBe(1)
        }
      }
    }
  )

  // one user gesture on an append icon / popup trigger toggles exactly once
  it.each(report.toggles.filter(r => !r.excluded).map(r => [r.name, r.gesture, r] as const))(
    '%s: %s opens, then closes (one toggle per gesture)',
    (_name, _gesture, r) => {
      expect(r.messages).toEqual([])
      if (r.realBrowserOnly) {
        return // e2e/toggle.spec.ts checks it in Chromium
      }
      expect(r.steps?.map(step => step.shown)).toEqual(r.expected?.shown)
      if (r.emits) {
        expect(r.mountEmitted).toEqual([])
        expect(r.steps?.map(step => step.emitted)).toEqual(r.expected?.emitted)
      }
    }
  )

  // every event a component emits is declared at runtime (no dev "neither declared" warning)
  it.each(report.emits.map(r => [r.name, r.check, r] as const))(
    '%s: every emit is declared (%s)',
    (_name, _check, r) => {
      expect(r.messages).toEqual([])
    }
  )

  it.each(report.behaviour.map(r => [r.name, r] as const))('%s', (_name, r) => {
    expect(r.messages).toEqual([])
    const actual = Object.fromEntries(Object.keys(r.expected).map(k => [k, r[k]]))
    expect(actual).toEqual(r.expected)
  })
})
