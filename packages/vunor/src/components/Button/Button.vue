<script setup lang="ts">
withDefaults(
  defineProps<{
    dense?: boolean
    kind?: 'filled' | 'outlined' | 'light' | 'text'
  }>(),
  {}
)
</script>

<template>
  <button class="btn rounded p-$m bg-red-500 m-6 text-2xl">
    <slot />
  </button>
</template>
