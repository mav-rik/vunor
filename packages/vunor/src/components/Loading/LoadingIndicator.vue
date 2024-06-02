<script setup lang="ts">
withDefaults(defineProps<{ size: string }>(), { size: '1em' })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 14 14"
    fill="none"
    class="loading-indicator loading-indicator-ring"
  >
    <circle cx="50%" cy="50%" r="6" stroke="currentColor" />
  </svg>
</template>

<style>
.loading-indicator {
  /* pointer-events: none; */
  cursor: wait;
}
svg.loading-indicator-ring {
  animation: loading-indicator-ring-rotate 1.5s linear infinite;
}

svg.loading-indicator-ring > circle {
  animation: loading-indicator-ring 2.5s linear infinite;
  stroke-dasharray: 38 38;
  stroke-width: 1;
}

@keyframes loading-indicator-ring-rotate {
  from {
    transform: rotateZ(0);
  }
  to {
    transform: rotateZ(360deg);
  }
}
@keyframes loading-indicator-ring {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -76;
  }
}
</style>
