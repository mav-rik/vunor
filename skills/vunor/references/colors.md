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

### The scope-driven idiom (most important rule of the system)

**Manage color through scope changes; manage color application through `current-*` / `scope-*` indirection. Avoid hard-coding palette names (`primary-500`, `error-500`) on individual elements.**

Why: every component (button, input, card, banner, badge, …) gets its color from whichever scope is active above it in the tree. Swap the scope on a wrapper, and the entire subtree re-tints with no other class changes. Hard-coded colors break that — a component that says `bg-primary-500` always shows blue, even inside a `scope-error` block where it should be red.

The two halves of the idiom:

1. **Set color via scope.** A component or subtree picks up its palette from the nearest `scope-{name}` ancestor.
2. **Read color via `current-*` indirection or scope-relative classes.** Inside a component, paint with `bg-current`, `text-current`, `border-current`, `text-current-hl`, `bg-current/10`, or `bg-scope-color-500`, `border-scope-color-300`, etc. — never `bg-primary-500` directly.

That single rule lets the same button, the same input, the same card render in primary, error, warn, good, secondary, neutral — without any of those classes appearing in the markup.

```html
<!-- Reusable: this badge works in ANY scope context -->
<span class="surface-100 px-$xs rounded-base">{{ count }}</span>

<!-- ...and now changes color depending on the parent scope -->
<div class="scope-primary"><span class="surface-100 …">42</span></div>  <!-- blue -->
<div class="scope-error">  <span class="surface-100 …">42</span></div>  <!-- red -->
<div class="scope-good">   <span class="surface-100 …">42</span></div>  <!-- green -->
```

The same principle is why `c8-filled`, `i8-filled`, `layer-*`, `surface-*` work everywhere: their internals reference `--scope-color-*`, `--current-*`, `--current-hl` — not specific colors. The scope chooses; the component honors the choice.

### When to apply each scope

Vunor's preflight installs `scope-neutral` on `:root`, which means **the page chrome is neutral by default**: incidental borders, idle text, layer backgrounds, and unfocused inputs all read as a calm grey-blue. You usually don't want to override that.

Apply a stronger scope **only** to the elements (or subtrees) that should stand out:

| Use case | Scope |
|----------|-------|
| Brand-colored interactive accent (primary button, focused input, active tab, brand banner) | `scope-primary` |
| Alternate accent (highlight chip, secondary CTA) | `scope-secondary` |
| Validation error (errored input, destructive action button, error banner) | `scope-error` |
| Warning (caution banner, warning button) | `scope-warn` |
| Success (success banner, confirmation button) | `scope-good` |

Form components do this transition for you: `<VuInput>` automatically adds `scope-error` when its `error` prop is truthy, so the underline, focus ring, label, and message all switch to red without you wiring it up.

```html
<!-- Page-level: neutral by default (preflight) -->
<body class="layer-0">

  <!-- Brand-accent button: opt into primary -->
  <button class="scope-primary c8-filled">Save</button>

  <!-- State change: opt into error / warn for emphasis -->
  <button class="scope-error c8-flat">Delete</button>
  <div class="scope-warn surface-100">Read carefully</div>

  <!-- Idle elements: stay neutral, no extra class needed -->
  <input class="i8 i8-filled" />     <!-- neutral border, neutral focus ring -->
</body>
```

Avoid blanketing the entire page with a brand scope (`<html class="scope-primary">`) unless the brand color genuinely *is* the chrome — when everything is brand-colored, nothing reads as the accent.

### Rule of thumb: which class to reach for

| You want… | Use | Avoid |
|-----------|-----|-------|
| The scope's accent (highlight) color | `text-current-hl`, `border-current-hl`, `bg-current-hl` | `text-primary-500` |
| The scope's body background / text / border | `bg-current`, `text-current`, `border-current` | `bg-primary-100` |
| A specific shade from the active scope | `bg-scope-color-500`, `border-scope-color-300` | `bg-primary-500` |
| A depth-aware background | `layer-1`, `bg-layer-1` | `bg-grey-100 dark:bg-grey-800` |
| A colored block at a specific stop | `surface-100`, `surface-500`, `surface-900` | `bg-primary-100 text-primary-900 border-primary-200` |
| **A specific, scope-independent color** (rare — brand-locked logo bg, raw chart fill) | `bg-primary-500`, `text-error-700` | — |

When in doubt, prefer the indirected version. The exception (last row) exists, but if you find yourself reaching for it on regular UI, you're probably about to make the design less re-skinnable — consider whether changing the parent scope would do the same job.

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

Targets: `text`, `bg`, `icon`, `border`, `outline`, `caret`, `hl` (highlight), plus the **tone-axis siblings** `text-muted`, `icon-muted`, `text-hover`, `bg-hover`, `border-hover`.

### Sources for `current-{target}-{source}`

| Source | Result |
|--------|--------|
| `current-bg-scope-color-500` | reads `--scope-color-500` (whatever scope is active) |
| `current-bg-primary-500` | reads the static `primary-500` color from theme |
| `current-text-hl` | aliases `--current-text` to `--current-hl` (the scope's 500) |
| `current-bg-scope-light-2` | reads `--scope-light-2` |
| `current-text-muted-scope-dark-2` | sets the muted/secondary text slot (set automatically by `layer-X`) |
| `current-border-hover-scope-light-3` | sets the one-step-darker hover border (set by `layer-X`) |

### Apply variants

| Class | Effect |
|-------|--------|
| `bg-current` | `background-color: rgb(var(--current-bg) / var(--un-bg-opacity))` |
| `text-current` | same, with `--current-text` and `color` |
| `border-current` | `--current-border` → `border-color` |
| `icon-current` | sets icon opacity; pair with `icon-color` for color |
| `bg-current/50` | applies at 50% opacity instead of the var-controlled opacity |
| `bg-current-hl` | uses `--current-hl` instead of `--current-bg` |
| `text-current-muted` | uses `--current-text-muted` — the secondary/placeholder text weight |
| `text-current-hover` | uses `--current-text-hover` — the hover-step text token |
| `bg-current-hover` | uses `--current-bg-hover` — one-shade-darker bg for hover |
| `border-current-hover` | uses `--current-border-hover` — one-shade-darker border for hover (replaces the dual-token `hover:border-scope-light-3 dark:hover:border-scope-dark-3` literal) |
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

## Tone slots

Every scope (and `layer-X` inside it) publishes a small set of tone slots so you can paint the right semantic role without re-deriving shade math:

| Slot | Purpose | Example utility |
|------|---------|----------------|
| `--current-text` | Primary text weight (was `scope-dark-2` pre-0.2 — now `scope-dark-0`). | `text-current` |
| `--current-text-muted` | Secondary / placeholder text — what `text-current` used to paint. | `text-current-muted` |
| `--current-text-hover` | Hover-step text. | `hover:text-current-hover` |
| `--current-hl` | Accent / brand-color shade — `--scope-color-500`. | `text-current-hl`, `border-current-hl` |
| `--current-bg` | Layer / surface background. | `bg-current` |
| `--current-bg-hover` | Hover-step background — one shade darker (light) / lighter (dark). | `hover:bg-current-hover` |
| `--current-border` | Default border. | `border-current` |
| `--current-border-hover` | Hover-step border. | `hover:border-current-hover` |

```html
<div class="layer-0">
  <span class="text-current">primary text</span>
  <span class="text-current-muted">secondary text</span>
  <span class="text-current-hl">accent text</span>
  <button class="border-current hover:border-current-hover">hover steps the border one shade darker</button>
</div>
```

> **Breaking change in vunor 0.2:** `--current-text` inside `layer-X` now defaults to **primary** weight (`scope-dark-0`), not muted (`scope-dark-2`). If you relied on the old muted default, switch the affected sites to `text-current-muted`.

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

## Scope and portaled content

Reka UI primitives (Dialog, Popover, Tooltip, Select, Combobox, Menu) **portal their content to `document.body`**, which means the portaled subtree is **outside** any scope you set on a nested app container.

If you write `<div id="app" class="scope-primary">…</div>` and a `<VuDialog>` opens, the dialog renders next to `<div id="app">`, not inside it — so it inherits whatever scope sits on `<body>` / `<html>` instead of `scope-primary`. Since the preflight installs `scope-neutral` on `:root`, the dialog reads as neutral, not primary, and you'll see no brand color until you fix the scope placement.

**Set `scope-*` on `<html>` or `<body>`, not on a nested app container.** That way portaled content (dialogs, popovers, tooltips, select dropdowns, menu popups) inherits the same scope as the rest of the page:

```html
<!-- ❌ scope-primary lives below <body> — portals miss it -->
<body>
  <div id="app" class="scope-primary">…</div>
  <!-- DialogPortal renders here, with only scope-neutral from :root -->
</body>

<!-- ✅ scope-primary on <body> — every portal inherits it -->
<body class="scope-primary">
  <div id="app">…</div>
  <!-- DialogPortal renders here, still inside scope-primary -->
</body>
```

If you genuinely need different page chrome and portal scopes (rare), set the page-level scope on `<body>` and pass `class="scope-…"` directly on the portaled component (`<VuDialog class="scope-error">`) — the class will be forwarded to the portaled root.

## Gotchas

- `scope-{name}` paints nothing on its own. If you set only `scope-primary` and see no color, you forgot the consumer (`layer-*`, `surface-*`, `c8-*`, `bg-current`, …).
- `surface-0..4` overlap with `layer-0..4`. Pick one mental model per element; mixing reads as a bug.
- Layers don't equate to z-index. They express *visual depth*, not stacking order.
- The scope on a deeper element wins over a higher one — by tree depth, not specificity. Both `:root` and `.scope-primary` have specificity (0,1,0) but the deeper one wins because it's later in the cascade.
- `current-bg-scope-color-500` references whatever scope is active. `current-bg-primary-500` is hard-bound to primary regardless of scope.
- `icon-current` sets icon opacity, not color. The actual color comes from `icon-color`, which `<VuIcon>` already includes. Standalone SVGs may need both classes.
