# Shortcuts: c8, i8, and customization — Vunor

The shortcut object system that powers every Vunor component, the `c8-*` (clickable) and `i8-*` (input) systems, and how to extend or override either from your own code.

## Why shortcut objects

UnoCSS shortcuts are flat strings. That works for two-line cases but quickly becomes unreadable when a component needs base classes plus hover, focus-visible, dark, disabled, data-state, and parent-selector variants — which is everything a real component needs.

Vunor wraps UnoCSS shortcuts in a structured nested object so:

- Each variant has its own key.
- Two shortcut objects with the same name can be **deep-merged** (later wins per key).
- You can **surgically override** a single variant — say the `:hover` of `c8-filled` — without having to copy and re-write the whole shortcut.

```ts
import { defineShortcuts } from 'vunor/theme'

defineShortcuts({
  'btn': {
    '': 'h-fingertip flex items-center px-$m gap-$xs select-none fw-bold',
    'hover:': 'bg-current/05',
    'focus-visible:': 'outline outline-current/40',
    'dark:': 'text-white',
    '[&.btn-round]:': 'px-fingertip-half rounded-fingertip-half',
    'disabled:': 'opacity-80 cursor-not-allowed',
    '[&>span]:data-[loading]:': 'opacity-0 pointer-events-none',
  },
})
```

The keys are **variant prefixes** that get prepended to every class in the value. The empty string `''` is the base (no-prefix). Nested objects compose deeper:

```ts
defineShortcuts({
  'c8-filled': {
    '': 'current-bg-scope-color-500 text-white rounded-base',
    'dark:': {
      '': 'text-white/90',
      'hover:': 'current-bg-scope-color-600',
      // → "dark:text-white/90 dark:hover:current-bg-scope-color-600"
    },
    'hover:': 'current-bg-scope-color-400',
  },
})
```

## API

```ts
import {
  defineShortcuts,        // type-safe object builder (no-op at runtime)
  toUnoShortcut,          // flatten one shortcut object to a UnoCSS string
  mergeVunorShortcuts,    // deep-merge an array of shortcut maps (later wins)
  vunorShortcuts,         // produce the final Record<string,string> for unocss config
  rawVunorShortcuts,      // [i8, c8, ...componentShortcuts] — pre-merge
  mergedVunorShortcuts,   // result of mergeVunorShortcuts(rawVunorShortcuts)
} from 'vunor/theme'
```

### `vunorShortcuts(overrides?, baseShortcuts?)`

What goes in your unocss config. Returns `Record<string, string>` of every Vunor shortcut, optionally merged with your overrides on top.

```ts
import { vunorShortcuts, defineShortcuts } from 'vunor/theme'

const myOverrides = defineShortcuts({
  'c8-filled': { '': 'rounded-full' },         // only base; hover/dark/focus untouched
  'btn': { '': 'uppercase tracking-wider' },   // every Vunor button now uppercase
})

export default defineConfig({
  presets: [presetVunor()],
  shortcuts: [vunorShortcuts(myOverrides)],
})
```

The merge is **deep**, per-key: the override `'c8-filled': { '': 'rounded-full' }` only changes `c8-filled`'s base classes; every other variant in the original (hover, dark, active, focus-visible, etc.) survives.

### `mergeVunorShortcuts([a, b, c])`

Deep-merges an array of shortcut objects. Later entries win on conflict (string concatenation: `target + " " + source`). Use this when composing multiple custom shortcut maps before passing to `vunorShortcuts`.

```ts
const all = mergeVunorShortcuts([baseTokens, themeOverrides, brandOverrides])
shortcuts: [vunorShortcuts(all)]
```

### `toUnoShortcut(obj)`

Flattens one shortcut object to its UnoCSS string. Useful for inspection or for building dynamic shortcuts at runtime.

```ts
toUnoShortcut({
  '': 'flex items-center',
  'hover:': 'bg-blue-100',
})
// → "flex items-center hover:bg-blue-100"
```

### `defineShortcuts(obj)`

Returns the object as-is, but with a typed signature (`TVunorShortcut`). Pure type-safety helper.

## c8 — clickable styles

**`c8-*` is a color and state preset, not a button preset.** Each variant sets background, text, border-radius, and the hover / active / focus-visible / `[data-highlighted]` / `[data-active]` color transitions for an interactive surface in the active scope. It does **not** set `display`, `height`, `padding`, `gap`, `cursor`, or typography — that's the consumer's job.

For a working button you either use `<VuButton>` — which bundles the layout via the `btn` shortcut — or compose c8 with structural utilities yourself (see [Minimum working button](#minimum-working-button) below).

c8 also requires an active **scope** on the element or any ancestor. Without one, `--scope-color-*` and `--current-*` fall back to the preflight neutral defaults — usable but generic. To make a c8 button look "primary", put `scope-primary` on the button (or any ancestor); to flip it to destructive, switch the scope to `scope-error`. The button class never changes.

### Variants

| Class | Paints | Use for |
|-------|--------|---------|
| `c8-filled` | `bg: scope-color-500`, `text: white`, hover steps to `scope-color-400`, active to `scope-color-600` | Primary CTA |
| `c8-flat` | `bg: transparent`, `text: current` (scoped), hover `bg: current/10` | Secondary / ghost action |
| `c8-outlined` | `bg: transparent`, `border: current`, `text: current`, hover tinted bg | Outline CTA |
| `c8-light` | `bg: current/10` (10% scope-500), `text: current`, hover `bg: current/20` | Soft info / positive |
| `c8-flat-selected` | Selected emphasis on `c8-flat` — auto-applied when the element has `data-selected="true"` or `aria-pressed="true"` | Tabs, segmented controls, menu items, toggle buttons |

Each variant additionally pre-wires:

- `:hover`, `:focus-visible`, `[data-highlighted]` → light hover state
- `:active`, `[data-active]` → pressed state
- `disabled:` exclusions (so `not-([disabled]):hover` doesn't tint when disabled)
- `dark:` swaps for legibility

`[data-highlighted]` and `[data-active]` are populated by **reka-ui primitives** (menu items, listbox/select items, combobox items) so c8 transitions react to keyboard navigation as well as mouse hover. On a plain `<button>`, only the `:hover` / `:focus-visible` / `:active` portions trigger; the `[data-…]` rules sit dormant. `c8-flat-selected` similarly needs a primitive that toggles `data-selected` (e.g. `<MenuItem>`); plain buttons can opt in manually with `aria-pressed="true"`.

> **Note on tabs:** reka-ui's `<TabsTrigger>` uses `data-state="active"`, **not** `data-selected`. `c8-flat-selected` does **not** style tab triggers — the dedicated `tab` / `tabs-indicator` shortcuts (used by `<VuTabs>`) handle that. Use `c8-flat-selected` for menu items, segmented buttons, and toggle buttons.

### Minimum working button

```html
<!-- Text button -->
<button class="scope-primary c8-filled
               inline-flex items-center justify-center
               h-fingertip-m px-$m gap-$xs
               font-500 cursor-pointer">
  Save
</button>

<!-- Icon-only square button -->
<button class="c8-flat
               inline-grid place-items-center
               w-fingertip-m h-fingertip-m
               cursor-pointer">
  <VuIcon name="i--close" />
</button>

<!-- Icon + label -->
<button class="scope-primary c8-filled
               inline-flex items-center
               h-fingertip-m px-$m gap-$xs
               font-500 cursor-pointer">
  <VuIcon name="i--save" /> Save
</button>
```

`<VuButton>` ships these layout classes via its `btn` / `btn-square` / `btn-label` / `btn-icon` shortcuts, so on a `<VuButton>` you only have to pick the c8 variant:

```html
<VuButton class="scope-primary c8-filled" label="Save" />
<VuButton class="scope-error c8-flat" icon="i--trash" />
<a href="#" class="c8-flat inline-flex items-center h-fingertip px-$m">Link</a>
```

## i8 — input styles

**`i8-*` is a set of cooperating shortcuts, not a single class.** Like c8, none of them set the actual `<input>` styling on their own — you compose a wrapper, the input, and any decoration sub-classes together. `<VuInput>` does this composition for you; if you build inputs by hand, you wire the parts yourself.

i8 also requires an active **scope** for its color states (focus highlight, error state, hint colors). Without one, the preflight neutral defaults are used.

### Wrapper vs. leaf classes

Two roles to keep straight:

- **Wrapper** — applied to the container that holds the input plus its label, icons, hint. `i8` is the wrapper.
- **Leaf** — applied directly to the actual `<input>` / `<textarea>` / `<label>` / decoration node.

| Class | Role | Element |
|-------|------|---------|
| `i8` | Wrapper | container `<div>` (`h-fingertip`, flex layout, icon scoping, focus-within & error coloring) |
| `i8-flat` / `i8-filled` / `i8-round` | Wrapper variant | added next to `i8` to pick a visual style |
| `i8-input` | Leaf | the `<input>` itself |
| `i8-textarea` | Leaf | the `<textarea>` itself |
| `i8-label` | Leaf | floating label that collapses on focus |
| `i8-label-wrapper` | Wrapper-helper | positioning container for the label |
| `i8-stack-label` | Modifier | switches label to above-input position |
| `i8-hint` / `i8-counter` | Leaf | hint text / character counter under the input |
| `i8-hint-wrapper` / `i8-hint-wrapper-stack` | Wrapper-helper | layout for hint + counter row |
| `i8-prepend` / `i8-append` | Leaf | icons/text inside the border |
| `i8-before` / `i8-after` | Leaf | icons/text outside the border |
| `i8-underline` | Leaf | bottom underline used by `i8-flat` |
| `i8-loading` | Leaf | inline loading indicator slot |
| `i8-icon-wrap` / `i8-icon-clickable` | Leaf | icon container, clickable variant |
| `segmented` | Modifier | joins adjacent inputs into one visual unit |

### Three visual variants

| Class | Look |
|-------|------|
| `i8-flat` | Bottom-border underline only (minimal, material-style) |
| `i8-filled` | Background fill + thin border + soft outline on focus |
| `i8-round` | Pill-shaped (`rounded-fingertip-half`) variant of filled |

Pick one and add it to the wrapper next to `i8`.

### Minimum working input

```html
<div class="i8 i8-filled group/i8">
  <input class="i8-input" type="text" />
</div>
```

The wrapper carries `group/i8` because `i8-input`, `i8-label`, `i8-underline`, and the error rules use `group-[…]/i8:` selectors to react to focus, value presence, label presence, and `data-error` on the wrapper. Without `group/i8` the input renders, but focus highlight, error coloring, and floating-label transitions don't fire.

With label, hint, and a leading icon:

```html
<div class="i8 i8-filled group/i8">
  <span class="i8-prepend"><VuIcon name="i--search" /></span>
  <div class="i8-label-wrapper">
    <input class="i8-input" type="text" placeholder=" " />
    <label class="i8-label">Search</label>
  </div>
  <div class="i8-hint-wrapper"><span class="i8-hint">Try "vunor"</span></div>
</div>
```

`<VuInput iconBefore="i--search" label="Search" hint='Try "vunor"' />` produces the same composition automatically (and adds `group/i8` for you).

### i8 low-level rules — the apply layer

`i8-border-*`, `i8-bg-*`, `i8-outline-*` are **rules** (not shortcuts) that *set* CSS variables. `i8-apply-border` / `i8-apply-bg` / `i8-apply-outline` are the rules that *consume* those variables and emit actual `border`/`background`/`outline` CSS. The wrapper variants (`i8-filled`, `i8-flat`, `i8-round`) call the apply rules internally — that's how they paint.

You can use them directly in two situations:

**1. Tweak a wrapper without touching the shortcut.**

```html
<div class="i8 i8-filled
            i8-border-2px              /* --i8-border-width: 2px */
            i8-border-scope-color-500  /* --i8-border-color: --scope-color-500 */
            i8-bg-transparent          /* --i8-bg-color: 0 */
            i8-outline-opacity-30      /* --i8-outline-opacity: 0.3 */
            ">…</div>
```

**2. Paint i8 colors directly onto a standalone `<input>` without the `.i8` wrapper.**

When you don't want the extra wrapper `<div>` around every `<input>` (e.g. simple search box, inline rename field, custom layout), you can compose the apply rules straight onto the input:

```html
<input
  class="i8-input
         i8-bg-scope-light-1 i8-apply-bg
         i8-border-scope-color-300 i8-apply-border
         current-outline-hl i8-apply-outline
         h-fingertip rounded-base px-$m"
/>
```

The same pattern is used inside custom `i8-*` design variants (see [Pattern 5](#pattern-5--extend-i8-with-a-custom-design-variant)).

Full rule reference in [rules.md](rules.md).

## Built-in shortcuts catalog

These are the named shortcuts every `vunorShortcuts()` call ships:

| Group | Shortcuts |
|-------|----------|
| `c8` | `c8-filled`, `c8-filled-hover`, `c8-filled-active`, `c8-flat`, `c8-flat-hover`, `c8-flat-active` *(disabled — see Gotchas)*, `c8-flat-selected`, `c8-outlined`, `c8-outlined-hover`, `c8-outlined-active`, `c8-light`, `c8-light-hover`, `c8-light-active` |
| `i8` | `i8`, `i8-input`, `i8-textarea`, `i8-input-wrapper`, `i8-ta-wrapper`, `i8-label`, `i8-label-wrapper`, `i8-stack-label`, `i8-hint`, `i8-counter`, `i8-hint-wrapper`, `i8-hint-wrapper-stack`, `i8-prepend`, `i8-append`, `i8-before`, `i8-after`, `i8-icon-wrap`, `i8-icon-clickable`, `i8-loading`, `i8-underline`, `segmented` |
| Card | `card` |
| Button | `btn`, `btn-square`, `btn-label`, `btn-icon` |
| Checkbox | `checkbox-root`, `checkbox`, `checkbox-indicator`, `checkbox-icon`, `checkbox-label` |
| RadioGroup | `rb-container`, `rb-label`, `rb-root`, `rb-row`, `rb-item-wrapper`, `rb-item`, `rb-item-indicator`, `rb-item-label` |
| Select | `select-content`, `select-item`, `select-grp-label`, `select-separator`, `select-prepend`, `select-append`, `select-loading` |
| Combobox | `combobox-content`, `combobox-item`, `combobox-empty`, `combobox-grp-label` |
| Slider | `slider`, `slider-track`, `slider-range`, `slider-thumb`, `slider-label` |
| Tabs | `tabs-indicator`, `tab` |
| Menu | `menu-root`, `menu-item` |
| Dialog | `dialog-overlay`, `dialog-card`, `dialog-header`, `dialog-title`, `dialog-close`, `dialog-footer` |
| Calendar | `calendar-root`, `calendar-header`, `calendar-month-grid`, `calendar-grid-row`, `calendar-cell` |
| Loading | `loading-indicator`, `loading-indicator-wrapper`, `inner-loading`, `loading-indicator-ring` |
| Toast | `toast-root`, `toasts-viewport` |
| Progress | `progress-bar` |
| Misc | `shadow-popup` |

## Override patterns

### Pattern 1 — change one variant only

```ts
const overrides = defineShortcuts({
  'c8-filled': {
    '': 'rounded-full',       // base classes get appended; everything else preserved
  },
})
shortcuts: [vunorShortcuts(overrides)]
```

After merge, `c8-filled` still has its hover/active/dark variants — only the base picks up `rounded-full` in addition to the original base.

### Pattern 2 — replace a variant entirely

`mergeVunorShortcuts` concatenates strings. To *replace* the hover, you'd use enough specificity to overwrite, or unset by re-defining all the keys you want with new values:

```ts
defineShortcuts({
  'c8-filled': {
    'hover:': 'opacity-80',  // appended after the original hover
  },
})
```

If you really need to wipe a variant, define your own version of the shortcut at a different name and use it instead — pure replacement isn't a first-class operation, by design.

### Pattern 3 — add a brand-new shortcut

```ts
defineShortcuts({
  'badge': {
    '': 'inline-flex items-center px-$xs py-$xxs text-caption rounded-full bg-scope-color-100 text-scope-color-900',
    'dark:': 'bg-scope-dark-2 text-scope-light-1',
  },
  'badge-outline': {
    '': 'badge border border-current/40 bg-transparent',
  },
})
```

```html
<span class="scope-good badge">approved</span>
<span class="scope-error badge-outline">denied</span>
```

### Pattern 4 — restyle every Vunor button

```ts
defineShortcuts({
  'btn': {
    '': 'tracking-wide rounded-base',  // bigger letter-spacing, force base radius
  },
})
```

Affects `<VuButton>` and anything else carrying the `btn` class.

### Pattern 5 — extend i8 with a custom design variant

`i8`'s nested object uses CSS-attribute selectors so adding a new design variant is a matter of registering a sibling key:

```ts
defineShortcuts({
  'i8': {
    '[&.i8-glass]:': {
      '': 'i8-apply-bg current-outline-hl rounded-$s i8-apply-border backdrop-blur',
      'data-[active=true]:': 'current-border-hl outline i8-apply-outline',
      'focus-within:': 'current-border-hl outline i8-apply-outline',
    },
  },
})
```

Then pass `design="glass"` (or just `class="i8-glass"`) on a `<VuInput>` to opt in.

### Pattern 6 — customize via UnoCSS theme + Vunor shortcuts together

For the deepest customizations, combine theme-level changes (colors, fingertip, baseRadius — see [theme.md](theme.md)) with shortcut-level overrides:

```ts
presetVunor({
  baseRadius: '0.25em',                   // tighter corners everywhere
  fingertip: { m: '2.5em' },              // smaller default touch target
  palette: { colors: { primary: '#…' } }, // brand color
})

vunorShortcuts(defineShortcuts({
  'c8-filled': { '': 'tracking-wide font-medium' },  // brand button feel
  'card':      { '': 'shadow-sm' },                  // cards float
}))
```

That's the **idiom**: theme handles the mathematical scale (sizes, colors, radii); shortcuts handle the visual flourish (font weight, shadow, letter-spacing).

## When to use a shortcut vs. inline classes

| Choose shortcut when | Choose inline classes when |
|---------------------|----------------------------|
| Multiple components share the styling | One-off layout |
| You need variant logic (hover, dark, data-state) bundled | Base styles only |
| You want to skin Vunor components consistently | A page-specific tweak |
| The same combination appears in 3+ places | Truly unique element |

Don't paper over inline complexity with new shortcuts — only extract once you have repetition.

## Debugging FAQ

**"My c8 button is the wrong width or has no height."**
c8 doesn't set layout. Compose `inline-flex items-center h-fingertip-m px-$m` (or use `<VuButton>`). Don't try to "undo" a width c8 never set — `w-auto` does nothing useful here.

**"My c8 button has no padding / no gap between icon and label."**
Same reason — c8 doesn't set padding or gap. Add `px-$m gap-$xs` yourself, or switch to `<VuButton>`.

**"My c8 button has no color or only the neutral default."**
There's no active scope. Add `scope-primary` (or whichever scope you need) on the button or any ancestor. The preflight installs `scope-neutral` on `:root`, so you'll never see "nothing", but for brand color you must opt in.

**"My c8 hover works on a `<button>` but the `[data-highlighted]` style never fires."**
`[data-highlighted]` and `[data-active]` are populated by **reka-ui primitives** (menu items, listbox items, combobox items). Plain `<button>` only triggers the `:hover` / `:focus-visible` / `:active` portions of c8 — that's normal.

**"`c8-flat-selected` does nothing on my tabs."**
Tabs use `data-state="active"`, not `data-selected`. `c8-flat-selected` is for menu items, segmented buttons, and toggle buttons. For tab styling, use the dedicated `tab` / `tabs-indicator` shortcuts (used by `<VuTabs>`).

**"My standalone `<input>` has no border / background."**
Either wrap it in `<div class="i8 i8-filled group/i8">…</div>`, or paint colors directly with `i8-bg-* i8-apply-bg i8-border-* i8-apply-border` — the wrapper variants don't apply through the input element on their own.

**"My input doesn't show the focus highlight or error state."**
The `i8` wrapper must also carry `group/i8`. The focus / error / `data-has-value` styles are written as `group-[…]/i8:` selectors and need a named group ancestor. `<VuInput>` adds it automatically; if you compose i8 by hand, add `class="i8 i8-filled group/i8"`.

**"I applied `i8` to the `<input>` itself and nothing works right."**
`i8` is a wrapper, not a leaf. Move it to a parent `<div>` (with `group/i8`) and put `i8-input` on the actual `<input>`.

**"I added an override and now the original variant is gone."**
`mergeVunorShortcuts` *concatenates* into existing variant strings, it doesn't replace. If a class disappeared, you most likely defined a **sibling shortcut** with the same name *outside* `vunorShortcuts(overrides)` — that collides with the default. Always go through `vunorShortcuts(overrides)`.

## Gotchas

- Shortcut keys are **variant prefixes**, not pseudo-classes. The key `'hover:'` (with the colon!) prepends `hover:` to every class. Forgetting the colon makes UnoCSS read `hover` as a literal class.
- The empty key `''` is the base. Every shortcut needs one or it generates nothing for the no-prefix state.
- Merge concatenates. `'c8-filled': { '': 'rounded-full' }` *adds* `rounded-full` to the base, it doesn't replace what's there. To "remove" a class, change the underlying tokens (e.g. set `baseRadius`) or define a sibling shortcut you opt into.
- The c8/i8 systems consume `--scope-color-*` and `--current-*`. Without an active `scope-*`, they fall back to the preflight's neutral defaults — usable but generic.
- `c8-flat-active` is currently disabled (commented in source) because it conflicted with tabs. Use `c8-flat-selected` (driven by `data-selected`/`aria-pressed`) for active state.
- Adding a shortcut named `card` (or any built-in name) without going through `vunorShortcuts(overrides)` will collide with the default. Always pass overrides to `vunorShortcuts()`.
