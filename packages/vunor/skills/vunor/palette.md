# Color palette — vunor

> Oklab perceptual color system, seed colors, layers, surfaces, scopes, and the current-color system.

## Concepts

Vunor generates its color system using `@prostojs/palitra`, built on the Oklab perceptual color model. Unlike RGB/HSL, Oklab grades colors by how people actually see them — `primary-500` and `error-500` sit at the same perceptual luminance regardless of hue.

For each seed color, palitra generates:
1. **Main palette** (10 steps: 50, 100, 200, ..., 900) — luminance-graded with perceptually uniform steps
2. **Layer palette** (5 steps: 0–4) — desaturated variants for backgrounds

All values are emitted as CSS custom properties.

### Color architecture

```
seed color → palitra (Oklab) → main palette (50–900)
                              → light layers (0–4)
                              → dark layers (0–4)
                                    ↓
                              CSS custom properties
                                    ↓
                  scope-{color}  →  --scope-color-{step}
                  current-bg-*   →  --current-bg
                  bg-current     →  applies --current-bg
                  layer-{0-4}    →  full bg+text+icon
                  surface-{step} →  full bg+text+icon
```

## Configuration

### Seed colors

Pass to `presetVunor({ palette: { colors: { ... } } })`:

| Name | Default | Purpose |
|------|---------|---------|
| `primary` | `#004eaf` | Main brand color |
| `secondary` | `#edd812` | Accent / highlight |
| `good` | `#7bc76a` | Success / positive |
| `warn` | `#ef9421` | Warning |
| `error` | `#bf5a5f` | Error / negative |
| `grey` | `#858892` | Neutral greys |
| `neutral` | `#5da0c5` | Alternative neutral |

Each color can be a simple hex string or an object with fine-tuning:

```ts
palette: {
  colors: {
    primary: '#6B4EFF',                          // simple swap
    error: {
      color: '#DC2626',
      vivid: { dark: 0.3, light: 0.3 },         // hue rotation at palette edges
      saturate: { dark: -0.1, light: -0.1 },     // desaturate slightly
    },
  },
}
```

### Advanced palette controls

```ts
palette: {
  lightest: 0.97,      // max luminance for lightest step (0–1)
  darkest: 0.24,       // min luminance for darkest step (0–1)
  layersDepth: 0.08,   // brightness step between layer-0 and layer-4

  mainPalette: {
    luminance: { dark: 0.26, middle: 0.62, light: 0.97 },
    saturate: { dark: -0.25, light: -0.25 },
    vivid: { dark: 0.1, light: 0.2 },
  },
  layerPalette: {
    desaturate: 0.2,
    luminance: { dark: 0.24, light: 0.32 },
  },
}
```

## API Reference

### Color scope classes

#### `scope-{color}`

Sets `--scope-color-*` CSS custom properties for an entire subtree.

```html
<div class="scope-primary">
  <!-- All children can use scope-aware utilities -->
  <button class="c8-filled">Uses primary palette</button>
</div>
```

Valid color names: `primary`, `secondary`, `good`, `warn`, `error`, `grey`, `neutral`.

#### `current-{target}-{color}-{step}`

Sets a specific `--current-{target}` CSS variable to a specific palette step.

```html
<div class="current-bg-primary-500 current-text-primary-50">
  <div class="bg-current text-current">Colored via CSS vars</div>
</div>
```

Targets: `text`, `bg`, `icon`, `border`, `outline`, `caret`, `hl` (highlight).

#### `{target}-current` / `{target}-current/{opacity}`

Applies the current-scoped color.

```html
<div class="current-bg-error-500">
  <div class="bg-current">Full opacity error bg</div>
  <div class="bg-current/50">50% opacity error bg</div>
</div>
```

### Layers

#### `layer-{0-4}`

Full background + text + icon styling that automatically adapts to light/dark mode.

```html
<div class="layer-0 scope-primary">
  <!-- Light: lightest bg, dark text. Dark mode: darkest bg, light text -->
  <div class="layer-1">
    <!-- One step deeper -->
    <div class="layer-2">
      <!-- Even deeper -->
    </div>
  </div>
</div>
```

- `layer-0` is the outermost (lightest in light mode, darkest in dark)
- Each layer steps progressively toward the opposite extreme
- Apply `scope-{color}` to tint the layers with a palette

### Surfaces

#### `surface-{step}`

Applies a specific palette stop as background + text + icon.

```html
<div class="scope-primary surface-100">Lightly tinted</div>
<div class="scope-error surface-500">Bold error banner</div>
```

- `surface-0` through `surface-4` map to the layer scale
- `surface-50` through `surface-900` map to the main 10-step palette
- Custom surfaces can be defined in `palette.surfaces`

## Common patterns

### Pattern: Scoped button colors

Use `scope-{color}` to set the palette, then a `c8-*` class for the visual style.

```html
<button class="scope-primary c8-filled">Primary</button>
<button class="scope-error c8-outlined">Error</button>
<button class="scope-good c8-light">Success</button>
```

### Pattern: Themed card sections

Nest layers to create visual depth.

```html
<div class="layer-0 scope-primary">
  <VuCard>
    <div class="layer-1">
      <p>Slightly deeper background</p>
      <div class="layer-2">
        <p>Even deeper</p>
      </div>
    </div>
  </VuCard>
</div>
```

### Pattern: Custom current-color usage

Set colors independently for different targets.

```html
<div class="current-bg-primary-100 current-text-primary-900 current-border-primary-300">
  <div class="bg-current text-current border-current border-1">
    Custom color combination
  </div>
</div>
```

### Pattern: Dark mode awareness

Layers handle dark mode automatically. No need for explicit `dark:` prefixes on layer/surface classes.

```html
<!-- This automatically adapts to dark mode -->
<div class="layer-0 scope-primary">
  <div class="layer-1">Content</div>
</div>
```

## Best practices

- Use `scope-{color}` at the highest reasonable ancestor — children inherit the scope.
- Prefer `layer-*` for page-level backgrounds and `surface-*` for specific component accents.
- Don't hard-code palette step numbers unless you need a specific color — let layers and surfaces handle light/dark adaptation.
- When customizing the palette, test both light and dark modes — Oklab ensures perceptual consistency, but extreme `vivid`/`saturate` overrides can break the balance.

## Gotchas

- `scope-{color}` only sets CSS variables — it doesn't apply any visible styles by itself. You need `layer-*`, `surface-*`, `bg-current`, etc. to consume the scope.
- Layer numbers don't correspond to z-index — they're visual depth levels only.
- Swapping the primary color changes every component that uses `scope-primary` — this is by design but can be surprising if components mix scopes unexpectedly.
- `current-bg-scope-color-500` (note: `scope-color`, not a specific palette name) references whatever the current scope is. This is used internally by `c8-filled` and similar shortcut patterns.
