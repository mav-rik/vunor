<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    icon?: string
    iconSide?: 'left' | 'right'
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    iconSide: 'left',
  }
)
</script>

<template>
  <button
    class="btn group/btn"
    :data-has-label="!!label || $slots.default"
    :data-has-icon="!!icon"
    :data-loading="loading ? '' : undefined"
    :disabled="loading || disabled || undefined"
  >
    <div class="loading-indicator-wrapper" v-if="loading">
      <LoadingIndicator />
    </div>
    <Icon v-if="icon && iconSide === 'left'" :name="icon" class="btn-icon btn-icon-left" />
    <slot>
      <span class="btn-label">{{ label }}</span>
    </slot>

    <Icon v-if="icon && iconSide === 'right'" :name="icon" class="btn-icon btn-icon-right" />
  </button>
</template>
