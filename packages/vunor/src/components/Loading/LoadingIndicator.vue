<script setup lang="ts">
withDefaults(defineProps<{ size?: string }>(), { size: '1em' })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 14 14"
    fill="none"
    class="loading-indicator loading-indicator-ring"
  >
    <circle
      cx="50%"
      cy="50%"
      r="6"
      stroke="currentColor"
      stroke-dasharray="38 38"
      stroke-width="1"
      class=""
    />
  </svg>
</template>
