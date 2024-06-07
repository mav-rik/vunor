<script setup lang="ts"></script>
<template>
  <Card level="h2" class="with-bg relative">
    <CardHeader class="mb-$s">Sliders</CardHeader>

    <div class="flex flex-col gap-$m">
      <Slider display-value label="Single thumb slider" :default-value="[10]" />
      <Slider display-value label="Range slider" :thumbs="2" :default-value="[12, 70]" />
      <Slider display-value label="Three thumb slider" :thumbs="3" :default-value="[16, 50, 80]" />
    </div>
  </Card>
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
