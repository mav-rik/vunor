<script setup lang="ts">
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
</script>
<template>
  <VuCard level="h2" class="with-bg relative">
    <VuCardHeader class="mb-$s">Testing</VuCardHeader>
  </VuCard>
</template>

<style scoped>
.with-bg {
  position: relative;
  min-height: 100vh;
}
.with-bg:before {
  content: ' ';
  position: fixed;
  pointer-events: none;
  margin-left: -2.5em;
  width: 80vw;
  top: 0;
  height: 100vh;
  background-image: url(/bg7.png);
  background-size: cover;
  mix-blend-mode: darken;
  opacity: 0.05;
}
.dark .with-bg:before {
  mix-blend-mode: overlay;
  opacity: 0.25;
}
</style>
