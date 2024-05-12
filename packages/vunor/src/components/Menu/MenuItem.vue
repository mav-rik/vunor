<script setup lang="ts">
defineProps<{
  icon?: string
  selected?: boolean
  label?: string
  ariaSelected?: boolean
}>()
</script>

<template>
  <Button
    :icon="icon"
    :aria-selected="selected"
    :label="label"
    class="justify-start c8-flat gap-$m w-full fw-400 btn-round mb-$xs"
  >
  </Button>
</template>
