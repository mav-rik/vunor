# TODO — DX improvements requested by atscript-ui

Source of these requests: walking `packages/ui-styles/src/shortcuts/**` in
the `atscript-ui` monorepo and identifying patterns that are re-derived by
hand because vunor doesn't expose the matching primitive. Each item below
notes the workaround we currently ship, the count of duplicate sites in
that codebase, and the proposed vunor-side change.

## 1. Add `current-text-strong` (or rename `--current-text` slots)

**Problem.** Inside any `layer-0` wrapper, `--current-text` resolves to
`scope-dark-2` — i.e. placeholder/muted weight. Every `<input>` whose
*value* should read at primary text weight has to bypass the var
indirection by hand:

```ts
// atscript-ui/packages/ui-styles/src/shortcuts/common/_shared.ts
export const strongText = "text-scope-dark-0 dark:text-scope-light-0";
```

Used in 8+ places (`as-filter-dialog`, `as-fpill`, `as-filter-field`,
`as-page`, `as-preset-picker`, `as-preset-dialog`, form `inputBase`).
CLAUDE.md documents it explicitly as a known workaround.

**Ask.** Ship one of:

- a `current-text-strong` (or `text-current-strong`) utility that aliases
  `--current-text` to the un-muted slot, OR
- a different default for `--current-text` inside `layer-0` so input values
  paint at primary weight without an override.

Either way, `strongText` and the `!text-...` overrides go away — and
consumer themes can re-tune one variable instead of patching every
input.

---

## 2. Ship an `i8-bare` leaf-class for unwrapped `<input>`s

**Problem.** Most of our inputs are single-element `<input>`s without the
`i8` wrapper `<div>` (filter pills, search boxes, inline rename fields,
popover entry fields). The shortcuts.md "Paint i8 colors directly onto a
standalone `<input>`" recipe is rebuilt by hand 7+ times:

```
border-1 layer-0 rounded-base outline-none current-outline-hl <strongText>
+ focus:  current-border-hl outline i8-apply-outline
+ placeholder:text-current/50
+ hover:  border-scope-light-3 dark:border-scope-dark-3   (see #3)
```

Sites: `as-filter-dialog-condition-select`, `as-filter-input`, `as-fpill-input`,
`as-filter-field-search`, `as-page-search-input`, `as-preset-picker-popover-input`,
`as-preset-dialog-search-input`, `as-preset-dialog-row-rename`, plus the
shared `inputBase` / `smallInputBase` exports.

**Ask.** Promote the recipe to a first-class shortcut (`i8-bare`,
`input-leaf`, `i8-input-bare` — naming TBD) bundling border + layer + outline
+ focus state + placeholder color. Result: our 7 input shortcuts collapse
to `i8-bare h-fingertip-m px-$s` + per-context tweaks.

---

## 3. Add a `current-border-hover` token

**Problem.** "Step the border one shade darker on hover" is the standard
input/pill hover idiom and shows up as the dual-token literal:

```
hover: border-scope-light-3 dark:border-scope-dark-3
```

8+ occurrences across `as-fpill`, `as-filter-field`, `as-filter-dialog`
(twice), `as-page`, `as-orderable-list-checkbox`, `as-table-checkbox`.

`--current-border` exists but has no companion "hover step." Adding one
would reduce two tokens (`light` + `dark` fork) to a single class and
make the step user-tunable.

**Ask.** Either:

- a `current-border-hover` CSS var + matching `border-current-hover`
  utility, OR
- a `hover-border-step` rule that emits the dual-token expansion.

---

## 4. Promote `btn` (and friends) to first-class public shortcuts

**Problem.** `c8-*` is documented as "color preset, not a button preset"
and shortcuts.md's "Minimum working button" gives the layout glue:

```
inline-flex items-center justify-center h-fingertip-{s,m} px-$m
font-{500,600} cursor-pointer
```

— which we paste verbatim alongside `c8-*` in **10 places** in `atscript-ui`:
`as-confirm-dialog-cancel/confirm`, `as-filter-btn/btn-apply`,
`as-table-actions-btn/more`, `as-preset-picker-popover-cancel/save`,
`as-preset-dialog-footer-close/save`, plus close cousins in
`as-page-toolbar-btn`, `as-orderable-list-toolbar-btn`,
`as-submit-btn`. The `btn` shortcut already exists in vunor — but it's
treated as `<VuButton>`-internal.

**Ask.** Promote `btn`, `btn-square`, `btn-icon`, `btn-label` to the
"publicly composable" tier so consumers can write `c8-filled btn`
instead of restating the 6-class layout suffix. (If the existing `btn`
carries `<VuButton>`-only opinions, fork a leaner public version.)

---

## 5. Roll `opacity-40 cursor-not-allowed` into `c8-*` `disabled:`

**Problem.** shortcuts.md says `c8-*` "pre-wires `disabled:` exclusions"
— meaning hover/active suppression. But the *visual* disabled treatment
(`opacity-40 cursor-not-allowed`) is still consumer-side, so we paint it
**14 times** across atscript-ui shortcut files.

**Ask.** Bake `opacity-40 cursor-not-allowed` (or whatever the canonical
treatment is) into the `disabled:` branch of every `c8-*`. Or expose a
`c8-disabled` opt-in rule so the consumer states the *intent* once
instead of restating the *recipe* on every button.

---

## 6. Make `[data-highlighted]: layer-3` a built-in for menu rows

**Problem.** Every reka-ui menu row we ship is the same shape:

```
flex items-center gap-$s w-full px-$m py-$xs border-0 bg-transparent
text-current text-left cursor-pointer outline-none
hover: layer-3
data-[highlighted]: layer-3
```

4 verbatim copies in `as-column-menu-item`, `as-row-actions-menu-item`,
`as-table-actions-menu-item`, `as-preset-picker-item`.

vunor's existing `menu-item` is `<VuMenu>`-internal; consumers wiring
plain reka-ui menus re-derive it.

**Ask.**

- Make `menu-item` (and `menu-separator`) public-composable like the
  proposed public `btn`.
- Bonus: extend `c8-flat`'s `[data-highlighted]` branch to use `layer-3`
  instead of `current/10` so plain reka-ui menu rows get the right
  hover-tint by composing `c8-flat` alone.

---

## 7. Add a `c8-toggle` (or extend `c8-flat-selected` for `[data-on]`)

**Problem.** atscript-ui `as-preset-dialog` defines four near-identical
"icon button with on/off state" shortcuts:

```
scope-neutral c8-flat inline-flex items-center justify-center
size-fingertip-s rounded-base cursor-pointer text-current/40 shrink-0
hover:                scope-primary layer-2 text-current-hl
[&[data-on]]:         scope-primary layer-2 border-1 current-border-hl
                      text-primary-500
```

(`as-preset-dialog-row-default`, `…-row-fav`, `…-row-public-toggle`,
`…-row-delete`.) `c8-flat-selected` already covers `data-selected="true"`
/ `aria-pressed="true"`, but not `[data-on]` and the visual is different
(soft-tint vs full pressed style).

**Ask.** Either:

- a `c8-toggle` variant that flips between flat-at-rest and a
  soft-primary-tinted on-state on `[data-on="true"]`, OR
- generalize `c8-flat-selected` to also fire on `[data-on]` and define
  the soft-tint as the canonical "selected" treatment for `c8-flat`.

---

## 8. Add a public `popup-card` (sibling of `dialog-card`)

**Problem.** Every popover/menu/listbox content surface we ship is:

```
scope-primary layer-0 z-[200] py-$xs border-1 rounded-r2 shadow-popup
```

6 verbatim occurrences across `as-column-menu-content`,
`as-row-actions-menu`, `as-table-actions-menu`, `as-preset-picker-menu`,
`as-preset-picker-popover`, `as-filter-field-dropdown`. vunor ships
`dialog-card`, `select-content`, `combobox-content` — but each is
component-internal, not the right vocabulary for a hand-rolled reka-ui
popover.

**Ask.** A public `popup-card` (or `popover-surface`) bundling the layer
+ border + radius + shadow + z baseline. Symmetric partner of
`dialog-card`. Consumers add `min-w-[Xem]` / `max-w-[Yem]` per use.

---

## Recommended ordering

If implementing in sequence, this order maximises immediate consumer-side
LOC reduction:

1. **#1 (`current-text-strong`) + #2 (`i8-bare`)** — together kill
   `strongText` and 7 input recipes. Highest LOC win.
2. **#4 (public `btn`)** — kills 10 verbatim layout strings.
3. **#5 (`disabled` baked into `c8-*`)** — kills 14 redundant lines.
4. **#3 (`current-border-hover`)** — kills 8 dual-token literals.
5. **#6 (public `menu-item`)** — kills 4 menu-row recipes.
6. **#8 (`popup-card`)** — kills 6 popover-surface recipes.
7. **#7 (`c8-toggle`)** — narrower scope, but unblocks future toggle
   surfaces.

## Common thread

The pattern across all eight items: vunor exposes a *component class*
(`btn`, `menu-item`, `dialog-card`, `i8-input`) only as part of its own
components. As soon as a consumer wants the same primitive on a
hand-rolled `<button>` / `<input>` / popover, they re-derive it from
`c8-*` + `i8-apply-*` rules + low-level scope tokens.

Promoting those internal component shortcuts to first-class public
primitives — and filling the `--current-text` / `--current-border`
hover-step gaps — is the highest-leverage DX move.
