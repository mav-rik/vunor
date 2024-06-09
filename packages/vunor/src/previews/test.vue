<script setup lang="ts"></script>
<template>
  <VuCard level="h2" class="with-bg relative">
    <VuCardHeader class="mb-$s">Testing</VuCardHeader>

    <VuPopover align="end">
      <VuButton label="Artem M" icon="i--more-vert" icon-side="right">
        <template #icon-left>
          <VuIcon name="i--search" class="size-2em bg-red rounded-full" />
        </template>
      </VuButton>

      <template v-slot:content="{ close }">
        <div
          class="scope-primary flex flex-col layer-0 shadow-xl rounded-$m min-w-[var(--radix-popover-trigger-width)] w-500px"
        >
          <div>
            <VuButton label="item" class="c8-flat rounded-0!" @click="close" />
          </div>
        </div>
      </template>
    </VuPopover>
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
