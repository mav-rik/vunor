<script setup lang="ts">
import { ref } from 'vue'

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
const layers = ['layer-0', 'layer-1', 'layer-2', 'layer-3', 'layer-4']

const toggleOn = ref(false)
const toggleSelect = ref(false)
</script>

<template>
  <VuCard level="h2">
    <VuCardHeader class="mb-$s">Tokens</VuCardHeader>

    <p class="text-body-s text-current-muted mb-$m">
      Demos for the new <code>--current-text-muted</code> and
      <code>--current-{text,bg,border}-hover</code> token slots, the
      <code>disabled-soft</code> shortcut, and <code>c8-flat</code>'s new
      <code>[data-on=true]</code> trigger.
    </p>

    <div class="mb-$xl">
      <h3 class="text-mb-$m">text-current vs text-current-muted (per layer)</h3>
      <p class="text-body-s text-current-muted mb-$m">
        <code>text-current</code> now paints <strong>primary</strong> weight inside any
        <code>layer-X</code>. The previous "muted by default" weight moved to
        <code>text-current-muted</code>.
      </p>
      <div v-for="layer of layers" :key="layer" :class="layer" class="px-$m py-$s mb-$xs">
        <div class="text-body fw-700 mb-$xs">{{ layer }}</div>
        <div class="text-current">text-current — primary weight</div>
        <div class="text-current-muted">text-current-muted — secondary weight</div>
        <div class="text-current-hl">text-current-hl — accent weight</div>
      </div>
    </div>

    <div class="mb-$xl">
      <h3 class="text-mb-$m">border-current-hover (one-step-darker hover)</h3>
      <p class="text-body-s text-current-muted mb-$m">
        Replaces the dual-token literal
        <code>hover:border-scope-light-3 dark:hover:border-scope-dark-3</code>.
      </p>
      <div v-for="layer of layers" :key="`hb-${layer}`" :class="layer" class="px-$m py-$s mb-$xs">
        <div class="text-body fw-700 mb-$xs">{{ layer }}</div>
        <div
          class="inline-block px-$m py-$xs rounded-r1 border-1 current-border-grey-500 border-current hover:border-current-hover transition-all"
        >
          hover me — border steps one shade darker
        </div>
      </div>
    </div>

    <div class="mb-$xl">
      <h3 class="text-mb-$m">bg-current-hover</h3>
      <div v-for="scope of scopes" :key="`hbg-${scope}`" :class="scope" class="layer-0 mb-$xs">
        <div class="px-$m py-$s flex gap-$m items-center">
          <span class="text-caption text-current-muted w-[8em]">{{ scope }}</span>
          <div class="px-$m py-$xs rounded-r1 cursor-pointer hover:bg-current-hover transition-all">
            hover for <code>bg-current-hover</code>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-$xl">
      <h3 class="text-mb-$m">disabled-soft (auto-fires on disabled / aria / data)</h3>
      <div class="layer-0 px-$m py-$s flex gap-$m items-center">
        <button class="disabled-soft c8-flat px-$m py-$xs rounded-r1 cursor-pointer" disabled>
          disabled native
        </button>
        <button
          class="disabled-soft c8-flat px-$m py-$xs rounded-r1 cursor-pointer"
          aria-disabled="true"
        >
          aria-disabled
        </button>
        <a class="disabled-soft inline-flex items-center px-$m py-$xs rounded-r1" data-disabled>
          data-disabled link
        </a>
      </div>
    </div>

    <div class="mb-$xl">
      <h3 class="text-mb-$m">c8-flat reacts to [data-on=true]</h3>
      <p class="text-body-s text-current-muted mb-$m">
        Existing <code>c8-flat-selected</code> trigger plus the new <code>data-[on=true]</code>.
        Click each to toggle.
      </p>
      <div class="layer-0 px-$m py-$s flex gap-$m items-center">
        <button
          :data-on="toggleOn"
          @click="toggleOn = !toggleOn"
          class="scope-primary c8-flat px-$m py-$xs rounded-r1 cursor-pointer select-none"
        >
          [data-on] toggle (currently: {{ toggleOn }})
        </button>
        <button
          :aria-pressed="toggleSelect"
          @click="toggleSelect = !toggleSelect"
          class="scope-primary c8-flat px-$m py-$xs rounded-r1 cursor-pointer select-none"
        >
          [aria-pressed] toggle (currently: {{ toggleSelect }})
        </button>
      </div>
    </div>
  </VuCard>
</template>
