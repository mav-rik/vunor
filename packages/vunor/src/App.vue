<script setup lang="ts">
import { useDark } from '@vueuse/core'

const menu = [
  ['Alerts', '', PreviewAlerts],
  ['Cards', '', PreviewCards],
  ['Surfaces', '', PreviewSurfaces],
  ['Typography', '', PreviewTypography],
]

const menu2 = [
  { group: 'Styles', label: 'Surfaces', value: 'Surfaces', icon: 'i--surfaces' },
  { group: 'Styles', label: 'Typography', value: 'Typography', icon: 'i--typography' },
  { group: 'Components', label: 'Alerts', value: 'Alerts', icon: 'i--alert' },
  { group: 'Components', label: 'Cards', value: 'Cards', icon: 'i--cards' },
  { group: '', label: 'Testing', value: 'Testing', icon: 'i--test' },
]

const pages = {
  Alerts: PreviewAlerts,
  Cards: PreviewCards,
  Surfaces: PreviewSurfaces,
  Typography: PreviewTypography,
  Testing: PreviewTest,
}

const selected = ref<keyof typeof pages>('Testing')

const current = computed(() => pages[selected.value])

const dark = useDark()
</script>

<template>
  <app-layout
    left
    header
    header-class="border-b"
    scroll-top-on-change-view
    max-w="98rem"
    left-w="16rem"
    left-class=" flex flex-col justify-between p-$m border-r"
    main-class="min-h-100vh"
    class="scope-primary layer-0"
  >
    <template #header> Hello </template>
    <template #left>
      <div class="flex-1 flex flex-col items-end">
        <Menu :items="menu2" v-model="selected" class="w-full h-full"></Menu>
      </div>
      <div class="flex-shrink-1 flex flex-col items-end">
        <div
          class="flex flex-col w-full border-t border-color-black/10 dark:border-color-white/10 pt-$m"
        >
          <button
            @click="dark = !dark"
            class="select-none w-full filled hover:bg-hl rounded px-$m flex items-center justify-start gap-$m h-fingertip active:bg-pressed"
          >
            <span
              class="size-[1.5em] inline-block text-icon"
              :class="{
                'i--dark-mode': !dark,
                'i--light-mode': dark,
              }"
            ></span>
            <span class="fw-bold lh-1em">{{ dark ? 'Light' : 'Dark' }} Mode</span>
          </button>
        </div>
      </div>
    </template>
    <component :is="current"></component>
  </app-layout>
</template>
