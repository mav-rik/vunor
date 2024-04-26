<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    text: string
    size: keyof typeof classes
    rounded: boolean
  }>(),
  {
    title: 'Title',
    text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt in numquam debitis harum ad, iure quasi suscipit quibusdam unde recusandae consequatur officiis nam delectus illo, nihil commodi. Excepturi, soluta officiis.',
    size: 'a',
    rounded: false,
  }
)

const guides = ref(true)

const classes = {
  a: {
    card: 'p-card-title-a',
    rounded: 'p-card-rounded-title-a',
    w: 'w-title-a',
    h: 'h-title-a',
    text: 'text-title-a',
    top: 'top-title-a',
  },
  b: {
    card: 'p-card-title-b',
    rounded: 'p-card-rounded-title-b',
    w: 'w-title-b',
    h: 'h-title-b',
    text: 'text-title-b',
    top: 'top-title-b',
  },
  c: {
    card: 'p-card-title-c',
    rounded: 'p-card-rounded-title-c',
    w: 'w-title-c',
    h: 'h-title-c',
    text: 'text-title-c',
    top: 'top-title-c',
  },
  body: {
    card: 'p-card-body',
    rounded: 'p-card-rounded-body',
    w: 'w-body',
    h: 'h-body',
    text: 'text-body',
    top: 'top-body',
  },
  d1: {
    card: 'p-card-display-1',
    rounded: 'p-card-rounded-display-1',
    w: 'w-display-1',
    h: 'h-display-1',
    text: 'text-display-1',
    top: 'top-display-1',
  },
  d2: {
    card: 'p-card-display-2',
    rounded: 'p-card-rounded-display-2',
    w: 'w-display-2',
    h: 'h-display-2',
    text: 'text-display-2',
    top: 'top-display-2',
  },
  h: {
    card: 'p-card-heading',
    rounded: 'p-card-rounded-heading',
    w: 'w-heading',
    h: 'h-heading',
    text: 'text-heading',
    top: 'top-heading',
  },
}
</script>
<template>
  <article
    class="border border-color-gray-400 relative"
    :class="rounded ? classes[size].rounded : classes[size].card"
    @click="guides = !guides"
  >
    <h3 :class="classes[size].text" class="mb-$s">{{ title }}</h3>
    <p class="text-body">
      {{ text }}
    </p>
    <template v-if="guides">
      <div
        :class="classes[size].w"
        class="bg-blue-700 border border-dashed border-color-blue-200 bg-opacity-5 absolute left-0 bottom-0 top-0"
      ></div>
      <div
        :class="classes[size].w"
        class="bg-blue-700 border border-dashed border-color-blue-200 bg-opacity-5 absolute right-0 bottom-0 top-0"
      ></div>
      <div
        :class="classes[size].h"
        class="bg-blue-700 border border-dashed border-color-blue-200 bg-opacity-5 absolute left-0 top-0 right-0"
      ></div>
      <div
        :class="classes[size].h"
        class="bg-blue-700 border border-dashed border-color-blue-200 bg-opacity-5 absolute left-0 bottom-0 right-0"
      ></div>

      <div
        :class="classes[size].h + ' ' + classes[size].top"
        class="pointer-events-none border border-dashed border-color-green-500 bg-green-700 bg-opacity-5 absolute left-0 right-0"
      ></div>
    </template>
  </article>
</template>
