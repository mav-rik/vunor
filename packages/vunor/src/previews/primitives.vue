<script setup lang="ts">
import { ref } from 'vue'

import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'

const search = ref('')
const renaming = ref('untitled')
const errored = ref('')
</script>

<template>
  <VuCard level="h2">
    <VuCardHeader class="mb-$s">Public Primitives</VuCardHeader>

    <p class="text-body-s text-current-muted mb-$m">
      Public-tier shortcuts: hand-rolled inputs/buttons/menus that compose the same primitives
      <code>&lt;VuInput&gt;</code>, <code>&lt;VuButton&gt;</code>, <code>&lt;VuMenu&gt;</code> use
      internally.
    </p>

    <!-- i8-bare -->
    <div class="mb-$xl">
      <h3 class="text-mb-$m">i8-bare — standalone &lt;input&gt; without an i8 wrapper</h3>
      <p class="text-body-s text-current-muted mb-$m">
        Use when you don't want the wrapper div around every input — search boxes, inline rename
        fields, popover entry fields. Padding / height stay external.
      </p>
      <div class="layer-0 p-$m flex flex-col gap-$m">
        <input v-model="search" class="i8-bare h-fingertip-s px-$m" placeholder="search…" />
        <input v-model="renaming" class="i8-bare h-fingertip-s px-$m" placeholder="rename…" />
        <input
          v-model="errored"
          data-error="true"
          class="i8-bare h-fingertip-s px-$m"
          placeholder="error state via data-error"
        />
        <input
          aria-disabled="true"
          disabled
          class="i8-bare h-fingertip-s px-$m"
          placeholder="disabled"
        />
        <input
          class="scope-primary i8-bare h-fingertip-s px-$m rounded-fingertip-half"
          placeholder="rounded + scoped"
        />
      </div>
    </div>

    <!-- public btn family -->
    <div class="mb-$xl">
      <h3 class="text-mb-$m">btn — layout primitive for hand-rolled clickables</h3>
      <p class="text-body-s text-current-muted mb-$m">
        Promoted from <code>&lt;VuButton&gt;</code>-internal to public. Compose with any
        <code>c8-*</code> for color and a <code>scope-*</code> for theming.
      </p>
      <div class="layer-0 p-$m flex flex-wrap gap-$m items-center">
        <button class="scope-primary c8-filled btn cursor-pointer">Save</button>
        <button class="scope-primary c8-flat btn cursor-pointer">Cancel</button>
        <button class="scope-primary c8-outlined btn cursor-pointer">Outline</button>
        <button class="scope-error c8-filled btn cursor-pointer">Delete</button>
        <button class="c8-chrome btn cursor-pointer">Chrome</button>
        <button class="scope-primary c8-filled btn btn-square cursor-pointer">
          <span class="i--save btn-icon" />
        </button>
        <button class="scope-primary c8-filled btn btn-round cursor-pointer">
          <span class="i--save btn-icon btn-icon-left" />
          <span class="btn-label">Round</span>
        </button>
        <button class="scope-primary c8-filled btn cursor-pointer" disabled>
          <span class="btn-label">Disabled</span>
        </button>
      </div>
    </div>

    <!-- popup-card with menu-item rows -->
    <div class="mb-$xl">
      <h3 class="text-mb-$m">popup-card + public menu-item</h3>
      <p class="text-body-s text-current-muted mb-$m">
        <code>popup-card</code> is the surface chrome for hand-rolled popovers / listboxes.
        <code>menu-item</code> is the row primitive — both promoted from component-internal to
        public.
      </p>
      <div class="flex flex-wrap gap-$m">
        <div class="popup-card w-[14em] py-$xs">
          <button class="menu-item cursor-pointer">
            <span class="i--save" />
            <span>Save</span>
          </button>
          <button class="menu-item cursor-pointer">
            <span class="i--copy" />
            <span>Duplicate</span>
          </button>
          <button class="menu-item cursor-pointer" aria-pressed="true">
            <span class="i--checkmark" />
            <span>Pinned</span>
          </button>
          <button class="menu-item cursor-pointer">
            <span class="i--close" />
            <span>Delete</span>
          </button>
        </div>
        <div class="scope-primary popup-card w-[14em] py-$xs">
          <button class="menu-item cursor-pointer">scope-primary row</button>
          <button class="menu-item cursor-pointer" data-on="true">selected via data-on</button>
          <button class="menu-item cursor-pointer">third row</button>
        </div>
      </div>
    </div>
  </VuCard>
</template>
