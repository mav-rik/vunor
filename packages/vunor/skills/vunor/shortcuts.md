# Shortcut objects — vunor

> The structured shortcut system for defining and customizing component styles: defineShortcuts, mergeVunorShortcuts, c8/i8 style systems, and overriding built-in styles.

## Concepts

Instead of flat UnoCSS shortcut strings, Vunor uses **structured nested objects** where keys are variant prefixes and values are the classes to apply. This makes styles readable, deeply mergeable, and surgically overridable.

The key insight: when two shortcut objects define the same key, `mergeVunorShortcuts()` deep-merges them with later entries winning. You can override a single variant of a built-in style without rewriting the whole shortcut.

### How it works

```
defineShortcuts({ ... })   →   Shortcut object (nested)
         ↓
toUnoShortcut(obj)         →   Flat UnoCSS string
         ↓
mergeVunorShortcuts([...]) →   Merged array (later wins)
         ↓
vunorShortcuts(overrides)  →   Final UnoCSS shortcuts config
```

## API Reference

### `defineShortcuts(obj)`

Creates a typed shortcut object. Keys are shortcut names (CSS classes), values are variant-prefix objects.

```ts
import { defineShortcuts } from 'vunor/theme'

const shortcuts = defineShortcuts({
  'btn': {
    '': 'h-fingertip flex items-center',     // base classes (no prefix)
    'hover:': 'bg-current/05',               // → "hover:bg-current/05"
    'dark:': 'text-white',                   // → "dark:text-white"
    '[&.btn-round]:': 'rounded-full',        // → "[&.btn-round]:rounded-full"
  },
})
```

Each key is a **variant prefix** that gets prepended to every class in the value.

### Compound variants

Nesting goes deeper for compound states:

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

### `toUnoShortcut(obj)`

Flattens a shortcut object into a single UnoCSS string. Called internally but can be used directly for debugging.

```ts
import { toUnoShortcut } from 'vunor/theme'

const flat = toUnoShortcut({
  '': 'flex items-center',
  'hover:': 'bg-blue-100',
})
// → "flex items-center hover:bg-blue-100"
```

### `mergeVunorShortcuts(arrays)`

Deep-merges multiple shortcut arrays. Later arrays win on conflict.

```ts
import { mergeVunorShortcuts } from 'vunor/theme'

const merged = mergeVunorShortcuts([defaultShortcuts, myOverrides])
```

### `vunorShortcuts(overrides?, baseShortcuts?)`

Returns the final merged shortcuts for UnoCSS config. This is what you put in `shortcuts: [...]`.

```ts
import { vunorShortcuts } from 'vunor/theme'

// Default styles
shortcuts: [vunorShortcuts()]

// With overrides (overrides take priority)
shortcuts: [vunorShortcuts(myCustomShortcuts)]
```

## Built-in style systems

### c8 — Clickable styles

Four visual variants for buttons and interactive elements. Use with `scope-{color}` to set the palette.

| Class | Description |
|-------|-------------|
| `c8-filled` | Solid background, white text |
| `c8-flat` | Transparent background, colored text, subtle hover |
| `c8-outlined` | Border + colored text, transparent fill |
| `c8-light` | Light tinted background, colored text |

Each includes hover, active, focus, and disabled states.

```html
<button class="scope-primary c8-filled">Save</button>
<button class="scope-error c8-flat">Cancel</button>
<button class="scope-good c8-outlined">Confirm</button>
<button class="scope-warn c8-light">Warning</button>
```

### i8 — Input styles

Three visual variants for form inputs.

| Class | Description |
|-------|-------------|
| `i8-flat` | Bottom border only (minimal) |
| `i8-filled` | Full border with background |
| `i8-round` | Pill-shaped (fully rounded) |

Sub-shortcuts used within input components:

| Class | Purpose |
|-------|---------|
| `i8-input` | The `<input>` element itself |
| `i8-textarea` | The `<textarea>` element |
| `i8-label` | Floating label |
| `i8-label-wrapper` | Label container for positioning |
| `i8-hint` | Hint text below input |
| `i8-counter` | Character counter |
| `i8-prepend` / `i8-append` | Side icons/content (inside border) |
| `i8-before` / `i8-after` | Side content (outside border) |
| `i8-underline` | Bottom border element |

### Other built-in shortcuts

| Prefix | Components |
|--------|-----------|
| `btn` | Button — `btn`, `btn-round`, `btn-square`, `btn-icon`, `btn-label` |
| `card` | Card — `card`, `card-header`, `card-dense` |
| `checkbox` | Checkbox — `checkbox-root`, `checkbox`, `checkbox-indicator`, `checkbox-icon`, `checkbox-label` |
| `rb` | RadioGroup — `rb-container`, `rb-root`, `rb-item`, `rb-item-indicator`, `rb-item-label` |
| `select` | Select — `select-content`, `select-item`, `select-grp-label`, `select-separator` |
| `dialog` | Dialog — `dialog-overlay`, `dialog-card`, `dialog-header`, `dialog-title`, `dialog-close`, `dialog-footer` |
| `tabs` | Tabs — `tabs-indicator`, `tab` |
| `menu` | Menu — `menu-root`, `menu-item` |
| `loading` | Loading — `loading-indicator`, `loading-indicator-wrapper`, `inner-loading` |
| `toast` | Toasts — `toast-root`, `toasts-viewport` |
| `progress` | ProgressBar — `progress-bar` |

## Common patterns

### Pattern: Override a single variant

Change only the base classes of `c8-filled` while keeping all hover/dark/active variants intact:

```ts
import { vunorShortcuts, defineShortcuts } from 'vunor/theme'

const myOverrides = defineShortcuts({
  'c8-filled': {
    '': 'rounded-full',  // only overrides base — hover, dark, etc. stay
  },
})

export default defineConfig({
  presets: [presetVunor()],
  shortcuts: [vunorShortcuts(myOverrides)],
})
```

### Pattern: Override input underline style

```ts
const myOverrides = defineShortcuts({
  'i8-flat': {
    '': 'border-b-2',  // thicker bottom border
  },
})
```

### Pattern: Add a new shortcut

```ts
const myShortcuts = defineShortcuts({
  'badge': {
    '': 'inline-flex items-center px-$xs py-$xxs text-caption rounded-full',
    'dark:': 'bg-white/10',
  },
})

shortcuts: [vunorShortcuts(myShortcuts)]
```

### Pattern: Override component-specific shortcuts

```ts
const myOverrides = defineShortcuts({
  'btn': {
    '': 'uppercase tracking-wider',  // make all buttons uppercase
  },
  'card': {
    '': 'shadow-lg',  // add shadow to all cards
  },
})
```

## Integration

- Shortcuts are consumed by UnoCSS — they expand to utility classes at build time.
- The `c8-*` and `i8-*` systems are used internally by Vunor components (`VuButton` uses `c8-*`, `VuInput` uses `i8-*`).
- You can use `c8-*` and `i8-*` classes on any HTML element, not just Vunor components.
- `scope-{color}` must be set on an ancestor (or the element itself) for `c8-*` and `i8-*` to pick up colors.

## Best practices

- Always pass overrides through `vunorShortcuts(overrides)` — don't try to manually merge with the defaults.
- Override at the most specific variant level possible. Replacing `''` (base) is safe; replacing the entire shortcut object loses all variant handling.
- Use `defineShortcuts()` for type safety — it validates the structure at the TypeScript level.
- Keep custom shortcuts in a separate file (e.g., `shortcuts.custom.ts`) for clarity.

## Gotchas

- Shortcut keys are **variant prefixes**, not CSS pseudo-classes. The key `'hover:'` (with colon) prepends `hover:` to each class in the value string.
- The empty string key `''` is the base (no-prefix) classes. It's required for every shortcut.
- `mergeVunorShortcuts` does **deep merge**, not replacement. If you need to completely replace a shortcut, set every key explicitly.
- Shortcut names become CSS class names. Adding a shortcut `'my-card'` means you use `class="my-card"`.
- The `i8` rules (`i8-border-*`, `i8-bg-*`, `i8-outline-*`) are separate UnoCSS rules, not shortcuts. They set CSS custom properties (`--i8-border-color`, `--i8-bg-color`) consumed by the `i8-*` shortcuts.
