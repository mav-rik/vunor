<script setup lang="ts">
import { reactive } from 'vue'

import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'

const scopes = [
  'scope-grey',
  'scope-neutral',
  'scope-primary',
  'scope-secondary',
  'scope-good',
  'scope-warn',
  'scope-error',
]

const types = ['c8-filled', 'c8-outlined', 'c8-light', 'c8-flat', 'c8-chrome']

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
  <VuCard level="h2">
    <VuCardHeader class="mb-$s">Clickable (c8)</VuCardHeader>
    <div v-for="t of types" class="mb-$xl">
      <h4 class="text-mb-$m">Class "{{ t }}"</h4>
      <div class="flex gap-$m flex-wrap items-center justify-center">
        <div
          v-for="scope of scopes"
          tabindex="0"
          class="h-fingertip rounded flex items-center justify-center px-$m gap-$m select-none"
          @click="selected[`${scope}-${t}`] = !selected[`${scope}-${t}`]"
          :aria-selected="selected[`${scope}-${t}`]"
          :class="{ [scope]: true, [t]: true }"
        >
          <span class="i--click icon-color size-[1.25em]"></span>{{ scope.replace('scope-', '') }}
        </div>
      </div>
    </div>
    <div class="mb-$xl">
      <h4 class="text-mb-$m"><code>c8-chrome</code> stays neutral inside any scope</h4>
      <p class="text-body-s text-current/70 mb-$m">
        Each row below is wrapped in a different scope. <code>c8-filled</code> follows the scope (it
        changes color). <code>c8-chrome</code> ignores it — secondary chrome buttons remain neutral
        and don't compete with the scoped CTA.
      </p>
      <div
        v-for="scope of scopes"
        :class="scope"
        class="surface-0 p-$m mb-$xs rounded-r1 flex items-center gap-$m"
      >
        <span class="text-caption opacity-60 w-[8em] truncate">{{ scope }}</span>
        <button
          class="c8-filled h-fingertip rounded-r1 flex items-center px-$m gap-$xs cursor-pointer select-none"
        >
          Apply
        </button>
        <button
          class="c8-chrome h-fingertip rounded flex items-center px-$m gap-$xs cursor-pointer select-none"
        >
          Cancel
        </button>
        <button
          class="c8-chrome h-fingertip rounded flex items-center px-$m gap-$xs cursor-pointer select-none"
        >
          <span class="i--close icon-color size-[1.1em]"></span>Select all
        </button>
      </div>
    </div>

    <div>
      <h4 class="text-mb-$m">Segmented</h4>
      <div class="flex">
        <div
          tabindex="0"
          class="segmented c8-outlined h-[2rem] rounded flex items-center justify-center px-$m gap-$m select-none"
        >
          Button 1
        </div>
        <div
          tabindex="0"
          class="segmented c8-outlined h-[2rem] rounded flex items-center justify-center px-$m gap-$m select-none"
        >
          Button 2
        </div>
        <div
          tabindex="0"
          class="segmented c8-outlined h-[2rem] rounded flex items-center justify-center px-$m gap-$m select-none"
        >
          Button 3
        </div>
      </div>
    </div>
  </VuCard>
</template>
