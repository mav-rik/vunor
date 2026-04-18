import fs from 'node:fs'
import path from 'node:path'

import { createGenerator } from 'unocss'
import vue from '@vitejs/plugin-vue'
import { scan } from 'rolldown/experimental'

import { shortcuts as sc } from '../src/components/shortcuts'
import { presetVunor } from '../src/theme/preset-vunor'
import { c8 } from '../src/theme/shortcuts/c8'
import { i8 } from '../src/theme/shortcuts/i8'
import { mergeVunorShortcuts, toUnoShortcut } from '../src/theme/utils/shortcut-obj'

import type { TVunorShortcut } from '../src/theme/utils/define-sc'

// Replicate vunorShortcuts() locally to avoid importing theme.ts
// (theme.ts imports the generated file which doesn't exist yet)
function vunorShortcuts() {
  const merged = mergeVunorShortcuts([i8, c8, ...sc])
  for (const [key, val] of Object.entries(merged)) {
    merged[key] = typeof val === 'string' ? val : toUnoShortcut(val as TVunorShortcut)
  }
  return merged as Record<string, string>
}

const __dirname = import.meta.dirname
const PKG_ROOT = path.resolve(__dirname, '..')

// Step 1: Parse component entries from package.json exports
const pkgJson = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8'))
const componentEntries: Record<string, string> = {}

const knownTsExports = new Set(['.', './package.json', './theme', './utils', './vite', './nuxt'])
for (const exportPath of Object.keys(pkgJson.exports as Record<string, unknown>)) {
  if (knownTsExports.has(exportPath)) {continue}
  const match = exportPath.match(/^\.\/(\w+)$/)
  if (!match) {continue}
  const name = match[1]
  const found = findVueFile(path.join(PKG_ROOT, 'src', 'components'), `${name}.vue`)
  if (found) {componentEntries[name] = found}
}

function findVueFile(dir: string, filename: string): string | undefined {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      const found = findVueFile(fullPath, filename)
      if (found) {return found}
    } else if (file.name === filename) {
      return fullPath
    }
  }
}

console.log(`Found ${Object.keys(componentEntries).length} component entries`)

// Step 2: Build module graph via rolldown scan()
const moduleGraph = new Map<string, string[]>()
const entryIdMap = new Map<string, string>()

function stripQueryParams(id: string): string {
  const idx = id.indexOf('?')
  return idx >= 0 ? id.slice(0, idx) : id
}

const ASSET_RE = /\.(css|scss|less|styl|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|mp[34]|webm|ogg|pdf)(\?.*)?$/

const cleanup = await scan({
  input: Object.fromEntries(
    Object.entries(componentEntries).map(([name, filePath]) => [name, filePath])
  ),
  external: [
    'vue',
    'vue-router',
    'reka-ui',
    'defu',
    '@prostojs/palitra',
    '@unocss/preset-mini',
    '@vueuse/core',
    'unplugin-vue-components',
    '@nuxt/kit',
    '@nuxt/schema',
    'unocss',
    /^@internationalized\//,
    /^node:/,
    'path',
    'fs',
    'util',
    'os',
    'child_process',
    'stream',
    'buffer',
    'assert',
    'events',
  ],
  resolve: {
    alias: {
      'vunor/utils': path.resolve(PKG_ROOT, 'src/utils'),
      vunor: path.resolve(PKG_ROOT, 'src/vunor'),
    },
  },
  plugins: [
    {
      name: 'stub-assets',
      resolveId(source) {
        if (ASSET_RE.test(source)) {
          return { id: `\0stub:${source}`, external: true }
        }
      },
    },
    vue(),
    {
      name: 'collect-module-graph',
      moduleParsed(info) {
        moduleGraph.set(info.id, [
          ...info.importedIds,
          ...info.dynamicallyImportedIds,
        ])

        if (info.isEntry) {
          const cleanPath = stripQueryParams(info.id)
          for (const [name, filePath] of Object.entries(componentEntries)) {
            if (cleanPath === filePath) {
              entryIdMap.set(name, info.id)
              break
            }
          }
        }
      },
    },
  ],
})

await cleanup

console.log(`Module graph: ${moduleGraph.size} modules, ${entryIdMap.size} entries resolved`)

// Step 3: Walk graph per entry to find reachable .vue files
function collectVueFiles(entryId: string): Set<string> {
  const visited = new Set<string>()
  const vueFiles = new Set<string>()
  const queue = [entryId]

  while (queue.length > 0) {
    const id = queue.pop() as string
    if (visited.has(id)) {continue}
    visited.add(id)

    const cleanId = stripQueryParams(id)
    if (cleanId.endsWith('.vue') && !cleanId.includes('\0')) {
      vueFiles.add(cleanId)
    }

    const importedIds = moduleGraph.get(id)
    if (importedIds) {
      for (const importedId of importedIds) {
        if (!visited.has(importedId)) {
          queue.push(importedId)
        }
      }
    }
  }

  return vueFiles
}

// Step 4: Extract UnoCSS classes per component
const uno = await createGenerator({
  presets: [presetVunor()],
  shortcuts: [vunorShortcuts()],
})

const componentClassMap: Record<string, string[]> = {}

for (const [name, entryId] of entryIdMap) {
  const vueFiles = collectVueFiles(entryId)
  const allCode = [...vueFiles].map((f) => fs.readFileSync(f, 'utf8')).join('\n')
  const { matched } = await uno.generate(allCode, { preflights: false })
  componentClassMap[name] = [...matched].toSorted()
}

// Warn about components not found in the graph
for (const name of Object.keys(componentEntries)) {
  if (!entryIdMap.has(name)) {
    console.warn(`  Warning: ${name} was not resolved as an entry`)
  }
}

// Step 5: Write generated file
const outputDir = path.join(PKG_ROOT, 'src', 'theme', 'generated')
fs.mkdirSync(outputDir, { recursive: true })

const lines = [
  '// Auto-generated by scripts/extract-component-classes.ts',
  '// Do not edit manually.',
  '',
  'export const componentClasses: Record<string, string[]> = {',
]

for (const [name, classes] of Object.entries(componentClassMap).toSorted(([a], [b]) =>
  a.localeCompare(b)
)) {
  lines.push(`  ${name}: [`)
  for (const cls of classes) {
    lines.push(`    '${cls.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}',`)
  }
  lines.push('  ],')
}

lines.push('}')
lines.push('')
lines.push('export function getComponentClasses(...components: string[]): string[] {')
lines.push('  const set = new Set<string>()')
lines.push('  for (const name of components) {')
lines.push("    const key = name.startsWith('Vu') ? name.slice(2) : name")
lines.push('    for (const cls of componentClasses[key] ?? []) set.add(cls)')
lines.push('  }')
lines.push('  return [...set]')
lines.push('}')
lines.push('')

const outputPath = path.join(outputDir, 'component-classes.ts')
fs.writeFileSync(outputPath, lines.join('\n'), 'utf8')

console.log(
  `Generated component classes for ${Object.keys(componentClassMap).length} components → ${path.relative(PKG_ROOT, outputPath)}`
)

// Print summary
for (const [name, classes] of Object.entries(componentClassMap).toSorted(([a], [b]) =>
  a.localeCompare(b)
)) {
  console.log(`  ${name}: ${classes.length} classes`)
}
