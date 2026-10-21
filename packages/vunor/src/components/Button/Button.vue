<script setup lang="ts">
import { computed, getCurrentInstance, useAttrs, warn } from 'vue'

import VuButtonBase from './ButtonBase.vue'

// Attrs go to VuButtonBase explicitly in both branches: through RouterLink they would
// depend on the vue-router version rendering a single root
defineOptions({ inheritAttrs: false })

// aria-selected is only valid on these roles (WAI-ARIA); a plain button gets data-selected,
// which the c8 styles treat the same way
const SELECTABLE_ROLES = new Set([
  'option',
  'tab',
  'gridcell',
  'row',
  'columnheader',
  'rowheader',
  'treeitem',
])

/** the defined entries only: an `undefined` binding would still override or render */
function defined(values: Record<string, unknown>) {
  const result: Record<string, unknown> = {}
  for (const key in values) {
    if (values[key] !== undefined) {
      result[key] = values[key]
    }
  }
  return result
}

/** `@click` with any modifiers Vue keeps in the key (`.once`, `.capture`, `.passive`) */
const CLICK_LISTENER = /^onClick(?:Once|Passive|Capture)*$/

const props = withDefaults(
  defineProps<{
    label?: string
    icon?: string
    iconSide?: 'left' | 'right'
    loading?: boolean
    disabled?: boolean
    active?: boolean
    pressed?: boolean
    selected?: boolean
    /**
     * Router location: renders a router link through the app's RouterLink. Typed
     * structurally (compatible with vue-router's `RouteLocationRaw`), so vunor needs no
     * vue-router types. Without a router, a string (or `{ path }`) renders `<a href>`.
     */
    to?:
      | string
      | {
          path?: string
          name?: string | symbol
          params?: Record<string, unknown>
          query?: Record<string, unknown>
          hash?: string
          replace?: boolean
          force?: boolean
          state?: unknown
        }
    class?: string | Record<string, boolean>
    style?: string | Record<string, string>
    asLink?: boolean
  }>(),
  // absent means "not a toggle / not selectable": no aria-pressed / aria-selected at all
  { pressed: undefined, selected: undefined }
)

// Use the RouterLink the app registered (`app.use(router)`) instead of importing
// vue-router: vunor does not depend on vue-router, and a second copy of it would not
// see the app's router anyway.
const RouterLink = getCurrentInstance()?.appContext.components.RouterLink

// VuButtonBase's props plus class/style; Button-only props must not become DOM attributes
const baseProps = computed(() =>
  defined({
    label: props.label,
    icon: props.icon,
    iconSide: props.iconSide,
    loading: props.loading,
    disabled: props.disabled,
    class: props.class,
    style: props.style,
  })
)

const attrs = useAttrs()
const ariaSelected = computed(() =>
  props.selected !== undefined && SELECTABLE_ROLES.has(String(attrs.role))
    ? props.selected
    : undefined
)

// State attributes this button computes. Precedence: they are bound BEFORE `$attrs`, so an
// attribute the consumer passes, or a Reka as-child parent injects (<Toggle as-child>,
// <TabsTrigger as-child>), wins; an undefined state renders nothing.
const stateAttrs = computed(() =>
  defined({
    'data-active': props.active ? '' : undefined,
    'aria-pressed': props.pressed,
    'data-selected': props.selected === undefined ? undefined : String(props.selected),
    'aria-selected': ariaSelected.value,
  })
)

// A link cannot be natively disabled: while disabled or loading VuButtonBase drops its href
// and renders aria-disabled="true"; a click neither navigates nor reaches any click
// listener here (`@click` goes through onLinkClick, its `.once` / `.capture` / `.passive`
// forms are dropped while inactive). Read on render: $attrs is not reactive.
const inactive = computed(() => !!(props.disabled || props.loading))
function linkAttrs() {
  const rest: Record<string, unknown> = {}
  for (const key in attrs) {
    if (key === 'onClick' || (inactive.value && CLICK_LISTENER.test(key))) {
      continue
    }
    rest[key] = attrs[key]
  }
  return rest
}
function onLinkClick(event: MouseEvent, navigate?: (event: MouseEvent) => unknown) {
  if (inactive.value) {
    event.preventDefault()
    return
  }
  const handlers = attrs.onClick as
    | ((event: MouseEvent) => void)
    | Array<(event: MouseEvent) => void>
  for (const handler of [handlers ?? []].flat()) {
    handler(event)
  }
  navigate?.(event)
}

// `to` without a router: plain link for string / `{ path }` locations
const fallbackHref = computed(() => {
  const to = props.to
  return typeof to === 'string' ? to : to?.path
})
const isLink = computed(() => props.asLink || fallbackHref.value !== undefined)
if (props.to !== undefined && !RouterLink) {
  warn(
    'VuButton: `to` is set but the app has no router (app.use(router)); ' +
      'rendering a plain link without client-side navigation.'
  )
}
</script>

<template>
  <component
    :is="RouterLink"
    v-if="!!to && RouterLink"
    custom
    :to
    v-slot="{ isActive, isExactActive, href, navigate }"
  >
    <VuButtonBase
      v-bind="{
        ...(isExactActive ? { 'aria-current': 'page' } : {}),
        ...(isActive ? { 'data-selected': 'true' } : {}),
        ...linkAttrs(),
        ...baseProps,
      }"
      as="a"
      :href
      @click="onLinkClick($event, navigate)"
    >
      <template #icon-left v-if="$slots['icon-left']">
        <slot name="icon-left"></slot>
      </template>
      <slot></slot>
      <template #icon-right v-if="$slots['icon-right']">
        <slot name="icon-right"></slot>
      </template>
    </VuButtonBase>
  </component>

  <VuButtonBase
    v-else
    :as="isLink ? 'a' : 'button'"
    :href="fallbackHref"
    v-bind="
      isLink
        ? {
            ...stateAttrs,
            ...linkAttrs(),
            ...baseProps,
            onClick: onLinkClick,
          }
        : { ...stateAttrs, ...$attrs, ...baseProps }
    "
  >
    <template #icon-left v-if="$slots['icon-left']">
      <slot name="icon-left"></slot>
    </template>
    <slot></slot>
    <template #icon-right v-if="$slots['icon-right']">
      <slot name="icon-right"></slot>
    </template>
  </VuButtonBase>
</template>
