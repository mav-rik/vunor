# Setup — Vunor

Installation, project wiring for Vue 3 + Vite and Nuxt 3, package exports, and `presetVunor()` option summary.

## Install

```bash
pnpm add vunor
# peer deps (auto-installed): vue ^3.5, unocss ^66, reka-ui ^2
```

## Vue 3 + Vite

Three files. Each does one job:

### `uno.config.ts` — register the preset and shortcuts

```ts
import { defineConfig } from 'unocss'
import { presetVunor, vunorShortcuts } from 'vunor/theme'

export default defineConfig({
  presets: [
    presetVunor({
      // optional palette tuning — see references/theme.md
      palette: { colors: { primary: '#6B4EFF' } },
    }),
  ],
  shortcuts: [vunorShortcuts()],   // register Vunor's component shortcuts
})
```

`vunorShortcuts()` returns a flat `Record<string, string>` of every Vunor shortcut (c8, i8, btn, card, dialog, etc.) merged and stringified. Pass an override object to customize: `vunorShortcuts(myOverrides)` — see [shortcuts.md](shortcuts.md).

No `safelist` needed. `presetVunor` ships an extractor that scans templates for `<VuButton>`, `<VuInput>`, etc. and adds the matching component classes automatically.

### `vite.config.ts` — auto-import `<VuFoo>` components

```ts
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { VunorVueResolver } from 'vunor/vite'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    Components({ resolvers: [VunorVueResolver] }),
  ],
})
```

`VunorVueResolver` maps `<VuButton>` in templates → `import { default as VuButton } from 'vunor/Button'`. Without it, components must be imported manually:

```ts
import VuButton from 'vunor/Button'
import VuCard from 'vunor/Card'
import VuInput from 'vunor/Input'
```

### `main.ts` — load reset and UnoCSS virtual stylesheet

```ts
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

## Nuxt 3

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vunor/nuxt', '@unocss/nuxt'],
  // unocss preset/shortcut config still goes in uno.config.ts
})

// To restrict which Vu* components get registered:
//   vunor: { components: ['Button', 'Input', 'Card'] }
// or to skip auto-registration:
//   vunor: { components: false }
```

The Nuxt module auto-registers every `Vu*` component globally.

## Package exports

| Path | Provides |
|------|----------|
| `vunor` | PI composables: `useInputPi`, `useInputProps`, `useInputBaseProps`, `useCardPI`, toast helpers |
| `vunor/theme` | `presetVunor`, `vunorShortcuts`, `defineShortcuts`, `mergeVunorShortcuts`, `toUnoShortcut`, type exports (`TVunorPaletteOptions`, `TVunorPaletteColor`, `TVunorMainPaletteAdvanced`, `TVunorLayerPaletteAdvanced`, `TVunorSurfaceConfig`, `TVunorTheme`, `TVunorShortcut`), plus `componentClasses` / `getComponentClasses` |
| `vunor/utils` | `useProvideInject` (build typed provide/inject pairs) |
| `vunor/vite` | `VunorVueResolver` for `unplugin-vue-components` |
| `vunor/nuxt` | Nuxt 3 module that registers all `Vu*` components |
| `vunor/{Name}` | One per component: `vunor/Button`, `vunor/Card`, `vunor/CardHeader`, `vunor/CardInner`, `vunor/Input`, `vunor/InputBase`, `vunor/Select`, `vunor/SelectBase`, `vunor/Combobox`, `vunor/Checkbox`, `vunor/RadioGroup`, `vunor/Slider`, `vunor/DatePicker`, `vunor/DatePickerBase`, `vunor/DatePickerInner`, `vunor/DatePickerPopup`, `vunor/Calendar`, `vunor/Dialog`, `vunor/Tabs`, `vunor/Menu`, `vunor/MenuItem`, `vunor/Popover`, `vunor/Pagination`, `vunor/AppLayout`, `vunor/AppToasts`, `vunor/Icon`, `vunor/Label`, `vunor/Loading*`, `vunor/InnerLoading`, `vunor/OverflowContainer`, `vunor/ProgressBar`, `vunor/DevTools`, `vunor/DelayedSwitch`, `vunor/ButtonBase` |

## `presetVunor()` options

All optional; defaults shown.

```ts
presetVunor({
  // Spacing scale base (golden ratio); spacing tokens compute as base^n
  spacingFactor: 1.618,

  // Font height correction (so text-mt-* / text-mb-* land on real glyphs).
  // 1 means font fills the em box; lower values reflect that real fonts
  // render shorter than 1em. Tune per font family.
  actualFontHeightFactor: 1,
  actualFontHeightTopBottomRatio: 0.52,

  // Multipliers used when card-{level} computes --card-spacing
  cardSpacingFactor: { regular: 1, dense: 0.6 },

  // Per-typography overrides — see typography.md
  typography: { /* h1: { size: 4, weight: 300, … }, body: { … } */ },

  // Whether layer-0..4 scale dark/light differently
  layers: { reverseDark: false, reverseLight: false },

  // Touch-target sizes used by fingertip-{xs|s|m|l|xl}
  fingertip: {
    xs: '0.708em',  // ≈ 1 / 1.618^1.5 em
    s:  '1.146em',
    m:  '3em',      // standard ~48px
    l:  '3.5em',
    xl: '4em',
  },

  // Default border-radius for `rounded-base` and computed radii
  baseRadius: '0.618em',  // 1 / golden-ratio

  // Animation durations + keyframes (used by Dialog, Toasts, ProgressBar, …)
  animation: { durations: { /*…*/ }, keyframes: { /*…*/ } },

  // Palette generation — see references/theme.md
  palette: {
    colors: { primary: '…', secondary: '…', good: '…', warn: '…',
              error: '…', grey: '…', neutral: '…' },
    lightest: 0.97,
    darkest: 0.24,
    layersDepth: 0.08,
    flatness: 1,
    mainPalette: { /* fine-tune the 50–900 scale */ },
    layerPalette: { /* fine-tune layers 0–4 */ },
    surfaces: { /* override or add surface-* presets */ },
  },
})
```

For everything under `palette`, see [theme.md](theme.md).

## Verification

After setup, the following should all work:

```html
<div class="scope-primary layer-0">           <!-- page bg via primary scope -->
  <button class="c8-filled">click</button>     <!-- filled primary button -->
  <div class="surface-100">colored block</div>
  <p class="text-h1 text-mb-$m">heading</p>    <!-- font-corrected margin -->
</div>
```

If colors are missing, the most likely cause is no scope on an ancestor; preflights install `scope-neutral` on `:root`, but tooltips/toasts that portal outside `<html>` should still see it.

## Common pitfalls

- **Not loading `virtual:uno.css`** — without it UnoCSS emits no styles. Confirm `import 'virtual:uno.css'` is in your entry file (Nuxt's UnoCSS module does this for you).
- **Aliasing components past the `Vu` prefix** — the built-in extractor matches `<Vu…>` and `from 'vunor/…'`. Aliasing to `<MyButton>` skips the extractor; either keep the prefix or add the underlying classes to `safelist`.
- **Mixing UnoCSS major versions** — `presetVunor` requires UnoCSS ^66 and Reka UI ^2. Older versions break the API surface.
- **Tree-shaking single components** — `vunor/Button` only imports what it needs; the resolver pattern keeps the bundle small. Importing from the barrel `'vunor'` brings only PI composables, no components.
