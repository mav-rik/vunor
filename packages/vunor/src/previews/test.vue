<script setup lang="ts">
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import VuInput from '../components/Input/Input.vue'
</script>
<template>
  <VuCard level="h2" class="with-bg relative">
    <VuCardHeader class="mb-$s">Testing</VuCardHeader>

    <div class="flex flex-col w-20em gap-$s icon-size-$m">
      <VuInput
        icon-append="i--search"
        design="filled"
        hint="this is hint"
        :maxlength="5"
        no-border
        class="i8-no-border"
      />
      <VuInput icon-append="i--search" design="filled" hint="this is hint" :maxlength="5" />
      <VuInput icon-append="i--search" design="filled" />
      <VuInput icon-append="i--search" design="filled" hint="this is hint" :maxlength="5" />

      <VuInput
        design="filled"
        hint="this is hint"
        icon-append="i--search"
        v-on:append-click="console.log('append')"
      >
        <template v-slot:input="inputAttrs">
          <div
            class="i8-input grid grid-cols-[auto_minmax(4em,1fr)] items-center relative gap-$s"
            v-bind="inputAttrs"
          >
            <!-- <div class="flex gap-$s items-center overflow-hidden">
              <div class="surface-100 rounded px-$s">item1</div>
              <div class="surface-100 rounded px-$s">item1</div>
              <div class="surface-100 rounded px-$s">item1</div>
              <div class="surface-100 rounded px-$s">item1</div>
            </div> -->
            <div class="relative min-w-4em [grid-column:1/-1]">
              <!--[grid-column:1/-1] -->
              <input v-bind="inputAttrs" class="bg-transparent outline-none w-full" />
            </div>
          </div>
        </template>
      </VuInput>
    </div>
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
