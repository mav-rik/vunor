// Mounts one case of test-dist/contract.mjs `toggleCases` (by name) for e2e/toggle.spec.ts
// and logs every `update:open` to `window.__log`.
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import { createApp, h } from 'vue'

import { toggleCases } from '../../test-dist/contract.mjs'

import type { App, Component } from 'vue'

const components = import.meta.glob<{ default: Component }>('../../src/components/**/*.vue', {
  eager: true,
})
function component(name: string): Component {
  const entry = Object.entries(components).find(([file]) => file.endsWith(`/${name}.vue`))
  if (!entry) {
    throw new Error(`no component ${name}`)
  }
  return entry[1].default
}

interface TToggleWindow {
  __log: unknown[]
  __app?: App
  __mount: (name: string) => void
  __ready: boolean
}
const w = window as unknown as TToggleWindow
w.__log = []
w.__mount = name => {
  const fixture = (toggleCases as Record<string, { component: string; props: object }>)[name]
  w.__app?.unmount()
  w.__log.length = 0
  const app = createApp({
    render: () =>
      h('div', { style: 'padding: 40px' }, [
        h(
          component(fixture.component),
          { ...fixture.props, 'onUpdate:open': (value: unknown) => w.__log.push(value) },
          { content: () => h('div', { class: 'probe-popup' }, 'content') }
        ),
      ]),
  })
  app.mount('#app')
  w.__app = app
}
w.__ready = true
