<script setup lang="ts">
const modelValue = defineModel<number[]>()
</script>

<template>
  <SliderRoot
    v-model="modelValue"
    class="relative flex items-center select-none touch-none w-[400px] h-5"
    :max="100"
    :step="5"
    :min-steps-between-thumbs="1"
  >
    <SliderTrack class="bg-current-text relative grow rounded-full h-[3px]">
      <SliderRange class="absolute bg-green rounded-full h-full" />
    </SliderTrack>
    <SliderThumb
      class="block w-5 h-5 bg-green shadow-[0_2px_10px] shadow-blackA7 rounded-[10px] hover:bg-violet3 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA8 focus:bg-white"
      aria-label="Volume"
    />
    <SliderThumb
      class="block w-5 h-5 bg-red shadow-[0_2px_10px] shadow-blackA7 rounded-[10px] hover:bg-violet3 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA8 focus:bg-white"
      aria-label="Volume"
    />
    <SliderThumb
      class="block w-5 h-5 bg-blue shadow-[0_2px_10px] shadow-blackA7 rounded-[10px] hover:bg-violet3 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA8 focus:bg-white"
      aria-label="Volume"
    />
  </SliderRoot>
</template>
