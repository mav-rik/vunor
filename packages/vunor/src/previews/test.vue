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

    <div class="flex gap-$s flex-col current-icon-red w-15em current-hl-black">
      <VuInput
        icon-append="i--clear"
        icon-prepend="i--search"
        icon-before="i--config"
        icon-after="i--layers"
        @after-click="c"
        @before-click="c"
        @prepend-click="c"
        @append-click="c"
      />
    </div>
  </VuCard>
</template>
