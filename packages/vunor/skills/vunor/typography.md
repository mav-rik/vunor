# Typography & spacing — vunor

> Golden ratio type scale, spacing tokens, text margin utilities, fingertip sizes, and card spacing.

## Concepts

All dimensions in Vunor derive from the golden ratio (`k = 1.618`). Font sizes, line heights, spacing, border radii, and touch targets are computed as powers of `k`, producing a naturally harmonious scale.

Each typography level sets multiple CSS custom properties:
- `--font-size` — the em size
- `--font-corrected` — actual rendered glyph height (accounting for font metrics)
- `--font-bold` — bold weight for this level
- `--font-weight` — normal weight for this level
- `--font-bc` / `--font-tc` — bottom/top correction for precise vertical spacing
- `line-height`, `letter-spacing`

## API Reference

### Typography utilities

Applied as UnoCSS classes: `text-h1`, `text-body`, `text-label`, etc.

| Name | Scale (k^n) | ~Size | Weight | Bold | Line Height |
|------|-------------|-------|--------|------|-------------|
| `text-h1` | k^3.5 | ~3.33em | 400 | 700 | k^0.5 |
| `text-h2` | k^2.5 | ~2.06em | 400 | 700 | k^0.5 |
| `text-h3` | k^2 | ~1.62em | 400 | 700 | k^0.5 |
| `text-h4` | k^1 | ~1.24em | 400 | 600 | k^0.5 |
| `text-h5` | k^0.5 | ~1.10em | 400 | 600 | k^0.5 |
| `text-h6` | k^0.25 | ~1.05em | 600 | 700 | k^0.5 |
| `text-body` | k^0 | 1em | 400 | 600 | k^0.75 |
| `text-body-l` | k^0.5 | ~1.27em | 400 | 600 | k^0.75 |
| `text-body-s` | k^-0.5 | ~0.79em | 400 | 600 | k^1 |
| `text-label` | k^-0.25 | ~0.89em | 500 | 700 | k^0.5 |
| `text-caption` | k^-0.5 | ~0.79em | 400 | 600 | k^0.5 |
| `text-overline` | k^-0.5 | ~0.79em | 400 | 600 | k^0.5 |
| `text-subheading` | k^-0.2 | ~0.91em | 400 | 600 | k^0.75 |
| `text-callout` | k^-0.25 | ~0.89em | 400 | 600 | k^0.5 |

```html
<h1 class="text-h1">Large heading</h1>
<p class="text-body">Regular paragraph</p>
<span class="text-caption">Small caption</span>
```

### Typography overrides

Override individual entries in `presetVunor`:

```ts
presetVunor({
  typography: {
    h1: { size: 4, weight: 300, boldWeight: 700 },
    body: { height: 1.75 },     // taller line-height
    label: { weight: 600 },
  },
})
```

Each entry accepts: `size` (em), `weight`, `boldWeight`, `height` (line-height), `letterSpacing`.

### Spacing tokens

Golden ratio spacing progression, used as UnoCSS utilities:

| Token | Scale | ~Value |
|-------|-------|--------|
| `$xxs` | 1/k^3 | 0.24em |
| `$xs` | 1/k^2 | 0.38em |
| `$s` | 1/k | 0.62em |
| `$m` | 1 | 1em |
| `$l` | k | 1.62em |
| `$xl` | k^2 | 2.62em |
| `$xxl` | k^3 | 4.24em |

```html
<div class="p-$m">Standard padding (1em)</div>
<div class="p-$s gap-$xs">Smaller padding, tiny gap</div>
<div class="m-$l">Large margin</div>
```

Works with all standard UnoCSS spacing utilities: `p-`, `m-`, `gap-`, `px-`, `py-`, `mx-`, `my-`, etc.

### Text-aware margins

#### `text-mt-{size}` / `text-mb-{size}` / `text-my-{size}`

Text margin utilities that compensate for line-height to maintain optically correct spacing. They use `--font-tc` (top correction) and `--font-bc` (bottom correction) to adjust margins.

```html
<h1 class="text-h1 text-mb-$m">Title</h1>
<p class="text-body text-mt-$s">Paragraph with optically corrected spacing</p>
```

### Fingertip (touch target) sizes

Interactive elements default to `--v-fingertip` for accessibility. Configurable sizes:

| Class | Default | Purpose |
|-------|---------|---------|
| `fingertip-xs` | ~1.24em | Compact controls |
| `fingertip-s` | ~1.85em | Small buttons |
| `fingertip` / `fingertip-m` | 3em (~48px) | Standard touch target |
| `fingertip-l` | 3.5em | Large buttons |
| `fingertip-xl` | 4em | Extra-large targets |

```html
<button class="h-fingertip">Standard height</button>
<button class="fingertip-xs h-fingertip">Compact height</button>
```

Components like `VuButton` and `VuInput` use `h-fingertip` by default.

Override in preset:

```ts
presetVunor({
  fingertip: { xs: '1.25em', s: '2em', m: '3em', l: '3.5em', xl: '4em' },
})
```

### Card spacing

#### `card-{typography}`

Sets `--card-spacing` proportional to the heading's corrected font size. Use on `<VuCard>` via the `level` prop.

```html
<VuCard level="h3">
  <VuCardHeader>Section Title</VuCardHeader>
  <p>Content with h3-proportional padding</p>
</VuCard>
```

Valid values: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `subheading`, `body`, `body-l`, `body-s`, `callout`, `label`, `caption`, `overline`.

#### `card-dense`

Reduces card spacing to 60% of normal (configurable via `cardSpacingFactor.dense`).

```html
<VuCard level="h4" dense>Compact card</VuCard>
```

### Border radius

Default border radius is `0.618em` (1/golden-ratio). Override globally:

```ts
presetVunor({
  baseRadius: '0.5em',  // or any CSS length
})
```

Applied via the `rounded-base` utility class.

## Common patterns

### Pattern: Heading + body with harmonious spacing

```html
<article>
  <h2 class="text-h2 text-mb-$s">Article Title</h2>
  <p class="text-body text-mb-$m">First paragraph...</p>
  <p class="text-body text-mb-$m">Second paragraph...</p>
</article>
```

### Pattern: Card with typography-driven spacing

```html
<VuCard level="h3">
  <VuCardHeader>Dashboard</VuCardHeader>
  <div class="flex flex-col gap-$s">
    <p class="text-body">Card padding scales with the h3 heading.</p>
  </div>
</VuCard>
```

### Pattern: Dense layout

```html
<div class="fingertip-xs">
  <VuCard level="body" dense>
    <div class="flex gap-$xxs">
      <!-- Compact controls and tight spacing -->
    </div>
  </VuCard>
</div>
```

## Best practices

- Use `text-mt-*` and `text-mb-*` instead of plain `mt-*` / `mb-*` for spacing between typographic elements — they compensate for line-height optical differences.
- Use spacing tokens (`$s`, `$m`, `$l`) instead of arbitrary values — they maintain the golden ratio relationship.
- Set `level` on `VuCard` to match the most prominent heading inside — this auto-calculates harmonious padding.
- Don't mix pixel-based spacing with the token system — the tokens are em-based and scale with font size.

## Gotchas

- Spacing tokens use `$` prefix (e.g., `p-$m`), not bare names. `p-m` is a standard UnoCSS utility (medium), not a Vunor token.
- `text-h1` through `text-caption` set multiple CSS properties, not just `font-size`. Overriding `font-size` directly may break spacing calculations.
- `--font-corrected` depends on `actualFontHeightFactor` in the preset. If your font renders significantly taller/shorter than the default, adjust this factor for correct spacing.
- Card spacing is relative to the heading size — a `card-h1` has much larger padding than `card-body`. This is intentional but can be surprising.
