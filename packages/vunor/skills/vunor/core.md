# Core concepts & setup — vunor

> Installation, project setup for Vue 3 + Vite and Nuxt 3, mental model, and package exports.

## Concepts

Vunor is two things in one package:

1. **A UnoCSS theme engine** — a custom UnoCSS preset (`presetVunor`) that generates a complete design system from a few mathematical constants: golden ratio for typography/spacing, Oklab for perceptually uniform colors, and structured shortcut objects for mergeable component styles.

2. **A Vue 3 component library** — 30+ accessible components built on Reka UI, styled entirely through UnoCSS classes (zero CSS files). Components use the `Vu` prefix in templates (`<VuButton>`, `<VuInput>`).

You can use the theme engine without the components, or use both together.

### Key principles

- **All styling is UnoCSS classes** — no `<style>` blocks, no CSS files, no scoped styles. Component appearance is defined through UnoCSS shortcuts, rules, and CSS custom properties.
- **Mathematical derivation** — font sizes, spacing, border radii, and touch targets all derive from the golden ratio (1.618). Change one scale factor and the entire system recalculates.
- **Perceptual color uniformity** — palette generation uses Oklab, so `primary-500` and `error-500` look equally bright regardless of hue.
- **Deep mergeability** — component styles use structured shortcut objects that can be surgically overridden through deep merging, not string replacement.

## Installation

```bash
pnpm add vunor
# or: npm install vunor
```

Peer dependencies (installed automatically with vunor):
- `vue` ^3.5
- `unocss` ^66
- `reka-ui` ^2.0

## Setup — Vue 3 + Vite

Three files to configure:

### vite.config.ts

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { VunorVueResolver } from 'vunor/vite'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    Components({
      resolvers: [VunorVueResolver],
    }),
  ],
})
```

`VunorVueResolver` maps `<VuButton>` in templates to `import { default as VuButton } from 'vunor/Button'`. No manual imports needed.

### uno.config.ts

```ts
import { defineConfig } from 'unocss'
import { presetVunor, vunorShortcuts } from 'vunor/theme'

export default defineConfig({
  presets: [presetVunor()],
  shortcuts: [vunorShortcuts()],
})
```

No `safelist` is needed. The preset includes a built-in extractor that detects `<VuButton>`, `<VuInput>`, etc. in templates and automatically includes the required CSS classes.

### main.ts

```ts
import { createApp } from 'vue'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import App from './App.vue'

createApp(App).mount('#app')
```

## Setup — Nuxt 3

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vunor/nuxt'],
})
```

The Nuxt module auto-registers all `Vu*` components globally. No additional configuration is needed for basic usage.

## Package exports

```
vunor              Provide/inject composables: useInputPi, useCardPI, useInputProps, etc.
vunor/theme        UnoCSS preset, shortcuts, palette: presetVunor, vunorShortcuts, defineShortcuts, etc.
vunor/utils        Utilities: mergeCssClasses, useProvideInject
vunor/vite         Component resolver: VunorVueResolver
vunor/nuxt         Nuxt 3 module (auto-registers Vu* components)
vunor/{Name}       Individual Vue components, e.g. vunor/Button, vunor/Input, vunor/Card
```

### Key exports from `vunor/theme`

```ts
import {
  presetVunor,          // UnoCSS preset factory
  vunorShortcuts,       // Returns merged shortcuts array for UnoCSS config
  defineShortcuts,      // Type-safe shortcut object builder
  mergeVunorShortcuts,  // Merge multiple shortcut arrays (later wins)
  toUnoShortcut,        // Flatten a shortcut object to a UnoCSS string
} from 'vunor/theme'
```

### Key exports from `vunor`

```ts
import {
  useInputPi,         // Provide/inject for Input component groups
  useInputProps,       // Computed props helper for Input
  useInputBaseProps,   // Computed props helper for InputBase
  useCardPI,           // Provide/inject for Card → CardHeader
} from 'vunor'
```

## presetVunor options

```ts
presetVunor({
  // Color palette — see palette.md
  palette: { colors: { primary: '#6B4EFF' } },

  // Golden ratio spacing factor (default: 1.618)
  spacingFactor: 1.618,

  // Global border radius (default: ~0.618em = 1/golden-ratio)
  baseRadius: '0.5em',

  // Typography overrides — see typography.md
  typography: { h1: { size: 4, weight: 300 } },

  // Font rendering correction
  actualFontHeightFactor: 0.76,
  actualFontHeightTopBottomRatio: 0.5,

  // Touch target sizes
  fingertip: { xs: '1.25em', s: '2em', m: '3em', l: '3.5em', xl: '4em' },

  // Card padding multipliers
  cardSpacingFactor: { regular: 1, dense: 0.6 },

  // Layer direction
  layers: { reverseDark: false, reverseLight: false },
})
```

## Best practices

- Always include both `presetVunor()` in `presets` and `vunorShortcuts()` in `shortcuts` — they work together.
- Use `VunorVueResolver` with `unplugin-vue-components` for tree-shaking — only components you use get bundled.
- Do not add component CSS classes to `safelist` — the built-in extractor handles this automatically.
- For Nuxt projects, prefer the `vunor/nuxt` module over manual Vite plugin setup.

## Gotchas

- The preset expects UnoCSS ^66. Earlier versions may have incompatible APIs.
- Components require Reka UI ^2.0 as a peer dependency. The Reka UI v1 API is not compatible.
- `vunor/theme` is a separate entry point from `vunor` — import preset/shortcut utilities from `vunor/theme`, not `vunor`.
- The built-in CSS extractor matches `Vu` prefix patterns. If you alias components to different names, the extractor won't detect them and you'll need to add the component's CSS classes manually.
