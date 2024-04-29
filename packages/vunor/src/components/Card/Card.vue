<script setup lang="ts">
import { useCardPI } from './pi'

const props = withDefaults(
  defineProps<{
    as?: string
    asChild?: boolean
    noPadding?: boolean
    level?:
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6'
      | 'subheading'
      | 'body-l'
      | 'body'
      | 'body-s'
      | 'callout'
    dense?: boolean
    rounded?: boolean
  }>(),
  {
    as: 'div',
  }
)

const { headerLevel } = useCardPI().provide()

const _level = computed(() => props.level || headerLevel.value || 'h6')
</script>

<template>
  <Primitive
    :as
    :asChild
    :data-rounded="rounded"
    :data-dense="dense"
    :data-level="_level"
    :style="noPadding ? 'padding: 0' : ''"
    class="card"
  >
    <slot />
  </Primitive>
</template>
./pi
