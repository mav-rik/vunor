# Form components — Vunor

`<VuInput>`, `<VuSelect>`, `<VuCombobox>`, `<VuCheckbox>`, `<VuRadioGroup>`, `<VuSlider>`, `<VuDatePicker>`. All use the `i8-*` shortcut system and Reka UI primitives. For non-form components see [components.md](components.md). For shortcut customization see [shortcuts.md](shortcuts.md).

## Shared conventions

- Three design variants: `flat` (underline only), `filled` (full border + bg), `round` (pill version of filled). Set via `design` prop or by adding the `i8-flat` / `i8-filled` / `i8-round` class manually.
- All inputs auto-scope to `scope-error` when an error is present, so the focus ring and underline turn red.
- State uses **ARIA + data attributes**: `aria-disabled="true"`, `aria-required="true"`, `data-state="checked|unchecked|indeterminate"`, `data-active`, `data-has-value`, `data-error`. **Do not** reach for `:checked`, `:disabled`, or HTML `disabled` attribute when querying.
- Most form components support a `loading` state.
- Errors can be `boolean` (just turns red) or `string` (turns red and shows the message under the input).

## `<VuInput>`

Text or textarea input with floating label, hint, counter, prepend/append icons and slots, error handling.

| Prop | Type | Default | Effect |
|------|------|---------|--------|
| `modelValue` | string \| number | — | v-model |
| `label` | string | — | Floating label (collapses on focus) |
| `stackLabel` | boolean | `false` | Always-stacked label above input (no float) |
| `placeholder` | string | — | Native placeholder |
| `design` | `'flat' \| 'filled' \| 'round'` | `'flat'` | Visual variant |
| `type` | `'text' \| 'textarea'` | `'text'` | Field type |
| `readonly`, `disabled`, `required` | boolean | `false` | State |
| `maxlength` | number | — | Char limit; renders counter |
| `rows` | number | — | Textarea rows |
| `autoGrow` | boolean | `false` | Textarea grows with content |
| `loading` | boolean | `false` | Show inline spinner |
| `error` | string \| boolean | — | Error state / message |
| `hint` | string | — | Hint text under field |
| `iconBefore`, `iconAfter` | string | — | Icons outside the input border |
| `iconPrepend`, `iconAppend` | string | — | Icons inside the input border |
| `groupTemplate` | string | `'repeat(1, 1fr)'` | CSS grid template for multi-input groups |
| `active` | boolean | — | Force `data-active` (used by parents) |

Emits: `update:modelValue`, `blur`, `focus`, `click`, `beforeClick`, `afterClick`, `prependClick`, `appendClick`.

Slots: `default` (custom input renderer), `before`, `after`, `prepend`, `append`, `input`, `overlay`, `error`, `hint`, `counter`, `label`.

CSS classes: `i8` (wrapper), `i8-input`, `i8-textarea`, `i8-label`, `i8-hint`, `i8-counter`, `i8-prepend`, `i8-append`, `i8-before`, `i8-after`, `i8-underline`.

Data attrs: `data-has-value`, `data-active`, `data-error`, `data-has-label`, `data-has-prepend`, `data-has-append`, `data-type`.

```html
<!-- basic -->
<VuInput v-model="name" label="Full Name" />

<!-- design + error -->
<VuInput v-model="email" label="Email" design="filled" :error="emailError" />

<!-- textarea with auto-grow -->
<VuInput v-model="bio" label="Bio" type="textarea" auto-grow :rows="3" />

<!-- with icons inside the border -->
<VuInput v-model="search" label="Search"
         icon-prepend="i-mdi-magnify" icon-append="i-mdi-close"
         @append-click="search = ''" />

<!-- with character counter -->
<VuInput v-model="tweet" label="Tweet" :maxlength="280" />

<!-- prefix/suffix via slots -->
<VuInput v-model="price" label="Price" design="filled">
  <template #prepend>$</template>
  <template #append>.00</template>
</VuInput>

<!-- segmented (joined visually) -->
<div class="segmented">
  <VuInput v-model="firstName" label="First Name" design="filled" />
  <VuInput v-model="lastName" label="Last Name" design="filled" />
</div>
```

For a custom input renderer (e.g. masked input), use the `input` slot:

```html
<VuInput v-model="phone" label="Phone">
  <template #input="{ inputProps }">
    <input v-bind="inputProps" v-mask="'(###) ###-####'" />
  </template>
</VuInput>
```

### `i8-bare` — standalone `<input>` without a wrapper

For inline rename fields, search boxes, or any case where the `i8` wrapper `<div>` is overhead, use the public `i8-bare` shortcut. It bundles border + bg + outline + focus highlight + placeholder color + `data-error` reaction — height/padding/radius stay external.

```html
<input class="i8-bare h-fingertip-s px-$m" placeholder="search…" />
<input class="scope-primary i8-bare h-fingertip-m px-$m rounded-fingertip-half" />
```

See [shortcuts.md](shortcuts.md) for the full recipe and how it composes the underlying apply-rules.

## `<VuSelect>`

Dropdown built on Reka UI Select. Portals popup to `<body>`. Typically wrapped inside `<VuInput>` for the label/error/design surround.

| Prop | Type | Default | Effect |
|------|------|---------|--------|
| `modelValue` | string | — | v-model |
| `items` | `Array<string \| TItem> \| Record<string, Array>` | — | Options or grouped record |
| `defaultValue` | string | — | Initial value |
| `disabled`, `required` | boolean | `false` | State |
| `disabledValues` | string[] | — | Specific items to disable |
| `placeholder` | string | — | Trigger placeholder |
| `popupClass` | string | — | Class on the popup container |
| `popupRound` | boolean | — | Round popup corners |
| `popupPosition` | `'item-aligned' \| 'popper'` | — | Popup positioning mode |

Slots: `default` (custom item renderer), `selected-items`.

CSS classes: `select-content` (popup), `select-item`, `select-grp-label`, `select-separator`, `select-prepend`, `select-append`, `select-loading`.

Data attrs on items: `data-highlighted`, `data-disabled`, `data-state="checked"`.

```html
<!-- string items inside an Input wrapper -->
<VuInput label="Fruit" design="filled">
  <VuSelect v-model="fruit" :items="['Apple', 'Banana', 'Cherry']" />
</VuInput>

<!-- object items -->
<VuInput label="Country" design="filled">
  <VuSelect v-model="country" :items="[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' },
  ]" />
</VuInput>

<!-- grouped items -->
<VuInput label="City" design="filled">
  <VuSelect v-model="city" :items="{
    'North America': ['New York', 'Toronto'],
    'Europe':        ['London', 'Paris'],
  }" />
</VuInput>
```

`VuSelect` standalone (no `VuInput` wrapper) renders just the trigger button — use it for compact toolbars where you don't need a label.

## `<VuCombobox>`

Searchable dropdown with optional multi-select and grouping. Inherits all `VuInput` props for the label/design/error surround (it composes its own `i8` wrapper).

| Prop | Type | Default | Effect |
|------|------|---------|--------|
| `modelValue` | string \| string[] | — | v-model |
| `items` | `Array<string \| T> \| Record<string, Array>` | — | Options or grouped record |
| `searchTerm` | string | — | v-model for search input text |
| `multiple` | boolean | `false` | Multi-select mode |
| `checkboxItems` | boolean | `false` | Show checkboxes in multi-select |
| `modelOpen` | boolean | — | v-model for popup open state |
| `dropdownIcon` | string | `'i--chevron-down'` | Toggle icon |
| `resetSearchTermOnBlur` | boolean | — | Clear search on blur |
| `popupClass` | string | — | Class on the popup |
| `popupRound` | boolean | — | Round popup corners |
| `align` | string | — | Popup alignment |

Plus all `VuInput` props (`label`, `design`, `disabled`, `error`, `hint`, …).

Slots: `empty`, `group-label`, `item` (with `{ item, selected }`), `prepend`, `append`.

```html
<!-- searchable -->
<VuCombobox v-model="fruit" label="Fruit" :items="fruits" design="filled" />

<!-- multi-select with checkboxes -->
<VuCombobox v-model="picked" label="Fruits"
            :items="fruits" multiple checkbox-items design="filled" />

<!-- custom item renderer -->
<VuCombobox v-model="user" label="User" :items="users" design="filled">
  <template #item="{ item, selected }">
    <div class="flex items-center gap-$xs">
      <img :src="item.avatar" class="size-6 rounded-full" />
      <span>{{ item.label }}</span>
      <VuIcon v-if="selected" name="i-mdi-check" class="ml-auto" />
    </div>
  </template>
</VuCombobox>
```

## `<VuCheckbox>`

Reka UI Checkbox with indeterminate state.

| Prop | Type | Default | Effect |
|------|------|---------|--------|
| `modelValue` | `boolean \| undefined \| 'indeterminate'` | — | v-model (use `'indeterminate'` for tri-state) |
| `label` | string | — | Label text |
| `disabled`, `readonly`, `required` | boolean | `false` | State |
| `error` | string \| boolean | — | Error state / message |
| `verticalMiddle` | boolean | `false` | Vertically center checkbox with multi-line label |
| `reverse` | boolean | `false` | Label before checkbox |

Slots: `default` (custom label content), `label`.
CSS classes: `checkbox-root`, `checkbox`, `checkbox-indicator`, `checkbox-icon`, `checkbox-label`.
Data attrs: `data-state="checked|unchecked|indeterminate"`, `data-error`, plus `aria-disabled`.

```html
<VuCheckbox v-model="agreed" label="I agree to the terms" />
<VuCheckbox v-model="selectAll" label="Select all"
            :model-value="allSelected ? true : someSelected ? 'indeterminate' : false" />
```

## `<VuRadioGroup>`

Reka UI RadioGroup.

| Prop | Type | Default | Effect |
|------|------|---------|--------|
| `modelValue` | string | — | v-model |
| `items` | `Array<string \| { value, label?, disabled? }>` | — | Options |
| `defaultValue` | string | — | Initial value |
| `label` | string | — | Group label |
| `labelVisible` | boolean | `true` | Show label |
| `row` | boolean | `false` | Horizontal layout |
| `disabled` | boolean | `false` | Disable all items |
| `disabledValues` | string[] | — | Specific items to disable |
| `error` | string \| boolean | — | Error state / message |
| `verticalMiddle`, `reverse` | boolean | `false` | Layout tweaks |

Slots: `default` (custom item renderer with item bind).
CSS classes: `rb-container`, `rb-label`, `rb-root`, `rb-row`, `rb-item-wrapper`, `rb-item`, `rb-item-indicator`, `rb-item-label`.

```html
<VuRadioGroup v-model="size" label="Size" :items="['Small', 'Medium', 'Large']" />

<VuRadioGroup v-model="plan" label="Plan" :items="[
  { value: 'free', label: 'Free' },
  { value: 'pro',  label: 'Pro' },
  { value: 'ent',  label: 'Enterprise', disabled: true },
]" />

<!-- horizontal -->
<VuRadioGroup v-model="align" :items="['Left', 'Center', 'Right']" row />
```

## `<VuSlider>`

Reka UI Slider — single or multi-thumb range.

| Prop | Type | Default | Effect |
|------|------|---------|--------|
| `modelValue` | `number[]` | — | v-model — **always an array** |
| `min`, `max`, `step` | number | `0`, `100`, `1` | Range and granularity |
| `disabled` | boolean | `false` | Disabled |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction |
| `thumbs` | number | `1` | Number of thumbs (range slider) |
| `labels` | string[] | — | Labels under each thumb |
| `label` | string | — | Overall label |
| `displayValue` | boolean | `false` | Show current value |
| `hideRange` | boolean | `false` | Hide the colored fill track |

Slots: `default` (custom thumb renderer).
CSS classes: `slider`, `slider-track`, `slider-range`, `slider-thumb`, `slider-label`.

```html
<!-- single thumb (still array) -->
<VuSlider v-model="volume" :min="0" :max="100" label="Volume" />

<!-- range -->
<VuSlider v-model="priceRange" :min="0" :max="1000" :thumbs="2"
          label="Price Range" />
```

## `<VuDatePicker>`

Date input with calendar popup. Composed from `DatePickerBase`, `DatePickerInner`, `DatePickerPopup`. Uses `@internationalized/date` internally.

```html
<VuDatePicker v-model="date" label="Start Date" design="filled" />
```

For an inline calendar (no popup), use `<VuCalendar>` directly.

## Common patterns

### Form with validation

```html
<form @submit.prevent="submit" class="flex flex-col gap-$m">
  <VuInput v-model="name"  label="Name"  required :error="errors.name" />
  <VuInput v-model="email" label="Email" required :error="errors.email" />

  <VuInput label="Role" design="filled">
    <VuSelect v-model="role" :items="roles" />
  </VuInput>

  <VuCheckbox v-model="terms" label="I agree to the terms"
              :error="errors.terms" />

  <VuButton class="scope-primary c8-filled" label="Submit" type="submit" />
</form>
```

### Wrap Select in Input for label parity

```html
<VuInput label="Country" design="filled" :error="countryError">
  <VuSelect v-model="country" :items="countries" />
</VuInput>
```

This keeps the Select looking and behaving like the rest of the form (label, error scoping, design variant).

### Async-loading combobox

```html
<VuCombobox v-model="user"
            label="Search users"
            :items="results"
            :loading="searching"
            :search-term="query"
            @update:search-term="onSearch"
            design="filled" />
```

## Gotchas

- `<VuSlider>` always uses an array model, even with one thumb. `v-model="vol"` where `vol` is a single number won't work — use `[vol]`.
- `<VuCheckbox>` model can be `boolean` or the literal string `'indeterminate'`. UI state is reflected via `data-state`, not `:checked`.
- Reka UI renders hidden native `<select>/<option>` for form submission alongside the custom UI. `[role="option"]` matches both — scope to `div[role="option"]` within `.select-content` (the popup CSS class).
- `disabled` becomes `aria-disabled="true"`. CSS selectors and queries should match `[aria-disabled="true"]`, not `[disabled]`.
- `required` becomes `aria-required="true"`. Same caveat.
- Select / Combobox popups portal to `<body>` and inherit the `:root` scope. Pass `popupClass="scope-…"` to override the popup palette.
- `<VuInput type="textarea">` switches the rendered element to `<textarea>`. Other HTML input types (`'password'`, `'email'`) aren't covered by `type` — pass them via the underlying `<input>` attrs through the `input` slot or a wrapping `<VuInputBase>`.
- `iconPrepend`/`iconAppend` (inside the border) are different from `iconBefore`/`iconAfter` (outside the border). The latter pair gets `i8-icon-clickable` if you wire a `@before-click`/`@after-click` handler.
