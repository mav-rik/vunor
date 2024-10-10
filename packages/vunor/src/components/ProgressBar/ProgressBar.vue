<script setup lang="ts">
import { ProgressIndicator, ProgressRoot, type ProgressRootProps } from 'radix-vue'

const props = withDefaults(defineProps<ProgressRootProps & { loading?: boolean }>(), {
  max: 100,
  loading: true,
})
</script>
<template>
  <ProgressRoot
    v-bind="props"
    :loading="undefined"
    class="progress-track"
    style="transform: translateZ(0)"
    :data-loading="loading !== false && Number(modelValue) < max ? '' : undefined"
  >
    <ProgressIndicator
      class="progress-bar"
      :style="`transform: translateX(-${100 - (Number(modelValue) / Number(max)) * 100}%)`"
    />
  </ProgressRoot>
</template>
