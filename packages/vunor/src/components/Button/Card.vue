<script setup lang="ts">
withDefaults(
  defineProps<{
    as: string
  }>(),
  {
    as: 'div',
  }
)
</script>

<template>
  <Primitive :as class="p-card-rounded-display-2"> </Primitive>
</template>
