<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'

import VuIcon from '../Icon/Icon.vue'
import VuLoadingIndicator from '../Loading/LoadingIndicator.vue'

// Template note: the root keeps the `group/btn` class although no vunor rule reads it
// any more (since 0.3.0 the label and icon take their cue from inherited custom
// properties instead of `group-[.btn-square]/btn:` descendant rules). It stays because
// it is public surface that consumer-authored `group-*/btn:` rules may still key on.
// Keep the template to a single root element (no sibling comments): fallthrough attrs
// (class, @click, aria-*) are applied to that root.

const INACTIVE_LINK_ATTRS = Object.freeze({
  'role': 'link',
  'aria-disabled': 'true',
  'tabindex': 0,
})
const NO_ATTRS = Object.freeze({})

const props = withDefaults(
  defineProps<{
    label?: string
    icon?: string
    iconSide?: 'left' | 'right'
    loading?: boolean
    disabled?: boolean
    as?: string
    href?: string
  }>(),
  {
    iconSide: 'left',
    as: 'button',
  }
)

// A link cannot be natively disabled: while disabled or loading it drops `href` (so neither
// a click, a middle-click nor "open in new tab" follows it) and stays a focusable,
// announced link. `disabled` is only rendered on a <button>.
const inactiveLink = computed(() => props.as === 'a' && !!(props.loading || props.disabled))
</script>

<template>
  <Primitive
    class="btn group/btn"
    :as
    :href="inactiveLink ? undefined : href"
    v-bind="inactiveLink ? INACTIVE_LINK_ATTRS : NO_ATTRS"
    :data-has-label="!!label || !!$slots.default"
    :data-has-icon="!!icon"
    :data-loading="loading ? '' : undefined"
    :disabled="as === 'button' ? loading || disabled || undefined : undefined"
  >
    <div class="loading-indicator-wrapper" v-if="loading">
      <VuLoadingIndicator />
    </div>
    <slot name="icon-left">
      <VuIcon v-if="icon && iconSide === 'left'" :name="icon" class="btn-icon btn-icon-left" />
    </slot>
    <slot>
      <span class="btn-label">{{ label }}</span>
    </slot>

    <slot name="icon-right">
      <VuIcon v-if="icon && iconSide === 'right'" :name="icon" class="btn-icon btn-icon-right" />
    </slot>
  </Primitive>
</template>
