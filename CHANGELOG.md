# Changelog

## Unreleased

### Breaking

- `vue` (`^3.5.0`), `unocss` (`^66.2.1`) and `reka-ui` (`^2.8.0`) are now **peer dependencies** (they were dependencies). The app provides them, so it has a single copy of each. npm and pnpm install missing peers automatically; list them in your app to pin versions: `pnpm add vunor vue unocss reka-ui`. The floors are measured: the dist checks pass with reka-ui 2.8.0 (older 2.x releases do not render popups with Vue 3.4), reka-ui 2.8 needs `@vueuse/core` 14, which needs Vue 3.5, and the theme generates identical CSS from unocss 66.2.1 on (66.2.0 and older miss arbitrary custom-property utilities).
- `@unocss/preset-mini` is no longer a dependency: types come from `unocss/preset-mini` (no second `@unocss` copy).
- `@nuxt/kit` and `@nuxt/schema` are optional peer dependencies, used only by `vunor/nuxt`.

### Intended changes of default behaviour

The dist test compares what each component passes to its Reka/vunor parts by default with
0.3.2; these are the only differences:

- `VuCheckbox` is no longer `required` by default (it always set `required` on the checkbox, which would block form submission now that `name` is forwarded). Pass `required` to require it.
- `VuButton` renders `aria-pressed` only when `pressed` is passed, and `aria-selected` only when `selected` is passed **and** the button has a role that allows it (`option`, `tab`, `gridcell`, `row`, `columnheader`, `rowheader`, `treeitem`, e.g. inside a listbox). Before, every button rendered `aria-pressed="false" aria-selected="false"`. `selected` now also sets `data-selected`, which `c8-*` styles like `aria-selected`.
- `VuButton` with `to`: the active router link gets `data-selected="true"` and, when exactly active, `aria-current="page"`, instead of the invalid `aria-selected` on a link. The `c8-flat` look is the same.
- `id`: on `VuCheckbox` it goes to the checkbox control (for `<label for>`), not the wrapper div. On `VuPopover` (and a `multiple` + `groupItem` `VuCombobox`) the trigger keeps Reka's id, which links it to the popup; an `id` you pass is not applied there.
- Button-only props (`active`, `pressed`, `selected`, `asLink`, `to`) no longer appear as DOM attributes.
- Wrappers no longer pass `false` for boolean props you did not set, so Reka's own defaults apply (for example the hidden date input of `VuDatePicker` is no longer `required="false"`).
- `VuPopover` no longer passes its own props to the popup as attributes (`as-link`, `model-value`, … appeared on the popup element).
- Removed invalid `as-child` attributes from `VuCombobox`'s popup portal and `VuPopover`'s root (they did nothing and warned in development).
- `VuButton` no longer renders an empty `style=""` attribute.
- `default-open` works on `VuPopover`, `VuSelect`, `VuSelectBase`, `VuCombobox`, `VuDatePicker` and `VuDatePickerBase`: when you do not bind `open` (`v-model:open`), the `open` model is now `undefined` (Reka's "uncontrolled") instead of `false`, which kept the popup closed and ignored `default-open`. Likewise `VuCheckbox` `default-value` works: its model is `undefined` until you bind it.
- What a component exposes about that state now always matches the Reka root, also when it is uncontrolled: slot props (`VuPopover` `isOpen`, `VuSelectBase` `open` / `value` / `displayItem`), the open-state styling (`data-active` / `data-group-active` on the Select, Combobox and date picker shells, the Popover trigger), `openPopup()` (one call toggles once), the Checkbox mark, the Slider value label and the Select / Combobox shown label with `default-value`. `VuDialog` uses the same rule: `default-open` opens it without emitting `update:open`.
- Like Reka, components read `default-open` / `default-value` once, when they mount: changing it later has no effect, and what the component exposes stays in step with the Reka root. When you clear a bound model (`v-model` back to `undefined`), the exposed state falls back exactly like the root (for example `VuSlider`'s label shows Reka's default `0`, not nothing), and the component does not emit.
- Behaviour change: with `multiple`, `VuCombobox`'s `open` (`v-model:open`, `default-open`) is the popover the user opens with the field. In 0.3.2 it described the option list inside the popover, which is always open: mounting emitted `update:open(true)` with the popover closed, the first open emitted nothing, and a bound `:open` did not open the popover. Now mounting emits nothing, each open and close emits one `update:open`, a bound `:open` / `default-open` opens the popover, and the field's open-state styling (`data-expanded`, `data-active`) follows the popover.
- Clearing a `multiple` `VuCombobox` (its clear icon) now emits `[]` (0.3.2 emitted `undefined`), so the selection is empty rather than handed back to the uncontrolled default.
- One click toggles a popup once. A click on a field's append icon (the chevron) also reached the field around it, and both toggled: the `VuCombobox` chevron (single and `groupItem`) could not open its popup, and in `multiple` mode a second chevron click did not close it. Every wrapper now routes a gesture to exactly one toggle (`VuCombobox`, `VuSelect`, `VuSelectBase`, `VuDatePicker`, `VuDatePickerBase`, `VuPopover`); the Reka triggers they render are marked `data-vu-trigger` and toggle by themselves.
- The `VuDatePicker` / `VuDatePickerBase` calendar icon is keyboard-operable: it is a `role="button"` with an `aria-label`, and Enter / Space open and close the calendar (it reacted to clicks only).
- A popup whose `v-model:open` went back to `undefined` after being set no longer passes `undefined` to Reka (`Invalid prop "present"` warning in development): once set, the open state handed to Reka stays a boolean.
- `VuCombobox`: the field shows its open state (`data-group-active`, like `VuSelect`), and `popupPosition` / `sticky` apply.
- `VuCombobox` with `groupItem`: moving the pointer off the input clears the keyboard highlight, and the reading direction applies, as in non-`groupItem` mode. Reka's listbox wiring (`dir`, pointer-leave and focus-out handlers) now reaches the input, and the wrapper classes `relative w-full h-full` are no longer passed down (in 0.3.2 both were merged into a hidden template node and never reached the DOM).
- `VuMenu` highlights its first item when it opens (Reka's default). In 0.3.2 the item buttons rendered a Fragment root, so Reka could not register the items.
- `VuDatePicker` / `VuDatePickerBase` render their input shell (see Fixes), so the date field, its trigger and the popup's `aria-labelledby` now exist by default.

Defaults kept on purpose: `VuCombobox` keeps the typed text on blur (`resetSearchTermOnBlur` defaults to `false`; Reka's default is `true`), and `VuPopover` keeps collision handling off (`avoidCollisions`, `sideFlip`, `alignFlip`, `hideShiftedArrow` default to `false`; pass them to opt in).

### Fixes

- Components are compiled in production mode. Before, template comments next to a root element turned it into a Fragment, and production apps silently lost `class`, `@click` and `aria-*` on `VuButton`, `VuButtonBase`, `VuCheckbox` and `VuMenuItem`.
- Every component forwards fallthrough attributes (`class`, `style`, `id`, `data-*`, `aria-*`, listeners) to its rendered root, including components whose Reka root renders no element (`VuDialog`, `VuPopover`, `VuSelect`, `VuSelectBase`, `VuDatePickerBase`, `VuAppToasts`, `VuCombobox`).
- Props and events of the wrapped Reka component pass through, for example `VuSelect`/`VuSelectBase` `name`, `multiple`, `by`, `dir`, `autocomplete`, `v-model:open`; `VuPopover` `v-model:open`, `modal`, `default-open` and the content events; `VuCombobox` `name`, `by`, `open-on-focus`, `@highlight` and more; `@update:placeholder` on `VuCalendar` and `VuDatePicker`. `name` now submits the value with the enclosing form.
- `vunor/nuxt` no longer throws `ReferenceError: __vue_files__ is not defined` on import.
- `VuDatePickerBase` renders `VuInputBase` (it rendered an unknown `<vuinputbase>` element).
- `VuCombobox` no longer imports `@vueuse/core` (it was not a dependency), and no longer warns about a readonly computed on every mount.
- A disabled or loading `VuButton` rendered as a link (`to`, `as-link`) no longer navigates or fires `@click`: it drops `href` (so middle-click and "open in new tab" have nothing to follow) and stays a focusable link (`role="link"`, `aria-disabled="true"`, `tabindex="0"`). `VuButtonBase` no longer renders the invalid `disabled` attribute on `<a>`.
- `VuButton`: `to` uses the app's `RouterLink` (no `vue-router` import; its type is structural) and navigates client-side; without a router, a string `to` renders `<a href>` and warns in dev.
- `@click` on `VuSelect` and `VuCombobox` fires in `groupItem` mode too.
- `VuSelect` / `VuSelectBase` types: the model is `string`, or `string[]` with `multiple`.
- `VuSlider` no longer calls `@update:model-value` twice per change.
- `VuAppToasts` forwards `hotkey` to the toast viewport.
- The published `dist/` is rebuilt from scratch, so no stale chunks are shipped.
- `VuCheckbox` forwards `name`, `value`, `true-value`, `false-value` and `default-value` to the checkbox control.
- `VuRadioGroup` forwards `name`, `required`, `orientation`, `dir` and `loop`.
- `VuDialog` supports `default-open` and `disable-outside-pointer-events`, and no longer points `aria-describedby` at a missing description.
- `VuOverflowContainer` no longer hangs when it has no width (hidden or not laid out).
- `VuInputBase` used outside `VuInput` no longer warns about a missing injection.
- `VuCheckbox` shows its checkmark from Reka's own state: with custom `true-value` / `false-value`, and inside a Reka `CheckboxGroupRoot` (the group's model decides), the mark now matches the checkbox.
- `VuCombobox` with `open-on-click` / `open-on-focus`: a click on the input opens the popup once (one `update:open`) instead of opening and immediately closing it; the chevron still toggles.
- A disabled or loading `VuButton` link also ignores `@click.once`, `@click.capture` and `@click.passive` listeners.
- `VuSelectBase` with `multiple`: its slot `value` is `[]` when nothing is selected, as in Reka (it was `undefined`).
- `VuDialog` footer buttons no longer warn in development (`Component emitted event "footer-click-ok" but it is neither declared …`) and no longer put the `@footer-click-<label>` listeners on the dialog card element. The event names are unchanged: `footer-click` (with the label) and `footer-click-<label>` (lower-cased, spaces removed). `.once`, kebab-case and `v-on` object listeners work for `footer-click-<label>` as for any Vue event.

### Known trade-off

- Because components are compiled in production mode, their props carry no runtime type information (only what boolean casting needs). Apps no longer get Vue's "Invalid prop type" warnings for vunor components in development; TypeScript types are unchanged.
