<script setup lang="ts">
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import VuInput from '../components/Input/Input.vue'
function c() {
  console.log('c')
}
</script>
<template>
  <VuCard level="h2" class="relative">
    <VuCardHeader class="mb-$s">Testing</VuCardHeader>

    <div class="flex gap-$s flex-col layer-4 w-20em p-$m rounded i8-bg-layer-0">
      <VuInput label="test" design="filled" />
      <VuInput label="test" design="filled" />
      <VuInput label="test" design="filled" />
      <VuInput label="test" design="filled" />

      <div class="current-text-layer-0 text-current">text</div>
    </div>
  </VuCard>
</template>
