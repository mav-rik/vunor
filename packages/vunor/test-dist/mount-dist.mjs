// Mounts the built package (dist/) the way a consumer gets it and reports, as JSON (to the
// file given as the first argument, else stdout):
// - entries:   every package.json export imports without throwing
// - attrs:     class, style, id, data-*, aria-* and @click reach each component's root
// - contract:  every prop / emit of each wrapped component (contract.mjs) reaches it
// - behaviour: targeted checks (router links, form submission, open models)
// Every case also records Vue/console warnings and errors; the spec fails on any.
//
// dist.spec.ts runs this in a child process, once with NODE_ENV=production (so that
// `vue` resolves to its *.cjs.prod.js build) and once with NODE_ENV=development. The
// production runtime silently drops fallthrough attrs when a component renders a
// Fragment root; the dev runtime papers over comment-only fragments.
// It imports `vunor/*`, so it checks the package it lives in.
import fs from 'node:fs'
import Module, { createRequire } from 'node:module'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { format } from 'node:util'

import { GlobalWindow } from 'happy-dom'

import {
  asChildParents,
  defaultVariants,
  emitPayloads,
  emitSweepProps,
  modelStateNotExposed,
  POPUP_SELECTOR,
  TOGGLE,
  toggleCases,
  toggleNotApplicable,
  stateAttrs,
  values,
  wrappers,
} from './contract.mjs'

// Same approach as @happy-dom/global-registrator: copy the window's property
// descriptors onto globalThis (overriding Node's own Event/EventTarget so the DOM
// classes interoperate). Descriptors are copied, not read, so lazy Node getters stay idle.
const window = new GlobalWindow({ url: 'http://localhost/' })
const IGNORE = new Set(['constructor', 'undefined', 'NaN', 'global', 'globalThis', 'console'])
for (const key of Object.getOwnPropertyNames(window)) {
  if (IGNORE.has(key)) {
    continue
  }
  const desc = Object.getOwnPropertyDescriptor(window, key)
  const current = Object.getOwnPropertyDescriptor(globalThis, key)
  if (current?.value === undefined || current.value !== desc.value) {
    Object.defineProperty(globalThis, key, { ...desc, configurable: true })
  }
}
globalThis.window = window

const require = createRequire(import.meta.url)
const vue = await import('vue')
const { camelize, createApp, h, isRef, nextTick, ref, toHandlerKey } = vue
const vueProdLoaded = Object.keys(Module._cache).some(k => k.endsWith('runtime-core.cjs.prod.js'))
const reka = await import('reka-ui')
const { CalendarDate } = await import('@internationalized/date')
const VueRouter = await import('vue-router')

const pkg = require('../package.json')

const PROBE = {
  'class': 'probe-class',
  'style': 'order: 7',
  'id': 'probe-id',
  'data-probe': 'probe-data',
  'aria-label': 'probe-aria',
}

// ---------------------------------------------------------------- case plumbing

let messages = []
const { error: consoleError, warn: consoleWarn } = console
console.error = (...args) => messages.push(`error: ${format(...args)}`)
console.warn = (...args) => messages.push(`warn: ${format(...args)}`)
process.on('uncaughtException', e => messages.push(`uncaught: ${e?.stack ?? e}`))
process.on('unhandledRejection', e => messages.push(`unhandled: ${e?.stack ?? e}`))

async function tick(n = 3) {
  for (let i = 0; i < n; i++) {
    await nextTick()
    await sleep(2)
  }
}

const CASE_TIMEOUT = 10_000
let caseLabel = ''
const verbose = !!process.env.VUNOR_DIST_VERBOSE
// only for checking old builds that hang on a component (comma-separated names)
const skipped = new Set((process.env.VUNOR_DIST_SKIP ?? '').split(',').filter(Boolean))
let caseStart = 0

/** Runs one case; `body(mount, container)` returns the case's facts. Messages are collected. */
async function runCase(body) {
  if (verbose) {
    process.stderr.write(`${caseLabel} (${Date.now() - caseStart}ms prev)\n`)
    caseStart = Date.now()
  }
  messages = []
  document.body.innerHTML = ''
  const container = document.createElement('div')
  document.body.append(container)
  const apps = []
  const mount = (render, { plugins = [] } = {}) => {
    const app = createApp({ render })
    for (const plugin of plugins) {
      app.use(plugin)
    }
    app.config.errorHandler = e => messages.push(`handler: ${e?.stack ?? e}`)
    apps.push(app)
    app.mount(container)
    return app
  }
  let facts = {}
  const timer = new AbortController()
  const timeout = (async () => {
    try {
      await sleep(CASE_TIMEOUT, undefined, { signal: timer.signal })
    } catch {
      return undefined // aborted: the case already finished and won the race
    }
    throw new Error(`case timed out after ${CASE_TIMEOUT}ms`)
  })()
  try {
    facts = (await Promise.race([body(mount, container), timeout])) ?? {}
  } catch (error_) {
    messages.push(`threw: ${error_?.stack ?? error_}`)
  } finally {
    timer.abort()
  }
  await tick(1)
  for (const app of apps) {
    try {
      app.unmount()
    } catch (error_) {
      messages.push(`unmount: ${error_}`)
    }
  }
  return { ...facts, messages: [...new Set(messages)] }
}

async function loadComponent(name) {
  if (typeof name !== 'string') {
    return name
  }
  if (name.startsWith('vunor/')) {
    const mod = await import(name)
    return mod.default
  }
  if (!(name in reka)) {
    throw new Error(`unknown reka export ${name}`)
  }
  return reka[name]
}

/** First component instance of `type` under `instance` (portals included). */
function findInstance(instance, type) {
  const seen = new Set()
  const walk = vnode => {
    if (!vnode || typeof vnode !== 'object' || seen.has(vnode)) {
      return undefined
    }
    seen.add(vnode)
    if (vnode.component) {
      if (vnode.type === type) {
        return vnode.component
      }
      return walk(vnode.component.subTree)
    }
    if (Array.isArray(vnode.children)) {
      for (const child of vnode.children) {
        const found = walk(child)
        if (found) {
          return found
        }
      }
    }
    return undefined
  }
  return walk(instance?.subTree)
}

function routerPlugin() {
  return VueRouter.createRouter({
    history: VueRouter.createMemoryHistory(),
    routes: [{ path: '/:any(.*)*', component: { render: () => null } }],
  })
}

// ---------------------------------------------------------------- entries

const entryResults = []
for (const key of Object.keys(pkg.exports)) {
  if (key === './package.json') {
    continue
  }
  const specifier = key === '.' ? 'vunor' : `vunor/${key.slice(2)}`
  caseLabel = `entry ${specifier}`
  const result = await runCase(async () => {
    const mod = await import(specifier)
    const exportCount = Object.keys(mod).length
    if (specifier === 'vunor/nuxt') {
      return { ok: typeof mod.default === 'function' }
    }
    if (specifier === 'vunor/vite') {
      return { ok: mod.VunorVueResolver('VuButton')?.from === 'vunor/Button' }
    }
    if (/^\.\/[A-Z]/.test(key)) {
      return { ok: typeof mod.default === 'object' && mod.default !== null }
    }
    return { ok: exportCount > 0 }
  })
  entryResults.push({ entry: specifier, ...result })
}

// ---------------------------------------------------------------- attrs

/**
 * Per-component mount fixtures for the attrs check. Every exported component is mounted;
 * a fixture is needed only when the defaults do not fit.
 * - `component`: dist entry to mount (for extra variants of one component)
 * - `props`, `wrap`, `wrapProps`: how to render it
 * - `target`: element that must receive the attrs (default: the component's root
 *   element, or the first element it renders in place)
 * - `id`: where `id` goes when it is not a plain attr: a selector of the element that
 *   gets it, `'reka'` (Reka manages the element's id: a popover trigger), `'datepicker'`
 *   (the date field gets it) or `'skip: <reason>'`
 * - `clickTarget`: `click` is a declared component event (TInputEmits), emitted when the
 *   field is clicked: click this element (bubbling) instead of the root
 * - `skip`: the component renders no element of its own
 */
const attrFixtures = {
  'AppToasts': { target: () => document.querySelector('.toasts-viewport') },
  'Button': { props: { label: 'x' } },
  'Button[role=tab]': { component: 'Button', props: { label: 'x', role: 'tab' } },
  'Button[to]': { component: 'Button', props: { label: 'x', to: '/x' }, router: true },
  'ButtonBase': { props: { label: 'x' } },
  'Calendar': { target: () => document.querySelector('.calendar-root') },
  'CardHeader': { wrap: 'vunor/Card' },
  'CardInner': { wrap: 'vunor/Card' },
  'Checkbox': { props: { modelValue: false, label: 'x' }, id: '[role="checkbox"]' },
  'Combobox': { props: { items: ['a', 'b'] }, clickTarget: '.i8' },
  'Combobox[groupItem]': {
    component: 'Combobox',
    props: { items: ['a', 'b'], groupItem: true },
    clickTarget: '.i8',
  },
  'Combobox[multiple]': {
    component: 'Combobox',
    props: { items: ['a', 'b'], multiple: true },
    clickTarget: '.i8',
  },
  'Combobox[multiple,groupItem]': {
    component: 'Combobox',
    props: { items: ['a', 'b'], multiple: true, groupItem: true },
    clickTarget: '.i8',
    id: 'reka',
  },
  'Combobox[disabled]': {
    component: 'Combobox',
    props: { items: ['a'], disabled: true },
    clickTarget: '.i8',
  },
  'Combobox[disabled,groupItem]': {
    component: 'Combobox',
    props: { items: ['a'], disabled: true, groupItem: true },
    clickTarget: '.i8',
  },
  'DatePicker': { clickTarget: '.i8', id: 'datepicker' },
  'DatePickerBase': { id: 'datepicker' },
  'DatePickerInner': {
    wrap: 'DatePickerRoot',
    id: 'skip: the date field takes its id from the `id` prop of DatePickerRoot / VuDatePicker',
  },
  'DatePickerPopup': {
    wrap: 'DatePickerRoot',
    wrapProps: { open: true },
    target: () => document.querySelector('.date-picker-root'),
  },
  'DelayedSwitch': { skip: 'renderless: renders only its scoped slot' },
  'DevTools': {
    skip: 'renders only inside a Vite dev server (reads the UnoCSS dev stylesheet); single v-if root',
  },
  'Dialog': {
    props: { open: true, title: 't' },
    target: () => document.querySelector('.dialog-card'),
  },
  'Icon': { props: { name: 'i--x' } },
  'Input': { clickTarget: '.i8' },
  'Input[groupItem]': { component: 'Input', props: { groupItem: true }, clickTarget: '.i8' },
  'Menu': { props: { items: ['a', 'b'] }, target: () => document.querySelector('.menu-root') },
  'MenuItem': { props: { label: 'x' } },
  'OverflowContainer': { props: { items: ['a', 'b'] } },
  'Pagination': { props: { total: 50 } },
  'Popover': { id: 'reka' },
  'ProgressBar': { props: { modelValue: 50 } },
  'RadioGroup': { props: { items: ['a', 'b'] } },
  'Select': { props: { items: ['a', 'b'] }, clickTarget: '.i8' },
  'Select[groupItem]': {
    component: 'Select',
    props: { items: ['a', 'b'], groupItem: true },
    clickTarget: '.i8',
  },
  'SelectBase': { props: { items: ['a', 'b'] } },
  'Slider': { props: { modelValue: [10] } },
  'Tabs': { props: { tabs: [{ value: 'a' }, { value: 'b' }] } },
}

const componentNames = Object.keys(pkg.exports)
  .filter(k => /^\.\/[A-Z]/.test(k))
  .map(k => k.slice(2))

const attrCases = []
for (const name of componentNames) {
  attrCases.push([name, attrFixtures[name] ?? {}])
  for (const [key, fx] of Object.entries(attrFixtures)) {
    if (fx.component === name) {
      attrCases.push([key, fx])
    }
  }
}

/** Whether the probe `id` went where the fixture says (default: the root element). */
function idReached(fx, el) {
  const idEl = document.querySelector(`#${PROBE.id}`)
  if (fx.id?.startsWith('skip:')) {
    return true
  }
  if (fx.id === 'reka') {
    return !idEl && !!el.id
  }
  if (fx.id === 'datepicker') {
    return !!idEl && el.contains(idEl) && idEl !== el
  }
  if (fx.id) {
    return !!idEl && idEl.matches(fx.id)
  }
  return idEl === el
}

/**
 * Mounts a fixture with `props`; `inject` (if given) are attrs a Reka as-child parent
 * (`Primitive as-child`) merges into the component, the way Toggle / TabsTrigger do.
 * Returns the element that must receive fallthrough attrs.
 */
async function mountFixture(mount, container, name, fx, props, inject) {
  const Comp = await loadComponent(`vunor/${fx.component ?? name}`)
  const Wrap = fx.wrap ? await loadComponent(fx.wrap) : undefined
  let instance
  const component = () =>
    h(Comp, {
      ...fx.props,
      ...props,
      ref: el => {
        instance = el
      },
    })
  const node = inject
    ? () => h(reka.Primitive, { asChild: true, ...inject }, { default: component })
    : component
  const router = fx.router ? routerPlugin() : undefined
  mount(() => (Wrap ? h(Wrap, fx.wrapProps ?? {}, { default: node }) : node()), {
    plugins: router ? [router] : [],
  })
  if (router) {
    await router.isReady()
  }
  await tick()
  let el = fx.target ? fx.target() : instance?.$el
  if (!fx.target && el?.nodeType !== 1 && !Wrap) {
    el = container.firstElementChild
  }
  return el?.nodeType === 1 ? el : undefined
}

const attrResults = []
for (const [name, fx] of attrCases) {
  if (fx.skip || skipped.has(fx.component ?? name)) {
    attrResults.push({ name, skip: fx.skip ?? 'VUNOR_DIST_SKIP' })
    continue
  }
  caseLabel = `attrs ${name}`
  const result = await runCase(async (mount, container) => {
    let clicks = 0
    const el = await mountFixture(mount, container, name, fx, {
      ...PROBE,
      onClick: () => {
        clicks++
      },
    })
    const facts = { isElement: el?.nodeType === 1 }
    if (!facts.isElement) {
      return facts
    }
    facts.tag = el.tagName.toLowerCase()
    facts.class = el.classList.contains(PROBE.class)
    facts.style = el.style.order === '7'
    facts.data = el.dataset.probe === PROBE['data-probe']
    facts.aria = el.getAttribute('aria-label') === PROBE['aria-label']
    facts.id = idReached(fx, el)
    const clickEl = fx.clickTarget ? container.querySelector(fx.clickTarget) : el
    clickEl?.dispatchEvent(new window.MouseEvent('click', { bubbles: !!fx.clickTarget }))
    await tick(1)
    facts.clicks = clicks
    if (!(facts.class && facts.aria && facts.style && facts.data && facts.id)) {
      facts.html = document.body.innerHTML.slice(0, 3000)
    }
    return facts
  })
  attrResults.push({ name, ...result })
}

// ---------------------------------------------------------------- state attrs precedence

const stateResults = []
for (const [name, attrs] of Object.entries(stateAttrs)) {
  const fx = attrFixtures[name] ?? (componentNames.includes(name) ? {} : undefined)
  if (!fx) {
    stateResults.push({
      name,
      mode: 'fixture',
      attr: '*',
      messages: [`no attrs fixture for ${name}`],
    })
    continue
  }
  for (const attr of attrs) {
    for (const mode of ['plain', 'as-child parent']) {
      caseLabel = `state ${name} ${attr} ${mode}`
      const value = `probe-${attr}`
      const result = await runCase(async (mount, container) => {
        const el = await mountFixture(
          mount,
          container,
          name,
          fx,
          mode === 'plain' ? { [attr]: value } : {},
          mode === 'plain' ? undefined : { [attr]: value }
        )
        const rendered = el?.getAttribute(attr)
        return { reached: rendered === value, rendered: rendered ?? null }
      })
      stateResults.push({ name, attr, mode, ...result })
    }
  }
}
for (const c of asChildParents) {
  caseLabel = `as-child ${c.name}`
  const result = await runCase(async (mount, container) => {
    const Child = await loadComponent(`vunor/${c.child}`)
    const Parent = await loadComponent(c.parent)
    let node = () =>
      h(Parent, { asChild: true, ...c.parentProps }, { default: () => h(Child, c.childProps) })
    for (const [outer, props] of (c.within ?? []).toReversed()) {
      const Outer = await loadComponent(outer)
      const inner = node
      node = () => h(Outer, props, { default: inner })
    }
    mount(node)
    await tick()
    const el = container.querySelector('button') ?? document.querySelector('button')
    return {
      rendered: Object.fromEntries(
        Object.keys(c.expect).map(a => [a, el?.getAttribute(a) ?? null])
      ),
    }
  })
  stateResults.push({
    name: c.name,
    mode: 'reka parent',
    attr: Object.keys(c.expect).join(','),
    expected: c.expect,
    ...result,
    reached: JSON.stringify(result.rendered) === JSON.stringify(c.expect),
  })
}

// ---------------------------------------------------------------- forwarding contract

function keysOf(value) {
  return Array.isArray(value) ? value : Object.keys(value ?? {})
}

const helpers = { date: (y, m, d) => new CalendarDate(y, m, d) }

function probeValue(rootName, prop, definition) {
  for (const key of [`${rootName}.${prop}`, prop]) {
    if (key in values) {
      const value = values[key]
      return typeof value === 'function' ? value(helpers) : value
    }
  }
  const raw = definition?.type
  const types = (Array.isArray(raw) ? raw : [raw]).filter(Boolean)
  if (types.includes(Boolean)) {
    return definition.default !== true
  }
  if (types.length > 0 && types.every(t => t === Function)) {
    return function probeFunction() {
      return undefined
    }
  }
  if (types.includes(Number)) {
    return 37
  }
  if (types.includes(Array) && !types.includes(String)) {
    return ['probe']
  }
  return `probe-${prop}`
}

function emitPayload(rootName, event) {
  for (const key of [`${rootName}.${event}`, event]) {
    if (key in emitPayloads) {
      const value = emitPayloads[key]
      return typeof value === 'function' ? value(helpers) : value
    }
  }
  return { probe: event }
}

/** Stable, date-independent rendering of a prop value for the defaults snapshot */
function serialize(value) {
  if (value === undefined) {
    return 'undefined'
  }
  if (typeof value === 'function') {
    return 'function'
  }
  if (value && typeof value === 'object' && 'calendar' in value && 'year' in value) {
    return 'DateValue'
  }
  if (value && typeof value === 'object' && ('setup' in value || 'render' in value)) {
    return `component:${value.__name ?? value.name ?? '?'}`
  }
  if (typeof Node !== 'undefined' && value instanceof Node) {
    return `<${value.nodeName.toLowerCase()}>`
  }
  try {
    // generated ids (reka-…-v-12, v-3) depend on mount order: compare their shape
    return JSON.stringify(value)?.replaceAll(/v-\d+/g, 'v-#')
  } catch {
    return Object.prototype.toString.call(value)
  }
}

// generic building blocks (as/as-child plumbing, transitions, teleports): their props are
// only as/asChild/present, and what they render with is recorded on the component that
// passes it to them
const GENERIC = new Set(['Primitive', 'PrimitiveSlot', 'Presence', 'Teleport'])

/**
 * Whether a prop's effective default is `false`, read from the component definition: a
 * Boolean prop without a default (Vue casts absent to false) or with `default: false`.
 */
function defaultsToFalse(type, key) {
  const options = type.props
  if (!options || Array.isArray(options)) {
    return false
  }
  const definition = options[key]
  if (definition === Boolean) {
    return true
  }
  if (!definition || typeof definition !== 'object') {
    return false
  }
  if ('default' in definition) {
    return definition.default === false
  }
  const types = [definition.type].flat()
  return types.includes(Boolean)
}

/**
 * Props and attrs of the root and of every named component rendered inside it (every
 * instance, in render order; generic building blocks skipped), flattened to `Name.prop` /
 * `Name[attr].key` (`Name#2.prop` for the second instance). Going below the root catches
 * defaults that only take effect deeper (Reka's PopperContent defaults `avoidCollisions`
 * to true; PopoverContent passes a `false` it receives through), and attrs catch
 * DOM-level defaults (aria-pressed).
 */
function snapshotTree(rootInstance, falseDefaults) {
  const out = {}
  const seen = new Set()
  const names = new Map()
  const record = (instance, force) => {
    const name = instance.type.__name ?? instance.type.name ?? 'Anonymous'
    if (!force && (GENERIC.has(name) || name === 'Anonymous')) {
      return
    }
    // every instance, in render order: Name, Name#2, Name#3, ...
    const count = (names.get(name) ?? 0) + 1
    names.set(name, count)
    const label = count === 1 ? name : `${name}#${count}`
    for (const [key, value] of Object.entries(instance.props)) {
      out[`${label}.${key}`] = serialize(value)
      if (defaultsToFalse(instance.type, key)) {
        falseDefaults.add(`${label.replace(/#\d+$/, '')}.${key}`)
      }
    }
    for (const [key, value] of Object.entries(instance.attrs)) {
      if (value !== undefined) {
        out[`${label}[attr].${key}`] = serialize(value)
      }
    }
  }
  const walk = vnode => {
    if (!vnode || typeof vnode !== 'object' || seen.has(vnode)) {
      return
    }
    seen.add(vnode)
    if (vnode.component) {
      record(vnode.component, false)
      walk(vnode.component.subTree)
      return
    }
    if (Array.isArray(vnode.children)) {
      for (const child of vnode.children) {
        walk(child)
      }
    }
  }
  record(rootInstance, true)
  walk(rootInstance.subTree)
  return out
}

/** `props` without `key` (absent, not `undefined`) */
function omitKey(props, key) {
  if (key === undefined) {
    return props
  }
  const { [key]: _omitted, ...rest } = props
  return rest
}

const contractResults = []
const defaultResults = {}
const uncontrolledResults = []
for (const [wrapperName, wrapper] of Object.entries(wrappers)) {
  if (skipped.has(wrapperName)) {
    contractResults.push({ name: wrapperName, kind: 'skip', key: '*', excluded: 'VUNOR_DIST_SKIP' })
    continue
  }
  const Wrapper = await loadComponent(`vunor/${wrapperName}`)
  const Wrap = wrapper.wrap ? await loadComponent(wrapper.wrap) : undefined
  for (const target of wrapper.targets) {
    const Root = await loadComponent(target.root)
    const rootName = target.root.replace(/^vunor\//, '')
    const exclude = { ...target.exclude, ...target.unobservable }
    const mountWith = async (mount, extra, { settle = true, without } = {}) => {
      let instance
      const node = () =>
        h(
          Wrapper,
          {
            ...omitKey({ ...wrapper.props, ...target.props, ...extra }, without),
            ref: el => {
              instance = el
            },
          },
          wrapper.slot ? { default: () => h('span', 'probe') } : undefined
        )
      mount(() => (Wrap ? h(Wrap, wrapper.wrapProps ?? {}, { default: node }) : node()), {
        plugins: extra.to === undefined ? [] : [routerPlugin()],
      })
      if (settle) {
        await tick()
      }
      return findInstance(instance?.$, Root)
    }
    const name = `${wrapperName} → ${rootName}`
    // default usage: only what the wrapper needs to render; snapshot what reaches the root
    caseLabel = `${name} defaults`
    const defaults = await runCase(async mount => {
      const rootInstance = await mountWith(mount, {})
      const falseDefaults = new Set()
      return rootInstance
        ? { props: snapshotTree(rootInstance, falseDefaults), falseDefaults: [...falseDefaults] }
        : { props: 'not rendered' }
    })
    defaultResults[name] = defaults

    // every `defaultX` of the root works when `X` is not passed: the root stays
    // uncontrolled (`X` undefined) and receives `defaultX`
    for (const defaultProp of keysOf(Root.props).filter(k => /^default[A-Z]/.test(k))) {
      const stem = defaultProp.slice('default'.length)
      const controlled = stem === 'Value' ? 'modelValue' : stem[0].toLowerCase() + stem.slice(1)
      if (!(controlled in (Root.props ?? {})) || defaultProp in exclude || controlled in exclude) {
        continue
      }
      const selfManaged = target.selfManaged?.[defaultProp]
      if (selfManaged) {
        uncontrolledResults.push({ name, key: defaultProp, controlled, excluded: selfManaged })
        continue
      }
      const value = probeValue(rootName, defaultProp, Root.props[defaultProp])
      caseLabel = `${name} ${defaultProp} without ${controlled}`
      const result = await runCase(async mount => {
        const rootInstance = await mountWith(
          mount,
          {
            [target.alias?.[defaultProp] ?? defaultProp]: value,
          },
          // `X` is left out, even when the wrapper needs it to render (Slider): passing
          // `X: undefined` would skip Vue's absent-boolean cast and hide the bug. Checked
          // as mounted: happy-dom then dismisses popovers on its first focus pass, and the
          // wrapper's model follows that close like v-model would
          { settle: false, without: controlled }
        )
        if (!rootInstance) {
          return { found: false }
        }
        return {
          found: true,
          reached: Object.is(rootInstance.props[defaultProp], value),
          uncontrolled: rootInstance.props[controlled] === undefined,
          controlledValue: serialize(rootInstance.props[controlled]),
        }
      })
      uncontrolledResults.push({ name, key: defaultProp, controlled, ...result })
    }
    for (const prop of keysOf(Root.props)) {
      if (prop in exclude) {
        contractResults.push({ name, kind: 'prop', key: prop, excluded: exclude[prop] })
        continue
      }
      const value = probeValue(rootName, prop, Root.props[prop])
      caseLabel = `${name} prop ${prop}`
      // a model prop is passed the way v-model passes it: with its update listener
      const modelListener = keysOf(Root.emits).includes(`update:${prop}`)
        ? { [toHandlerKey(`update:${prop}`)]: () => undefined }
        : {}
      const wrapperProp = target.alias?.[prop] ?? prop
      const result = await runCase(async mount => {
        const rootInstance = await mountWith(mount, { [wrapperProp]: value, ...modelListener })
        if (!rootInstance) {
          return { found: false }
        }
        const received = rootInstance.props[prop]
        return { found: true, reached: Object.is(received, value), received: String(received) }
      })
      contractResults.push({ name, kind: 'prop', key: prop, ...result })
    }
    for (const event of keysOf(Root.emits)) {
      if (event in exclude) {
        contractResults.push({ name, kind: 'emit', key: event, excluded: exclude[event] })
        continue
      }
      const payload = emitPayload(rootName, event)
      caseLabel = `${name} emit ${event}`
      const result = await runCase(async mount => {
        const calls = []
        const rootInstance = await mountWith(mount, {
          [toHandlerKey(camelize(event))]: (...args) => calls.push(args),
        })
        if (!rootInstance) {
          return { found: false }
        }
        calls.length = 0
        rootInstance.emit(event, payload)
        await tick(1)
        // the root's payload arrives exactly once (a double-forwarded emit calls twice);
        // other calls are the test DOM's own (happy-dom dismisses popovers on focus)
        const withPayload = calls.filter(args => Object.is(args[0], payload)).length
        return { found: true, reached: withPayload === 1, calls: withPayload }
      })
      contractResults.push({ name, kind: 'emit', key: event, ...result })
    }
  }
}

// default usage of other modes (contract.mjs `defaultVariants`)
for (const variant of defaultVariants) {
  caseLabel = `${variant.name} defaults`
  const Root = await loadComponent(variant.root)
  const result = await runCase(async mount => {
    const Comp = await loadComponent(`vunor/${variant.component}`)
    let instance
    const router = variant.router ? routerPlugin() : undefined
    mount(
      () =>
        h(Comp, {
          ...variant.props,
          ref: el => {
            instance = el
          },
        }),
      { plugins: router ? [router] : [] }
    )
    if (router) {
      await router.isReady()
    }
    await tick()
    const rootInstance = findInstance(instance?.$, Root)
    const falseDefaults = new Set()
    return rootInstance
      ? { props: snapshotTree(rootInstance, falseDefaults), falseDefaults: [...falseDefaults] }
      : { props: 'not rendered' }
  })
  if (variant.allow) {
    result.messages = result.messages.filter(m => !m.includes(variant.allow))
  }
  defaultResults[variant.name] = result
}

// ---------------------------------------------------------------- model state: one source of truth

/** The root's actual state of `key`, read from the context it provides (`open`, `modelValue`, ...) */
function rootState(rootInstance, key) {
  const provides = rootInstance?.provides ?? {}
  for (const k of Reflect.ownKeys(provides)) {
    const context = provides[k]
    if (context && typeof context === 'object' && key in context && isRef(context[key])) {
      return context[key].value
    }
  }
  return undefined
}

const attrOf = (selector, name) => document.querySelector(selector)?.getAttribute(name) ?? null
const isTrue = value => value === 'true' || value === ''
/** The whole pointer sequence of a mouse click (Reka triggers act on pointerdown) */
function pointerClick(el) {
  const init = { bubbles: true, cancelable: true, button: 0, pointerType: 'mouse' }
  el?.dispatchEvent(new window.PointerEvent('pointerdown', init))
  el?.dispatchEvent(new window.MouseEvent('mousedown', init))
  el?.dispatchEvent(new window.PointerEvent('pointerup', init))
  el?.dispatchEvent(new window.MouseEvent('mouseup', init))
  el?.dispatchEvent(new window.MouseEvent('click', init))
}
const clickOn = selector => {
  document
    .querySelector(selector)
    ?.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }))
}
// happy-dom moves focus on mount, which Reka reads as an outside interaction and dismisses
// the popup; the tests keep it open the way a consumer would (VuPopover forwards the event)
const KEEP_POPOVER_OPEN = { onInteractOutside: event => event.preventDefault() }
const captureSlot =
  (extra = {}) =>
  capture => ({
    default: slot => {
      capture.slot = slot
      return h('button', { class: 'probe-trigger' }, 'T')
    },
    ...extra,
  })

/**
 * One entry per exposed model. `covers`: the wrapper model (`Wrapper.X`, from its
 * `update:X` emits); `pair`: the wrapped root model it mirrors (`Wrapper → Root.X`).
 * - `component` / `props` / `slots(capture)`: how to render it
 * - `model`: the wrapper's model prop; `rootKey`: the root context key holding the state
 *   (or `actual(rootInstance)`); `defaultKey`: the wrapper's `defaultX`, if any
 * - `values`: two probe values; `expect(rootValue)`: what every exposure must equal
 * - `exposed(capture)`: the exposures; `toggle(capture, before)`: one user toggle
 * - `focusSensitive`: an exposure also lights up on focus: read closed state blurred
 */
const openSubject = ({ covers, pair, component, exposed, toggle, props, slots, ...rest }) => ({
  covers,
  pair,
  component,
  model: 'open',
  rootKey: 'open',
  defaultKey: 'defaultOpen',
  values: [true, false],
  props: props ?? {},
  slots,
  exposed,
  expect: open => !!open,
  toggle,
  ...rest,
})
const stateSubjects = [
  openSubject({
    covers: 'Popover.open',
    pair: 'Popover → PopoverRoot.open',
    component: 'Popover',
    props: KEEP_POPOVER_OPEN,
    exposed: capture => ({ slotIsOpen: capture.slot?.isOpen }),
    toggle: capture => (capture.slot.isOpen ? capture.slot.close() : capture.slot.open()),
    slots: captureSlot({ content: () => h('div', 'x') }),
  }),
  openSubject({
    // VuPopover's plain `v-model` is an alias of `v-model:open`
    covers: 'Popover.modelValue',
    pair: 'Popover → PopoverRoot.open',
    component: 'Popover',
    props: KEEP_POPOVER_OPEN,
    model: 'modelValue',
    exposed: capture => ({ slotIsOpen: capture.slot?.isOpen }),
    toggle: capture => (capture.slot.isOpen ? capture.slot.close() : capture.slot.open()),
    slots: captureSlot({ content: () => h('div', 'x') }),
  }),
  openSubject({
    covers: 'Popover.open',
    pair: 'Popover → PopoverRoot.open',
    component: 'Popover',
    props: KEEP_POPOVER_OPEN,
    variant: 'default trigger',
    exposed: () => ({ triggerActive: attrOf('.btn', 'data-active') !== null }),
    toggle: () => clickOn('.btn'),
    slots: () => ({ content: () => h('div', 'x') }),
  }),
  openSubject({
    covers: 'SelectBase.open',
    pair: 'SelectBase → SelectRoot.open',
    component: 'SelectBase',
    exposed: capture => ({ slotOpen: capture.slot?.open }),
    toggle: capture => capture.slot.openPopup(),
    props: { items: ['a', 'b'] },
    slots: captureSlot(),
  }),
  openSubject({
    covers: 'Select.open',
    pair: 'Select → SelectRoot.open',
    component: 'Select',
    exposed: () => ({ shellActive: isTrue(attrOf('[data-group-active]', 'data-group-active')) }),
    toggle: () => clickOn('.i8'),
    props: { items: ['a', 'b'] },
    focusSensitive: true,
  }),
  openSubject({
    covers: 'Combobox.open',
    pair: 'Combobox → ComboboxRoot.open',
    component: 'Combobox',
    exposed: () => ({
      shellActive: isTrue(attrOf('[data-group-active]', 'data-group-active')),
      inputActive: isTrue(attrOf('.i8', 'data-active')),
      expanded: isTrue(attrOf('.i8', 'data-expanded')),
    }),
    toggle: () => clickOn('.i8'),
    props: { items: ['a', 'b'] },
    focusSensitive: true,
  }),
  // with `multiple`, `open` is the popover the user opens (the list inside is always open)
  ...['multiple', 'multiple,groupItem'].map(variant =>
    openSubject({
      covers: 'Combobox.open',
      pair: 'Combobox → PopoverRoot.open',
      variant,
      component: 'Combobox',
      root: 'PopoverRoot',
      exposed: () => ({
        // the field shell (VuInput, or the trigger itself with groupItem)
        expanded: isTrue(attrOf('.i8-combobox', 'data-expanded')),
        triggerActive: isTrue(attrOf('.combobox-embedded-input', 'data-active')),
        popup: !!document.querySelector('[data-reka-popper-content-wrapper]'),
      }),
      toggle: () => clickOn('.combobox-embedded-input'),
      props: Object.fromEntries([
        ['items', ['a', 'b']],
        ...variant.split(',').map(flag => [flag, true]),
      ]),
      focusSensitive: true,
    })
  ),
  openSubject({
    covers: 'DatePicker.open',
    pair: 'DatePicker → DatePickerRoot.open',
    component: 'DatePicker',
    exposed: () => ({
      shellActive: isTrue(attrOf('[data-group-active]', 'data-group-active')),
      popup: !!document.querySelector('.date-picker-root'),
    }),
    toggle: () => clickOn('[data-reka-date-field-segment="trigger"]'),
    focusSensitive: true,
  }),
  openSubject({
    covers: 'DatePickerBase.open',
    pair: 'DatePickerBase → DatePickerRoot.open',
    component: 'DatePickerBase',
    exposed: () => ({
      shellActive: isTrue(attrOf('.i8', 'data-active')),
      popup: !!document.querySelector('.date-picker-root'),
    }),
    toggle: () => clickOn('[data-reka-date-field-segment="trigger"]'),
    focusSensitive: true,
  }),
  openSubject({
    covers: 'Dialog.open',
    pair: 'Dialog → DialogRoot.open',
    component: 'Dialog',
    exposed: () => ({ card: !!document.querySelector('.dialog-card') }),
    // the dialog can only be closed from inside (its close button)
    toggle: (_capture, before) => (before.actual ? clickOn('.dialog-close') : false),
    props: { title: 't', closeButton: true },
    // closing keeps DialogRoot open for the 150ms animation
    settleMs: 200,
  }),
  {
    covers: 'Checkbox.modelValue',
    pair: 'Checkbox → CheckboxRoot.modelValue',
    component: 'Checkbox',
    model: 'modelValue',
    rootKey: 'state',
    defaultKey: 'defaultValue',
    values: [true, false],
    props: { label: 'x' },
    exposed: () => ({ checkmark: !!document.querySelector('.checkbox-icon') }),
    expect: state => state === true,
    toggle: () => clickOn('[role="checkbox"]'),
  },
  // custom checked / unchecked values: the mark follows Reka's state, not `=== true`
  ...[
    ['trueValue', { trueValue: 'yes', falseValue: 'no' }, ['yes', 'no']],
    ['falseValue', { falseValue: 'off' }, [true, 'off']],
  ].map(([variant, props, probeValues]) => ({
    covers: 'Checkbox.modelValue',
    pair: 'Checkbox → CheckboxRoot.modelValue',
    variant,
    component: 'Checkbox',
    model: 'modelValue',
    rootKey: 'state',
    defaultKey: 'defaultValue',
    values: probeValues,
    props: { label: 'x', ...props },
    exposed: () => ({ checkmark: !!document.querySelector('.checkbox-icon') }),
    expect: state => state === true,
    toggle: () => clickOn('[role="checkbox"]'),
  })),
  {
    covers: 'SelectBase.modelValue',
    pair: 'SelectBase → SelectRoot.modelValue',
    component: 'SelectBase',
    model: 'modelValue',
    rootKey: 'modelValue',
    defaultKey: 'defaultValue',
    values: ['a', 'b'],
    props: { items: ['a', 'b'] },
    slots: captureSlot(),
    exposed: capture => ({
      slotValue: capture.slot?.value,
      label: capture.slot?.displayItem?.label,
    }),
    expect: value => value,
  },
  // `multiple`: Reka's own default is `[]` (not `undefined`)
  ...['SelectBase', 'Select'].map(component => ({
    covers: `${component}.modelValue`,
    pair: `${component} → SelectRoot.modelValue`,
    variant: 'multiple',
    component,
    model: 'modelValue',
    rootKey: 'modelValue',
    defaultKey: 'defaultValue',
    values: [['a'], ['b']],
    props: { items: ['a', 'b'], multiple: true },
    slots: component === 'SelectBase' ? captureSlot() : undefined,
    exposed: capture =>
      component === 'SelectBase'
        ? { slotValue: capture.slot?.value }
        : { shown: document.querySelector('.i8 input')?.value || undefined },
    expect: value => (component === 'SelectBase' ? value : value?.join(', ') || undefined),
  })),
  {
    covers: 'Select.modelValue',
    pair: 'Select → SelectRoot.modelValue',
    component: 'Select',
    model: 'modelValue',
    rootKey: 'modelValue',
    defaultKey: 'defaultValue',
    values: ['a', 'b'],
    props: { items: ['a', 'b'] },
    exposed: () => ({ shown: document.querySelector('.i8 input')?.value || undefined }),
    expect: value => value,
  },
  {
    covers: 'Combobox.modelValue',
    pair: 'Combobox → ComboboxRoot.modelValue',
    component: 'Combobox',
    model: 'modelValue',
    rootKey: 'modelValue',
    defaultKey: 'defaultValue',
    values: ['a', 'b'],
    props: { items: ['a', 'b'] },
    exposed: () => ({ shown: document.querySelector('input')?.value || undefined }),
    expect: value => value,
  },
  {
    covers: 'Combobox.modelValue',
    pair: 'Combobox → ComboboxRoot.modelValue',
    variant: 'multiple',
    component: 'Combobox',
    model: 'modelValue',
    rootKey: 'modelValue',
    defaultKey: 'defaultValue',
    values: [['a'], ['b']],
    props: { items: ['a', 'b'], multiple: true },
    // with `multiple`, ComboboxRoot lives in the popover: open it to compare
    prepare: () => clickOn('.combobox-embedded-input'),
    exposed: () => ({
      shown: document.querySelector('.combobox-multi-items')?.textContent?.trim() || undefined,
    }),
    expect: value => (value?.length ? value.join(', ') : undefined),
  },
  {
    covers: 'Combobox.searchTerm',
    pair: 'Combobox → ComboboxInput.searchTerm',
    component: 'Combobox',
    model: 'searchTerm',
    root: 'ComboboxInput',
    actual: rootInstance => rootInstance?.props.modelValue,
    values: ['a', 'b'],
    props: { items: ['apple', 'banana'] },
    exposed: () => ({ typed: document.querySelector('input')?.value || undefined }),
    expect: value => value || undefined,
  },
  {
    covers: 'Slider.modelValue',
    pair: 'Slider → SliderRoot.modelValue',
    component: 'Slider',
    model: 'modelValue',
    rootKey: 'modelValue',
    defaultKey: 'defaultValue',
    values: [[30], [60]],
    props: { displayValue: true },
    exposed: () => ({ label: document.querySelector('.text-label')?.textContent?.trim() }),
    expect: value => (value ?? []).join(' | '),
  },
]

const modelStateResults = []
const coverageFailure = (name, why) =>
  modelStateResults.push({ name, mode: 'coverage', messages: [why] })

// 1. every root model X with a defaultX (from the Reka definitions) has a reader
for (const [wrapperName, wrapper] of Object.entries(wrappers)) {
  for (const target of wrapper.targets) {
    const Root = await loadComponent(target.root)
    const rootName = target.root.replace(/^vunor\//, '')
    const exclude = { ...target.exclude, ...target.unobservable }
    for (const defaultProp of keysOf(Root.props).filter(k => /^default[A-Z]/.test(k))) {
      const stem = defaultProp.slice('default'.length)
      const model = stem === 'Value' ? 'modelValue' : stem[0].toLowerCase() + stem.slice(1)
      if (!(model in (Root.props ?? {})) || model in exclude || defaultProp in exclude) {
        continue
      }
      const pair = `${wrapperName} → ${rootName}.${model}`
      if (modelStateNotExposed[pair]) {
        modelStateResults.push({ name: pair, mode: '-', excluded: modelStateNotExposed[pair] })
      } else if (!stateSubjects.some(s => s.pair === pair)) {
        coverageFailure(pair, 'no state reader in mount-dist.mjs and not in modelStateNotExposed')
      }
    }
  }
}
// 2. every model a wrapper exposes (its `update:X` emits) has a reader
for (const name of componentNames) {
  const Comp = await loadComponent(`vunor/${name}`)
  for (const event of keysOf(Comp.emits).filter(e => e.startsWith('update:'))) {
    const covers = `${name}.${event.slice('update:'.length)}`
    if (modelStateNotExposed[covers]) {
      modelStateResults.push({ name: covers, mode: '-', excluded: modelStateNotExposed[covers] })
    } else if (!stateSubjects.some(s => s.covers === covers)) {
      coverageFailure(covers, 'no state reader in mount-dist.mjs and not in modelStateNotExposed')
    }
  }
}

async function runStateCase(subject, label, mode, initialProps, change) {
  const Wrapper = await loadComponent(`vunor/${subject.component}`)
  const Root = await loadComponent(subject.root ?? subject.pair.split(' → ')[1].split('.')[0])
  const { model } = subject
  const listenerKey = toHandlerKey(`update:${model}`)
  caseLabel = `state ${label}`
  const result = await runCase(async mount => {
    const capture = {}
    const bound = ref(initialProps === 'v-model cycle' ? undefined : subject.values[1])
    const props = ref(initialProps)
    const emitted = []
    let instance
    mount(() =>
      h(
        Wrapper,
        {
          ...subject.props,
          ...(props.value === 'v-model' || props.value === 'v-model cycle'
            ? {
                [model]: bound.value,
                [listenerKey]: v => {
                  emitted.push(v)
                  bound.value = v
                },
              }
            : { ...props.value, [listenerKey]: v => emitted.push(v) }),
          ref: el => {
            instance = el
          },
        },
        subject.slots?.(capture)
      )
    )
    await nextTick()
    await nextTick()
    if (subject.prepare) {
      subject.prepare(capture)
      await nextTick()
      await nextTick()
    }
    const rootInstance = () => findInstance(instance?.$, Root)
    const read = async () => {
      const raw = subject.actual
        ? subject.actual(rootInstance())
        : rootState(rootInstance(), subject.rootKey ?? model)
      const actual = subject.expect(raw)
      if (subject.focusSensitive && !actual) {
        // closed: focus alone must not keep the shell "active"
        document.activeElement?.blur?.()
        await nextTick()
      }
      // `undefined` -> null: JSON would drop the key and the check would pass vacuously
      const exposed = Object.fromEntries(
        Object.entries(subject.exposed(capture, actual)).map(([k, v]) => [k, v ?? null])
      )
      return { actual: actual ?? null, exposed }
    }
    const before = await read()
    const facts = { before }
    emitted.length = 0
    if (initialProps === 'v-model cycle') {
      // a v-model that starts undefined, is set, then cleared: no warnings (Reka Presence
      // requires a boolean), no emit from the wrapper, the exposures follow the root
      bound.value = subject.values[0]
      await nextTick()
      await nextTick()
      bound.value = undefined
      await nextTick()
      await nextTick()
      facts.after = await read()
      facts.emitted = emitted.length
      facts.parentChange = true
      return facts
    }
    if (change) {
      // the parent changes props: the wrapper must not emit, and must still mirror the root
      props.value = change
      await nextTick()
      await nextTick()
      facts.after = await read()
      facts.emitted = emitted.length
      facts.parentChange = true
      return facts
    }
    if (subject.toggle && subject.toggle(capture, before) !== false) {
      await nextTick()
      await nextTick()
      if (subject.settleMs) {
        await sleep(subject.settleMs)
      }
      facts.after = await read()
      facts.emitted = emitted.length
    }
    return facts
  })
  modelStateResults.push({
    name: label,
    pair: subject.pair,
    mode,
    controlled: mode.startsWith('controlled'),
    ...result,
  })
}

for (const subject of stateSubjects) {
  const name = `${subject.covers}${subject.variant ? `[${subject.variant}]` : ''} → ${subject.pair.split(' → ')[1]}`
  const [first, second] = subject.values
  const { model, defaultKey } = subject
  if (defaultKey) {
    await runStateCase(subject, `${name} uncontrolled (default)`, 'uncontrolled', {
      [defaultKey]: first,
    })
    // Reka reads defaultX once: a later change must leave root and wrapper in step
    await runStateCase(
      subject,
      `${name} default changed after mount`,
      'default changed',
      { [defaultKey]: first },
      { [defaultKey]: second }
    )
  }
  for (const value of [first, second]) {
    await runStateCase(subject, `${name} controlled ${JSON.stringify(value)}`, 'controlled', {
      [model]: value,
      [toHandlerKey(`update:${model}`)]: () => undefined,
    })
  }
  await runStateCase(subject, `${name} v-model`, 'v-model', 'v-model')
  await runStateCase(
    subject,
    `${name} v-model undefined → set → cleared`,
    'v-model cycle',
    'v-model cycle'
  )
  // the parent clears a controlled model: no emit, the exposures follow the root
  await runStateCase(
    subject,
    `${name} controlled → undefined`,
    'controlled cleared',
    { [model]: first },
    {}
  )
}

// ---------------------------------------------------------------- one gesture, one toggle

/**
 * Discovery: every component (and attrs-fixture variant) that renders an append icon or a
 * popup trigger needs a case in contract.mjs `toggleCases` (or a reason in
 * `toggleNotApplicable`). Each case then makes two gestures on its icon / trigger and
 * must do what it `expected` (default: open, then close), one `update:open` per gesture
 * where the component emits it (a click on an icon also bubbles to the field shell: both
 * must not toggle). `keys`: the trigger must also open and close from the keyboard.
 */
const popupShown = () => !!document.querySelector(POPUP_SELECTOR)
// the component's own icon / trigger (popups are portaled outside the container)
const lastIn = (container, selector) => [...container.querySelectorAll(selector)].at(-1)
const TOGGLE_MARKERS = '.i8-icon-wrap, [aria-haspopup], [aria-expanded], [data-vu-trigger]'

const toggleResults = []
for (const [name, fx] of attrCases) {
  if (fx.skip || toggleCases[name]) {
    continue
  }
  caseLabel = `toggle discovery ${name}`
  const found = await runCase(async (mount, container) => {
    await mountFixture(mount, container, name, fx, {})
    return { markers: !!document.querySelector(TOGGLE_MARKERS) }
  })
  if (found.markers) {
    toggleResults.push(
      toggleNotApplicable[name]
        ? { name, excluded: toggleNotApplicable[name] }
        : { name, messages: ['renders an append icon or trigger but has no toggle case'] }
    )
  }
}

for (const [name, toggle] of Object.entries(toggleCases)) {
  const Comp = await loadComponent(`vunor/${toggle.component}`)
  const gestures = [['click', 'click']]
  if (toggle.keys) {
    gestures.push(['Enter', 'Space'])
  }
  for (const [first, second] of gestures) {
    caseLabel = `toggle ${name} ${first}/${second}`
    const result = await runCase(async (mount, container) => {
      const emitted = []
      mount(() =>
        h(
          Comp,
          {
            ...toggle.props,
            ...(toggle.component === 'Popover' ? KEEP_POPOVER_OPEN : {}),
            'onUpdate:open': v => emitted.push(v),
          },
          { content: () => h('div', { class: 'probe-popup' }, 'content') }
        )
      )
      await tick()
      const gesture = async kind => {
        const el = lastIn(container, toggle.icon)
        if (kind === 'click') {
          pointerClick(el)
        } else {
          el?.focus()
          el?.dispatchEvent(
            new window.KeyboardEvent('keydown', {
              key: kind === 'Space' ? ' ' : kind,
              code: kind,
              bubbles: true,
              cancelable: true,
            })
          )
        }
        await nextTick()
        await nextTick()
      }
      // mounting is not a user gesture: nothing may be emitted for it
      const mountEmitted = [...emitted]
      const steps = []
      for (const kind of [first, second]) {
        emitted.length = 0
        await gesture(kind)
        steps.push({ gesture: kind, shown: popupShown(), emitted: [...emitted] })
      }
      return {
        mountEmitted,
        steps,
        expected: toggle.expected ?? TOGGLE,
        emits: toggle.emits,
        realBrowserOnly: toggle.realBrowserOnly,
      }
    })
    toggleResults.push({ name, gesture: `${first} then ${second}`, ...result })
  }
}

// ---------------------------------------------------------------- behaviour

const behaviourResults = []
async function behaviour(name, expected, body, allow) {
  caseLabel = name
  const result = await runCase(body)
  if (allow) {
    result.allowed = result.messages.filter(m => allow.test(m))
    result.messages = result.messages.filter(m => !allow.test(m))
  }
  behaviourResults.push({ name, expected, ...result })
}

const Button = await loadComponent('vunor/Button')
const Select = await loadComponent('vunor/Select')
const SelectBase = await loadComponent('vunor/SelectBase')
const Popover = await loadComponent('vunor/Popover')
const Dialog = await loadComponent('vunor/Dialog')
const Combobox = await loadComponent('vunor/Combobox')
const NO_ROUTER_WARNING = /VuButton: `to` is set but the app has no router/

await behaviour(
  'Button `to` without a router renders <a href> (no stray `to` attr, dev warning)',
  { tag: 'a', href: '/x', toAttr: null, warned: process.env.NODE_ENV !== 'production' },
  async (mount, container) => {
    mount(() => h(Button, { to: '/x', label: 'go' }))
    await tick()
    const a = container.firstElementChild
    return {
      tag: a?.tagName.toLowerCase(),
      href: a?.getAttribute('href'),
      toAttr: a?.getAttribute('to'),
      warned: messages.some(m => NO_ROUTER_WARNING.test(m)),
    }
  },
  NO_ROUTER_WARNING
)
await behaviour(
  'Button `to` with a router renders a RouterLink that navigates on click',
  { tag: 'a', href: '/x', toAttr: null, route: '/x', clicks: 1 },
  async (mount, container) => {
    const router = routerPlugin()
    let clicks = 0
    mount(() => h(Button, { to: '/x', label: 'go', onClick: () => clicks++ }), {
      plugins: [router],
    })
    await router.isReady()
    await tick()
    const a = container.firstElementChild
    a?.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }))
    await tick()
    return {
      tag: a?.tagName.toLowerCase(),
      href: a?.getAttribute('href'),
      toAttr: a?.getAttribute('to'),
      route: router.currentRoute.value.path,
      clicks,
    }
  }
)
for (const [label, Comp] of [
  ['Select', Select],
  ['SelectBase', SelectBase],
]) {
  await behaviour(
    `${label} \`name\` submits the value with the enclosing form`,
    { value: 'a' },
    async mount => {
      mount(() =>
        h('form', { id: 'probe-form' }, [
          h(Comp, { items: ['a', 'b'], modelValue: 'a', name: 'country' }),
        ])
      )
      await tick()
      const data = new window.FormData(document.querySelector('#probe-form'))
      return { value: data.get('country') }
    }
  )
}
// happy-dom dismisses an open popover on mount (spurious focus-outside), so the open
// state is checked as v-model would control it: with an update listener that keeps it
for (const [label, props] of [
  ['v-model:open', { 'open': true, 'onUpdate:open': () => undefined }],
  ['v-model', { 'modelValue': true, 'onUpdate:modelValue': () => undefined }],
]) {
  await behaviour(`Popover ${label} opens the popup`, { shown: true }, async mount => {
    mount(() => h(Popover, props, { content: () => h('div', { class: 'probe-popup' }, 'x') }))
    await tick()
    return { shown: !!document.querySelector('.probe-popup') }
  })
}
// default-open must open each wrapper (checked right after mount: happy-dom dismisses
// uncontrolled popovers on its first focus pass)
for (const [label, props] of [
  ['Popover', {}],
  ['Select', { items: ['a', 'b'] }],
  ['SelectBase', { items: ['a', 'b'] }],
  ['Combobox', { items: ['a', 'b'] }],
  ['DatePicker', {}],
  ['DatePickerBase', {}],
]) {
  await behaviour(`${label} default-open opens it`, { expanded: 'true' }, async mount => {
    const Comp = await loadComponent(`vunor/${label}`)
    mount(() => h(Comp, { ...props, defaultOpen: true }, { content: () => h('div', 'x') }))
    await nextTick()
    return {
      expanded: document.querySelector('[aria-expanded]')?.getAttribute('aria-expanded') ?? null,
    }
  })
}
// a link cannot be natively disabled: disabled / loading must block navigation and @click
for (const [label, props, router] of [
  ['router link, disabled', { to: '/x', disabled: true }, true],
  ['router link, loading', { to: '/x', loading: true }, true],
  ['plain link (no router), disabled', { to: '/x', disabled: true }, false],
  ['as-link, disabled', { asLink: true, href: '/x', disabled: true }, false],
]) {
  await behaviour(
    `Button ${label}: no href, no navigation, no @click, a focusable disabled link`,
    {
      route: router ? '/' : null,
      clicks: 0,
      prevented: true,
      ariaDisabled: 'true',
      href: null,
      role: 'link',
      tabindex: '0',
      disabledAttr: null,
    },
    async (mount, container) => {
      const plugin = router ? routerPlugin() : undefined
      let clicks = 0
      mount(() => h(Button, { label: 'go', ...props, onClick: () => clicks++ }), {
        plugins: plugin ? [plugin] : [],
      })
      if (plugin) {
        await plugin.isReady()
      }
      await tick()
      const a = container.querySelector('a')
      const event = new window.MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })
      a?.dispatchEvent(event)
      await tick()
      return {
        route: plugin ? plugin.currentRoute.value.path : null,
        clicks,
        prevented: event.defaultPrevented,
        ariaDisabled: a?.getAttribute('aria-disabled') ?? null,
        // without href, middle-click / "open in new tab" have nothing to follow
        href: a?.getAttribute('href') ?? null,
        role: a?.getAttribute('role') ?? null,
        tabindex: a?.getAttribute('tabindex') ?? null,
        disabledAttr: a?.getAttribute('disabled') ?? null,
      }
    },
    /VuButton: `to` is set but the app has no router/
  )
}
// every click listener form (`@click`, `.once`, `.capture`, `.passive`, combined) is
// blocked on an inactive link and works on an active one (`.once`: one call for two clicks)
const CLICK_LISTENERS = [
  'onClick',
  'onClickOnce',
  'onClickCapture',
  'onClickPassive',
  'onClickCaptureOnce',
]
const LINK_KINDS = [
  ['router link', { to: '/x' }, true],
  ['plain link (no router)', { to: '/x' }, false],
  ['as-link', { asLink: true, href: '/x' }, false],
]
for (const listener of CLICK_LISTENERS) {
  for (const [kind, linkProps, router] of LINK_KINDS) {
    for (const state of ['disabled', 'loading', 'active']) {
      const inactive = state !== 'active'
      await behaviour(
        `Button ${kind}, ${state}: ${listener} ${inactive ? 'never fires' : 'fires'}`,
        {
          calls: inactive ? 0 : listener.endsWith('Once') ? 1 : 2,
          route: router ? (inactive ? '/' : '/x') : null,
        },
        async (mount, container) => {
          const plugin = router ? routerPlugin() : undefined
          let calls = 0
          mount(
            () =>
              h(Button, {
                label: 'go',
                ...linkProps,
                ...(inactive ? { [state]: true } : {}),
                [listener]: () => calls++,
              }),
            { plugins: plugin ? [plugin] : [] }
          )
          if (plugin) {
            await plugin.isReady()
          }
          await tick()
          // keep the test page in place (a plain link would navigate happy-dom)
          const stay = event => !router && event.preventDefault()
          window.addEventListener('click', stay)
          for (let i = 0; i < 2; i++) {
            pointerClick(container.querySelector('a'))
            await tick()
          }
          window.removeEventListener('click', stay)
          return { calls, route: plugin ? plugin.currentRoute.value.path : null }
        },
        /VuButton: `to` is set but the app has no router/
      )
    }
  }
}
await behaviour(
  'Dialog default-open opens the dialog (without emitting update:open)',
  { shown: true, emitted: 0 },
  async mount => {
    const emitted = []
    mount(() =>
      h(
        Dialog,
        { 'defaultOpen': true, 'title': 't', 'onUpdate:open': v => emitted.push(v) },
        () => 'b'
      )
    )
    await nextTick()
    await nextTick()
    return { shown: !!document.querySelector('.dialog-card'), emitted: emitted.length }
  }
)
await behaviour(
  'Dialog footer buttons emit `footer-click` and `footer-click-<label>` (names unchanged)',
  {
    calls: [
      ['footer-click-ok'],
      ['footer-click', 'Ok'],
      ['footer-click-savedraft'],
      ['footer-click', 'Save Draft'],
      ['footer-click-cancel'],
      ['footer-click', 'Cancel'],
    ],
    attrListeners: [],
  },
  async mount => {
    const calls = []
    const on =
      (...tag) =>
      event =>
        calls.push(event instanceof window.MouseEvent ? tag : ['bad payload'])
    mount(() =>
      h(Dialog, {
        'open': true,
        'title': 't',
        'footerButtons': ['Ok', 'Save Draft', 'Cancel'],
        'onUpdate:open': () => undefined,
        'onFooterClick': (label, event) =>
          calls.push(event instanceof window.MouseEvent ? ['footer-click', label] : ['bad']),
        'onFooterClickOk': on('footer-click-ok'),
        'onFooterClickSavedraft': on('footer-click-savedraft'),
        'onFooterClickCancel': on('footer-click-cancel'),
      })
    )
    await tick()
    for (const label of ['Ok', 'Save Draft', 'Cancel']) {
      ;[...document.querySelectorAll('.dialog-footer button')]
        .find(b => b.textContent.trim() === label)
        ?.click()
      await tick()
    }
    const card = document.querySelector('.dialog-card')
    // Vue keeps an element's DOM listeners under a `_vei` symbol
    const vei = card && Object.getOwnPropertySymbols(card).find(k => k.description === '_vei')
    return {
      calls,
      // the per-button listeners are the dialog's, not attributes / listeners of the card
      attrListeners: card
        ? [...Object.keys((vei && card[vei]) ?? {}), ...card.getAttributeNames()].filter(k =>
            /footer/i.test(k)
          )
        : ['no card'],
    }
  }
)
// inside a CheckboxGroupRoot the group's model decides: the mark follows Reka's state
const Checkbox = await loadComponent('vunor/Checkbox')
/** the checkboxes whose mark differs from Reka's checked state */
const markMismatches = () =>
  [...document.querySelectorAll('[role="checkbox"]')]
    .map((box, index) => [
      index,
      (box.dataset.state === 'checked') !== !!box.querySelector('.checkbox-icon'),
    ])
    .filter(([, differs]) => differs)
    .map(([index]) => index)
for (const groupValue of [['a'], ['b'], ['a', 'b'], []]) {
  await behaviour(
    `Checkbox in a CheckboxGroupRoot ${JSON.stringify(groupValue)}: marks follow the group`,
    { mismatches: [], afterClick: [] },
    async mount => {
      const model = ref(groupValue)
      mount(() =>
        h(
          reka.CheckboxGroupRoot,
          { 'modelValue': model.value, 'onUpdate:modelValue': v => (model.value = v) },
          () => ['a', 'b'].map(value => h(Checkbox, { value, label: value }))
        )
      )
      await tick()
      const before = markMismatches()
      clickOn('[role="checkbox"]')
      await tick()
      return { mismatches: before, afterClick: markMismatches() }
    }
  )
}
// clearing a `multiple` Combobox empties the selection (`[]`) in every mode
for (const [label, props] of [
  ['uncontrolled', { defaultValue: ['a'] }],
  ['v-model', 'v-model'],
]) {
  await behaviour(
    `Combobox multiple clear (${label}) emits [] and shows nothing`,
    { emitted: [[]], shown: '', root: [] },
    async mount => {
      const bound = ref(['a'])
      const emitted = []
      let instance
      mount(() =>
        h(Combobox, {
          'items': ['a', 'b'],
          'multiple': true,
          ...(props === 'v-model' ? { modelValue: bound.value } : props),
          'onUpdate:modelValue': v => {
            emitted.push(v)
            bound.value = v
          },
          'ref': el => {
            instance = el
          },
        })
      )
      await tick()
      const clear = [...document.querySelectorAll('.i8-icon-wrap')].find(el =>
        el.querySelector('.combobox-c8-icon')?.outerHTML.includes('clear')
      )
      pointerClick(clear)
      await tick()
      clickOn('.combobox-embedded-input')
      await tick()
      const ComboboxRoot = await loadComponent('ComboboxRoot')
      return {
        emitted,
        shown: document.querySelector('.combobox-multi-items')?.textContent?.trim() ?? null,
        root: rootState(findInstance(instance?.$, ComboboxRoot), 'modelValue') ?? null,
      }
    }
  )
}
// every listener form Vue's own emit understands reaches `footer-click-<label>` listeners
for (const [label, listeners, expectedCalls] of [
  ['camelCase', fn => ({ onFooterClickOk: fn }), 2],
  ['kebab-case', fn => ({ 'onFooter-click-ok': fn }), 2],
  ['v-on object', fn => vue.toHandlers({ 'footer-click-ok': fn }), 2],
  ['.once', fn => ({ onFooterClickOkOnce: fn }), 1],
  ['listener and .once', fn => ({ onFooterClickOk: fn, onFooterClickOkOnce: fn }), 3],
]) {
  await behaviour(
    `Dialog footer-click-<label> ${label} listener (two clicks)`,
    { calls: expectedCalls, attrListeners: [] },
    async mount => {
      let calls = 0
      mount(() =>
        h(Dialog, {
          'open': true,
          'title': 't',
          'footerButtons': ['Ok'],
          'onUpdate:open': () => undefined,
          ...listeners(() => calls++),
        })
      )
      await tick()
      for (let i = 0; i < 2; i++) {
        document.querySelector('.dialog-footer button')?.click()
        await tick()
      }
      const card = document.querySelector('.dialog-card')
      const vei = card && Object.getOwnPropertySymbols(card).find(k => k.description === '_vei')
      return {
        calls,
        attrListeners: card
          ? [...Object.keys((vei && card[vei]) ?? {}), ...card.getAttributeNames()].filter(k =>
              /footer/i.test(k)
            )
          : ['no card'],
      }
    }
  )
}
await behaviour(
  'Combobox multiple renders the multi-value trigger',
  { multi: true },
  async (mount, container) => {
    mount(() => h(Combobox, { items: ['a', 'b'], multiple: true, modelValue: ['a'] }))
    await tick()
    return { multi: !!container.querySelector('.combobox-multi-input') }
  }
)

// ---------------------------------------------------------------- every emit is declared

/**
 * An emit whose name the component does not declare at runtime makes dev Vue warn
 * ("Component emitted event … but it is neither declared") and leaves the parent's
 * listener in `$attrs`. Two generated checks per component:
 * - source: every `emit(…)` / `$emit(…)` in its .vue file names a literal event that its
 *   built definition declares (a template-literal or computed name cannot be declared);
 * - sweep: mounted (attrs fixture plus contract.mjs `emitSweepProps`), every element it
 *   renders is clicked, pressed (Enter), focused, blurred and typed into; no undeclared-emit
 *   warning may appear. Other messages the random gestures cause are not this check's.
 */
const UNDECLARED_EMIT = /emitted event "[^"]*" but it is neither declared/
const emitResults = []
const sourceFiles = new Map()
const srcRoot = new URL('../src/components/', import.meta.url)
for (const file of fs.readdirSync(srcRoot, { recursive: true })) {
  if (String(file).endsWith('.vue')) {
    sourceFiles.set(path.basename(String(file), '.vue'), new URL(String(file), srcRoot))
  }
}
const EMIT_CALL = /(?<![\w$.])\$?emit\s*(?:<[^>()]*>)?\(\s*([^,)]*)/g
for (const name of componentNames) {
  const file = sourceFiles.get(name)
  if (!file) {
    emitResults.push({ name, check: 'source', messages: ['no src/components/**/<name>.vue'] })
    continue
  }
  const Comp = await loadComponent(`vunor/${name}`)
  const declared = new Set(keysOf(Comp.emits))
  const declaredProps = new Set(keysOf(Comp.props))
  const problems = []
  for (const [call, arg] of fs.readFileSync(file, 'utf8').matchAll(EMIT_CALL)) {
    const literal = /^(['"])([^'"]*)\1$/.exec(arg.trim()) ?? /^`()([^`$]*)`$/.exec(arg.trim())
    if (!literal) {
      problems.push(`emits an event whose name is only known at runtime: ${call.trim()}`)
    } else if (
      !declared.has(literal[2]) &&
      !declaredProps.has(toHandlerKey(camelize(literal[2])))
    ) {
      problems.push(`emits "${literal[2]}" without declaring it`)
    }
  }
  emitResults.push({ name, check: 'source', messages: problems })
}

// no navigation from swept links
const noNavigation = event => event.target?.closest?.('a[href]') && event.preventDefault()
const SWEEP_EVENTS = [
  ['pointerdown', 'PointerEvent'],
  ['mousedown', 'MouseEvent'],
  ['pointerup', 'PointerEvent'],
  ['mouseup', 'MouseEvent'],
  ['click', 'MouseEvent'],
]
for (const [name, fx] of attrCases) {
  if (fx.skip || skipped.has(fx.component ?? name)) {
    continue
  }
  caseLabel = `emit sweep ${name}`
  const result = await runCase(async (mount, container) => {
    document.addEventListener('click', noNavigation, true)
    try {
      await mountFixture(mount, container, name, fx, emitSweepProps[fx.component ?? name] ?? {})
      const elements = [...document.body.querySelectorAll('*')].slice(0, 300)
      for (const el of elements) {
        if (!el.isConnected) {
          continue
        }
        const init = { bubbles: true, cancelable: true, button: 0, key: 'Enter', code: 'Enter' }
        for (const [type, Ctor] of SWEEP_EVENTS) {
          el.dispatchEvent(new window[Ctor](type, init))
        }
        el.dispatchEvent(new window.KeyboardEvent('keydown', init))
        el.focus?.()
        if ('value' in el && el.tagName === 'INPUT') {
          el.dispatchEvent(new window.Event('input', { bubbles: true }))
        }
        el.blur?.()
        await nextTick()
      }
      await tick()
    } finally {
      document.removeEventListener('click', noNavigation, true)
    }
    return {}
  })
  const undeclared = result.messages.filter(m => UNDECLARED_EMIT.test(m))
  emitResults.push({
    name,
    check: 'sweep',
    messages: undeclared,
    ignored: result.messages.length - undeclared.length,
  })
}

console.error = consoleError
console.warn = consoleWarn
const report = JSON.stringify({
  nodeEnv: process.env.NODE_ENV,
  vueProdLoaded,
  entries: entryResults,
  attrs: attrResults,
  state: stateResults,
  contract: contractResults,
  defaults: defaultResults,
  uncontrolled: uncontrolledResults,
  modelState: modelStateResults,
  toggles: toggleResults,
  emits: emitResults,
  behaviour: behaviourResults,
})
// a large write to a pipe is asynchronous and would be cut by process.exit: write a
// file (or stdout synchronously, for manual runs)
fs.writeFileSync(process.argv[2] ?? process.stdout.fd, report)
await window.happyDOM.abort()
process.exit(0)
