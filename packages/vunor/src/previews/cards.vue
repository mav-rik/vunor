<script setup lang="ts">
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import { ref } from 'vue'

const lorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet pariatur ab maiores voluptatibus ipsum officia nobis! Eveniet error rerum dolore eligendi, tempora qui nobis soluta fugit quibusdam cupiditate, ducimus magnam!'
const levels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body'] as const
const guides = ref(false)
const dense = ref(true)
</script>
<template>
  <VuCard level="h2">
    <VuCardHeader class="mb-$s">Cards</VuCardHeader>
    <h3 class="mb-$s border-b border-b-2px">Levels</h3>
    <div class="flex flex-col gap-$l">
      <VuCard
        v-for="level of levels"
        :level="level"
        rounded
        class="border max-w-xl relative"
        @click="guides = !guides"
      >
        <VuCardHeader class="mb-$xxs fw-bold">Level {{ level }}</VuCardHeader>
        <p class="text-my-0">{{ lorem }}</p>
        <template v-if="guides">
          <div
            class="bg-blue-700 w-$card-spacing border border-dashed border-color-blue-200 bg-opacity-5 absolute left-0 bottom-0 top-0"
          ></div>
          <div
            class="bg-blue-700 w-$card-spacing border border-dashed border-color-blue-200 bg-opacity-5 absolute right-0 bottom-0 top-0"
          ></div>
          <div
            class="bg-blue-700 h-$card-spacing border border-dashed border-color-blue-200 bg-opacity-5 absolute left-0 top-0 right-0"
          ></div>
          <div
            class="bg-blue-700 h-$card-spacing border border-dashed border-color-blue-200 bg-opacity-5 absolute left-0 bottom-0 right-0"
          ></div>

          <div
            class="h-$card-heading-corrected top-$card-spacing pointer-events-none border border-dashed border-color-green-500 bg-green-700 bg-opacity-5 absolute left-0 right-0"
          ></div>
        </template>
      </VuCard>
    </div>
    <h3 class="mb-$s mt-$l border-b border-b-2px">Density</h3>
    <div class="grid grid-cols-2 gap-$l">
      <VuCard
        level="h3"
        class="border w-full scope-neutral surface-0"
        rounded
        :dense="dense"
        @click="dense = !dense"
      >
        <VuCardHeader>Card H3</VuCardHeader>
        <p class="text-mb-0">
          Density =
          <span class="surface-50 border inline-block rounded px-$m">{{
            dense ? 'dense' : 'regular'
          }}</span
          ><br />Click here to change density.
        </p>
      </VuCard>
      <VuCard
        level="h4"
        class="border w-full scope-neutral surface-0"
        rounded
        :dense="dense"
        @click="dense = !dense"
      >
        <VuCardHeader>Card H4</VuCardHeader>
        <p class="text-mb-0">
          Density =
          <span class="surface-50 border inline-block rounded px-$m">{{
            dense ? 'dense' : 'regular'
          }}</span
          ><br />Click here to change density.
        </p>
      </VuCard>
      <VuCard
        level="h5"
        class="border w-full scope-neutral surface-0"
        rounded
        :dense="dense"
        @click="dense = !dense"
      >
        <VuCardHeader>Card H5</VuCardHeader>
        <p class="text-mb-0">
          Density =
          <span class="surface-50 border inline-block rounded px-$m">{{
            dense ? 'dense' : 'regular'
          }}</span
          ><br />Click here to change density.
        </p>
      </VuCard>
      <VuCard
        level="h6"
        class="border w-full scope-neutral surface-0"
        rounded
        :dense="dense"
        @click="dense = !dense"
      >
        <VuCardHeader>Card H6</VuCardHeader>
        <p class="text-mb-0">
          Density =
          <span class="surface-50 border inline-block rounded px-$m">{{
            dense ? 'dense' : 'regular'
          }}</span
          ><br />Click here to change density.
        </p>
      </VuCard>
    </div>
  </VuCard>
</template>
