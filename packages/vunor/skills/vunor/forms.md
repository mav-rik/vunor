# Form components — vunor

> Detailed usage for Input, Select, Combobox, Checkbox, RadioGroup, Slider, and DatePicker.

## Concepts

Form components use the `i8-*` shortcut system for visual styling and Reka UI primitives for accessibility. They support three design variants (`flat`, `filled`, `round`) and integrate with the color scope system.

All form components:
- Use `scope-{color}` for theming (default scope applies if none set)
- Support `disabled`, `error`, and `loading` states
- Emit standard Vue events (`update:modelValue`, `blur`, `focus`)
- Use `aria-*` and `data-*` attributes for state (not HTML attributes)

## API Reference

### `<VuInput>`

Text / textarea input with floating label.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | — | v-model binding |
| `label` | `string` | — | Floating label text |
| `stackLabel` | `boolean` | `false` | Keep label stacked (never floats) |
| `placeholder` | `string` | — | Input placeholder |
| `design` | `'flat' \| 'filled' \| 'round'` | `'flat'` | Visual design variant |
| `type` | `'text' \| 'textarea'` | `'text'` | Input type |
| `readonly` | `boolean` | `false` | Read-only state |
| `disabled` | `boolean` | `false` | Disabled state |
| `required` | `boolean` | `false` | Required field |
| `maxlength` | `number` | — | Character limit |
| `rows` | `number` | — | Textarea rows |
| `autoGrow` | `boolean` | `false` | Auto-grow textarea |
| `loading` | `boolean` | `false` | Show loading state |
| `error` | `string \| boolean` | — | Error state / message |
| `hint` | `string` | — | Hint text below input |
| `iconBefore` | `string` | — | Icon before input (outside border) |
| `iconAfter` | `string` | — | Icon after input (outside border) |
| `iconPrepend` | `string` | — | Icon prepended inside border |
| `iconAppend` | `string` | — | Icon appended inside border |

**Emits**: `update:modelValue`, `blur`, `focus`, `click`, `beforeClick`, `afterClick`, `prependClick`, `appendClick`

**Slots**: `default`, `before`, `after`, `prepend`, `append`, `input`, `overlay`, `error`, `hint`, `counter`, `label`

**CSS classes**: `i8` (wrapper), `i8-input`, `i8-textarea`, `i8-label`, `i8-hint`, `i8-counter`, `i8-prepend`, `i8-append`, `i8-before`, `i8-after`, `i8-underline`

**Data attrs**: `data-has-value`, `data-active`, `data-error`, `data-has-label`, `data-has-prepend`, `data-has-append`

```html
<!-- Basic text input -->
<VuInput v-model="name" label="Full Name" />

<!-- With design variant -->
<VuInput v-model="email" label="Email" design="filled" />

<!-- With validation error -->
<VuInput v-model="password" label="Password" type="password" :error="passwordError" />

<!-- Textarea with auto-grow -->
<VuInput v-model="bio" label="Bio" type="textarea" auto-grow :rows="3" />

<!-- With icons -->
<VuInput v-model="search" label="Search" icon-prepend="i-mdi-magnify" icon-append="i-mdi-close" />

<!-- With character counter -->
<VuInput v-model="tweet" label="Tweet" :maxlength="280" />
```

### `<VuSelect>`

Dropdown select built on Reka UI SelectRoot.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | — | v-model binding |
| `items` | `Array<string \| T> \| Record<string, Array>` | — | Options (array or grouped record) |
| `defaultValue` | `string` | — | Initial value |
| `disabled` | `boolean` | `false` | Disabled state |
| `disabledValues` | `string[]` | — | Specific disabled options |
| `required` | `boolean` | `false` | Required field |
| `placeholder` | `string` | — | Placeholder text |
| `popupClass` | `string` | — | CSS class for popup |
| `popupRound` | `boolean` | — | Round popup corners |
| `popupPosition` | `'item-aligned' \| 'popper'` | — | Popup positioning mode |

**Slots**: `default` (custom item rendering), `selected-items`
**CSS classes**: `select-content` (popup), `select-item`, `select-grp-label`, `select-separator`
**Data attrs on items**: `data-highlighted`, `data-disabled`, `data-state="checked"`

```html
<!-- Simple string items -->
<VuInput label="Fruit" design="filled">
  <VuSelect v-model="fruit" :items="['Apple', 'Banana', 'Cherry']" />
</VuInput>

<!-- Object items -->
<VuInput label="Country">
  <VuSelect
    v-model="country"
    :items="[
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'mx', label: 'Mexico' },
    ]"
  />
</VuInput>

<!-- Grouped items -->
<VuInput label="City">
  <VuSelect
    v-model="city"
    :items="{
      'North America': ['New York', 'Toronto'],
      'Europe': ['London', 'Paris'],
    }"
  />
</VuInput>
```

**Important**: `VuSelect` is typically placed inside a `VuInput` wrapper to get the label, design variant, and error handling.

### `<VuCombobox>`

Searchable dropdown with filtering. Inherits input props for label, design, etc.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| string[]` | — | v-model binding |
| `items` | `Array<T \| string> \| Record<string, Array>` | — | Options |
| `searchTerm` | `string` | — | v-model for search text |
| `multiple` | `boolean` | `false` | Multi-select mode |
| `checkboxItems` | `boolean` | `false` | Show checkboxes in multi-select |
| `modelOpen` | `boolean` | — | v-model for open state |
| `dropdownIcon` | `string` | `'i--chevron-down'` | Dropdown toggle icon |
| `resetSearchTermOnBlur` | `boolean` | — | Clear search on blur |
| `popupClass` | `string` | — | CSS class for popup |
| `popupRound` | `boolean` | — | Round popup corners |
| `align` | `string` | — | Popup alignment |

Also accepts all `VuInput` props: `label`, `design`, `disabled`, `error`, `hint`, etc.

**Slots**: `empty`, `group-label`, `item` (with `{ selected }` bind), `prepend`, `append`

```html
<!-- Basic searchable select -->
<VuCombobox v-model="fruit" label="Fruit" :items="fruits" />

<!-- Multi-select with checkboxes -->
<VuCombobox
  v-model="selectedFruits"
  label="Fruits"
  :items="fruits"
  multiple
  checkbox-items
/>

<!-- Custom item rendering -->
<VuCombobox v-model="user" label="User" :items="users">
  <template #item="{ item, selected }">
    <div class="flex items-center gap-$xs">
      <img :src="item.avatar" class="size-6 rounded-full" />
      <span>{{ item.label }}</span>
    </div>
  </template>
</VuCombobox>
```

### `<VuCheckbox>`

Checkbox with indeterminate state support.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean \| undefined \| 'indeterminate'` | — | v-model binding |
| `label` | `string` | — | Checkbox label |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Read-only state |
| `required` | `boolean` | `false` | Required field |
| `error` | `string \| boolean` | — | Error state / message |
| `verticalMiddle` | `boolean` | `false` | Vertically center checkbox with label |
| `reverse` | `boolean` | `false` | Label before checkbox |

**Slots**: `default`, `label`
**CSS classes**: `checkbox-root`, `checkbox`, `checkbox-indicator`, `checkbox-icon`, `checkbox-label`
**Data attrs**: `data-state="checked" \| "unchecked" \| "indeterminate"`, `data-error`, `aria-disabled`

```html
<VuCheckbox v-model="agreed" label="I agree to the terms" />
<VuCheckbox v-model="selectAll" label="Select all" />
```

### `<VuRadioGroup>`

Radio button group.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | — | v-model binding |
| `items` | `Array<string \| { value, label?, disabled? }>` | — | Radio options |
| `defaultValue` | `string` | — | Initial value |
| `label` | `string` | — | Group label |
| `labelVisible` | `boolean` | `true` | Show group label |
| `row` | `boolean` | `false` | Horizontal layout |
| `disabled` | `boolean` | `false` | Disable all items |
| `disabledValues` | `string[]` | — | Specific disabled items |
| `error` | `string \| boolean` | — | Error state / message |
| `verticalMiddle` | `boolean` | `false` | Vertically center radio with label |
| `reverse` | `boolean` | `false` | Label before radio |

**Slots**: `default` (custom item rendering with item bind)
**CSS classes**: `rb-container`, `rb-label`, `rb-root`, `rb-row`, `rb-item-wrapper`, `rb-item`, `rb-item-indicator`, `rb-item-label`
**Data attrs**: `data-state`, `data-disabled`

```html
<!-- String items -->
<VuRadioGroup v-model="size" label="Size" :items="['Small', 'Medium', 'Large']" />

<!-- Object items with disabled -->
<VuRadioGroup
  v-model="plan"
  label="Plan"
  :items="[
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise', disabled: true },
  ]"
/>

<!-- Horizontal layout -->
<VuRadioGroup v-model="align" :items="['Left', 'Center', 'Right']" row />
```

### `<VuSlider>`

Range slider.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number[]` | — | v-model binding (array for range) |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `disabled` | `boolean` | `false` | Disabled state |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider direction |
| `thumbs` | `number` | `1` | Number of thumbs |
| `labels` | `string[]` | — | Labels for thumbs |
| `label` | `string` | — | Overall label |
| `displayValue` | `boolean` | `false` | Show current value |
| `hideRange` | `boolean` | `false` | Hide the colored range track |

**Slots**: `default` (custom thumb rendering)
**CSS classes**: `slider`, `slider-track`, `slider-range`, `slider-thumb`

```html
<!-- Basic slider -->
<VuSlider v-model="volume" :min="0" :max="100" label="Volume" />

<!-- Range slider (two thumbs) -->
<VuSlider v-model="priceRange" :min="0" :max="1000" :thumbs="2" label="Price Range" />
```

### `<VuDatePicker>`

Date picker with calendar popup.

Composed from: `DatePickerBase`, `DatePickerInner`, `DatePickerPopup`.

```html
<VuDatePicker v-model="date" label="Start Date" />
```

Uses `@internationalized/date` for date handling.

## Common patterns

### Pattern: Form with validation

```html
<form @submit.prevent="submit" class="flex flex-col gap-$m">
  <VuInput v-model="name" label="Name" required :error="errors.name" />
  <VuInput v-model="email" label="Email" required :error="errors.email" />

  <VuInput label="Role">
    <VuSelect v-model="role" :items="roles" />
  </VuInput>

  <VuCheckbox v-model="terms" label="I agree to the terms" :error="errors.terms" />

  <VuButton label="Submit" class="scope-primary c8-filled" type="submit" />
</form>
```

### Pattern: Select inside Input wrapper

`VuSelect` should be wrapped in `VuInput` for labels and design consistency:

```html
<VuInput label="Country" design="filled" :error="countryError">
  <VuSelect v-model="country" :items="countries" />
</VuInput>
```

### Pattern: Input with prefix/suffix slots

```html
<VuInput v-model="price" label="Price" design="filled">
  <template #prepend>$</template>
  <template #append>.00</template>
</VuInput>
```

### Pattern: Segmented input group

Use the `segmented` class to visually join adjacent inputs:

```html
<div class="segmented">
  <VuInput v-model="firstName" label="First Name" />
  <VuInput v-model="lastName" label="Last Name" />
</div>
```

## Integration

- Form components use `i8-*` shortcuts for styling. Override through `vunorShortcuts()` (see [shortcuts.md](shortcuts.md)).
- Error states set `data-error` attribute and apply error color scoping automatically.
- The `design` prop maps to `i8-flat`, `i8-filled`, or `i8-round` CSS classes.
- Combobox combines Input and Select functionality — it renders an `i8` wrapper with a dropdown popup.

## Best practices

- Wrap `VuSelect` inside `VuInput` for consistent label/error handling.
- Use `design` prop consistently across a form — mixing designs looks inconsistent.
- Pass error messages as strings (not just `true`) to display the error text below the input.
- Use `autoGrow` on textarea inputs for better UX — it expands as the user types.
- For multi-select Combobox, enable `checkboxItems` to make selection state obvious.

## Gotchas

- `VuCheckbox` uses `data-state="checked"` / `"unchecked"` / `"indeterminate"` — not the `:checked` CSS pseudo-class.
- `VuSelect` popup portals to `<body>`. Scope CSS selectors to `.select-content` to target it.
- Reka UI renders hidden native `<select>/<option>` for form submission alongside the custom UI. `[role="option"]` matches both — use `div[role="option"]` within `.select-content` for the visible options.
- `disabled` renders as `aria-disabled="true"`, not the HTML `disabled` attribute. Use `[aria-disabled="true"]` in CSS selectors.
- `required` renders as `aria-required="true"`, not the HTML `required` attribute.
- Input `type` prop accepts `'text'` or `'textarea'` — for HTML input types like `'password'` or `'email'`, pass them through the native attrs.
- The `modelValue` for `VuSlider` is always an array, even for a single thumb.
