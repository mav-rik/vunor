# UnoCSS custom rules — vunor

> All 15 custom UnoCSS rules provided by `presetVunor`: palette/scope/current-color rules, spacing/typography/card/fingertip rules, and i8 input styling rules.

## Concepts

Vunor's `presetVunor()` registers custom UnoCSS rules that power the color scope system, typography-aware spacing, card sizing, touch targets, and input styling. These rules generate CSS custom properties that compose together — e.g., `scope-primary` sets palette variables, `current-bg-scope-color-500` reads them, and `bg-current` applies the result.

Rules are organized in three groups:
1. **Palette rules** (8) — color scoping, current-color system, icon utilities
2. **Spacing rules** (4) — text margins, card spacing, fingertip sizing
3. **Input rules** (3) — i8 border/bg/outline configuration

## Palette rules

### `scope-{color}`

Sets `--scope-color-*` CSS custom properties for the entire subtree.

**Pattern:** `/^scope-(.*)$/`

Generates variables for all 10 main shades (50–900), 5 light layers (0–4), 5 dark layers (0–4), and sets `--current-hl` to the 500 shade. Valid colors: `primary`, `secondary`, `good`, `warn`, `error`, `grey`, `neutral`.

```html
<div class="scope-primary">
  <!-- --scope-color-50 through --scope-color-900 are now set -->
  <!-- --scope-light-0 through --scope-light-4 -->
  <!-- --scope-dark-0 through --scope-dark-4 -->
  <!-- --current-hl = primary-500 -->
</div>
```

### `current-{target}-{source}`

Sets a `--current-{target}` CSS variable to a specific color.

**Pattern:** `/^current-(text|bg|icon|border|outline|caret|hl)-(.+)$/`

| Source type | Example | Result |
|-------------|---------|--------|
| Scope reference | `current-bg-scope-color-500` | `--current-bg: var(--scope-color-500)` |
| Highlight alias | `current-text-hl` | `--current-text: var(--current-hl)` |
| Theme color | `current-bg-primary-500` | `--current-bg: <rgb values>` |

```html
<div class="current-bg-primary-500 current-text-primary-50">
  <div class="bg-current text-current">Styled via CSS vars</div>
</div>
```

### `{target}-current` / `{target}-current-{source}` / `{target}-current/{opacity}`

Applies a `--current-*` color to a CSS property.

**Pattern:** `/^(text|bg|icon|border|outline|caret|fill|shadow|ring)-current(-text|-bg|-icon|-border|-outline|-caret|-hl)?(\/\d{1,3})?$/`

```html
<div class="text-current">          <!-- color: rgb(var(--current-text) / 1) -->
<div class="bg-current/50">         <!-- background-color: rgb(var(--current-bg) / 0.5) -->
<div class="border-current-hl">     <!-- border-color uses --current-hl -->
<div class="icon-current">          <!-- sets --un-icon-opacity: 1 -->
<div class="shadow-current-border"> <!-- --un-shadow-color from --current-border -->
```

Special behavior for `icon` target: sets `--un-icon-opacity` but applies color through the `icon-color` rule, not directly.

### `{target}-scope-{source}` / `{target}-scope-{source}/{opacity}`

Applies a scoped palette color directly to a CSS property without going through `--current-*`.

**Pattern:** `/^(bg|text|fill|stroke|border|outline|icon|caret)-scope-((?:color|dark|light|text|bg|white|black|icon)(?:-\d+)?)(\/\d{1,3})?$/`

```html
<div class="bg-scope-color-100">     <!-- background: --scope-color-100 -->
<div class="text-scope-dark-2">      <!-- color: --scope-dark-2 -->
<div class="border-scope-light-1/50"> <!-- border: --scope-light-1 at 50% -->
```

### `icon-opacity-{0-100}`

Sets `--un-icon-opacity`.

**Pattern:** `/^icon-opacity-(\d{1,3})$/`

```html
<div class="icon-opacity-50"> <!-- --un-icon-opacity: 0.5 -->
```

### `icon-color`

Applies the current icon color with icon opacity.

**Pattern:** exact match `icon-color`

```css
.icon-color { color: rgb(var(--current-icon) / var(--un-icon-opacity, 1)); }
```

### `icon-size-{value}` / `icon-size`

Sets or applies icon dimensions.

**Pattern:** `/^icon-size-(.*)$/` and exact match `icon-size`

| Class | Result |
|-------|--------|
| `icon-size-[2em]` | `--icon-size: 2em` |
| `icon-size-4` | `--icon-size: 1rem` (from theme.spacing) |
| `icon-size` | `width/height: var(--icon-size, 1em)` |

## Spacing rules

### `text-m{t|b|y}-{size}`

Text margins with line-height compensation. Adjusts top/bottom margins using `--font-tc` (top correction) and `--font-bc` (bottom correction) so spacing between typographic elements is optically correct.

**Pattern:** `/^text-m([bty])?-(.*)$/`

| Suffix | Applies to |
|--------|-----------|
| `t` | top only |
| `b` | bottom only |
| `y` | top and bottom |
| _(none)_ | all four sides |

```html
<h1 class="text-h1 text-mb-$m">Title</h1>
<!-- margin-bottom: calc(1em + var(--font-bc)) -->

<p class="text-body text-mt-$s">Paragraph</p>
<!-- margin-top: calc(0.62em + var(--font-tc)) -->
```

Size values: spacing tokens (`$s`, `$m`, `$l`...), theme spacing keys, or numbers (multiplied by 0.25rem if unitless).

### `card-dense`

Switches card spacing to the dense variant.

**Pattern:** exact match `card-dense`

```css
.card-dense { --card-spacing: var(--card-spacing-dense); }
```

### `card-{typography}`

Sets `--card-spacing` proportional to a typography level's corrected font size.

**Pattern:** `/^card-(.*)$/` (matches any valid `theme.fontSize` key)

```html
<div class="card-h3">
  <!-- --card-spacing: <h3 corrected size * cardSpacingFactor.regular> -->
  <!-- --card-spacing-dense: <h3 corrected size * cardSpacingFactor.dense> -->
  <!-- --card-heading-size, --card-heading-bold, etc. also set -->
  <!-- padding: var(--card-spacing) -->
</div>
```

Valid keys: `h1`–`h6`, `subheading`, `body`, `body-l`, `body-s`, `callout`, `label`, `caption`, `overline`.

### `fingertip-{size}`

Sets touch target height via `--v-fingertip` and `--v-fingertip-half`.

**Pattern:** `/^fingertip-(.*)/`

| Class | Source |
|-------|--------|
| `fingertip-xs` / `s` / `m` / `l` / `xl` | Named sizes from preset config |
| `fingertip-4` | `theme.spacing['4']` |
| `fingertip-[2.5rem]` | Bracket value used directly |

```css
.fingertip-m { --v-fingertip: 3em; --v-fingertip-half: 1.5em; }
```

## Input (i8) rules

### `i8-{target}-{value}`

Configures input border, outline, or background via CSS custom properties.

**Pattern:** `/^i8-(border|outline|bg)-(.+)$/`

| Value type | Example | CSS generated |
|-----------|---------|---------------|
| `none` | `i8-border-none` | `--i8-border-width: 0` |
| `transparent` | `i8-bg-transparent` | `--i8-bg-color: 0` |
| Scope ref | `i8-border-scope-color-500` | `--i8-border-color: var(--scope-color-500)` |
| Theme color | `i8-border-primary` | `--i8-border-color: <rgb>` |
| Width (px/em/rem) | `i8-border-2px` | `--i8-border-width: 2px` |
| Bracket color | `i8-outline-[#ff0000]` | `--i8-outline-color: #ff0000` |
| Bracket width | `i8-border-[0.5em]` | `--i8-border-width: 0.5em` |

### `i8-{target}-opacity-{0-100}`

Sets opacity for input border, outline, or background.

**Pattern:** `/^i8-(border|outline|bg)-opacity-(\d{1,3})$/`

```html
<div class="i8-border-opacity-50"> <!-- --i8-border-opacity: 0.5 -->
```

### `i8-apply-{target}`

Applies the configured i8 values to actual CSS properties. This is the final rendering step — used internally by `i8-flat`, `i8-filled`, `i8-round` shortcuts.

**Pattern:** `/^i8-apply-(border|outline|bg)$/`

| Class | CSS | Defaults |
|-------|-----|----------|
| `i8-apply-bg` | `background-color: rgb(var(--i8-bg-color, var(--current-bg)) / var(--i8-bg-opacity, 1))` | opacity: 1 |
| `i8-apply-border` | `border-color: rgb(...)` + `border-width: var(--i8-border-width, 1px)` | opacity: 0.2, width: 1px |
| `i8-apply-outline` | `outline-color: rgb(...)` + `outline-width: var(--i8-outline-width, 2px)` | opacity: 0.5, width: 2px |

## CSS custom properties reference

Properties set by these rules:

| Variable | Set by | Used by |
|----------|--------|---------|
| `--scope-color-{step}` | `scope-*` | `current-*-scope-*`, `*-scope-*` |
| `--scope-light-{0-4}` | `scope-*` | `layer-*`, `*-scope-light-*` |
| `--scope-dark-{0-4}` | `scope-*` | `layer-*`, `*-scope-dark-*` |
| `--current-text` | `current-text-*` | `text-current` |
| `--current-bg` | `current-bg-*` | `bg-current` |
| `--current-icon` | `current-icon-*` | `icon-current`, `icon-color` |
| `--current-border` | `current-border-*` | `border-current` |
| `--current-hl` | `scope-*`, `current-hl-*` | `*-current-hl` |
| `--font-tc` / `--font-bc` | `text-*` typography utilities | `text-mt-*`, `text-mb-*` |
| `--card-spacing` | `card-*` | Card component padding |
| `--card-spacing-dense` | `card-*` | `card-dense` |
| `--v-fingertip` | `fingertip-*` | `h-fingertip`, button/input heights |
| `--v-fingertip-half` | `fingertip-*` | `px-fingertip-half`, rounded buttons |
| `--i8-border-color` | `i8-border-*` | `i8-apply-border` |
| `--i8-border-width` | `i8-border-*` | `i8-apply-border` |
| `--i8-border-opacity` | `i8-border-opacity-*` | `i8-apply-border` |
| `--i8-bg-color` | `i8-bg-*` | `i8-apply-bg` |
| `--i8-bg-opacity` | `i8-bg-opacity-*` | `i8-apply-bg` |
| `--i8-outline-color` | `i8-outline-*` | `i8-apply-outline` |
| `--i8-outline-width` | `i8-outline-*` | `i8-apply-outline` |
| `--i8-outline-opacity` | `i8-outline-opacity-*` | `i8-apply-outline` |
| `--un-icon-opacity` | `icon-opacity-*`, `icon-current` | `icon-color` |
| `--icon-size` | `icon-size-*` | `icon-size` |

## Best practices

- Use `scope-{color}` at the highest ancestor that shares a palette — avoids redundant variable declarations.
- Prefer `text-mt-*` / `text-mb-*` over plain `mt-*` / `mb-*` between typographic elements — the font corrections produce optically correct spacing.
- The `i8-*` rules are low-level — most of the time, use `i8-flat` / `i8-filled` / `i8-round` shortcuts which compose these rules internally.
- `card-{typography}` sets `padding` directly — don't add extra padding classes on the same element.

## Gotchas

- `scope-{color}` only sets CSS variables — it doesn't apply any visible styles. You need `layer-*`, `surface-*`, `bg-current`, or `*-scope-*` classes to consume the scope.
- `icon-current` does **not** set `color` directly — it sets `--un-icon-opacity`. Use `icon-color` alongside it, or use the `icon-color icon-size` classes that components already include.
- `i8-apply-border` defaults to `border-opacity: 0.2` and `width: 1px`. If you set `i8-border-primary` but see no visible border, check that `border-style` (e.g. `border-solid`) is also applied.
- `text-m-$m` applies margins to **all four sides** (not just top/bottom). Use `text-my-$m` for vertical-only.
- `fingertip-m` sets the CSS variable but doesn't apply height — use `h-fingertip` to consume it.
- `card-dense` requires a `card-{typography}` rule on the same element (or ancestor) to have set `--card-spacing-dense`.
