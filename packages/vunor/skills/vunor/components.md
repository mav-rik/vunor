# Components overview — vunor

> Layout, action, feedback, and utility components: Card, Dialog, Button, Tabs, Menu, Popover, AppLayout, Icon, Loading, etc.

## Concepts

Vunor ships 30+ accessible Vue 3 components built on Reka UI. All use the `Vu` prefix in templates (`<VuButton>`, `<VuCard>`). Source files omit the prefix (`Button.vue`, `Card.vue`).

Components are styled entirely through UnoCSS shortcuts and CSS custom properties — no scoped styles. Override any component's appearance through the shortcut object system (see [shortcuts.md](shortcuts.md)).

### Auto-import

- **Vite**: Use `VunorVueResolver` with `unplugin-vue-components` — no manual imports needed.
- **Nuxt**: The `vunor/nuxt` module auto-registers all `Vu*` components globally.
- **Manual**: `import VuButton from 'vunor/Button'`

### Reka UI foundation

All interactive components wrap Reka UI primitives, providing:
- Full keyboard navigation and ARIA attributes
- Polymorphic rendering via `as` / `asChild` props
- Portal rendering for popups/dialogs
- State management (`data-state="checked"`, `aria-disabled="true"`, etc.)

### Provide/Inject (PI) pattern

Some components use typed provide/inject for parent-child communication via `useProvideInject`:

```ts
// Parent calls: useInputPi().provide()
// Child calls:  useInputPi().inject(focused)
```

Components with PI: **Input** (tracks focused state across input groups), **Card** (passes header level to CardHeader).

## API Reference

### Layout components

#### `<VuCard>`

Card container with typography-driven spacing.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | `string` | — | Typography level for spacing: `'h1'`–`'h6'`, `'body'`, `'callout'`, etc. |
| `dense` | `boolean` | `false` | Reduce padding to 60% |
| `rounded` | `boolean` | `true` | Apply border radius |
| `noPadding` | `boolean` | `false` | Remove all padding |
| `as` | `string` | `'div'` | HTML element to render as |
| `asChild` | `boolean` | `false` | Render as child element (Reka UI polymorphic) |

**Slots**: `default`

**CSS classes**: `card`, `card-dense`
**Data attrs**: `data-rounded`, `data-dense`, `data-level`

```html
<VuCard level="h3">
  <VuCardHeader>Section Title</VuCardHeader>
  <p>Card content with h3-proportional padding</p>
</VuCard>
```

#### `<VuCardHeader>`

Header inside a card. Automatically adapts typography level from parent Card's PI.

**Slots**: `default`
**CSS classes**: `card-header`

#### `<VuCardInner>`

Nested card section for visual grouping within a card.

**Slots**: `default`

#### `<VuDialog>`

Modal dialog with overlay.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | v-model for open state |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `modal` | `boolean` | `true` | Modal behavior |
| `title` | `string` | — | Dialog title |
| `level` | `string` | `'h4'` | Typography level for title |
| `rounded` | `boolean` | `true` | Apply border radius |
| `closeButton` | `boolean` | `true` | Show close button |
| `footerButtons` | `Array` | — | Footer action buttons |
| `focusFirstSelector` | `string` | `'input'` | CSS selector for initial focus |

**Emits**: `footer-click`, `footer-click-{buttonId}`
**Slots**: `header`, `title`, `default`, `footer`
**CSS classes**: `dialog-overlay`, `dialog-card`, `dialog-header`, `dialog-title`, `dialog-close`, `dialog-footer`

```html
<VuDialog v-model:open="showDialog" title="Confirm">
  <p>Are you sure?</p>
  <template #footer>
    <VuButton class="scope-primary c8-filled" @click="confirm">Yes</VuButton>
  </template>
</VuDialog>
```

#### `<VuTabs>`

Tabbed content panels.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `Array<{ value, label?, icon? }>` | — | Tab definitions |
| `modelValue` | `string` | — | v-model for active tab |
| `defaultValue` | `string` | — | Initial active tab |
| `activationMode` | `'automatic' \| 'manual'` | `'automatic'` | Tab activation mode |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Tab list direction |
| `indicator` | `boolean` | `true` | Show active tab indicator |
| `noContent` | `boolean` | `false` | Hide content panels |
| `tabGrow` | `boolean` | `false` | Tabs fill available width |
| `tabClass` | `string` | `'c8-flat'` | CSS class for tab triggers |

**Slots**: `default` (custom tab trigger), named slots per `tab.value` for content
**CSS classes**: `tabs-indicator`, `tab`

```html
<VuTabs :tabs="[{ value: 'a', label: 'Tab A' }, { value: 'b', label: 'Tab B' }]">
  <template #a>Content A</template>
  <template #b>Content B</template>
</VuTabs>
```

#### `<VuPopover>`

Floating popover anchored to a trigger element. Wraps Reka UI PopoverRoot.

**Slots**: `default` (trigger), popover content slot
**CSS classes**: Uses Reka UI PopoverPortal for rendering.

#### `<VuAppLayout>`

App shell with header, sidebar, and footer slots.

**CSS variables**: `--app-footer-h`, `--app-header-h`, `--app-left-w`, `--app-right-w`, `--app-max-w`

### Action components

#### `<VuButton>`

Button with icon, loading, and link support.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Button text |
| `icon` | `string` | — | Icon name (UnoCSS icon class) |
| `iconSide` | `'left' \| 'right'` | `'left'` | Icon position |
| `loading` | `boolean` | `false` | Show loading indicator |
| `disabled` | `boolean` | `false` | Disable button |
| `active` | `boolean` | `false` | Active state |
| `pressed` | `boolean` | `false` | Pressed state |
| `selected` | `boolean` | `false` | Selected state |
| `to` | `RouteLocationRaw` | — | Vue Router link target |
| `asLink` | `boolean` | `false` | Render as `<a>` |

**Slots**: `default`, `icon-left`, `icon-right`
**CSS classes**: `btn`, `btn-round`, `btn-square`, `btn-icon`, `btn-label`

```html
<!-- Basic -->
<VuButton label="Save" class="scope-primary c8-filled" />

<!-- With icon -->
<VuButton icon="i-mdi-check" label="Confirm" class="scope-good c8-filled" />

<!-- Icon-only (square) -->
<VuButton icon="i-mdi-close" class="scope-error c8-flat" />

<!-- As router link -->
<VuButton label="Go Home" :to="{ name: 'home' }" class="c8-flat" />

<!-- Loading state -->
<VuButton label="Saving..." :loading="isSaving" class="scope-primary c8-filled" />
```

#### `<VuMenu>`

Navigation / command menu built on Reka UI ComboboxRoot. Supports search filtering and grouping.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<string \| TItem>` | — | Menu items |
| `emptyText` | `string` | — | Text when no items match |

`TItem`: `{ label, value, icon?, group? }`

**Slots**: `empty`, `item`
**CSS classes**: `menu-root`, `menu-item`

#### `<VuMenuItem>`

Individual menu item.

#### `<VuPagination>`

Page navigation component.

### Feedback components

#### `<VuAppToasts>`

Toast notification container. Place once at app root.

**CSS classes**: `toast-root`, `toasts-viewport`

#### `<VuProgressBar>`

Progress bar indicator.

**CSS classes**: `progress-bar`

#### `<VuLoadingIndicator>`

Circular loading spinner.

**CSS classes**: `loading-indicator`, `loading-indicator-ring`

#### `<VuInnerLoading>`

Overlay loading indicator within a container.

**CSS classes**: `inner-loading`, `loading-indicator-wrapper`

```html
<div class="relative">
  <p>Content</p>
  <VuInnerLoading v-if="loading" />
</div>
```

### Utility components

#### `<VuIcon>`

Icon display using UnoCSS icon classes.

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Icon class name (e.g. `'i-mdi-check'`) |

**CSS classes**: `icon-color`, `icon-size`

```html
<VuIcon name="i-mdi-check" />
```

#### `<VuOverflowContainer>`

Handles content overflow with scroll indicators.

#### `<VuCalendar>`

Standalone calendar grid (used internally by DatePicker).

**CSS classes**: `calendar-root`, `calendar-header`, `calendar-month-grid`, `calendar-grid-row`, `calendar-cell`

## Common patterns

### Pattern: Scoped button group

```html
<div class="scope-primary flex gap-$xs">
  <VuButton label="Save" class="c8-filled" />
  <VuButton label="Draft" class="c8-outlined" />
  <VuButton label="Cancel" class="c8-flat" />
</div>
```

### Pattern: Dialog with footer buttons

```html
<VuDialog
  v-model:open="showConfirm"
  title="Delete Item?"
  :footer-buttons="['cancel', { id: 'delete', label: 'Delete', class: 'scope-error c8-filled' }]"
  @footer-click-delete="handleDelete"
>
  <p>This action cannot be undone.</p>
</VuDialog>
```

### Pattern: Card with nested sections

```html
<VuCard level="h3">
  <VuCardHeader>User Profile</VuCardHeader>
  <VuCardInner>
    <VuCardHeader>Personal Info</VuCardHeader>
    <p>Name, email, etc.</p>
  </VuCardInner>
  <VuCardInner>
    <VuCardHeader>Preferences</VuCardHeader>
    <p>Settings...</p>
  </VuCardInner>
</VuCard>
```

## Best practices

- Always set `scope-{color}` on or above interactive components — `c8-*` styles rely on it for coloring.
- Use the `level` prop on `VuCard` to get typography-proportional padding.
- Place `<VuAppToasts>` once at the app root, not inside conditional renders.
- For loading states, use `VuInnerLoading` inside a `relative`-positioned container — it uses `absolute` positioning internally.

## Gotchas

- Reka UI uses `aria-disabled="true"` instead of the HTML `disabled` attribute. Check `aria-disabled` in selectors, not `disabled`.
- Reka UI uses `data-state="checked"` / `"unchecked"` / `"indeterminate"` for state, not `:checked` pseudo-class.
- Select/Combobox popups portal to `<body>` — scope CSS selectors to `.select-content` to target them.
- Reka UI renders hidden native `<select>/<option>` for form submission. `getByRole('option')` matches both native and custom options — scope to `div[role="option"]` within the popup.
- `VuButton` with a `to` prop renders as a router link. It does not render a `<button>` element in that case.
