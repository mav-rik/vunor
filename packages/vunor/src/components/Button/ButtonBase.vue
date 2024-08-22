<script setup lang="ts">
import { Primitive } from 'radix-vue'
import VuLoadingIndicator from '../Loading/LoadingIndicator.vue'
import VuIcon from '../Icon/Icon.vue'

withDefaults(
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
</script>

<template>
  <Primitive
    class="btn group/btn"
    :as
    :href
    :data-has-label="!!label || !!$slots.default"
    :data-has-icon="!!icon"
    :data-loading="loading ? '' : undefined"
    :disabled="loading || disabled || undefined"
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
