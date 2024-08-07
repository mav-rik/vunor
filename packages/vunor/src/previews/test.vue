<script setup lang="ts">
const items = ['item 1', 'item 2', 'item 3', 'item 4', 'item 5']
</script>
<template>
  <VuCard level="h2" class="with-bg relative">
    <VuCardHeader class="mb-$s">Testing</VuCardHeader>

    <h4>Combobox with custom items</h4>
    <VuCombobox design="filled" :items>
      <template v-slot:item="item">
        <div class="h-5em flex gap-$l items-center">
          <VuIcon name="i--config" class="size-3em" />
          {{ item.label }}
        </div>
      </template>
    </VuCombobox>
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
