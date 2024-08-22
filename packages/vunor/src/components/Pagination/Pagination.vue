<script setup lang="ts">
import {
  PaginationRoot,
  PaginationList,
  PaginationFirst,
  PaginationPrev,
  PaginationListItem,
  PaginationEllipsis,
  PaginationNext,
  PaginationLast,
} from 'radix-vue'

import VuIcon from '../Icon/Icon.vue'

defineProps<{
  total: number
  defaultPage?: number
  showEdges?: boolean
  siblingCount?: number
  itemsPerPage?: number
  showArrows?: boolean
}>()
const modelValue = defineModel<number>()
const emit = defineEmits<{
  (name: 'update:page', v: number): void
}>()
</script>

<template>
  <PaginationRoot
    :total
    :itemsPerPage
    :sibling-count
    :show-edges
    :default-page
    v-model:page="modelValue"
    @update:page="emit('update:page', $event)"
  >
    <PaginationList v-slot="{ items }" class="flex items-center gap-1">
      <PaginationFirst
        v-if="!showEdges && showArrows"
        class="size-fingertip flex items-center justify-center btn btn-square c8-flat disabled:opacity-30"
      >
        <VuIcon name="i--chevron-left-2" class="btn-icon btn-icon-left" />
      </PaginationFirst>
      <PaginationPrev
        v-if="showArrows"
        class="size-fingertip flex items-center justify-center mr-4 btn btn-square c8-flat disabled:opacity-30"
      >
        <VuIcon name="i--chevron-left" class="btn-icon btn-icon-left" />
      </PaginationPrev>
      <template v-for="(page, index) in items">
        <PaginationListItem
          v-if="page.type === 'page'"
          :key="index"
          class="size-fingertip btn btn-square c8-flat"
          :value="page.value"
        >
          {{ page.value }}
        </PaginationListItem>
        <PaginationEllipsis
          v-else
          :key="page.type"
          :index="index"
          class="size-fingertip flex items-center justify-center"
        >
          &#8230;
        </PaginationEllipsis>
      </template>
      <PaginationNext
        v-if="showArrows"
        class="size-fingertip flex items-center justify-center ml-4 btn btn-square c8-flat disabled:opacity-30"
      >
        <VuIcon name="i--chevron-right" class="btn-icon btn-icon-left" />
      </PaginationNext>
      <PaginationLast
        v-if="!showEdges && showArrows"
        class="size-fingertip flex items-center justify-center btn btn-square c8-flat disabled:opacity-30"
      >
        <VuIcon name="i--chevron-right-2" class="btn-icon btn-icon-left" />
      </PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>
