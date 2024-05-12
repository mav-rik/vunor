<script setup lang="ts">
withDefaults(defineProps<{ label?: string; icon?: string; iconSide?: 'left' | 'right' }>(), {
  iconSide: 'left',
})
</script>

<template>
  <button class="btn group" :data-has-label="!!label || $slots.default" :data-has-icon="!!icon">
    <Icon v-if="icon && iconSide === 'left'" :name="icon" class="btn-icon btn-icon-left" />
    <slot>
      <span class="btn-label">{{ label }}</span>
    </slot>

    <Icon v-if="icon && iconSide === 'right'" :name="icon" class="btn-icon btn-icon-right" />
  </button>
</template>
