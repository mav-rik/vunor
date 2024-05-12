<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <div :class="name" class="icon-color"></div>
</template>
