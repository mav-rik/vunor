<script setup lang="ts">
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
