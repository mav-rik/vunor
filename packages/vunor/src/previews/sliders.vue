<script setup lang="ts">
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import VuSlider from '../components/Slider/Slider.vue'
</script>
<template>
  <VuCard level="h2" class="relative">
    <VuCardHeader class="mb-$s">Sliders</VuCardHeader>

    <div class="flex flex-col gap-$m">
      <VuSlider display-value label="Single thumb slider" :default-value="[10]" />
      <VuSlider display-value label="Range slider" :thumbs="2" :default-value="[12, 70]" />
      <VuSlider
        display-value
        label="Three thumb slider"
        :thumbs="3"
        :default-value="[16, 50, 80]"
      />
    </div>
  </VuCard>
</template>
