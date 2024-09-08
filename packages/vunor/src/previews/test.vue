<script setup lang="ts">
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
</script>
<template>
  <VuCard level="h2" class="relative">
    <VuCardHeader class="mb-$s">Test</VuCardHeader>

    <div class="size-5em surface-200 animate-from-scale-0 animate-to-scale-1">test</div>
  </VuCard>
</template>
