<script setup lang="ts">
const scopes = [
  'scope-background',
  'scope-neutral',
  'scope-primary',
  'scope-secondary',
  'scope-good',
  'scope-warn',
  'scope-error',
]

const types = ['ui-filled', 'ui-bordered', 'ui-light', 'ui-transparent']

const selected = reactive<Record<string, boolean>>({
  'scope-background-ui-transparent': false,
  'scope-neutral-ui-transparent': false,
  'scope-primary-ui-transparent': false,
  'scope-secondary-ui-transparent': false,
  'scope-good-ui-transparent': false,
  'scope-warn-ui-transparent': false,
  'scope-error-ui-transparent': false,
})
</script>

<template>
  <Card level="h2">
    <CardHeader class="mb-$s">Interactable</CardHeader>
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
          <span class="i--interact icon-color size-[1.25em]"></span
          >{{ scope.replace('scope-', '') }}
        </div>
      </div>
    </div>
  </Card>
</template>
