<script setup lang="ts">
import VuLoadingIndicator from './LoadingIndicator.vue'
defineProps<{
  size?: string
}>()
</script>

<template>
  <div class="inner-loading">
    <slot>
      <VuLoadingIndicator :size />
    </slot>
  </div>
</template>
