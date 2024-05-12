<script setup lang="ts">
import { useDark } from '@vueuse/core'

const menu2 = [
  { group: 'Styles', label: 'Clickable (c8)', value: 'Clickable', icon: 'i--click' },
  { group: 'Styles', label: 'Inputable (i8)', value: 'Inputable', icon: 'i--input' },
  { group: 'Styles', label: 'Layers', value: 'Layers', icon: 'i--layers' },
  { group: 'Styles', label: 'Surfaces', value: 'Surfaces', icon: 'i--surfaces' },
  { group: 'Styles', label: 'Typography', value: 'Typography', icon: 'i--typography' },
  { group: 'Components', label: 'Alerts', value: 'Alerts', icon: 'i--alert' },
  { group: 'Components', label: 'Buttons', value: 'Buttons', icon: 'i--button' },
  { group: 'Components', label: 'Cards', value: 'Cards', icon: 'i--cards' },
  { group: 'Components', label: 'Inputs', value: 'Inputs', icon: 'i--input' },
  { group: '', label: 'Testing', value: 'Testing', icon: 'i--test' },
]

const pages = {
  Alerts: PreviewAlerts,
  Buttons: PreviewButtons,
  Cards: PreviewCards,
  Surfaces: PreviewSurfaces,
  Layers: PreviewLayers,
  Clickable: PreviewClickable,
  Inputable: PreviewInputable,
  Typography: PreviewTypography,
  Testing: PreviewTest,
  Inputs: PreviewInputs,
}

const selected = ref<keyof typeof pages>('Testing')

const current = computed(() => pages[selected.value])

const dark = useDark()
</script>

<template>
  <app-layout
    left
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
        <Menu :items="menu2" v-model="selected" class="w-full h-full">
          <template #empty>
            <div
              class="py-6 flex flex-col items-center justify-center text-grey-500 current-icon-grey-500 icon-current/75 gap-$s"
            >
              <Icon name="i--sad-doc" class="size-4em" />
              <span class="lh-1em">Nothing found</span>
            </div>
          </template>
        </Menu>
      </div>
      <div class="flex-shrink-1 flex flex-col items-end">
        <div
          class="flex flex-col w-full border-t border-color-black/10 dark:border-color-white/10 pt-$m"
        >
          <Button
            class="c8-flat rounded-half-fingertip text-grey-800 dark:text-grey-300"
            @click="dark = !dark"
            :label="dark ? 'Light' : 'Dark'"
            :icon="dark ? 'i--light-mode' : 'i--dark-mode'"
          />
        </div>
      </div>
    </template>
    <component :is="current"></component>
  </app-layout>
</template>
