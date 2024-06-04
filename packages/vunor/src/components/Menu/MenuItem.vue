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
    :class="{
      'scope-grey': !selected,
    }"
    class="justify-start c8-flat gap-$m w-full fw-400 rounded-0!"
  >
  </Button>
</template>
