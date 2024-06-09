<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  label?: string
  icon?: string
  iconSide?: 'left' | 'right'
  loading?: boolean
  disabled?: boolean
  active?: boolean
  pressed?: boolean
  selected?: boolean
  to?: RouteLocationRaw
  class?: string | Record<string, boolean>
  style?: string | Record<string, string>
}>()
</script>

<template>
  <RouterLink v-if="!!to" custom :to v-slot="{ isActive, href }">
    <VuButtonBase as="a" :href :aria-selected="isActive" v-bind="props">
      <template #icon-left v-if="$slots['icon-left']">
        <slot name="icon-left"></slot>
      </template>
      <slot></slot>
      <template #icon-right v-if="$slots['icon-right']">
        <slot name="icon-right"></slot>
      </template>
    </VuButtonBase>
  </RouterLink>

  <VuButtonBase
    v-else
    v-bind="props"
    :data-active="active ? '' : undefined"
    :aria-pressed="typeof pressed === 'boolean' ? pressed : undefined"
    :aria-selected="typeof selected === 'boolean' ? selected : undefined"
  >
    <template #icon-left v-if="$slots['icon-left']">
      <slot name="icon-left"></slot>
    </template>
    <slot></slot>
    <template #icon-right v-if="$slots['icon-right']">
      <slot name="icon-right"></slot>
    </template>
  </VuButtonBase>
</template>
