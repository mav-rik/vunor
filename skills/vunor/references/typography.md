# Typography & spacing — Vunor

Golden-ratio type scale, spacing tokens, font-aware text margins, fingertip touch targets, and border radius.

For tuning knobs (font height correction, per-level overrides, spacing factor, baseRadius, fingertip sizes) see [theme.md](theme.md).

## Mathematical foundation

All sizes derive from the golden ratio `k = 1.618`. Type sizes are powers of `k`; spacing tokens are powers of `1.618` (the default `spacingFactor`). This produces a naturally harmonious rhythm.

Each typography utility sets `font-size`, `font-weight`, `line-height`, `letter-spacing`, plus several CSS variables consumed by margin compensation:

| Variable | Meaning |
|----------|---------|
| `--font-size` | em size of the level |
| `--font-corrected` | actual rendered glyph height (`size × actualFontHeightFactor`) |
| `--font-bold` | bold weight for this level |
| `--font-tc` / `--font-bc` | top / bottom correction (negative em) used by `text-mt-*` / `text-mb-*` |

## Typography utilities

Apply as UnoCSS classes: `text-h1`, `text-body`, `text-caption`, etc.

| Class | Scale `k^n` | ~Size | Weight / Bold | Line height `k^n` |
|-------|------------|-------|---------------|--------------------|
| `text-h1` | k^3.5 | ≈3.33em | 400 / 700 | k^0.5 |
| `text-h2` | k^2.5 | ≈2.06em | 400 / 700 | k^0.5 |
| `text-h3` | k^2 | ≈1.62em | 400 / 700 | k^0.5 |
| `text-h4` | k^1 | ≈1.24em | 400 / 600 | k^0.5 |
| `text-h5` | k^0.5 | ≈1.10em | 400 / 600 | k^0.5 |
| `text-h6` | k^0.25 | ≈1.05em | 600 / 700 | k^0.5 |
| `text-subheading` | k^-0.2 | ≈0.91em | 400 / 600 | k^0.5 |
| `text-body-l` | k^0.5 | ≈1.27em | 400 / 600 | k^0.75 |
| `text-body` | k^0 | 1em | 400 / 600 | k^0.75 |
| `text-body-s` | k^-0.5 | ≈0.79em | 400 / 600 | k |
| `text-callout` | k^-0.25 | ≈0.89em | 400 / 600 | k^0.5 |
| `text-label` | k^-0.25 | ≈0.89em | 500 / 700 | k^0.5 |
| `text-caption` | k^-0.5 | ≈0.79em | 400 / 600 | k^0.5 |
| `text-overline` | k^-0.5 | ≈0.79em | 400 / 600 | k^0.5 |

```html
<h1 class="text-h1">Title</h1>
<p class="text-body">Body content.</p>
<small class="text-caption">caption</small>
```

There's also `text-card-header` — a virtual level that reads `--card-heading-*` variables set by `card-{level}` (see [cards.md](cards.md)).

Override per-level via `presetVunor({ typography: { h1: { size: 4, weight: 300 } } })`. See [theme.md](theme.md).

## Spacing tokens

Golden-ratio scale, used wherever UnoCSS accepts a spacing key (`p-`, `m-`, `gap-`, `px-`, `py-`, `mx-`, `my-`, `space-x-`, `space-y-`, `top-`, `left-`, `inset-`, etc.):

| Token | Scale | ~Value |
|-------|-------|--------|
| `$xxs` | 1 / k^3 | ≈0.236em |
| `$xs` | 1 / k^2 | ≈0.382em |
| `$s` | 1 / k | ≈0.618em |
| `$m` | 1 | 1em |
| `$l` | k | ≈1.618em |
| `$xl` | k^2 | ≈2.618em |
| `$xxl` | k^3 | ≈4.236em |

```html
<div class="p-$m gap-$s">          <!-- standard padding, small gap -->
<div class="px-$l py-$m mt-$xl">   <!-- larger horizontal padding -->
<div class="m-$xxs">               <!-- tiny margin -->
```

The same tokens are exposed for `width`, `height`, `maxWidth`, `maxHeight`, `minWidth`, `minHeight`, `borderRadius`. So `w-$l`, `h-$xl`, `rounded-$s` all work.

### Font-derived spacing tokens

These let you size containers using the active font metrics — useful for inputs, code blocks, hint rows.

| Token | Source |
|-------|--------|
| `$font-size` | `var(--font-size)` |
| `$font-corrected` | `var(--font-corrected)` |
| `$font-tc` / `$font-bc` | `var(--font-tc)` / `var(--font-bc)` |
| `$card-spacing` / `$card-spacing-dense` | from `card-{level}` |
| `$card-heading-size` / `$card-heading-corrected` | from `card-{level}` |

```html
<div class="h-$card-spacing">  <!-- sized by active card spacing -->
<div class="p-$font-corrected">  <!-- pads to actual glyph height -->
```

### Fingertip spacing

Fingertip sizes appear both as touch-target classes and spacing tokens, so they compose naturally with padding/border-radius utilities:

| Token / class | Source |
|---------------|--------|
| `fingertip` / `h-fingertip` / `w-fingertip` | `--v-fingertip` (active) |
| `fingertip-half` / `px-fingertip-half` | `--v-fingertip-half` |
| `fingertip-xs` / `…-s` / `…-m` / `…-l` / `…-xl` | named sizes from preset |

`h-fingertip` is the standard height for buttons and inputs. `rounded-fingertip-half` produces a perfect pill.

## Text margins with line-height correction

`text-mt-*`, `text-mb-*`, `text-my-*`, `text-mx-*`, `text-m-*` apply margins that **subtract the line-height padding** above and below the actual glyphs. Use them between typographic elements to get optically correct spacing.

The math: `margin-top: calc(<size> + var(--font-tc))` and `margin-bottom: calc(<size> + var(--font-bc))`. `--font-tc` and `--font-bc` are negative ems set by the typography utility on the same element, so the visible gap matches the size you asked for instead of being inflated by the line box.

```html
<h1 class="text-h1 text-mb-$m">Heading</h1>
<p class="text-body text-mt-$s text-mb-$m">First paragraph.</p>
<p class="text-body text-mb-$m">Second paragraph.</p>
```

Variants:

| Class | Targets |
|-------|---------|
| `text-mt-{size}` | `margin-top` only |
| `text-mb-{size}` | `margin-bottom` only |
| `text-my-{size}` | `margin-top` and `margin-bottom` |
| `text-mx-{size}` | `margin-left` + `margin-right` (no correction) |
| `text-m-{size}` | all four sides |

`{size}` accepts spacing tokens (`$s`, `$m`), theme spacing keys, or numeric `<n>` (multiplied by `0.25rem` if unitless).

```html
<p class="text-body text-mb-2">→ margin-bottom: calc(0.5rem + var(--font-bc))</p>
<p class="text-body text-mb-1.5em">→ margin-bottom: calc(1.5em + var(--font-bc))</p>
```

`text-mt-0` / `text-mb-0` zero out the visual gap (still applying correction). Useful as the first/last child:

```html
<VuCardHeader class="text-mt-0">First</VuCardHeader>
<p class="text-mb-0">Last paragraph in card</p>
```

## Border radius

The `borderRadius` theme is a copy of the spacing scale plus `base` and a `baseRadius`-derived ladder `r0..r4`:

| Class | Source |
|-------|--------|
| `rounded-r0` | minimum radius — `min(base, clamp(2px, base/2, 4px))`, always `px`; for chips, checkboxes, tight pills |
| `rounded-r1` | `baseRadius` (alias for `rounded-base`); for buttons, inputs, default controls |
| `rounded-r2` | `baseRadius × 1.5`; for popovers, toasts, small containers |
| `rounded-r3` | `baseRadius × 2`; for dialogs, cards, emphasized surfaces |
| `rounded-r4` | `baseRadius × 2.5`; for hero surfaces, very-rounded panels |
| `rounded-base` | `--baseRadius` (default `0.618em`) — same as `rounded-r1` |
| `rounded-$xxs` … `rounded-$xxl` | spacing tokens (tracks `spacingFactor`, not `baseRadius`) |
| `rounded-fingertip-half` | half of active fingertip — perfect pill on `h-fingertip` |

All `rounded-r*` steps collapse to `0` when `baseRadius: '0'`, preserving the "flat everything" single-knob contract.

```html
<VuCheckbox />                                        <!-- rounded-r0 -->
<button class="h-fingertip px-$m rounded-r1 c8-filled scope-primary">Save</button>
<div class="rounded-r3 layer-0 p-$m">                 <!-- dialog-sized container -->
  …
</div>
<button class="h-fingertip rounded-fingertip-half">pill</button>
```

Override `baseRadius` in `presetVunor({ baseRadius })` to reskin every component in one stroke — all `rounded-r*`, `rounded-base`, and internal `c8-*` / `i8-filled` / checkbox / toast / select radii track it. Cards are the exception: their corner radius is font-size-derived via `--card-spacing`, so cards remain harmonious with heading size regardless of `baseRadius`. See [theme.md](theme.md) for the full radius-ladder reference.

## Common patterns

### Article rhythm

```html
<article class="text-body">
  <h2 class="text-h2 text-mb-$m">Article Title</h2>
  <p class="text-mt-0 text-mb-$m">Lead paragraph…</p>
  <h3 class="text-h3 text-mt-$xl text-mb-$s">Section</h3>
  <p class="text-mb-$m">Body…</p>
</article>
```

### Compact, font-relative form

```html
<div class="fingertip-xs flex flex-col gap-$xs">
  <VuInput v-model="x" label="Name" />
  <VuInput v-model="y" label="Email" />
</div>
```

### Pixel-perfect button row

```html
<div class="flex gap-$xs">
  <button class="h-fingertip px-$m rounded-base c8-filled scope-primary">Save</button>
  <button class="h-fingertip px-$m rounded-base c8-flat scope-grey">Cancel</button>
</div>
```

## Gotchas

- Spacing tokens use the `$` prefix. `p-$m` is golden-ratio 1em; plain `p-m` is a different (built-in UnoCSS) utility.
- `text-h1` … `text-caption` set multiple CSS properties, not just `font-size`. Don't override `font-size` directly on the same element — use the `typography` preset option instead.
- `text-m-$m` (no axis suffix) applies margins to all four sides. Use `text-my-$m` if you only want vertical correction.
- `text-mb-*` only applies font correction to top/bottom margins, not left/right. Horizontal margins from `text-mx-*` are uncorrected (no analogue to ascender/descender for left/right).
- `--font-corrected` depends on `actualFontHeightFactor`. If your font renders much taller or shorter than Inter (the design baseline), tune that factor in `presetVunor` — see [theme.md](theme.md).
- `fingertip-m` only sets the variable. To use the active fingertip as a height, also apply `h-fingertip` (or `min-h-fingertip`).
