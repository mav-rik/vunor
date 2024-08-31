<script setup lang="ts">
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import VuSlider from '../components/Slider/Slider.vue'
import VuCheckbox from '../components/Checkbox/Checkbox.vue'
import VuPagination from '../components/Pagination/Pagination.vue'
import { ref } from 'vue'

const showEdges = ref(true)
const showArrows = ref(true)
const total = ref([100])
const itemsPerPage = ref([10])
const siblingCount = ref([2])

function onUpdate(page: number) {
  console.log('update:page ' + page)
}
</script>
<template>
  <VuCard level="h2" class="relative">
    <VuCardHeader class="mb-$s">Pagination</VuCardHeader>

    <div class="flex flex-col gap-$m max-w-lg">
      <VuCheckbox v-model="showEdges" label="Show Edges" />
      <VuCheckbox v-model="showArrows" label="Show Arrows" />
      <VuSlider v-model="total" label="Total items" :min="0" :max="1000" />
      <VuSlider v-model="itemsPerPage" label="Items per page" :min="1" :max="total[0]" />
      <VuSlider v-model="siblingCount" label="Sibling Count" :min="0" :max="3" />
    </div>

    <div class="flex flex-col gap-$m scope-neutral">
      <VuPagination
        :total="total[0]"
        :items-per-page="itemsPerPage[0]"
        :show-edges
        :show-arrows
        :sibling-count="siblingCount[0]"
        @update:page="onUpdate"
      />
      <VuPagination
        :total="total[0]"
        :items-per-page="itemsPerPage[0]"
        :show-edges
        :show-arrows
        :sibling-count="siblingCount[0]"
        class="fingertip-s"
        @update:page="onUpdate"
      />
      <VuPagination
        :total="total[0]"
        :items-per-page="itemsPerPage[0]"
        :show-edges
        :show-arrows
        :sibling-count="siblingCount[0]"
        class="fingertip-xs"
        @update:page="onUpdate"
      />
    </div>
  </VuCard>
</template>
