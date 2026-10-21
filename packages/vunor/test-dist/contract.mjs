// The forwarding contract of vunor components, checked against the built dist/ by
// mount-dist.mjs (in the production and the development Vue runtime).
//
// A vunor component that wraps another component (a Reka root, or another vunor
// component) must pass every prop and emit of the wrapped component through: each
// one is either declared and forwarded, or reaches it by attribute fallthrough, or
// is listed in `exclude` below with the reason it is not part of the vunor API.
//
// `unobservable` lists forwarded props the test DOM cannot observe on the wrapped
// component, with the check that covers them instead.
//
// The props and emits are NOT listed here: they are read from the wrapped
// component's runtime definition, so a prop added in a future Reka release fails
// the check until it is forwarded or excluded.

/** Shared exclusion reasons */
const LAYOUT_AS_CHILD = 'layout-controlled: the wrapper sets as-child / the element itself'
const DATE_PICKER_PLACEHOLDER =
  'name clash: `placeholder` is the input placeholder text on vunor inputs; ' +
  'use `defaultPlaceholder` for the initially shown month (`@update:placeholder` is forwarded)'

const POPUP_POSITIONING =
  'popup positioning beyond the documented popup props is not exposed: Reka defaults apply'
const POPUP_EVENTS = 'popup dismissal events are not exposed: the popup closes through v-model:open'
const DATE_PICKER_CONTENT =
  'VuDatePicker / VuDatePickerBase do not expose the popup content props (Reka defaults ' +
  'apply); VuDatePickerPopup forwards them when it is composed directly'
const CONTROLLED_MOUNT = 'the wrapper controls mounting'
const noop = () => undefined
const OPEN = { 'open': true, 'onUpdate:open': noop }

/** `{ key: reason }` for several keys */
const excluded = (keys, reason) => Object.fromEntries(keys.map(key => [key, reason]))

const POPPER_REST = [
  'sideFlip',
  'alignOffset',
  'alignFlip',
  'avoidCollisions',
  'collisionBoundary',
  'collisionPadding',
  'arrowPadding',
  'hideShiftedArrow',
  'hideWhenDetached',
  'positionStrategy',
  'disableUpdateOnLayoutShift',
  'prioritizePosition',
  'reference',
  'disableOutsidePointerEvents',
]

/** Select popup: vunor maps popupPosition, side, sideOffset, sticky, updatePositionStrategy */
const selectContentTarget = {
  root: 'SelectContent',
  props: OPEN,
  alias: { position: 'popupPosition' },
  exclude: {
    forceMount: CONTROLLED_MOUNT,
    as: LAYOUT_AS_CHILD,
    asChild: LAYOUT_AS_CHILD,
    ...excluded(['bodyLock', 'align', ...POPPER_REST], POPUP_POSITIONING),
    ...excluded(['closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside'], POPUP_EVENTS),
  },
}

const datePickerContentTarget = {
  root: 'DatePickerContent',
  props: OPEN,
  exclude: {
    as: LAYOUT_AS_CHILD,
    asChild: LAYOUT_AS_CHILD,
    ...excluded(
      [
        'portal',
        'forceMount',
        'side',
        'sideOffset',
        'align',
        'sticky',
        'updatePositionStrategy',
        ...POPPER_REST,
        'escapeKeyDown',
        'pointerDownOutside',
        'focusOutside',
        'interactOutside',
        'openAutoFocus',
        'closeAutoFocus',
      ],
      DATE_PICKER_CONTENT
    ),
  },
}

/**
 * @typedef {object} TTarget
 * @property {string} root Reka export name, or `vunor/<Name>` for a vunor component
 * @property {Record<string, unknown>} [props] props needed to render the target
 * @property {Record<string, string>} [exclude] prop/emit name -> reason it is not forwarded
 * @property {Record<string, string>} [unobservable] forwarded, but not observable here -> why, and what covers it
 * @property {Record<string, string>} [alias] root prop -> the wrapper prop that sets it
 * @property {Record<string, string>} [selfManaged] `defaultX` the wrapper applies itself -> how
 */

/**
 * @typedef {object} TWrapper
 * @property {Record<string, unknown>} [props] props needed to render the wrapper
 * @property {string} [wrap] component the wrapper must be nested in (Reka export or `vunor/<Name>`)
 * @property {boolean} [slot] render default slot content (as-child roots need a child)
 * @property {Record<string, unknown>} [wrapProps]
 * @property {TTarget[]} targets
 */

/** @type {Record<string, TWrapper>} */
export const wrappers = {
  AppToasts: {
    targets: [
      { root: 'ToastProvider' },
      {
        root: 'ToastViewport',
        exclude: {
          label: "on VuAppToasts `label` is ToastProvider's label (the toasts' announcement)",
          as: LAYOUT_AS_CHILD,
          asChild: LAYOUT_AS_CHILD,
        },
      },
    ],
  },
  Button: { props: { label: 'x' }, targets: [{ root: 'vunor/ButtonBase' }] },
  ButtonBase: { props: { label: 'x' }, targets: [{ root: 'Primitive' }] },
  Calendar: {
    targets: [{ root: 'CalendarRoot', exclude: { as: LAYOUT_AS_CHILD, asChild: LAYOUT_AS_CHILD } }],
  },
  Card: { slot: true, targets: [{ root: 'Primitive' }] },
  CardHeader: { wrap: 'vunor/Card', slot: true, targets: [{ root: 'Primitive' }] },
  CardInner: { wrap: 'vunor/Card', slot: true, targets: [{ root: 'Primitive' }] },
  Checkbox: {
    props: { label: 'x' },
    targets: [{ root: 'CheckboxRoot', exclude: { as: LAYOUT_AS_CHILD, asChild: LAYOUT_AS_CHILD } }],
  },
  Combobox: {
    props: { items: ['a', 'b'] },
    targets: [
      {
        root: 'ComboboxRoot',
        exclude: {
          as: LAYOUT_AS_CHILD,
          asChild: LAYOUT_AS_CHILD,
          disabled:
            'a disabled (or readonly) VuCombobox renders a read-only input instead of ' +
            'ComboboxRoot (covered by the Combobox[disabled] attrs case)',
        },
        unobservable: {
          multiple:
            'bound explicitly; with `multiple` ComboboxRoot lives in the popover, which ' +
            'happy-dom closes on mount (covered by the Combobox[multiple] attrs case and ' +
            'the "Combobox multiple" behaviour case)',
        },
      },
      {
        root: 'ComboboxContent',
        props: OPEN,
        alias: { position: 'popupPosition' },
        exclude: {
          forceMount: CONTROLLED_MOUNT,
          as: LAYOUT_AS_CHILD,
          asChild: LAYOUT_AS_CHILD,
          ...excluded(['hideWhenEmpty', ...POPPER_REST], POPUP_POSITIONING),
          ...excluded(
            ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside'],
            POPUP_EVENTS
          ),
        },
      },
    ],
  },
  DatePicker: {
    targets: [
      {
        root: 'DatePickerRoot',
        exclude: {
          placeholder: DATE_PICKER_PLACEHOLDER,
          // older Reka 2.x releases declare these on DatePickerRoot
          as: LAYOUT_AS_CHILD,
          asChild: LAYOUT_AS_CHILD,
        },
      },
      datePickerContentTarget,
    ],
  },
  DatePickerBase: {
    targets: [
      {
        root: 'DatePickerRoot',
        exclude: {
          placeholder: DATE_PICKER_PLACEHOLDER,
          // older Reka 2.x releases declare these on DatePickerRoot
          as: LAYOUT_AS_CHILD,
          asChild: LAYOUT_AS_CHILD,
        },
      },
      datePickerContentTarget,
    ],
  },
  DatePickerPopup: {
    wrap: 'DatePickerRoot',
    wrapProps: { open: true },
    targets: [
      { root: 'DatePickerContent', exclude: { as: LAYOUT_AS_CHILD, asChild: LAYOUT_AS_CHILD } },
    ],
  },
  Dialog: {
    props: { title: 't' },
    targets: [
      {
        root: 'DialogRoot',
        exclude: {
          defaultOpen:
            'VuDialog keeps DialogRoot controlled (it delays closing for the animation) and ' +
            'applies default-open through its own open state (model-state and behaviour cases)',
          modal:
            'VuDialog is always modal; its own `modal` prop only styles the overlay as a backdrop',
        },
      },
      {
        root: 'DialogContent',
        props: OPEN,
        exclude: {
          as: LAYOUT_AS_CHILD,
          asChild: LAYOUT_AS_CHILD,
          forceMount:
            'VuDialog controls mounting itself (it keeps the card for the closing animation)',
        },
      },
      {
        root: 'DialogOverlay',
        props: OPEN,
        exclude: {
          forceMount: CONTROLLED_MOUNT,
          as: LAYOUT_AS_CHILD,
          asChild: LAYOUT_AS_CHILD,
        },
      },
    ],
  },
  InputBase: { targets: [{ root: 'Primitive' }] },
  Menu: {
    props: { items: ['a', 'b'] },
    targets: [
      {
        root: 'ComboboxRoot',
        exclude: {
          open: 'VuMenu is an always-open list (it binds open=true)',
          modelValue:
            "VuMenu's v-model is the picked item; ComboboxRoot's own model is reset after each pick",
          asChild: 'VuMenu renders the list element itself',
        },
      },
    ],
  },
  MenuItem: {
    props: { label: 'x' },
    targets: [
      {
        root: 'vunor/Button',
        exclude: {
          class: "merged with VuMenuItem's own classes (covered by the attrs check)",
          style: 'covered by the attrs check (style merges into the root element)',
        },
      },
    ],
  },
  OverflowContainer: {
    props: { items: ['a', 'b'] },
    targets: [
      {
        root: 'Primitive',
        exclude: { asChild: 'VuOverflowContainer measures the children of its own element' },
      },
    ],
  },
  Pagination: { props: { total: 50 }, targets: [{ root: 'PaginationRoot' }] },
  Popover: {
    targets: [
      { root: 'PopoverRoot' },
      {
        root: 'PopoverContent',
        props: OPEN,
        exclude: { as: LAYOUT_AS_CHILD, asChild: LAYOUT_AS_CHILD },
      },
    ],
  },
  ProgressBar: { props: { modelValue: 50 }, targets: [{ root: 'ProgressRoot' }] },
  RadioGroup: {
    props: { items: ['a', 'b'] },
    targets: [
      { root: 'RadioGroupRoot', exclude: { as: LAYOUT_AS_CHILD, asChild: LAYOUT_AS_CHILD } },
    ],
  },
  Select: {
    props: { items: ['a', 'b'] },
    targets: [{ root: 'SelectRoot' }, selectContentTarget],
  },
  SelectBase: {
    props: { items: ['a', 'b'] },
    targets: [{ root: 'SelectRoot' }, selectContentTarget],
  },
  Slider: { props: { modelValue: [10] }, targets: [{ root: 'SliderRoot' }] },
  Tabs: { props: { tabs: [{ value: 'a' }, { value: 'b' }] }, targets: [{ root: 'TabsRoot' }] },
}

const day = (h, y, m, d) => h.date(y, m, d)
const dateValues = root => ({
  [`${root}.modelValue`]: h => day(h, 2024, 5, 6),
  [`${root}.defaultValue`]: h => day(h, 2024, 5, 7),
  [`${root}.placeholder`]: h => day(h, 2024, 6, 2),
  [`${root}.defaultPlaceholder`]: h => day(h, 2024, 6, 1),
  [`${root}.maxValue`]: h => day(h, 2030, 1, 1),
  [`${root}.minValue`]: h => day(h, 2000, 1, 1),
})

/**
 * Values passed for wrapped-root props, looked up as `<Root>.<prop>` then `<prop>`.
 * Without an entry the value is derived from the prop's runtime type (a flipped
 * boolean default, a function, a number, or a `probe-<prop>` string). A function
 * entry receives helpers (`date(y, m, d)` builds a CalendarDate).
 */
export const values = {
  'dir': 'rtl',
  'orientation': 'vertical',
  'activationMode': 'manual',
  'side': 'top',
  'align': 'end',
  'sticky': 'always',
  'positionStrategy': 'fixed',
  'updatePositionStrategy': 'always',
  'position': 'item-aligned',
  'ComboboxContent.position': 'inline',
  'hotkey': ['KeyQ'],
  'swipeDirection': 'up',
  'thumbAlignment': 'overflow',
  'locale': 'de-DE',
  'hourCycle': 24,
  'granularity': 'minute',
  'weekdayFormat': 'long',
  'weekStartsOn': 1,
  'numberOfMonths': 2,
  'step': { minute: 5 },
  'SliderRoot.step': 5,
  'portal': { to: 'body' },
  'collisionPadding': 3,
  'collisionBoundary': [],
  'reference': {
    getBoundingClientRect: () => ({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }),
  },
  'as': 'section',
  'iconSide': 'right',
  'icon': 'i--x',
  'to': '/probe',
  'max': 200,
  'total': 77,
  'page': 2,
  'defaultPage': 3,
  'itemsPerPage': 5,
  'siblingCount': 2,
  'duration': 1234,
  'swipeThreshold': 77,
  ...dateValues('CalendarRoot'),
  ...dateValues('DatePickerRoot'),
  'SliderRoot.modelValue': [42],
  'SliderRoot.defaultValue': [7],
  'ProgressRoot.modelValue': 33,
  'CheckboxRoot.modelValue': 'indeterminate',
  'CheckboxRoot.defaultValue': true,
  'TabsRoot.modelValue': 'b',
  'TabsRoot.defaultValue': 'b',
  'RadioGroupRoot.modelValue': 'b',
  'RadioGroupRoot.defaultValue': 'b',
}

/**
 * Payloads for wrapped-root emits, looked up as `<Root>.<event>` then `<event>`
 * (default: a unique object). A function entry receives the same helpers as `values`.
 */
export const emitPayloads = {
  'update:open': true,
  'update:page': 4,
  'CheckboxRoot.update:modelValue': true,
  'CalendarRoot.update:modelValue': h => day(h, 2024, 5, 8),
  'CalendarRoot.update:placeholder': h => day(h, 2024, 7, 1),
  'DatePickerRoot.update:modelValue': h => day(h, 2024, 5, 8),
  'DatePickerRoot.update:placeholder': h => day(h, 2024, 7, 1),
}

const BUTTON_ARIA = '`VuButton` renders `aria-pressed` only when `pressed` is passed'
const BUTTON_ATTRS =
  'Button-only props (`active`, `pressed`, `selected`, `asLink`, `to`) no longer appear as DOM attributes'
const BUTTON_DATA_SELECTED = '`selected` now also sets `data-selected`'
const DATE_PICKER_INPUT = '`VuDatePickerBase` renders `VuInputBase`'

/** pin `key` to `to` (a serialized value) and point to the CHANGELOG `text` */
const pin = (to, text) => ({ to, text })
const U = 'undefined'
/** the chevron click reaches the field's own click handler: no separate append handler */
const ONE_TOGGLE = 'One click toggles a popup once'

const buttonAttrs = {
  'ButtonBase[attr].aria-pressed': pin(U, BUTTON_ARIA),
  'ButtonBase[attr].aria-selected': pin(U, BUTTON_ARIA),
  'ButtonBase[attr].active': pin(U, BUTTON_ATTRS),
  'ButtonBase[attr].pressed': pin(U, BUTTON_ATTRS),
  'ButtonBase[attr].selected': pin(U, BUTTON_ATTRS),
  'ButtonBase[attr].asLink': pin(U, BUTTON_ATTRS),
  'ButtonBase[attr].to': pin(U, BUTTON_ATTRS),
  'ButtonBase[attr].style': pin(U, '`VuButton` no longer renders an empty `style=""` attribute'),
}
/** a plain VuButton: neither a toggle nor selectable unless told */
const plainButton = {
  'Button.pressed': pin(U, BUTTON_ARIA),
  'Button.selected': pin(U, BUTTON_ARIA),
}
/** a VuMenuItem passes `selected`: data-selected="false", no aria-selected outside a listbox role */
const menuItemButton = {
  'Button.pressed': pin(U, BUTTON_ARIA),
  'ButtonBase[attr].data-selected': pin('"false"', BUTTON_DATA_SELECTED),
}

/** keys that change in the subtree of a VuDatePickerBase now that its input shell renders */
const datePickerInput = Object.fromEntries(
  Object.entries({
    'DateFieldRoot.placeholder': U,
    'DateFieldRoot.required': U,
    'InputBase.iconAppend': '"i--calendar"',
    'InputBase.onAppendClick': 'function',
    'InputBase.design': '"flat"',
    'InputBase.groupItem': 'false',
    'InputBase.autoGrow': 'false',
    'InputBase.active': 'false',
    'InputBase.loading': 'false',
    'InputBase.noUnderline': 'false',
    'InputBase.rows': '3',
    'InputBase[attr].stackLabel': 'false',
    'InputBase[attr].error': 'false',
    'InputBase[attr].data-has-value': '""',
    'DatePickerInner[attr].type': '"text"',
    'DatePickerInner[attr].rows': '3',
    'DatePickerInner[attr].data-has-prepend': 'false',
    'DatePickerInner[attr].data-has-append': 'true',
    'DatePickerInner[attr].data-has-label': 'false',
    'DatePickerInner[attr].onFocus': 'function',
    'DatePickerInner[attr].onBlur': 'function',
    'DatePickerTrigger.asChild': 'true',
    'PopoverTrigger.asChild': 'true',
    'PopoverTrigger.as': '"button"',
    'PopperAnchor.asChild': 'true',
    'DatePickerField[attr].type': '"text"',
    'DatePickerField[attr].rows': '3',
    'DatePickerField[attr].data-has-prepend': 'false',
    'DatePickerField[attr].data-has-append': 'true',
    'DatePickerField[attr].data-has-label': 'false',
    'DatePickerField[attr].onFocus': 'function',
    'DatePickerField[attr].onBlur': 'function',
    'DateFieldRoot[attr].type': '"text"',
    'DateFieldRoot[attr].rows': '3',
    'DateFieldRoot[attr].data-has-prepend': 'false',
    'DateFieldRoot[attr].data-has-append': 'true',
    'DateFieldRoot[attr].data-has-label': 'false',
    'DateFieldRoot[attr].onFocus': 'function',
    'DateFieldRoot[attr].onBlur': 'function',
    'PopoverTrigger[attr].data-reka-date-field-segment': '"trigger"',
    'PopoverTrigger[attr].disabled': 'false',
    'PopoverTrigger[attr].onFocusin': 'function',
    'PopperAnchor[attr].data-reka-date-field-segment': '"trigger"',
    'PopperAnchor[attr].disabled': 'false',
    'PopperAnchor[attr].onFocusin': 'function',
    'Icon.name': '"i--calendar"',
  }).map(([key, to]) => [key, pin(to, DATE_PICKER_INPUT)])
)
/** the popup is now labelled by the trigger the fixed input shell renders */
const datePickerPopup = {
  'PopperContent[attr].aria-labelledby': pin('"reka-popover-trigger-v-#"', DATE_PICKER_INPUT),
  'Card[attr].aria-labelledby': pin('"reka-popover-trigger-v-#"', DATE_PICKER_INPUT),
  'Card[attr].style': pin(
    JSON.stringify({
      '--reka-popover-content-transform-origin': 'var(--reka-popper-transform-origin)',
      '--reka-popover-content-available-width': 'var(--reka-popper-available-width)',
      '--reka-popover-content-available-height': 'var(--reka-popper-available-height)',
      '--reka-popover-trigger-width': 'var(--reka-popper-anchor-width)',
      '--reka-popover-trigger-height': 'var(--reka-popper-anchor-height)',
    }),
    DATE_PICKER_INPUT
  ),
}

const INVALID_AS_CHILD = 'Removed invalid `as-child` attributes'
/** 0.3.2 passed every VuPopover prop to the popup as attributes; Reka hands them down */
const popoverContentAttrs = Object.fromEntries(
  [
    'PopoverContent',
    'PopoverContentNonModal',
    'PopoverContentImpl',
    'FocusScope',
    'DismissableLayer',
    'PopperContent',
  ].flatMap(name =>
    ['asLink', 'modelValue', 'forceMount'].map(key => [
      `${name}[attr].${key}`,
      pin(U, 'no longer passes its own props to the popup'),
    ])
  )
)
const COMBOBOX_GROUP_ITEM = '`VuCombobox` with `groupItem`'
const DEFAULT_OPEN = '`default-open` works on'
/** the open model stays undefined (uncontrolled) when not bound, so default-open applies */
const uncontrolledOpen = root => ({ [`${root}.open`]: pin(U, DEFAULT_OPEN) })
/** groupItem: the as-child ComboboxRoot now merges into the input instead of a hidden node */
const comboboxGroupItem = {
  'ComboboxRoot[attr].class': pin(U, COMBOBOX_GROUP_ITEM),
  'PopperRoot[attr].class': pin(U, COMBOBOX_GROUP_ITEM),
  'ListboxRoot[attr].class': pin(U, COMBOBOX_GROUP_ITEM),
  ...Object.fromEntries(
    ['ComboboxAnchor', 'PopperAnchor', 'InputBase'].flatMap(name =>
      [
        ['dir', '"ltr"'],
        ['onPointerleave', 'function'],
        ['onFocusout', 'function'],
      ].map(([key, to]) => [`${name}[attr].${key}`, pin(to, COMBOBOX_GROUP_ITEM)])
    )
  ),
}
/** booleans the consumer did not set are no longer passed as `false` */
const unsetBooleans = {
  'VisuallyHidden[attr].required': pin(
    U,
    'no longer pass `false` for boolean props you did not set'
  ),
}

/**
 * Intended changes of DEFAULT behaviour since 0.3.2:
 * `'<Wrapper> → <Root>': { key: { to, text } }`, keys as in the defaults snapshot
 * (`Name.prop`, `Name[attr].key`), `'*'` for every pair. A listed key must have the value
 * `to` wherever it appears (so an intended change cannot silently revert); any other
 * difference from defaults-baseline.json (recorded from the 0.3.2 dist) fails, and each
 * `text` must appear in the repository CHANGELOG.md.
 */
export const defaultChanges = {
  '*': buttonAttrs,
  'Button → ButtonBase': plainButton,
  'Calendar → CalendarRoot': plainButton,
  'DatePicker → DatePickerContent': { ...plainButton, ...datePickerPopup },
  'DatePickerBase → DatePickerContent': { ...plainButton, ...datePickerPopup },
  'DatePickerPopup → DatePickerContent': plainButton,
  'Menu → ComboboxRoot': {
    ...menuItemButton,
    // inside the listbox the item has role="option", where aria-selected is valid
    'ButtonBase[attr].aria-selected': pin(
      'false',
      '`aria-selected` only when `selected` is passed **and** the button has a role'
    ),
    'Input[attr].aria-activedescendant': pin(
      '"reka-combobox-item-v-#"',
      '`VuMenu` highlights its first item when it opens'
    ),
  },
  'MenuItem → Button': menuItemButton,
  'Select → SelectRoot': uncontrolledOpen('SelectRoot'),
  'SelectBase → SelectRoot': uncontrolledOpen('SelectRoot'),
  'Combobox → ComboboxRoot': {
    ...uncontrolledOpen('ComboboxRoot'),
    'ComboboxPortal[attr].as-child': pin(U, INVALID_AS_CHILD),
    'InputBase.onAppendClick': pin(U, ONE_TOGGLE),
  },
  'Checkbox → CheckboxRoot': {
    'CheckboxRoot.modelValue': pin(U, '`VuCheckbox` `default-value` works'),
    'CheckboxRoot.required': pin('false', '`VuCheckbox` is no longer `required` by default'),
    'CheckboxRoot[attr].aria-required': pin(U, '`VuCheckbox` is no longer `required` by default'),
  },
  'Dialog → DialogContent': {
    'Card[attr].aria-describedby': pin(
      U,
      'no longer points `aria-describedby` at a missing description'
    ),
  },
  'DatePicker → DatePickerRoot': {
    ...datePickerInput,
    ...unsetBooleans,
    ...uncontrolledOpen('DatePickerRoot'),
  },
  'DatePickerBase → DatePickerRoot': {
    ...datePickerInput,
    ...unsetBooleans,
    ...uncontrolledOpen('DatePickerRoot'),
  },
  'Popover → PopoverRoot': {
    ...plainButton,
    ...Object.fromEntries(
      ['ButtonBase', 'Button', 'PopoverTrigger', 'PopperAnchor'].map(name => [
        `${name}[attr].data-vu-trigger`,
        pin('""', 'the Reka triggers they render are marked `data-vu-trigger`'),
      ])
    ),
    ...uncontrolledOpen('PopoverRoot'),
    'PopoverRoot[attr].as-child': pin(U, INVALID_AS_CHILD),
    'PopperRoot[attr].as-child': pin(U, INVALID_AS_CHILD),
    ...popoverContentAttrs,
  },
  'Popover → PopoverContent': popoverContentAttrs,
  'Combobox[groupItem] → ComboboxRoot': {
    ...comboboxGroupItem,
    ...uncontrolledOpen('ComboboxRoot'),
    'ComboboxPortal[attr].as-child': pin(U, INVALID_AS_CHILD),
    'InputBase.onAppendClick': pin(U, ONE_TOGGLE),
  },
  'Button[to, router] → ButtonBase': {
    'ButtonBase[attr].onClick': pin('function', 'navigates client-side'),
  },
  'Button[to, no router] → ButtonBase': {
    '<render>': pin('rendered', 'without a router, a string `to` renders `<a href>`'),
  },
}

/**
 * Precedence rule for state attributes. A vunor component computes some aria-* / data-*
 * state attributes on the element that takes its fallthrough attrs (`data-active`,
 * `aria-pressed`, `data-has-value`, ...). A computed state attribute:
 * - is rendered only when it has a value (`undefined` renders nothing), and
 * - never replaces the same attribute passed by the consumer or injected by a Reka
 *   as-child parent (`<Toggle as-child>`, `<TabsTrigger as-child>`, ...): those win.
 *
 * The state attributes each component computes, checked with a plain attr and with an
 * as-child parent injecting it (both must reach the rendered element unchanged).
 */
const BUTTON_STATE = ['data-has-label', 'data-has-icon', 'data-loading']
const BUTTON_TOGGLE_STATE = [...BUTTON_STATE, 'data-active', 'aria-pressed', 'data-selected']
const INPUT_STATE = ['data-error', 'data-group-active']
const INPUT_BASE_STATE = [
  'data-has-value',
  'data-active',
  'data-has-label',
  'data-has-placeholder',
  'data-type',
  'aria-disabled',
]
const CARD_STATE = ['data-rounded', 'data-dense', 'data-level']

export const stateAttrs = {
  'ButtonBase': BUTTON_STATE,
  'Button': BUTTON_TOGGLE_STATE,
  'Button[role=tab]': [...BUTTON_TOGGLE_STATE, 'aria-selected'],
  'Button[to]': [...BUTTON_STATE, 'aria-current', 'data-selected'],
  'MenuItem': BUTTON_TOGGLE_STATE,
  'Card': CARD_STATE,
  'Input': INPUT_STATE,
  'InputBase': INPUT_BASE_STATE,
  'Select': INPUT_STATE,
  'Select[groupItem]': INPUT_BASE_STATE,
  'Combobox': INPUT_STATE,
  'Combobox[groupItem]': INPUT_BASE_STATE,
  'Combobox[multiple]': [...INPUT_STATE, 'data-expanded'],
  'Combobox[multiple,groupItem]': [...INPUT_BASE_STATE, 'data-expanded'],
  'DatePicker': [...INPUT_STATE, 'data-has-value'],
  'DatePickerBase': INPUT_BASE_STATE,
  'Popover': [...BUTTON_STATE, 'data-active'],
  'ProgressBar': ['data-loading'],
  'Dialog': [...CARD_STATE, 'data-closing'],
  'Calendar': CARD_STATE,
  'DatePickerPopup': CARD_STATE,
}

/**
 * Real Reka as-child parents vunor documents for its buttons: what they inject must reach
 * the rendered button (`expect`: attribute -> value).
 */
export const asChildParents = [
  {
    name: 'Toggle as-child > VuButton',
    parent: 'Toggle',
    parentProps: { modelValue: true },
    child: 'Button',
    childProps: { label: 'x' },
    expect: { 'aria-pressed': 'true', 'data-state': 'on' },
  },
  {
    name: 'TabsTrigger as-child > VuButton',
    parent: 'TabsTrigger',
    parentProps: { value: 'a' },
    within: [
      ['TabsRoot', { modelValue: 'a' }],
      ['TabsList', {}],
    ],
    child: 'Button',
    childProps: { label: 'x' },
    expect: { 'role': 'tab', 'aria-selected': 'true', 'data-state': 'active' },
  },
  {
    name: 'DialogClose as-child > VuButton',
    parent: 'DialogClose',
    parentProps: {},
    within: [['DialogRoot', { open: true }]],
    child: 'Button',
    childProps: { label: 'x' },
    expect: { type: 'button' },
  },
]

/** More default-usage snapshots: modes and props that change the rendered tree */
export const defaultVariants = [
  {
    name: 'Combobox[multiple] → ComboboxRoot',
    component: 'Combobox',
    props: { items: ['a', 'b'], multiple: true },
    root: 'ComboboxRoot',
  },
  {
    name: 'Combobox[groupItem] → ComboboxRoot',
    component: 'Combobox',
    props: { items: ['a', 'b'], groupItem: true },
    root: 'ComboboxRoot',
  },
  {
    name: 'Button[to, router] → ButtonBase',
    component: 'Button',
    props: { label: 'x', to: '/x' },
    root: 'vunor/ButtonBase',
    router: true,
  },
  {
    name: 'Button[to, no router] → ButtonBase',
    component: 'Button',
    props: { label: 'x', to: '/x' },
    root: 'vunor/ButtonBase',
    allow: 'VuButton: `to` is set but the app has no router',
  },
]

/**
 * Single source of truth for model state. For every wrapped root with a model `X` and a
 * `defaultX` (discovered from the Reka definitions), whatever the wrapper exposes about
 * `X` (slot props, data attributes, toggles) must equal the root's actual state in every
 * mode: uncontrolled with `defaultX`, controlled, and v-model. mount-dist.mjs implements
 * a reader (and toggle) per exposure; a pair that exposes nothing is listed here with why.
 */
export const modelStateNotExposed = {
  'Calendar → CalendarRoot.modelValue': 'rendered by Reka (selected cell); vunor exposes nothing',
  'Calendar → CalendarRoot.placeholder': 'rendered by Reka (shown month); vunor exposes nothing',
  'DatePicker → DatePickerRoot.modelValue': 'rendered by Reka (date field segments)',
  'DatePickerBase → DatePickerRoot.modelValue': 'rendered by Reka (date field segments)',
  'Pagination → PaginationRoot.page': 'rendered by Reka (current page item)',
  'RadioGroup → RadioGroupRoot.modelValue': 'rendered by Reka (checked item)',
  'Tabs → TabsRoot.modelValue': 'rendered by Reka (active trigger and panel)',
  // wrapper models (their `update:X` emits) with nothing vunor derives from them
  'Calendar.modelValue': 'rendered by Reka (selected cell)',
  'Calendar.placeholder': 'a forwarded Reka event (shown month), not a vunor model',
  'DatePicker.modelValue': 'rendered by Reka (date field segments)',
  'DatePicker.placeholder': 'a forwarded Reka event (shown month), not a vunor model',
  'DatePickerBase.modelValue': 'rendered by Reka (date field segments)',
  'DatePickerBase.placeholder': 'a forwarded Reka event (shown month), not a vunor model',
  'DevTools.open': 'development-only palette tool with its own panel state',
  'Input.modelValue': 'the text in the native input; no wrapped root model',
  'InputBase.modelValue': 'the text in the native input; no wrapped root model',
  'Menu.modelValue':
    "VuMenu's own pick (its ComboboxRoot is reset after each pick); items read it directly",
  'Pagination.modelValue': 'rendered by Reka (current page item)',
  'Pagination.page': 'the same page as `modelValue`, re-emitted as Reka names it',
  'ProgressBar.modelValue': 'a forwarded Reka event; the bar renders the prop',
  'ProgressBar.max': 'a forwarded Reka event; the bar renders the prop',
  'RadioGroup.modelValue': 'rendered by Reka (checked item)',
  'Tabs.modelValue': 'rendered by Reka (active trigger and panel)',
}

/** Any open vunor popup (listbox, popper content, date picker calendar) */
export const POPUP_SELECTOR =
  '[role="listbox"], [data-reka-popper-content-wrapper], .date-picker-root'
/** A field's append icon (the chevron) */
const FIELD_ICON = '.i8 .i8-icon-wrap'
/** What two gestures do by default: the first opens, the second closes */
export const TOGGLE = { shown: [true, false], emitted: [[true], [false]] }
/** Gestures on the Combobox input with an open-on source: Reka opens, nothing toggles it shut */
const OPENS_ONLY = { shown: [true, true], emitted: [[true], []] }

/**
 * One gesture, one toggle. Every component (attrs-fixture variant) that renders an append
 * icon or a popup trigger needs a case here (or a reason in `toggleNotApplicable`); more
 * cases may be added for props that change the gestures. Each case mounts `component`
 * with `props` (mount-dist.mjs in happy-dom, both Vue runtimes; e2e/fixtures/toggle.ts in
 * Chromium) and makes two gestures on `icon`: they must do `expected` (default `TOGGLE`),
 * with nothing emitted on mount and the listed `update:open` per gesture when `emits`.
 * `keys`: Enter opens and Space closes it as well. `realBrowserOnly`: happy-dom cannot
 * reproduce the gesture (the reason); only Chromium checks it.
 */
export const toggleCases = {
  'Select': { component: 'Select', props: { items: ['a', 'b'] }, icon: FIELD_ICON, emits: true },
  'Select[groupItem]': {
    component: 'Select',
    props: { items: ['a', 'b'], groupItem: true },
    icon: FIELD_ICON,
    emits: true,
  },
  'SelectBase': {
    component: 'SelectBase',
    props: { items: ['a', 'b'] },
    icon: '[aria-expanded]',
    emits: true,
    realBrowserOnly:
      "Reka's SelectContent closes on the trigger's pointer sequence, which happy-dom does not run",
  },
  'Combobox': {
    component: 'Combobox',
    props: { items: ['a', 'b'] },
    icon: FIELD_ICON,
    emits: true,
  },
  'Combobox[groupItem]': {
    component: 'Combobox',
    props: { items: ['a', 'b'], groupItem: true },
    icon: FIELD_ICON,
    emits: true,
  },
  // with `multiple`, `open` is the popover the user opens (the list inside is always open)
  'Combobox[multiple]': {
    component: 'Combobox',
    props: { items: ['a', 'b'], multiple: true },
    icon: FIELD_ICON,
    emits: true,
  },
  'Combobox[multiple,groupItem]': {
    component: 'Combobox',
    props: { items: ['a', 'b'], multiple: true, groupItem: true },
    icon: FIELD_ICON,
    emits: true,
  },
  // Reka's input opens the popup on focus / click: the chevron still toggles, the input
  // only opens (the shell must not close what Reka just opened)
  ...Object.fromEntries(
    ['openOnClick', 'openOnFocus'].flatMap(flag => [
      [
        `Combobox[${flag}]`,
        {
          component: 'Combobox',
          props: { items: ['a', 'b'], [flag]: true },
          icon: FIELD_ICON,
          emits: true,
        },
      ],
      [
        `Combobox[${flag}] input`,
        {
          component: 'Combobox',
          props: { items: ['a', 'b'], [flag]: true },
          icon: 'input',
          emits: true,
          expected: OPENS_ONLY,
        },
      ],
    ])
  ),
  'DatePicker': {
    component: 'DatePicker',
    props: {},
    icon: '[data-reka-date-field-segment="trigger"]',
    emits: true,
    keys: true,
  },
  'DatePickerBase': {
    component: 'DatePickerBase',
    props: {},
    icon: '[data-reka-date-field-segment="trigger"]',
    emits: true,
    keys: true,
  },
  'Popover': { component: 'Popover', props: { label: 'P' }, icon: '[aria-haspopup]', emits: true },
}

/**
 * Components (attrs-fixture variants) that render an append icon or a popup trigger but
 * have nothing to toggle (mount-dist.mjs discovers them; every other one needs a case).
 */
export const toggleNotApplicable = {
  'Combobox[disabled]': 'disabled: the field is a read-only input, nothing opens',
  'Combobox[disabled,groupItem]': 'disabled: the field is a read-only input, nothing opens',
  'Menu': 'an always-open list (its search field is the combobox input)',
}

/**
 * Extra props for the emit sweep (mount-dist.mjs "every emit is declared"): what a
 * component needs to render the parts that emit (on top of its attrs fixture).
 */
export const emitSweepProps = {
  Dialog: { footerButtons: ['Ok', 'Save Draft', 'Cancel'], closeButton: true },
  Combobox: { modelValue: 'a' },
  Select: { modelValue: 'a' },
}
