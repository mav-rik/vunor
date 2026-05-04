# UnoCSS rule reference — Vunor

Every custom UnoCSS rule registered by `presetVunor()`, with patterns, generated CSS, and what consumes it. Use this file as a lookup when writing or debugging a class.

For semantic-class usage (which classes to combine for which result), see [colors.md](colors.md), [typography.md](typography.md), [cards.md](cards.md), [shortcuts.md](shortcuts.md).

## Categories

1. **Palette rules** — color scoping, current-color system, scope-direct painting, icon utilities.
2. **Spacing rules** — text margins, card spacing, fingertip sizing.
3. **Input (i8) rules** — i8 border/bg/outline configuration and application.
4. **Shortcuts** — `layer-*`, `surface-*`, `(target)-layer-*` (registered as static + dynamic shortcuts, listed here for completeness).

## Palette rules

### `scope-{color}` — palette scoping

```
/^scope-(.*)$/
```

Sets every `--scope-*` variable for an entire subtree from a named theme color.

Generates:
```css
.scope-primary {
  --scope-color: <rgb>;
  --scope-color-50:  <rgb>;
  --scope-color-100: <rgb>;
  …
  --scope-color-900: <rgb>;
  --scope-light-0: <rgb>;
  --scope-light-1: <rgb>;
  …
  --scope-light-4: <rgb>;
  --scope-dark-0: <rgb>;
  --scope-dark-1: <rgb>;
  …
  --scope-dark-4: <rgb>;
  --current-hl: <rgb>;     /* alias to --scope-color-500 */
}
```

Valid color names: `primary`, `secondary`, `good`, `warn`, `error`, `grey`, `neutral`. Returns `undefined` (rule no-op) for any other name.

A preflight installs `scope-neutral` on `:root` so the variables exist by default.

### `current-{target}-{source}` — set the current-color variable

```
/^current-(text-muted|icon-muted|text-hover|bg-hover|border-hover|text|bg|icon|border|outline|caret|hl)-(.+)$/
```

Sets `--current-{target}` to a color reference. Targets: `text`, `bg`, `icon`, `border`, `outline`, `caret`, `hl` (highlight), plus the **tone-axis siblings** `text-muted`, `icon-muted`, `text-hover`, `bg-hover`, `border-hover` (set automatically by `layer-X` — see [colors.md](colors.md#tone-slots)).

Source resolution rules:

| Source pattern | Result |
|----------------|--------|
| `scope-…` (e.g. `scope-color-500`, `scope-light-2`) | `--current-{target}: var(--scope-…)` |
| `hl` | `--current-{target}: var(--current-hl)` |
| any theme color (`primary`, `error-500`, `grey-300`, `white`, `black`, …) | resolved to `r g b` triplet |

```html
<div class="current-bg-scope-color-500">…</div>
<div class="current-text-hl">…</div>
<div class="current-border-grey-200">…</div>
```

### `(target)-current(-source)?(/opacity)?` — apply the current-color variable

```
/^(text|bg|icon|border|outline|caret|fill|shadow|ring)-current(-text-hover|-bg-hover|-border-hover|-text-muted|-icon-muted|-text|-bg|-icon|-border|-outline|-caret|-hl|-muted|-hover)?(\/\d{1,3})?$/
```

Reads a `--current-*` variable and renders to a CSS property. The `-muted` and `-hover` shorthands resolve against the same target (`text-current-muted` → `--current-text-muted`; `border-current-hover` → `--current-border-hover`).

```html
<div class="bg-current">         <!-- background-color: rgb(var(--current-bg) / var(--un-bg-opacity)) -->
<div class="bg-current/50">      <!-- 50% opacity, ignoring the var -->
<div class="text-current-hl">    <!-- color from --current-hl instead of --current-text -->
<div class="text-current-muted"> <!-- secondary/placeholder text weight -->
<div class="border-current">     <!-- border-color from --current-border -->
<div class="hover:border-current-hover">  <!-- one-step-darker hover border -->
<div class="hover:bg-current-hover">      <!-- one-step-darker hover bg -->
<div class="shadow-current-border">  <!-- --un-shadow-color from --current-border -->
<div class="ring-current-border">    <!-- --un-ring-color from --current-border -->
```

Special case: `icon-current` only sets `--un-icon-opacity` and (optionally) `--current-icon`. Use `icon-color` to actually paint.

`shadow-*-border` and `ring-*-border` route through the border opacity variable (`--un-border-opacity`) for design consistency with bordered surfaces.

### `(target)-scope-{source}(/opacity)?` — direct scope painting

```
/^(bg|text|fill|stroke|border|outline|icon|caret)-scope-((?:color|dark|light|text|bg|white|black|icon)(?:-\d+)?)(\/\d{1,3})?$/
```

Skips the `--current-*` indirection and paints from a `--scope-*` variable directly. Falls back to the static `grey` palette if `--scope-…` is unset.

```html
<div class="bg-scope-color-100">      <!-- background-color: rgb(var(--scope-color-100, <grey-100>)) -->
<div class="text-scope-dark-2/80">    <!-- color: rgb(var(--scope-dark-2) / 0.8) -->
<div class="border-scope-light-1/50"> <!-- 50% scope-light-1 -->
```

### `icon-opacity-{0-100}`

```
/^icon-opacity-(\d{1,3})$/
```

Sets `--un-icon-opacity: N/100`. Consumed by the `icon-color` rule.

### `icon-color`

Static rule. Renders:
```css
.icon-color { color: rgb(var(--current-icon) / var(--un-icon-opacity, 1)); }
```

`<VuIcon>` includes this class by default.

### `icon-size` and `icon-size-{value}`

```
/^icon-size-(.*)$/   (and exact `icon-size`)
```

| Class | CSS |
|-------|-----|
| `icon-size-[2em]` | `--icon-size: 2em` |
| `icon-size-4` | `--icon-size: 1rem` (from `theme.spacing['4']`) |
| `icon-size` | `width: var(--icon-size, 1em); height: var(--icon-size, 1em)` |

Pair them: `<VuIcon class="icon-size-[1.25em]" />`.

## Spacing rules

### `text-m{t|b|y}-{size}` — text-aware margin

```
/^text-m([bty])?-(.*)$/        layer: utilities
```

Margin compensation that subtracts the line-box ascender/descender from the requested margin. Uses `--font-tc` (top correction) and `--font-bc` (bottom correction) set by the typography utility on the same element.

| Suffix | Sides |
|--------|-------|
| `t` | top only |
| `b` | bottom only |
| `y` | top + bottom |
| _(none)_ | all four sides (`text-m-…`) |

Size lookup:

1. `theme.spacing[size]` — if it's a token (e.g. `$m`, `$xs`, `fingertip-half`)
2. Numeric `<n>(em|rem|px)?` — if unitless, multiplied by `0.25rem` (Tailwind-compatible)

```html
<h1 class="text-h1 text-mb-$m">→ margin-bottom: calc(1em + var(--font-bc))</h1>
<p class="text-body text-mt-$s">→ margin-top: calc(0.618em + var(--font-tc))</p>
```

Horizontal (`mx`/`m-…` for left/right) margins do **not** apply font correction (no analog for ascender/descender).

### `card-dense`

Static rule. Renders:
```css
.card-dense { --card-spacing: var(--card-spacing-dense); }
```

Switches the active card spacing variable to its dense counterpart. Requires a `card-{level}` rule on the same or ancestor element to have set both `--card-spacing` and `--card-spacing-dense`.

### `card-{typography-name}`

```
/^card-(.*)$/      where match must be a key in theme.fontSize
```

Sets several card variables proportional to a typography level's metrics, plus `padding`. See [cards.md](cards.md) for details.

### `fingertip-{value}`

```
/^fingertip-(.*)/
```

Sets the active touch-target variables.

| Class | Variables |
|-------|-----------|
| `fingertip-xs` `\|` `s` `\|` `m` `\|` `l` `\|` `xl` | `--v-fingertip: <named size>; --v-fingertip-half: <half>` |
| `fingertip-<theme.spacing key>` (e.g. `fingertip-4`) | reads from `theme.spacing` |
| `fingertip-[2.5rem]` | bracket value used directly |

```html
<div class="fingertip-xs">             <!-- compact density for this subtree -->
  <button class="h-fingertip">…</button>  <!-- consumes --v-fingertip = xs size -->
</div>
```

## Input (i8) rules

### `i8-{target}-{value}`

```
/^i8-(border|outline|bg)-(.+)$/
```

Configures input border/outline/background via custom properties. Resolution order:

| Value | Result |
|-------|--------|
| `none` | `--i8-{target}-width: 0` |
| `transparent` | `--i8-{target}-color: 0` |
| `scope-…` (e.g. `scope-color-500`) | `--i8-{target}-color: var(--scope-…)` |
| theme color (e.g. `primary`, `error`) | `--i8-{target}-color: <rgb>` |
| `<n>(px|em|rem)` (e.g. `2px`) | `--i8-{target}-width: 2px` |
| `[<value>]` with width unit | `--i8-{target}-width: <value>` |
| `[<value>]` otherwise | `--i8-{target}-color: <value>` |
| theme.spacing key | `--i8-{target}-width: <value>` |

```html
<div class="i8 i8-filled
            i8-border-2px
            i8-border-scope-color-500
            i8-bg-transparent
            i8-outline-[#ff0000]"></div>
```

### `i8-{target}-opacity-{0-100}`

```
/^i8-(border|outline|bg)-opacity-(\d{1,3})$/
```

Sets `--i8-{target}-opacity: N/100`.

### `i8-apply-{target}` — render the configured i8 values

```
/^i8-apply-(border|outline|bg)$/
```

The "commit" step. Reads `--i8-{target}-color` (defaulting to `--current-{target}`), `--i8-{target}-opacity`, and (for border/outline) `--i8-{target}-width`, then writes:

| Class | CSS |
|-------|-----|
| `i8-apply-bg` | `background-color: rgb(var(--i8-bg-color, var(--current-bg)) / var(--i8-bg-opacity, 1))` |
| `i8-apply-border` | `border-color: rgb(var(--i8-border-color, var(--current-border)) / var(--i8-border-opacity, 0.2)); border-width: var(--i8-border-width, 1px)` |
| `i8-apply-outline` | `outline-color: rgb(var(--i8-outline-color, var(--current-outline)) / var(--i8-outline-opacity, 0.5)); outline-width: var(--i8-outline-width, 2px)` |

You rarely apply these directly — they're called inside the `i8-flat`/`i8-filled`/`i8-round` shortcuts. Reach for them when defining a custom `i8` design variant.

## Shortcut-style rules (palette)

These are registered as **dynamic shortcuts** by the preset, but functionally feel like rules. They expand into UnoCSS strings.

### `layer-{0-4}`

Full background + text + icon + border bundle, plus the muted/hover tone slots ([colors.md#tone-slots](colors.md#tone-slots)). Auto-adapts to dark mode. Honors `theme.reverseDarkLayers` and `theme.reverseLightLayers`.

Expands to (light mode example with `n=2`):
```
current-bg-scope-light-2
current-text-scope-dark-0   current-text-muted-scope-dark-2   current-text-hover-scope-dark-0
current-icon-scope-dark-0   current-icon-muted-scope-dark-2
current-border-grey-500     current-border-hover-scope-light-3
current-bg-hover-scope-light-3
bg-current text-current

dark:current-bg-scope-dark-2
dark:current-text-scope-light-0   dark:current-text-muted-scope-light-2   dark:current-text-hover-scope-light-0
dark:current-icon-scope-light-0   dark:current-icon-muted-scope-light-2
dark:current-border-hover-scope-dark-3
dark:current-bg-hover-scope-dark-3
```

(The `[&.dark]:` clauses mirror the `dark:` ones for explicit class-based dark mode.)

### `(target)-layer-{0-4}`

```
/^(current-text-muted|current-icon-muted|current-text-hover|current-bg-hover|current-border-hover|bg|text|current-text|current-bg|current-icon|current-border|current-outline|current-caret|current-hl|i8-bg|i8-border|i8-outline)-layer-([0-4])$/
```

Single-property layer painting. Same dark-aware semantics as `layer-{0-4}` but only one target. Targets include the tone-axis siblings so you can paint just the muted/hover slot of a specific layer.

```html
<div class="bg-layer-1 text-layer-2 border-layer-3">…</div>
```

### `surface-{name}`

```
/^surface-(.+)$/
```

Renders a surface preset from `theme.surfaces[name]` as a `[bg, text, border, dark:bg, dark:text, dark:border]` bundle plus a soft `shadow-black/30` in dark mode.

Default surfaces: `0`, `1`, `2`, `3`, `4`, `50`, `100`, `200`, …, `900`. Add or override via `palette.surfaces`. See [theme.md](theme.md).

`surface` (no number) is a shortcut for `surface-100`.

## CSS custom property reference

| Variable | Set by | Read by |
|----------|--------|---------|
| `--scope-color-{0–900}` | `scope-*` | `current-*-scope-color-*`, `*-scope-color-*` |
| `--scope-light-{0–4}` | `scope-*` | `layer-*`, `*-scope-light-*`, surfaces |
| `--scope-dark-{0–4}` | `scope-*` | `layer-*`, `*-scope-dark-*`, surfaces |
| `--current-text` | `current-text-*` | `text-current` |
| `--current-bg` | `current-bg-*` | `bg-current`, `i8-apply-bg` (default) |
| `--current-icon` | `current-icon-*` | `icon-current`, `icon-color` |
| `--current-border` | `current-border-*` | `border-current`, `i8-apply-border` (default), `shadow-current-border`, `ring-current-border` |
| `--current-outline` | `current-outline-*` | `outline-current`, `i8-apply-outline` (default) |
| `--current-caret` | `current-caret-*` | `caret-current` |
| `--current-hl` | `scope-*` (auto) or `current-hl-*` | `*-current-hl` |
| `--font-size`, `--font-corrected`, `--font-bold`, `--font-tc`, `--font-bc` | `text-*` typography utilities | `text-mt-*`, `text-mb-*`, `card-{level}` |
| `--card-spacing` | `card-{level}` | `<VuCard>` padding, `p-$card-spacing`, `gap-$card-spacing` |
| `--card-spacing-dense` | `card-{level}` | `card-dense` |
| `--card-heading-*` | `card-{level}` | `text-card-header` |
| `--v-fingertip`, `--v-fingertip-half` | `fingertip-*` (default `m`) | `h-fingertip`, `lh-fingertip`, `rounded-fingertip-half` |
| `--i8-{border\|bg\|outline}-color/-width/-opacity` | `i8-{target}-*` | `i8-apply-*` |
| `--un-icon-opacity` | `icon-opacity-*`, `icon-current` | `icon-color` |
| `--icon-size` | `icon-size-*` | `icon-size` |
| `--un-default-border-color` | preflight | `border` (uno default) |
| `--un-border-opacity` | preflight (`0.25`) | uno default border, `i8-apply-border` (when sourced from border) |

## Best practices

- Set `scope-{color}` at the highest reasonable ancestor — variables cascade naturally and you minimize redundant declarations.
- Prefer `text-mt-*` / `text-mb-*` between typographic blocks. Reach for plain `mt-*` / `mb-*` only when there's no typography utility on either neighbor.
- Use `i8-flat` / `i8-filled` / `i8-round` shortcuts in normal code. Only use `i8-{border|bg|outline}-*` rules to *configure* a shortcut you already applied.
- `card-{level}` writes `padding` directly. Don't combine with another `p-*` on the same element — pick one.
- The `current-*` indirection is what makes `bg-current/05`, `border-current/40` work consistently across components. Skip it (`bg-scope-color-…`) only when you don't need the indirection.

## Gotchas

- `scope-{color}` only sets variables — it paints nothing. Pair with a consumer (`layer-*`, `surface-*`, `bg-current`, `c8-*`, `i8-*`).
- `icon-current` does **not** paint. It sets `--un-icon-opacity` and (sometimes) `--current-icon`. The actual color comes from `icon-color`.
- `i8-apply-border` defaults `border-opacity` to `0.2` and `border-width` to `1px`. Setting only `i8-border-primary` may produce a near-invisible line — also set opacity or width if you need contrast.
- `text-m-$m` (no axis) targets all four sides. Use `text-my-$m` for vertical-only.
- `fingertip-m` only sets the variable; `h-fingertip` consumes it. Forgetting one or the other yields a button without the expected height.
- `card-dense` requires that `card-{level}` already ran on the same element (or ancestor) so `--card-spacing-dense` exists. Adding `card-dense` to a bare `<div>` does nothing.
- `current-bg-scope-color-500` is **scope-relative** — uses whatever scope is active. `current-bg-primary-500` is **scope-independent** — always primary.
