<script setup lang="ts">
import { useDark } from '@vueuse/core'

const menu = [
  ['Alerts', '', PreviewAlerts],
  ['Cards', '', PreviewCards],
  ['Surfaces', '', PreviewSurfaces],
  ['Typography', '', PreviewTypography],
]

const current = ref(menu[0])

const dark = useDark()
</script>

<template>
  <div class="layer-0 scope-background min-h-100vh w-full flex">
    <aside
      class="surface-1 card-h6 w-xs border border-color-black/10 dark:border-color-white/10 flex flex-col h-100vh"
    >
      <div class="flex-1 flex flex-col gap-1">
        <card
          asChild
          level="body"
          v-for="item of menu"
          :data-selected="item[0] === current[0]"
          class="layer-1 text-left fw-bold w-full hover:surface-2 data-[selected=true]:surface-3 hover:data-[selected=true]:surface-3 rounded-2 p-$m!"
        >
          <button @click="current = item">
            <p class="text-my-0">{{ item[0] }}</p>
          </button>
        </card>
      </div>
      <div class="flex-shrink-1 py-h6 border-t border-color-black/10 dark:border-color-white/10">
        <card
          asChild
          level="body"
          class="layer-1 text-left fw-bold w-full hover:surface-2 rounded-2 p-$m!"
        >
          <button @click="dark = !dark">
            <p class="text-my-0">{{ dark ? 'Light' : 'Dark' }} Mode</p>
          </button>
        </card>
      </div>
    </aside>

    <main class="h-100vh flex-1 overflow-auto">
      <div class="max-w-90rem w-full mx-auto">
        <component :is="current[2]"></component>
      </div>
    </main>
  </div>
</template>
