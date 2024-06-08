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

const types = ['c8-filled', 'c8-outlined', 'c8-light', 'c8-flat']

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
  </VuCard>
</template>
