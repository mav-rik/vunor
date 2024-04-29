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
]

const pages = {
  Alerts: PreviewAlerts,
  Cards: PreviewCards,
  Surfaces: PreviewSurfaces,
  Typography: PreviewTypography,
}

const selected = ref<keyof typeof pages>('Surfaces')

const current = computed(() => pages[selected.value])

const dark = useDark()
</script>

<template>
  <app-layout
    left
    scroll-top-on-change-view
    max-w="98rem"
    left-w="16rem"
    left-class="border-r flex flex-col justify-between p-$m"
    class="layer-0 scope-brand"
  >
    <template #left>
      <div class="flex-1 flex flex-col items-end">
        <Menu :items="menu2" v-model="selected"></Menu>
      </div>
      <div class="flex-shrink-1 flex flex-col items-end">
        <div
          class="flex flex-col w-full border-t border-color-black/10 dark:border-color-white/10 pt-$m"
        >
          <card
            asChild
            level="body"
            class="select-none w-full hover:layer-1 rounded-1 p-$m! flex items-center justify-start gap-$m"
          >
            <button @click="dark = !dark">
              <span
                class="size-[1.25em] inline-block opacity-50"
                :class="{
                  'i--dark-mode': !dark,
                  'i--light-mode': dark,
                }"
              ></span>
              <p class="text-mb-0 fw-600 opacity-80">{{ dark ? 'Light' : 'Dark' }} Mode</p>
            </button>
          </card>
        </div>
      </div>
    </template>
    <component :is="current"></component>
  </app-layout>
</template>
