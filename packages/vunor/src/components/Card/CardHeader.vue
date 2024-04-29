<script setup lang="ts">
import { useCardPI } from './pi'

const props = defineProps<{
  as?: string
  asChild?: boolean
  level?: string
}>()

const _as = computed(() =>
  props.as
    ? props.as
    : ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(props.level || '')
      ? props.level
      : 'h6'
)

useCardPI().inject()
</script>

<template>
  <Primitive :as="_as" :asChild class="text-card-header text-mt-0">
    <slot></slot>
  </Primitive>
</template>
./pi
