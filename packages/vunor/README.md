# Vunor

A **UnoCSS theme engine** that turns a handful of design decisions into a complete, perceptually consistent design system -- plus an optional set of 30+ Vue 3 components that use it.

The core value is the theme: a golden-ratio-based type and spacing scale, an Oklab-graded color palette where every hue looks equally bright at the same step, and a deeply-mergeable shortcut object system that lets you customize any visual detail without rewriting CSS. The Vue components are a bonus -- you can use the theme engine on its own with any markup.

## Design Philosophy

Most design systems hard-code dozens of magic numbers for font sizes, spacing, colors, and border radii. Vunor derives **everything from a few mathematical constants**:

- **Golden ratio (1.618)** drives the typography scale, spacing tokens, and default border radius
- **Oklab color model** ensures perceptual uniformity -- `primary-500` and `error-500` look equally bright to the human eye, regardless of hue
- **Object-driven shortcuts** make every visual style surgically overridable through deep merging, not string replacement

The result: change one seed color or one scale factor, and the entire system recalculates consistently.

---

## Perceptual Color Palette

Vunor generates its full color system using [`@prostojs/palitra`](https://github.com/prostojs/palitra), a palette generator built on the **Oklab perceptual color model**.

### Why Oklab?

Traditional RGB/HSL-based palette generators produce steps that _look_ uneven: yellow-500 appears much brighter than blue-500 at the same lightness value, because RGB lightness doesn't match human perception. Oklab solves this -- it grades colors by how people actually see them. When palitra generates `primary-500` and `secondary-500`, they sit at the same perceptual luminance regardless of their hue. This means:

- Swapping your primary color from blue to green doesn't break visual hierarchy
- Numbered steps (50..900) have visually equal spacing between them
- Dark/light mode palettes stay balanced without manual correction

### How It Works

You provide up to 7 semantic seed colors. Palitra takes each one and generates:

1. **Main palette** (10 steps: 50, 100..900) -- luminance-graded from light to dark with perceptually uniform steps, optional saturation and hue-shift (vivid) adjustments at the extremes
2. **Layer palette** (5 steps: 0..4) -- desaturated variants for backgrounds that subtly tint without overwhelming content

All values are emitted as CSS custom properties, ready for use in any CSS-based system.

### Semantic Colors

| Name | Default | Purpose |
|------|---------|---------|
| `primary` | `#004eaf` | Main brand color |
| `secondary` | `#edd812` | Accent / highlight |
| `good` | `#7bc76a` | Success / positive |
| `warn` | `#ef9421` | Warning |
| `error` | `#bf5a5f` | Error / negative |
| `grey` | `#858892` | Neutral greys |
| `neutral` | `#5da0c5` | Alternative neutral |

### Per-Color Fine-Tuning

Each color can be a simple hex string or an object with saturation/vivid controls:

```ts
palette: {
  colors: {
    primary: '#6B4EFF',                          // simple swap
    error: {
      color: '#DC2626',
      vivid: { dark: 0.3, light: 0.3 },         // boost hue rotation at palette edges
      saturate: { dark: -0.1, light: -0.1 },     // desaturate slightly
    },
  },
}
```

### Advanced Palette Controls

Fine-tune the global palette generation curves:

```ts
palette: {
  lightest: 0.97,      // max luminance for the lightest step (0-1)
  darkest: 0.24,       // min luminance for the darkest step (0-1)
  layersDepth: 0.08,   // brightness step between layer-0 and layer-4

  mainPalette: {
    luminance: { dark: 0.26, middle: 0.62, light: 0.97 },
    saturate: { dark: -0.25, light: -0.25 },
    vivid: { dark: 0.1, light: 0.2 },       // hue rotation at edges
  },
  layerPalette: {
    desaturate: 0.2,     // pre-desaturate before generating layers
    luminance: { dark: 0.24, light: 0.32 },
  },
}
```

---

## Golden-Ratio Typography & Spacing

All dimensions in Vunor derive from the golden ratio (`k = 1.618`).

### Typography Scale

Font sizes, line heights, and letter spacing are computed from powers of `k`:

| Name | Size | Weight | Bold | Line Height |
|------|------|--------|------|-------------|
| `h1` | k^3.5 | 400 | 700 | k^0.5 |
| `h2` | k^2.5 | 400 | 700 | k^0.5 |
| `h3` | k^2 | 400 | 700 | k^0.5 |
| `h4` | k^1 | 400 | 600 | k^0.5 |
| `h5` | k^0.5 | 400 | 600 | k^0.5 |
| `h6` | k^0.25 | 600 | 700 | k^0.5 |
| `body` | 1 | 400 | 600 | k^0.75 |
| `body-s` | k^-0.5 | 400 | 600 | k^1 |
| `label` | k^-0.25 | 500 | 700 | k^0.5 |
| `caption` | k^-0.5 | 400 | 600 | k^0.5 |

Applied as UnoCSS utilities: `text-h1`, `text-body`, `text-label`, etc. Each sets `--font-size`, `--font-bold`, `--font-corrected` (actual rendered glyph height), line-height, letter-spacing, and top/bottom trim correction CSS vars.

Every entry is individually overridable:

```ts
typography: {
  h1: { size: 4, weight: 300, boldWeight: 700 },
  body: { height: 1.75 },     // taller line-height
  label: { weight: 600 },
}
```

### Spacing Scale

Spacing tokens follow the same golden-ratio progression:

| Token | Scale | ~Value |
|-------|-------|--------|
| `$xxs` | 1/k^3 | 0.24em |
| `$xs` | 1/k^2 | 0.38em |
| `$s` | 1/k | 0.62em |
| `$m` | 1 | 1em |
| `$l` | k | 1.62em |
| `$xl` | k^2 | 2.62em |
| `$xxl` | k^3 | 4.24em |

Used as `p-$m`, `m-$l`, `gap-$s`, etc. Text-aware margin utilities (`text-mt-$m`, `text-mb-$s`) compensate for line-height to maintain optically correct spacing.

### Other Derived Values

- **Border radius**: defaults to `0.618em` (1/golden-ratio), configurable via `baseRadius`
- **Touch targets** (`fingertip-xs` through `fingertip-xl`): sized using `sqrt(k)` progressions
- **Card spacing**: `card-{typography}` sets `--card-spacing` proportional to the heading's corrected size; `card-dense` switches to 0.6x

---

## Object-Driven Shortcuts

This is Vunor's approach to component styling. Instead of flat UnoCSS shortcut strings, Vunor uses **structured nested objects** where keys are variant prefixes and values are the classes to apply. This makes styles readable, deeply mergeable, and surgically overridable.

### How It Works

`defineShortcuts()` creates shortcut objects:

```ts
import { defineShortcuts } from 'vunor/theme'

const shortcuts = defineShortcuts({
  // 'btn' is the shortcut name (used as a CSS class)
  'btn': {
    '': 'h-fingertip flex items-center',     // base classes (no prefix)
    'hover:': 'bg-current/05',               // → "hover:bg-current/05"
    'dark:': 'text-white',                   // → "dark:text-white"
    '[&.btn-round]:': 'rounded-full',        // → "[&.btn-round]:rounded-full"
  },
})
```

Each key is a **variant prefix** that gets prepended to every class in the value. At build time, `toUnoShortcut()` flattens the object into a single UnoCSS shortcut string:

```
h-fingertip flex items-center hover:bg-current/05 dark:text-white [&.btn-round]:rounded-full
```

Wherever you use `class="btn"`, UnoCSS applies all those classes. The nesting is purely for readability and mergeability.

### Compound Variants

Nesting can go deeper for compound variants:

```ts
defineShortcuts({
  'c8-filled': {
    '': 'current-bg-scope-color-500 text-white rounded-base',
    'hover:': 'current-bg-scope-color-400',
    'dark:': {
      '': 'text-white/90',
      'hover:': 'current-bg-scope-color-600 border-solid',
      // produces: "dark:text-white/90 dark:hover:current-bg-scope-color-600 dark:hover:border-solid"
    },
  },
})
```

### Why Objects Instead of Strings?

**Because they merge.** When two shortcut objects define the same key, `mergeVunorShortcuts()` deep-merges them with later entries winning. This is the key to Vunor's customization model: you can surgically override a single variant of a built-in style without rewriting the whole shortcut.

For example, to make all filled buttons pill-shaped while keeping every other variant (hover, active, dark mode, disabled) intact:

```ts
import { vunorShortcuts, defineShortcuts } from 'vunor/theme'

const myOverrides = defineShortcuts({
  'c8-filled': {
    '': 'rounded-full',      // only overrides base classes
  },
  'i8-flat': {
    '': 'border-b-2',        // only overrides base classes
  },
})

export default defineConfig({
  presets: [presetVunor()],
  shortcuts: [vunorShortcuts(myOverrides)],
})
```

Your `'c8-filled'.'':` replaces only the base classes of `c8-filled`, while all its `hover:`, `dark:`, `active:` variants remain intact from the defaults. Everything flows through a single merge pipeline, producing consistent CSS passed to UnoCSS.

`vunorShortcuts()` returns the merged default shortcuts for all built-in styles (c8, i8, card, dialog, etc.). Pass your overrides as the first argument -- they take priority.

---

## Semantic CSS Classes

All visual styling uses UnoCSS class strings -- no CSS files or scoped styles. Component appearance is defined through shortcuts, rules, and CSS custom properties.

### Layers (`layer-0` .. `layer-4`)

Layers provide full background + text + icon styling that automatically adapts to light/dark mode:

```html
<div class="layer-0 scope-primary">
  <!-- Light: lightest bg, dark text. Dark mode: darkest bg, light text. -->
  <div class="layer-1">
    <!-- One step deeper -->
  </div>
</div>
```

- `layer-0` is the outermost (lightest in light mode, darkest in dark)
- Each subsequent layer steps progressively toward the opposite extreme
- Apply `scope-{color}` to set which palette the layers use

### Surfaces

Surfaces apply specific palette stops as background + text + icon:

```html
<div class="scope-primary surface-100">Lightly tinted</div>
<div class="scope-error surface-500">Bold error banner</div>
```

`surface-0` through `surface-4` map to the layer scale. `surface-50` through `surface-900` map to the main 10-step palette. Custom surfaces can be defined in `palette.surfaces`.

### Current-Color System

Fine-grained color control via CSS custom properties:

```html
<div class="current-bg-primary-500 bg-current text-current">
  Colored via CSS vars
</div>
```

- `scope-{color}` sets `--scope-color-*` vars for a palette
- `current-bg-{color}-{step}` sets `--current-bg`
- `bg-current` / `text-current` / `icon-current` apply the current-scoped colors

### Clickable Styles (`c8`)

Button and clickable element design variants:

| Class | Description |
|-------|-------------|
| `c8-filled` | Solid background, white text |
| `c8-flat` | Transparent background, colored text |
| `c8-outlined` | Border + colored text, transparent fill |
| `c8-light` | Light tinted background, colored text |

Each includes hover, active, focus, and disabled states. Apply on any element alongside `scope-{color}`:

```html
<button class="scope-primary c8-filled">Save</button>
<button class="scope-error c8-flat">Cancel</button>
```

### Inputable Styles (`i8`)

Input field design variants:

| Class | Description |
|-------|-------------|
| `i8-flat` | Bottom border only (minimal) |
| `i8-filled` | Full border with background |
| `i8-round` | Pill-shaped (fully rounded) |

Common sub-shortcuts: `i8-input`, `i8-label` (floating label), `i8-hint`, `i8-prepend` / `i8-append`, `i8-before` / `i8-after`.

---

## Full Configuration Example

```ts
import { defineConfig } from 'unocss'
import { presetVunor, vunorShortcuts } from 'vunor/theme'

export default defineConfig({
  presets: [
    presetVunor({
      // -- Perceptual color palette --
      palette: {
        colors: {
          primary: '#6B4EFF',
          secondary: '#FF6B4E',
          good: '#22C55E',
          error: {
            color: '#DC2626',
            vivid: { dark: 0.3, light: 0.3 },
            saturate: { dark: -0.1, light: -0.1 },
          },
        },
        lightest: 0.97,
        darkest: 0.24,
        layersDepth: 0.08,
      },

      // -- Golden-ratio spacing --
      spacingFactor: 1.618,

      // -- Global border radius --
      baseRadius: '0.5em',       // default: 0.618em (1/golden-ratio)

      // -- Typography overrides --
      typography: {
        h1: { size: 4, weight: 300, boldWeight: 700 },
        body: { height: 1.75 },
        label: { weight: 600 },
      },

      // -- Font rendering --
      actualFontHeightFactor: 0.76,
      actualFontHeightTopBottomRatio: 0.5,

      // -- Touch targets --
      fingertip: {
        xs: '1.25em',
        s: '2em',
        m: '3em',
        l: '3.5em',
        xl: '4em',
      },

      // -- Card padding multipliers --
      cardSpacingFactor: {
        regular: 1,
        dense: 0.6,
      },

      // -- Layer direction --
      layers: {
        reverseDark: false,
        reverseLight: false,
      },
    }),
  ],
  shortcuts: [vunorShortcuts()],
})
```

---

## Quick Start

### Vue 3 + Vite

```bash
pnpm add vunor
```

**vite.config.ts**

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

**uno.config.ts**

```ts
import { defineConfig } from 'unocss'
import { presetVunor, vunorShortcuts } from 'vunor/theme'

export default defineConfig({
  presets: [presetVunor()],
  shortcuts: [vunorShortcuts()],
})
```

**main.ts**

```ts
import { createApp } from 'vue'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import App from './App.vue'

createApp(App).mount('#app')
```

No `safelist` is needed. The UnoCSS preset includes a built-in extractor that detects `<VuButton>`, `<VuInput>`, etc. in your templates and automatically includes the required component CSS classes.

### Nuxt 3

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vunor/nuxt'],
})
```

The Nuxt module auto-registers all `Vu*` components.

---

## Vue Components (Optional)

Vunor ships 30+ accessible Vue 3 components built on Reka UI. All use the `Vu` prefix in templates. Auto-import via `VunorVueResolver` or the Nuxt module.

The components are consumers of the theme system described above -- they use `c8`, `i8`, layers, surfaces, and the typography scale. You can use the theme engine without any of these components, or use them as-is, or override their styles through the shortcut object system.

### Layout

| Component | Description |
|-----------|-------------|
| `VuAppLayout` | App shell with header, sidebar, footer slots |
| `VuCard` | Card container with typography-driven spacing |
| `VuCardHeader` | Card header with title and actions |
| `VuCardInner` | Nested card section |
| `VuTabs` | Tabbed content panels |
| `VuDialog` | Modal dialog with overlay |
| `VuPopover` | Floating popover anchored to a trigger |

### Form Inputs

| Component | Description |
|-----------|-------------|
| `VuInput` | Text / textarea input with floating label |
| `VuSelect` | Dropdown select |
| `VuCombobox` | Searchable dropdown with filtering |
| `VuCheckbox` | Checkbox with indeterminate state |
| `VuRadioGroup` | Radio button group |
| `VuSlider` | Range slider |
| `VuDatePicker` | Date picker with calendar popup |
| `VuLabel` | Form label |

### Actions

| Component | Description |
|-----------|-------------|
| `VuButton` | Button with icon, loading, and link support |
| `VuMenu` | Navigation / command menu |
| `VuMenuItem` | Menu item |
| `VuPagination` | Page navigation |

### Feedback

| Component | Description |
|-----------|-------------|
| `VuAppToasts` | Toast notification container |
| `VuProgressBar` | Progress bar |
| `VuLoadingIndicator` | Circular loading spinner |
| `VuInnerLoading` | Overlay loading within a container |

### Utility

| Component | Description |
|-----------|-------------|
| `VuIcon` | Icon display (integrates with UnoCSS icons) |
| `VuOverflowContainer` | Handles content overflow |
| `VuCalendar` | Standalone calendar grid |

## Package Exports

```
vunor            PI composables (provide/inject helpers)
vunor/theme      UnoCSS preset, shortcuts, palette, component classes
vunor/utils      mergeCssClasses, useProvideInject
vunor/vite       VunorVueResolver for unplugin-vue-components
vunor/nuxt       Nuxt 3 module
vunor/{Name}     Individual Vue components (e.g. vunor/Button)
```

## AI Agent Skills

`vunor` ships an AI agent skill for Claude Code, Cursor, Windsurf, Codex and other compatible agents.
The skill teaches your agent the library's APIs, patterns, and best practices — so it can help you write correct code without hallucinating.

**Install the skill into your agent:**

```bash
# Project-local (recommended — commits with your repo)
npx vunor setup-skills

# Global (available in all your projects)
npx vunor setup-skills --global
```

Restart your agent after installing. The skill is version-locked to the package — re-run after upgrading.

## License

MIT
