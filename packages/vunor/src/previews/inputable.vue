<script setup lang="ts">
const scopes = [
  'scope-grey',
  'scope-neutral',
  'scope-primary',
  'scope-secondary',
  'scope-good',
  'scope-warn',
  'scope-error',
]

const types = ['i8 i8-flat group', 'i8 i8-filled group']

const selected = reactive<Record<string, boolean>>({
  'scope-grey-c8-flat': false,
  'scope-neutral-c8-flat': false,
  'scope-primary-c8-flat': false,
  'scope-secondary-c8-flat': false,
  'scope-good-c8-flat': false,
  'scope-warn-c8-flat': false,
  'scope-error-c8-flat': false,
})
</script>

<template>
  <Card class="with-bg" level="h2">
    <CardHeader class="mb-$s relative">Inputable (i8)</CardHeader>
    <h3 class="mb-$s">Single Inputs</h3>
    <div v-for="t of types" class="mb-$xxl relative">
      <h4 class="text-mb-$m font-mono">
        class=<span class="text-secondary-500/80">"{{ t }}"</span>
      </h4>
      <div class="flex gap-$m flex-wrap items-center justify-center">
        <div class="flex flex-col gap-$xxs" :class="{ [scope]: true }" v-for="scope of scopes">
          <div :class="{ [t]: true }">
            <span class="i8-underline"></span>
            <input class="i8-input" v-i8-focusable placeholder="type anything" />
          </div>
          <div :class="t === 'i8 i8-filled group' ? 'px-$m' : ''">
            <div class="text-caption text-scope-color-500">{{ scope }}</div>
          </div>
        </div>
      </div>
    </div>

    <h3 class="mb-$s">Inputs Groupping</h3>
    <div v-for="t of types" class="mb-$xxl relative">
      <h4 class="text-mb-$m font-mono">
        class=<span class="text-secondary-500/80">"{{ t }} i8-group-item"</span>
      </h4>
      <div class="flex gap-$m flex-wrap items-center justify-center relative">
        <div class="flex flex-col gap-$xxs" :class="{ [scope]: true }" v-for="scope of scopes">
          <div class="flex">
            <div class="i8-group-item w-6em" :class="{ [t]: true }">
              <span class="i8-underline"></span>
              <input class="i8-input" v-i8-focusable />
            </div>
            <div class="i8-group-item w-4em" :class="{ [t]: true }">
              <span class="i8-underline"></span>
              <input class="i8-input" v-i8-focusable />
            </div>
            <div class="i8-group-item w-8em" :class="{ [t]: true }">
              <span class="i8-underline"></span>
              <input class="i8-input" v-i8-focusable />
            </div>
          </div>
          <div :class="t === 'i8 i8-filled group' ? 'px-$m' : ''">
            <div class="text-caption text-scope-color-500">{{ scope }}</div>
          </div>
        </div>
      </div>
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
