# Theme configuration — Vunor

Every knob `presetVunor()` accepts: palette tuning (vividness, saturation, flatness, layersDepth, lightest/darkest, mainPalette, layerPalette, surfaces), `baseRadius`, `fingertip`, `cardSpacingFactor`, `spacingFactor`, `actualFontHeightFactor`, `typography`, `layers`, `animation`.

For applying these knobs to your code (which classes consume which variables), see [colors.md](colors.md), [typography.md](typography.md), and [cards.md](cards.md).

## Top-level shape

```ts
import { presetVunor } from 'vunor/theme'

presetVunor({
  // ----- palette -----
  palette: {
    colors: { /* seeds */ },
    lightest, darkest, layersDepth, flatness,
    mainPalette: { /* 50–900 scale */ },
    layerPalette: { /* layers 0–4 */ },
    surfaces: { /* surface-* presets */ },
  },

  // ----- spacing & sizing -----
  spacingFactor,
  baseRadius,
  fingertip: { xs, s, m, l, xl },
  cardSpacingFactor: { regular, dense },

  // ----- typography -----
  actualFontHeightFactor,
  actualFontHeightTopBottomRatio,
  typography: { /* per-level overrides */ },

  // ----- layers (per-mode reverse) -----
  layers: { reverseDark, reverseLight },

  // ----- animation -----
  animation: { durations, keyframes },
})
```

## Palette

Vunor builds the entire color system from seven seed colors using `@prostojs/palitra` — an Oklab perceptual color generator. Oklab makes sure `primary-500` and `error-500` look equally bright regardless of hue, so the same shade number in different palettes is visually consistent.

For each seed color, palitra emits:

- **Main palette** — 10 perceptually-spaced shades: `50, 100, 200, …, 900`
- **Light layers** — 5 desaturated light variants: `light-0, light-1, …, light-4`
- **Dark layers** — 5 desaturated dark variants: `dark-0, dark-1, …, dark-4`

These end up as CSS variables consumed by the semantic class system in [colors.md](colors.md).

### `palette.colors` — seed colors

```ts
palette: {
  colors: {
    primary:   '#004eaf',     // blue
    secondary: '#edd812',     // yellow
    good:      '#7bc76a',     // green
    warn:      '#ef9421',     // orange
    error:     '#bf5a5f',     // red
    grey:      '#858892',     // neutral grey
    neutral:   '#5da0c5',     // alternative neutral (cool blue-grey)
  },
}
```

Each entry can be either:

- a CSS color string (`'#6B4EFF'`, `'rgb(...)`', `'hsl(...)'`, `'rebeccapurple'`)
- a `TVunorPaletteColor` object for fine-tuning:

```ts
primary: {
  color: '#6B4EFF',
  preserveInputColor: true,   // emit `primary` (no suffix) === input color
  saturate: { dark: -0.2, light: -0.2 },  // desaturate at palette ends
  vivid: { dark: 0.1, light: 0.2 },       // hue/chroma shift at ends
  flatness: 0.7,              // override per-color flatness (see below)
}
```

Defaults emitted by Vunor:

```
primary:   { color: '#004eaf', preserveInputColor: true,
             saturate: { dark: -0.2, light: -0.2 } }
grey:      { color: '#858892', saturate: { dark: 0,    light: 0    } }
secondary: { color: '#edd812', vivid:    { dark: 0.4,  light: 0.4  } }
neutral:   { color: '#5da0c5', vivid:    { dark: 0.1,  light: 0.1  } }
good:      { color: '#7bc76a', vivid:    { dark: 0.2,  light: 0.5  } }
warn:      { color: '#ef9421', vivid:    { dark: 0.2,  light: 0.3  } }
error:     { color: '#bf5a5f' }
```

You only need to provide the colors you want to override; defaults fill in the rest.

### `palette.lightest` and `palette.darkest`

Bound the brightness of the palette extremes. Both are luminance values in `[0, 1]`.

| Option | Default | Effect |
|--------|---------|--------|
| `lightest` | `0.97` | Luminance of `*-50` and `light-4`. Lower → less bright at the top. |
| `darkest` | `0.24` | Luminance of `*-900` and `dark-0`. Higher → less dark at the bottom. |

Use `lightest = 1` for pure-white tops, `darkest = 0.18` for inkier blacks.

### `palette.layersDepth`

How wide the depth steps are, measured in luminance.

```ts
layersDepth: 0.08   // default — subtle 8% step between consecutive layers
layersDepth: 0.12   // more contrast between layer-0 and layer-4
layersDepth: 0.04   // almost flat layers
```

Layers go from `darkest` to `darkest + layersDepth` in dark mode, and from `1 - layersDepth` to `1` in light mode.

### `palette.flatness`

Controls how aggressively palitra normalizes shades for **perceptual uniformity** across hues.

| Value | Meaning |
|-------|---------|
| `1` (default) | Fully flat. Every shade hits its target perceptual luminance exactly. Yellow-500 and blue-500 read at identical brightness. |
| `0` | No normalization. Shades follow a raw HSL ramp; hues keep their natural perceptual weight (yellows look bright, blues look dark). |
| `0.5` | Halfway blend. |

Override per-palette via `mainPalette.flatness` / `layerPalette.flatness`, or per-color via `colors.<name>.flatness`. The fallback chain is **per-color → per-palette → top-level → default 1**.

### `palette.mainPalette` — fine-tune the 50–900 scale

```ts
mainPalette: {
  preserveInputColor: false,
  flatness: undefined,   // falls back to palette.flatness

  luminance: {
    dark:   undefined,   // default: palette.darkest + palette.layersDepth + 0.02
    light:  undefined,   // default: palette.lightest
    useMiddle: true,     // anchor mid-shade by `middle` instead of interpolating
    middle: 0.62,
  },

  saturate: { dark: -0.25, light: -0.25 },  // desaturate at ends
  vivid:    { dark: 0.1,   light: 0.2   },  // chroma boost at ends
}
```

- `luminance.dark` / `luminance.light` set the brightness window of the 10-step scale.
- `useMiddle: true` (the default) pins shade-500 to `middle` brightness, which prevents the middle of the scale from drifting when `dark`/`light` move.
- `saturate` and `vivid` shape how shades evolve from the middle outward. Negative `saturate.dark/light` desaturates the extremes (a common trick to keep the 50 and 900 shades from looking gaudy). `vivid` adds chromatic punch at the ends.

### `palette.layerPalette` — fine-tune layers 0–4

```ts
layerPalette: {
  desaturate: 0.2,        // 0.2 → reduce saturation to 20% before generating layers
  flatness: undefined,
  luminance: {
    dark:  undefined,     // default: palette.darkest
    light: undefined,     // default: palette.darkest + palette.layersDepth
  },
  saturate: { dark: -0.2, light: -0.2 },
  vivid:    { dark: 0,    light: 0    },
}
```

Layers should look like *paper shaded with a hint of the seed color*, not full-strength brand colors. `desaturate` controls that. With `desaturate: 0.2`, the seed becomes 20% as saturated before palitra computes the layer ramp — perfect for subtle backgrounds.

The layer scale dark-0 → dark-4 (and light-4 → light-0 in light mode) spans a luminance range of `layersDepth`. Each layer is one fifth of that range darker than the next.

### `palette.surfaces` — declare colored-block presets

A surface is a **preset bundle** of `[bg, text, border, dark:bg, dark:text, dark:border]`. Each entry references either named scope variables (`scope-color-500`, `scope-light-2`, …) or any literal color from the theme.

```ts
palette: {
  surfaces: {
    // Override the default surface-100 to use less-saturated colors
    '100': [
      'scope-color-100', 'scope-color-800', 'scope-color-200',
      'scope-color-800', 'scope-color-200', 'scope-color-500',
    ],

    // Add a new surface-brand
    'brand': [
      'scope-color-500',  'white',         'scope-color-700',
      'scope-color-400',  'white',         'scope-color-600',
    ],
  },
}
```

After this, `<div class="scope-primary surface-brand">` paints with the bundle. See [colors.md](colors.md) for default surface presets shipped with the preset (0..4, 50, 100, 200, …, 900).

## Spacing and sizing

### `spacingFactor`

Base of the spacing geometric sequence. Default `1.618` (the golden ratio).

```
$xxs = 1 / spacingFactor^3 em
$xs  = 1 / spacingFactor^2 em
$s   = 1 / spacingFactor   em
$m   = 1                   em
$l   = spacingFactor       em
$xl  = spacingFactor^2     em
$xxl = spacingFactor^3     em
```

Setting `spacingFactor: 1.5` produces a flatter scale; setting it to `1.732` (√3) produces a more dramatic one.

### `baseRadius`

Default border radius value. Used by `rounded-base` and indirectly by `rounded-{spacing-token}` (since `borderRadius` is derived from `spacing`). Default `0.618em` (1 / golden ratio).

```ts
presetVunor({ baseRadius: '0.5em' })   // slightly less rounded
presetVunor({ baseRadius: '0' })       // square corners everywhere
```

Used by `rounded-base` (the default for `c8-*`, `i8-filled`, cards).

#### Single-knob radius — what bypasses it

`baseRadius` is the design system's radius knob: change it once, every component reskins. This only works if **every rounded corner routes through `rounded-base`** (or a spacing-scaled token like `rounded-$s`, `rounded-$card-spacing`). Anything that hardcodes a literal value **bypasses the knob entirely**:

```html
<!-- ✗ frozen at 7px, ignores baseRadius -->
<div class="rounded-[7px]">…</div>
<div class="rounded-[var(--my-app-radius)]">…</div>  <!-- if --my-app-radius is a literal -->
<style>.card { border-radius: 10px; }</style>
```

```html
<!-- ✓ tracks baseRadius -->
<div class="rounded-base">…</div>
<div class="rounded-$s">…</div>              <!-- scales with spacing -->
<div class="rounded-$card-spacing">…</div>   <!-- scales with card density -->
```

The same rule applies when you're **building a custom design system on top of vunor** (your own `defineShortcuts`, component library, or skinned app). Compose with `rounded-base` in your shortcuts instead of introducing a parallel radius variable — otherwise downstream consumers get two knobs to turn (yours and vunor's), and `baseRadius: '0'` doesn't make the UI flat.

If you need more than one radius size in your design, reach first for the **`rounded-r0..r4`** ladder — it derives from `baseRadius` directly and honours the single-knob contract (every step collapses to `0` when `baseRadius: '0'`). See the next subsection. Use spacing-derived radii (`rounded-$xxs` … `rounded-$xxl`) only when you specifically want a spacing-tied corner that tracks `spacingFactor` instead of `baseRadius`. Avoid literal pixels unless the shape is intentionally fixed (pill, full circle).

#### Radius ladder — `rounded-r0..r4`

Five-step scale derived from `baseRadius`. Every step resolves to `0` when `baseRadius: '0'`, so the "flat everything" preset stays flat.

| Token | Formula | At `baseRadius: 8px` | At `baseRadius: 0.618em` (default) | At `baseRadius: 0` | Typical use |
|-------|---------|----------------------|------------------------------------|--------------------|-------------|
| `rounded-r0` | `min(base, clamp(2px, base/2, 4px))` — always emitted in `px` | `4px` | `4px` | `0` | chips, checkboxes, tight indicator pills |
| `rounded-r1` | `base × 1` (same as `rounded-base`) | `8px` | `0.618em` | `0` | buttons, inputs, default controls |
| `rounded-r2` | `base × 1.5` | `12px` | `0.927em` | `0` | popovers, toasts, small containers |
| `rounded-r3` | `base × 2` | `16px` | `1.236em` | `0` | dialogs, cards, emphasized surfaces |
| `rounded-r4` | `base × 2.5` | `20px` | `1.545em` | `0` | hero surfaces, very-rounded panels |

Notes:

- **`r0` is always `px`.** Its whole purpose is an absolute floor (2px) and ceiling (4px), so it must not drift with the element's font-size. `rounded-r0` on a `text-h1` renders 4px; `rounded-r0` on a `text-caption` also renders 4px.
- **`r1..r4` preserve the input unit.** If `baseRadius` is em, they're em (scales with element font-size, same as `rounded-base` has always done). If `baseRadius` is px, they're px.
- **`rounded-base` and `rounded-r1` are equivalent** — both emit the `baseRadius` literal. Use whichever reads better in context; `r1` is the canonical form in the ladder.
- **Don't mix with `rounded-[4px]`.** Hardcoded literals break the single-knob contract. Use `rounded-r0` for chip-sized corners and `rounded-r3` for dialog-sized corners.

```html
<VuCheckbox />                              <!-- rounded-r0 internally -->
<button class="c8-filled h-fingertip">Save</button>  <!-- c8-filled = rounded-r1 -->
<VuDialog class="rounded-r3">…</VuDialog>   <!-- dialog-sized radius -->
<div class="rounded-r2">Popover content</div>
```

When building a custom design system on top of vunor, prefer the r-ladder over introducing parallel CSS variables — downstream consumers of your components get `baseRadius: '0' ⇒ flat UI` behaviour for free.

### `fingertip`

Touch-target sizes consumed by `h-fingertip`, `min-w-fingertip`, `rounded-fingertip-half`, `lh-fingertip`, etc.

```ts
fingertip: {
  xs: '0.708em',  // ≈ 1 / 1.618^1.5  — compact density
  s:  '1.146em',
  m:  '3em',      // standard ~48px touch target
  l:  '3.5em',    // larger
  xl: '4em',      // extra large
}
```

The active size is exposed as `--v-fingertip` and `--v-fingertip-half`. Apply `fingertip-{size}` to switch the active size for a subtree:

```html
<div class="fingertip-xs">          <!-- compact -->
  <button class="h-fingertip">…</button>
</div>
```

### `cardSpacingFactor`

Multipliers applied when `card-{level}` computes `--card-spacing` from the heading's corrected font height.

```ts
cardSpacingFactor: { regular: 1, dense: 0.6 }
```

`regular` is the default padding multiplier; `dense` kicks in when the card has the `card-dense` class (or `<VuCard dense />`). See [cards.md](cards.md).

## Typography

### `actualFontHeightFactor` and `actualFontHeightTopBottomRatio`

Real fonts don't fill the em-box edge to edge. The actual glyph height is some fraction of the declared font-size, and isn't necessarily centered.

| Option | Effect |
|--------|--------|
| `actualFontHeightFactor` | Real glyph height as fraction of font-size. `1` = fills the em-box; `0.76` matches Inter, `0.72` matches Roboto. |
| `actualFontHeightTopBottomRatio` | Where the optical center sits. `0.5` = centered; `0.52` slightly biased to the bottom. |

These two numbers feed into `--font-tc` and `--font-bc` (top/bottom correction) for every typography level, which `text-mt-*` / `text-mb-*` use to apply optically-correct margins. If your headings sit too high or too low above paragraphs, tune these. Inter at `actualFontHeightFactor: 0.76, actualFontHeightTopBottomRatio: 0.5` is a good starting point.

### `typography`

Per-level overrides. Each entry uses the schema:

```ts
typography: {
  h1: {
    size: 4,                         // em
    weight: 300,
    boldWeight: 700,
    height: 1.2,                     // line-height ratio
    spacing: -0.025,                 // letter-spacing em
    actualHeightFactor: 0.78,        // optional per-level font-metrics override
    actualHeightTopBottomRatio: 0.5,
  },
  body:  { height: 1.75 },
  label: { weight: 600 },
}
```

Names: `h1, h2, h3, h4, h5, h6, subheading, body-l, body, body-s, callout, label, caption, overline`.

Each entry generates a `text-{name}` UnoCSS utility plus a spacing token of the same name. See [typography.md](typography.md) for the full table and defaults.

## Layers (per-mode reverse)

```ts
layers: {
  reverseLight: false,  // light mode: layer-0 is lightest
  reverseDark:  false,  // dark mode:  layer-0 is darkest
}
```

Switching either to `true` flips the order. Common pattern: the *outer* surface should always be the most extreme (lightest in light mode, darkest in dark mode), so the defaults are usually correct.

## Animation

```ts
animation: {
  durations: {
    'slide-down-and-fade': '.15s',
    'dialog-in': '.15s',
    'easy-zoom-in': '.15s',
    'progress-bar': '4s',
    'blinking': '1s',
    'hide': '.1s',
    /* … */
  },
  keyframes: {
    'dialog-in': '{from { opacity: 0; transform: scale(0.9) } to { opacity: 1; transform: scale(1) }}',
    /* … */
  },
}
```

Used by Dialog, AppToasts, ProgressBar, DatePicker, Loading, etc. Override individual durations/keyframes by passing partial entries — `defu` merges with the defaults.

## Putting it together — example custom theme

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetVunor, vunorShortcuts } from 'vunor/theme'

export default defineConfig({
  presets: [
    presetVunor({
      // tighter density throughout
      baseRadius: '0.4em',
      fingertip:  { xs: '0.625em', s: '1em', m: '2.5em', l: '3em', xl: '3.5em' },
      cardSpacingFactor: { regular: 0.85, dense: 0.55 },

      // Inter font correction
      actualFontHeightFactor: 0.76,
      actualFontHeightTopBottomRatio: 0.5,

      typography: {
        h1: { size: 3.5, weight: 300 },
        h2: { size: 2.25 },
        body: { height: 1.6 },
      },

      palette: {
        // brand swap
        colors: {
          primary:   '#6B4EFF',
          secondary: '#FF8A4C',
          good:      '#22C55E',
          warn:      '#F59E0B',
          error:     '#EF4444',
        },
        // higher contrast layers
        layersDepth: 0.12,
        // a custom surface
        surfaces: {
          ghost: ['scope-light-1', 'scope-dark-2', 'scope-light-3',
                  'scope-dark-1', 'scope-light-2', 'scope-dark-3'],
        },
      },
    }),
  ],
  shortcuts: [vunorShortcuts()],
})
```

## Inspecting the live theme

Vunor ships a built-in `<VuDevTools>` component that lets you tune the palette options interactively (saturation, vividness, flatness, layersDepth, lightest/darkest) and copy the resulting config. Drop it into a dev-only route:

```vue
<VuDevTools v-if="$dev" />
```

The preset also embeds the active `paletteOpts` JSON into a sentinel preflight (`__vunor_palette_options { background-image: url("data:…base64,…") }`) so external tooling can read the resolved configuration.
