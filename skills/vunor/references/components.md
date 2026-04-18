# Components — Vunor

Non-form components: layout, action, feedback, utility. For form components see [forms.md](forms.md). For card-specific guidance see [cards.md](cards.md). All components use the `Vu` prefix in templates.

## Conventions

- All interactive components wrap **Reka UI** primitives — full keyboard navigation and ARIA out of the box.
- Polymorphic via `as` / `asChild` props (Reka UI `<Primitive>`).
- Auto-imported when `VunorVueResolver` (Vite) or `vunor/nuxt` module is configured. Manual import: `import VuButton from 'vunor/Button'`.
- Styling is done through CSS classes. To restyle, override the underlying shortcut via `vunorShortcuts(overrides)` — see [shortcuts.md](shortcuts.md).
- State uses `aria-disabled`, `aria-pressed`, `aria-selected`, `data-state="checked|unchecked|indeterminate"`, `data-active`, `data-highlighted`, **not** the HTML `disabled` attribute or `:checked` pseudo-class. Selectors and overrides must use the data/aria attributes.

## Layout

### `<VuAppLayout>`

App shell with header, sidebar (left/right), main, footer slots. Sets `--app-max-w`, `--app-header-h`, `--app-footer-h`, `--app-left-w`, `--app-right-w`.

| Prop | Default | Effect |
|------|---------|--------|
| `maxW` | `'90rem'` | Max width of the inner content rails |
| `header` / `footer` / `left` / `right` | `false` | Mount the corresponding slot |
| `headerH` / `footerH` | `'3rem'` | Heights when slot mounted |
| `leftW` / `rightW` | `'14rem'` | Side panel widths |
| `headerClass` / `footerClass` / `leftClass` / `rightClass` / `mainClass` | — | Class on each region wrapper |
| `scrollTopOnChangeView` | `false` | Auto-scroll main to top when its child swaps |

Slots: `header`, `footer`, `left`, `right`, `default` (main content).

```html
<VuAppLayout header left>
  <template #header>…</template>
  <template #left>
    <VuMenu :items="navItems" v-model="route" />
  </template>
  <RouterView />
</VuAppLayout>
```

### `<VuCard>`, `<VuCardHeader>`, `<VuCardInner>`

See [cards.md](cards.md) for full reference.

### `<VuDialog>`

Modal dialog built on Reka UI Dialog. Portals to `<body>`.

| Prop | Default | Effect |
|------|---------|--------|
| `open` | — | v-model for open state |
| `defaultOpen` | `false` | Initial open state |
| `modal` | `true` | Modal behavior (blocks underneath, focus trap) |
| `title` | — | Header title |
| `level` | `'h4'` | Typography level for the title (also drives card spacing) |
| `rounded` | `true` | Apply rounded corners |
| `closeButton` | `true` | Show the X button |
| `footerButtons` | — | `Array<string \| { id, label, class? }>` for built-in footer |
| `focusFirstSelector` | `'input'` | CSS selector for initial focus |

Emits: `footer-click`, `footer-click-{id}`, `update:open`.
Slots: `header`, `title`, `default`, `footer`.
CSS classes: `dialog-overlay`, `dialog-card`, `dialog-header`, `dialog-title`, `dialog-close`, `dialog-footer`.

```html
<VuDialog v-model:open="show" title="Confirm" :footer-buttons="['cancel', { id: 'ok', label: 'OK', class: 'scope-primary c8-filled' }]"
          @footer-click-ok="confirm">
  <p>Are you sure?</p>
</VuDialog>
```

### `<VuTabs>`

Reka UI Tabs with Vunor styling.

| Prop | Default | Effect |
|------|---------|--------|
| `tabs` | — | `Array<{ value, label?, icon? }>` |
| `modelValue` | — | v-model for active tab |
| `defaultValue` | — | Initial active tab |
| `activationMode` | `'automatic'` | `automatic` activates on focus, `manual` only on click |
| `orientation` | `'horizontal'` | or `'vertical'` |
| `indicator` | `true` | Show animated active indicator |
| `noContent` | `false` | Hide content panels (use externally) |
| `tabGrow` | `false` | Tabs fill available width |
| `tabClass` | `'c8-flat'` | Class for each tab trigger |
| `tabsListClass` | `'flex relative'` | Class for the list wrapper |

Slots: `default` (custom trigger renderer), one slot per `tab.value` for content.
CSS classes: `tabs-indicator`, `tab`.

```html
<VuTabs v-model="active"
        :tabs="[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]">
  <template #a>Content A</template>
  <template #b>Content B</template>
</VuTabs>
```

### `<VuPopover>`

Reka UI Popover wrapped with Vunor styling. Portals to `<body>`. Use the `default` slot for the trigger and named content slot for the popover body.

## Action

### `<VuButton>`

Button with icon, loading, link, and active/pressed/selected states.

| Prop | Type | Default | Effect |
|------|------|---------|--------|
| `label` | string | — | Text label (renders inside `.btn-label`) |
| `icon` | string | — | Icon class name (e.g. `'i-mdi-check'`) |
| `iconSide` | `'left' \| 'right'` | `'left'` | Icon position |
| `loading` | boolean | `false` | Show loading spinner, disable pointer |
| `disabled` | boolean | `false` | Disabled |
| `active` | boolean | `false` | Sets `data-active` (used by tabs/segmented) |
| `pressed` | boolean | — | Sets `aria-pressed` (toggle button) |
| `selected` | boolean | — | Sets `aria-selected` (selectable item) |
| `to` | RouteLocationRaw | — | Renders as `<router-link>` (Vue Router) |
| `asLink` | boolean | `false` | Render as `<a>` instead of `<button>` |

Slots: `default` (overrides label), `icon-left`, `icon-right`.
CSS classes: `btn`, `btn-round`, `btn-square`, `btn-icon`, `btn-label`.

`<VuButton>` does **not** prescribe a c8 variant — pair it with `c8-filled`/`c8-flat`/`c8-outlined`/`c8-light`/`c8-chrome` and a `scope-*`.

```html
<VuButton class="scope-primary c8-filled" label="Save" icon="i-mdi-check" />
<VuButton class="c8-flat" label="Cancel" />
<VuButton class="c8-chrome" label="Cancel" />          <!-- neutral chrome action, stays neutral in any scope -->
<VuButton class="scope-error c8-outlined btn-square btn-round" icon="i-mdi-close" />  <!-- icon-only round -->
<VuButton class="c8-flat" label="Profile" :to="{ name: 'profile' }" />                <!-- router link -->
<VuButton class="scope-primary c8-filled" label="Saving" :loading="busy" />
```

### `<VuMenu>`

Searchable menu / command palette built on Reka UI Combobox. Always-open when used as a sidebar; use inside `<VuPopover>` for command-palette behavior.

| Prop | Type | Effect |
|------|------|--------|
| `items` | `Array<string \| TItem>` | Menu items; `TItem = { label, value, icon?, group? }` |
| `emptyText` | string | Text when no items match |
| `modelValue` | any | v-model for selected value |

Slots: `empty`, `item`.

```html
<VuMenu v-model="route" :items="[
  { label: 'Home',     value: '/',     icon: 'i-mdi-home',  group: 'Main' },
  { label: 'Profile',  value: '/me',   icon: 'i-mdi-account', group: 'Main' },
  { label: 'Settings', value: '/cfg',  icon: 'i-mdi-cog',   group: 'Other' },
]" />
```

### `<VuMenuItem>`

Single menu row used internally by `<VuMenu>`. Reuse it when building custom menus that need consistent visuals.

### `<VuPagination>`

Page navigation. Pass current page and total via props (see component types). Uses `c8-flat` for page links.

## Feedback

### `<VuAppToasts>`

Reka UI Toast viewport. Place once at the app root (typically inside `<VuAppLayout>`).

```html
<VuAppLayout header>
  …
  <VuAppToasts />
</VuAppLayout>
```

Trigger toasts via the helper exposed in `vunor/AppToasts/app-toasts` (re-exported from `vunor`).

### `<VuProgressBar>`

Progress indicator. Pass `value` (0–100). Class `progress-bar` is the bar; the wrapper takes layout classes.

```html
<VuProgressBar :value="percent" class="w-full" />
```

### `<VuLoadingIndicator>`

Spinner. Used inside `<VuButton loading>` automatically. CSS classes: `loading-indicator`, `loading-indicator-ring`.

```html
<VuLoadingIndicator />
```

### `<VuInnerLoading>`

Overlay spinner that absolutely positions inside a `relative` ancestor. Use to indicate loading on cards / sections.

```html
<VuCard level="h3" class="relative" rounded>
  …
  <VuInnerLoading v-if="busy" />
</VuCard>
```

## Utility

### `<VuIcon>`

Renders a UnoCSS icon class.

| Prop | Type | Effect |
|------|------|--------|
| `name` | string | Icon class name (e.g. `'i-mdi-check'`, `'i-lucide-arrow-right'`) |

Includes `icon-color icon-size` automatically. Tweak size with `class="icon-size-[1.5em]"` or by setting `--icon-size` on an ancestor.

```html
<VuIcon name="i-mdi-check" />
<VuIcon name="i-lucide-arrow-right" class="icon-size-[1.25em]" />
```

### `<VuLabel>`

Form label component. Used internally by `<VuInput>` for stack-label mode; reuse it for standalone labels.

### `<VuOverflowContainer>`

Container that handles overflow with scroll indicators. Useful for horizontal toolbars / tab strips.

### `<VuCalendar>`

Standalone calendar grid (Reka UI Calendar). Used internally by `<VuDatePicker>`. Use directly when you need an inline calendar without the input field.

CSS classes: `calendar-root`, `calendar-header`, `calendar-month-grid`, `calendar-grid-row`, `calendar-cell`.

### `<VuDevTools>`

Floating panel that lets you tune the palette interactively (saturation, vividness, flatness, layersDepth, lightest/darkest, surfaces) and copy the resulting `presetVunor` config. Drop into a dev-only route.

### `<VuDelayedSwitch>`

Renders one of two slots after a configurable delay. Useful for "show loading after 200ms" patterns.

## Common patterns

### Page shell with toasts

```html
<VuAppLayout header left>
  <template #header>
    <h1 class="text-h5">My App</h1>
    <div class="flex gap-$xs">
      <VuButton class="c8-flat" icon="i-mdi-bell" />
      <VuButton class="scope-primary c8-filled" label="New" icon="i-mdi-plus" />
    </div>
  </template>
  <template #left>
    <VuMenu v-model="route" :items="nav" />
  </template>
  <RouterView />
  <VuAppToasts />
</VuAppLayout>
```

### Confirm dialog with footer buttons

```html
<VuDialog v-model:open="show" title="Delete item?"
          :footer-buttons="[
            'cancel',
            { id: 'delete', label: 'Delete', class: 'scope-error c8-filled' },
          ]"
          @footer-click-delete="onDelete">
  <p class="text-mb-0">This action cannot be undone.</p>
</VuDialog>
```

### Tab strip filling its container

```html
<VuTabs v-model="filter" tab-grow
        :tabs="[
          { value: 'all',    label: 'All' },
          { value: 'active', label: 'Active' },
          { value: 'done',   label: 'Done' },
        ]" />
```

## Gotchas

- Reka UI uses ARIA + data attributes for state, not the HTML attributes you might reach for. Use `[aria-disabled="true"]`, `[data-state="checked"]`, `[data-active]` in custom selectors.
- Dialog/Popover/Select popups portal to `<body>`. They inherit the `:root` scope (preflight installs `scope-neutral`). To paint them with a different palette, set the popup's `popupClass` / class to include `scope-…`.
- `<VuButton>` with `to` renders as a router link. The element is `<a>`, not `<button>`. Use `aria-pressed`/`aria-selected` for state on the link.
- `<VuAppToasts>` must be mounted exactly once and outside conditional renders — Reka UI manages portal singleton state.
- `<VuInnerLoading>` uses `absolute` positioning; the parent must be `relative` (or have an explicit stacking context) for it to overlay correctly.
- `<VuMenu>` is built on `ComboboxRoot` and renders its own `[role="listbox"]`. When writing tests, scope sidebar selectors to `nav` / `aside` to avoid matching popups elsewhere.
