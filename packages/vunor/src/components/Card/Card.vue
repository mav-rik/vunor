<script setup lang="ts">
import { useCardPI } from './card-utils'

const props = withDefaults(
  defineProps<{
    as?: string
    asChild?: boolean
    level?:
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6'
      | 'heading'
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
    :class="{
      [`card-${_level}`]: true,
      'rounded-$card-spacing': rounded,
      'card-dense': dense,
    }"
  >
    <slot />
  </Primitive>
</template>
