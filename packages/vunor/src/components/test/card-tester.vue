<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    text: string
    size: keyof typeof classes
    rounded: boolean
    dense: boolean
  }>(),
  {
    title: 'Title',
    text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt in numquam debitis harum ad, iure quasi suscipit quibusdam unde recusandae consequatur officiis nam delectus illo, nihil commodi. Excepturi, soluta officiis.',
    size: 'h4',
    rounded: false,
    dense: false,
  }
)

const guides = ref(true)

const classes = {
  h1: 'card-h1',
  h2: 'card-h2',
  h3: 'card-h3',
  h4: 'card-h4',
  h5: 'card-h5',
  h6: 'card-h6',
  sh: 'card-subheading',
  bodyl: 'card-body-l',
  body: 'card-body',
  bodys: 'card-body-s',
}
</script>
<template>
  <article
    class="relative"
    :class="{
      [classes[size]]: true,
      'card-dense': dense,
      'rounded-$card-spacing': rounded,
    }"
    @click="guides = !guides"
  >
    <h3 class="text-$card-heading text-mb-$m text-mt-0 fw-$bold">
      {{ title }}
    </h3>
    <slot>
      <p class="text-my-0">
        {{ text }}
      </p>
    </slot>
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
  </article>
</template>
