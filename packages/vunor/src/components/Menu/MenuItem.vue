<script setup lang="ts">
import VuButton from '../Button/Button.vue'
defineProps<{
  icon?: string
  selected?: boolean
  label?: string
  ariaSelected?: boolean
}>()
</script>

<template>
  <VuButton
    :icon="icon"
    :selected="selected"
    :label="label"
    :class="{
      'scope-grey': !selected,
    }"
    class="menu-item"
  />
</template>
