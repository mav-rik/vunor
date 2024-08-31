<script setup lang="ts">
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import { reactive } from 'vue'

const scopes = [
  'scope-grey',
  'scope-neutral',
  'scope-primary',
  'scope-secondary',
  'scope-good',
  'scope-warn',
  'scope-error',
]

const types = ['i8 i8-flat group/i8', 'i8 i8-filled group/i8']

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
  <VuCard class="" level="h2">
    <VuCardHeader class="mb-$s relative">Inputable (i8)</VuCardHeader>
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
          <div :class="t === 'i8 i8-filled group/i8' ? 'px-$m' : ''">
            <div class="text-caption text-scope-color-500">{{ scope }}</div>
          </div>
        </div>
      </div>
    </div>

    <h3 class="mb-$s">Inputs Groupping</h3>
    <div v-for="t of types" class="mb-$xxl relative">
      <h4 class="text-mb-$m font-mono">
        class=<span class="text-secondary-500/80">"{{ t }} segmented"</span>
      </h4>
      <div class="flex gap-$m flex-wrap items-center justify-center relative">
        <div class="flex flex-col gap-$xxs" :class="{ [scope]: true }" v-for="scope of scopes">
          <div class="flex">
            <div class="segmented w-6em" :class="{ [t]: true }">
              <span class="i8-underline"></span>
              <input class="i8-input" v-i8-focusable />
            </div>
            <div class="segmented w-4em" :class="{ [t]: true }">
              <span class="i8-underline"></span>
              <input class="i8-input" v-i8-focusable />
            </div>
            <div class="segmented w-8em" :class="{ [t]: true }">
              <span class="i8-underline"></span>
              <input class="i8-input" v-i8-focusable />
            </div>
          </div>
          <div :class="t === 'i8 i8-filled group/i8' ? 'px-$m' : ''">
            <div class="text-caption text-scope-color-500">{{ scope }}</div>
          </div>
        </div>
      </div>
    </div>
  </VuCard>
</template>
