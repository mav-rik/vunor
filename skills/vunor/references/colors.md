# Colors, scopes, layers, and surfaces — Vunor

The semantic class system: `scope-*`, `layer-0..4`, `surface-0..900`, `current-*`, and how light/dark mode resolves automatically.

## Concepts

A scope is a palette context. When you set `scope-primary` on an element, every descendant has the primary palette available as CSS variables — `--scope-color-50` through `--scope-color-900`, `--scope-light-0..4`, `--scope-dark-0..4`, and `--current-hl`. Anything that paints with these variables (layers, surfaces, `bg-current`, `c8-filled`, `i8-filled`, etc.) automatically uses primary.

Switch the scope, and an entire subtree re-tints. No re-rendering, no class soup.

```
seed color (e.g. '#6B4EFF')
        ↓ palitra (Oklab perceptual)
        ↓
        ├── main palette: --scope-color-50, -100, -200, … -900   (10 steps)
        ├── light layers: --scope-light-0, -1, -2, -3, -4         (5 steps)
        └── dark layers:  --scope-dark-0,  -1, -2, -3, -4         (5 steps)
        + alias:          --current-hl  →  --scope-color-500
```

A preflight installs `scope-neutral` variables on `:root` so the system has sane defaults even if no scope class is set. Real apps almost always set their own scope on `<html>` or `<body>`.

## scope-{name}

```html
<div class="scope-primary">
  <!-- All --scope-* variables now point at the primary palette -->
  <span class="bg-current/10">primary 10% bg via current</span>
  <div class="surface-100">primary surface</div>
  <button class="c8-filled">primary button</button>
</div>
```

Names: `primary` · `secondary` · `good` · `warn` · `error` · `grey` · `neutral`.

You can nest scopes freely. Inner scope wins:

```html
<body class="scope-primary">
  <main>                              <!-- primary -->
    <aside class="scope-secondary">   <!-- secondary -->
      <div class="scope-error">       <!-- error -->
        <button class="c8-filled">red</button>
      </div>
    </aside>
  </main>
</body>
```

`scope-{name}` only sets variables. It paints nothing on its own. Combine it with `bg-current`, `layer-*`, `surface-*`, `c8-*`, `i8-*`, etc.

## Layers — depth backgrounds

`layer-0` through `layer-4` paint a full bundle: background, body text color, icon color, default border color. They are **dark-mode aware** automatically.

| Light mode | Dark mode |
|------------|-----------|
| `layer-0` → lightest bg, dark text | `layer-0` → darkest bg, light text |
| `layer-4` → slightly darker bg | `layer-4` → slightly lighter bg |

Use them to express **depth**, not z-index. `layer-0` is the outermost surface (page). Each step `+1` is one shade deeper into the palette.

```html
<body class="scope-primary layer-0">                       <!-- page -->
  <header class="layer-1">…</header>                       <!-- one level in -->
  <main>
    <article class="layer-2">                              <!-- card -->
      <section class="layer-3">                            <!-- nested section -->
        <pre class="layer-4">…</pre>                       <!-- code block -->
      </section>
    </article>
  </main>
</body>
```

Adjust the brightness step between consecutive layers via `palette.layersDepth` (default `0.08` — 8% of luminance per layer; bumping to `0.12` gives more contrast). See [theme.md](theme.md).

If you want layer-0 to be the deepest instead of lightest in either mode:

```ts
presetVunor({ layers: { reverseLight: true, reverseDark: true } })
```

### Per-target layer utilities

In addition to the bundle `layer-{0-4}`, you can apply just one target:

```html
<div class="bg-layer-2 text-layer-1 border-layer-3">  <!-- mix and match -->
```

Pattern: `(bg|text|current-text|current-bg|current-icon|current-border|current-outline|current-caret|current-hl|i8-bg|i8-border|i8-outline)-layer-{0-4}`.

## Surfaces — colored blocks

Surfaces are presets that bundle background + text + icon + border into one class. Two ranges:

- **`surface-0` … `surface-4`** — same as the layer scale (depth backgrounds).
- **`surface-50` … `surface-900`** — colored blocks at specific palette stops.

```html
<div class="scope-primary">
  <div class="surface-100">subtle tinted info banner</div>
  <div class="surface-500">bold accent block, white text</div>
  <div class="surface-900">deep block, light text</div>
</div>

<div class="scope-error surface-50">soft error banner</div>
<div class="scope-good surface-500">solid success block</div>
```

`surface` (no number) is an alias for `surface-100`.

Each surface mapping is `[bg, text, border, dark:bg, dark:text, dark:border]` — fully overridable. Define your own surface (e.g. `surface-brand`) by passing `palette.surfaces` in the preset config — see [theme.md](theme.md).

## current-* — the CSS-var painting layer

Underneath layers and surfaces is the `current-*` system. It's how Vunor's shortcuts work and what you reach for when you need precise control.

The pattern is two-step:

1. **Set** a `--current-{target}` variable.
2. **Apply** it with `{target}-current`.

```html
<!-- step 1: set --current-bg, --current-text -->
<div class="current-bg-primary-500 current-text-primary-50">
  <!-- step 2: apply -->
  <span class="bg-current text-current">painted with the vars above</span>
  <span class="bg-current/50">same color, 50% opacity</span>
</div>
```

Targets: `text`, `bg`, `icon`, `border`, `outline`, `caret`, `hl` (highlight).

### Sources for `current-{target}-{source}`

| Source | Result |
|--------|--------|
| `current-bg-scope-color-500` | reads `--scope-color-500` (whatever scope is active) |
| `current-bg-primary-500` | reads the static `primary-500` color from theme |
| `current-text-hl` | aliases `--current-text` to `--current-hl` (the scope's 500) |
| `current-bg-scope-light-2` | reads `--scope-light-2` |

### Apply variants

| Class | Effect |
|-------|--------|
| `bg-current` | `background-color: rgb(var(--current-bg) / var(--un-bg-opacity))` |
| `text-current` | same, with `--current-text` and `color` |
| `border-current` | `--current-border` → `border-color` |
| `icon-current` | sets icon opacity; pair with `icon-color` for color |
| `bg-current/50` | applies at 50% opacity instead of the var-controlled opacity |
| `bg-current-hl` | uses `--current-hl` instead of `--current-bg` |
| `shadow-current-border` | drives `--un-shadow-color` from `--current-border` |
| `ring-current-border` | same for ring color |

### Direct scope painting (no `current-*`)

Skip the two-step dance entirely:

```html
<div class="bg-scope-color-100">      <!-- background-color: --scope-color-100 -->
<div class="text-scope-dark-2/80">    <!-- text from --scope-dark-2 at 80% -->
<div class="border-scope-light-1">    <!-- border-color: --scope-light-1 -->
```

Targets: `bg`, `text`, `fill`, `stroke`, `border`, `outline`, `icon`, `caret`.
Sources: `color-{50..900}`, `light-{0..4}`, `dark-{0..4}`, plus the helpers `text`, `bg`, `icon`, `white`, `black`.

## Static palette colors

Every `scope-*` color is also available as a static UnoCSS color: `bg-primary-500`, `text-error-700`, `border-good-300`, etc. These are normal UnoCSS color utilities; they don't read scope variables, so they are the right choice when you want a fixed color that doesn't follow the scope.

## Dark mode behavior

Vunor doesn't ship a dark-mode toggle — that's UnoCSS's `dark:` variant + your strategy of choice (`class` or `media`). What Vunor does is wire the layer/surface system so it crosses light↔dark on its own.

- `layer-0..4`, `surface-0..900` automatically switch their underlying `--scope-*-*` lookup when `dark:` triggers.
- For any custom code, prefer `current-*-scope-light-*` / `current-*-scope-dark-*` over hard-coded colors so the dark variant resolves itself:

  ```html
  <div class="current-bg-scope-light-1 dark:current-bg-scope-dark-1">
    <span class="bg-current">dark-aware background</span>
  </div>
  ```

- The `c8-*` and `i8-*` shortcut systems already include `dark:` rules. Don't add your own unless overriding intentionally.

## Accent / highlight color

Every scope publishes `--current-hl = --scope-color-500`. Use it for the brand-color accent within a subtree without committing to a specific shade name:

```html
<div class="scope-primary">
  <span class="text-current-hl">primary 500 text</span>
  <span class="border-current-hl">primary 500 border</span>
</div>
```

`text-mt-…`, focus rings on inputs, the active tabs indicator, and selected-state text in `c8-flat-selected` all use `--current-hl`.

## Common patterns

### Page shell

```html
<html class="scope-primary">
  <body class="layer-0">
    <header class="layer-1 px-$m h-fingertip flex items-center">…</header>
    <main class="p-$m">
      <VuCard level="h3">…</VuCard>
    </main>
  </body>
</html>
```

### Banner palette per status

```html
<div class="surface-100 scope-good">success banner</div>
<div class="surface-100 scope-warn">warning banner</div>
<div class="surface-100 scope-error">error banner</div>
```

### Mixed-color action group

```html
<div class="flex gap-$xs">
  <button class="scope-primary c8-filled">Save</button>
  <button class="scope-grey c8-flat">Cancel</button>
  <button class="scope-error c8-flat">Delete</button>
</div>
```

### Custom card section with explicit colors

```html
<div class="current-bg-scope-color-50 current-text-scope-color-900 current-border-scope-color-200">
  <div class="bg-current text-current border-current border rounded-base p-$m">
    fully scoped, no surface used
  </div>
</div>
```

## Gotchas

- `scope-{name}` paints nothing on its own. If you set only `scope-primary` and see no color, you forgot the consumer (`layer-*`, `surface-*`, `c8-*`, `bg-current`, …).
- `surface-0..4` overlap with `layer-0..4`. Pick one mental model per element; mixing reads as a bug.
- Layers don't equate to z-index. They express *visual depth*, not stacking order.
- The scope on a deeper element wins over a higher one — by tree depth, not specificity. Both `:root` and `.scope-primary` have specificity (0,1,0) but the deeper one wins because it's later in the cascade.
- `current-bg-scope-color-500` references whatever scope is active. `current-bg-primary-500` is hard-bound to primary regardless of scope.
- `icon-current` sets icon opacity, not color. The actual color comes from `icon-color`, which `<VuIcon>` already includes. Standalone SVGs may need both classes.
