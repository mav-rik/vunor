<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { ref, computed } from 'vue'

import VuAppLayout from './components/AppLayout/AppLayout.vue'
import VuDevTools from './components/DevTools/DevTools.vue'
import VuIcon from './components/Icon/Icon.vue'
import VuMenu from './components/Menu/Menu.vue'
import VuButton from './components/Button/Button.vue'

import PreviewAlerts from './previews/alerts.vue'
import PreviewButtons from './previews/buttons.vue'
import PreviewDialog from './previews/dialog.vue'
import PreviewOverflowButtons from './previews/overflowbuttons.vue'
import PreviewCards from './previews/cards.vue'
import PreviewCheckboxes from './previews/checkboxes.vue'
import PreviewComboboxes from './previews/comboboxes.vue'
import PreviewRadiobuttons from './previews/radiobuttons.vue'
import PreviewSelects from './previews/selects.vue'
import PreviewSliders from './previews/sliders.vue'
import PreviewSurfaces from './previews/surfaces.vue'
import PreviewLayers from './previews/layers.vue'
import PreviewClickable from './previews/clickable.vue'
import PreviewInputable from './previews/inputable.vue'
import PreviewTypography from './previews/typography.vue'
import PreviewTest from './previews/test.vue'
import PreviewTabs from './previews/tabs.vue'
import PreviewInputs from './previews/inputs.vue'
import PreviewPagination from './previews/pagination.vue'
import PreviewCalendar from './previews/calendar.vue'
import VuAppToasts from './components/AppToasts/AppToasts.vue'

const menu2 = [
  { group: 'Styles', label: 'Clickable (c8)', value: 'Clickable', icon: 'i--click' },
  { group: 'Styles', label: 'Inputable (i8)', value: 'Inputable', icon: 'i--input' },
  { group: 'Styles', label: 'Layers', value: 'Layers', icon: 'i--layers' },
  { group: 'Styles', label: 'Surfaces', value: 'Surfaces', icon: 'i--surfaces' },
  { group: 'Styles', label: 'Typography', value: 'Typography', icon: 'i--typography' },
  // { group: 'Components', label: 'Alerts', value: 'Alerts', icon: 'i--alert' },
  { group: 'Components', label: 'Buttons', value: 'Buttons', icon: 'i--button' },
  { group: 'Components', label: 'Dialog', value: 'Dialog', icon: 'i--dialog' },
  {
    group: 'Components',
    label: 'Overflow Buttons',
    value: 'OverflowButtons',
    icon: 'i--segm-button',
  },
  { group: 'Components', label: 'Calendar', value: 'Calendar', icon: 'i--calendar' },
  { group: 'Components', label: 'Cards', value: 'Cards', icon: 'i--cards' },
  { group: 'Components', label: 'Checkboxes', value: 'Checkboxes', icon: 'i--checkmark' },
  { group: 'Components', label: 'Comboboxes', value: 'Comboboxes', icon: 'i--select' },
  { group: 'Components', label: 'Inputs', value: 'Inputs', icon: 'i--input' },
  { group: 'Components', label: 'Radiobuttons', value: 'Radiobuttons', icon: 'i--radio' },
  { group: 'Components', label: 'Selects', value: 'Selects', icon: 'i--select' },
  { group: 'Components', label: 'Sliders', value: 'Sliders', icon: 'i--slider' },
  { group: 'Components', label: 'Tabs', value: 'Tabs', icon: 'i--tabs' },
  { group: 'Components', label: 'Pagination', value: 'Pagination', icon: 'i--pagination' },
  { group: '', label: 'Testing', value: 'Testing', icon: 'i--test' },
]

const pages = {
  Alerts: PreviewAlerts,
  Buttons: PreviewButtons,
  Dialog: PreviewDialog,
  OverflowButtons: PreviewOverflowButtons,
  Calendar: PreviewCalendar,
  Cards: PreviewCards,
  Checkboxes: PreviewCheckboxes,
  Comboboxes: PreviewComboboxes,
  Radiobuttons: PreviewRadiobuttons,
  Selects: PreviewSelects,
  Sliders: PreviewSliders,
  Surfaces: PreviewSurfaces,
  Layers: PreviewLayers,
  Clickable: PreviewClickable,
  Inputable: PreviewInputable,
  Typography: PreviewTypography,
  Testing: PreviewTest,
  Inputs: PreviewInputs,
  Pagination: PreviewPagination,
  Tabs: PreviewTabs,
}

const selected = ref<keyof typeof pages>('Testing')

const current = computed(() => pages[selected.value])

const dark = useDark()
</script>

<template>
  <vu-app-layout
    left
    header-class="border-b"
    scroll-top-on-change-view
    max-w="98rem"
    left-w="16rem"
    left-class=" flex flex-col justify-between p-$m border-r"
    main-class="min-h-100vh"
    class="layer-0"
  >
    <template #header> Hello </template>
    <template #left>
      <div class="flex-1 flex flex-col items-end">
        <VuMenu :items="menu2" v-model="selected" class="w-full h-full">
          <template #empty>
            <div
              class="py-6 flex flex-col items-center justify-center text-grey-500 current-icon-grey-500 icon-current/75 gap-$s"
            >
              <VuIcon name="i--sad-doc" class="size-4em" />
              <span class="lh-1em">Nothing found</span>
            </div>
          </template>
        </VuMenu>
      </div>
      <div class="flex-shrink-1 flex flex-col items-end">
        <div
          class="flex flex-col w-full border-t border-color-black/10 dark:border-color-white/10 pt-$m"
        >
          <VuButton
            class="c8-flat rounded-fingertip-half text-grey-800 dark:text-grey-300"
            @click="dark = !dark"
            :label="dark ? 'Light' : 'Dark'"
            :icon="dark ? 'i--light-mode' : 'i--dark-mode'"
          />
        </div>
      </div>
    </template>
    <component :is="current"></component>

    <VuDevTools />
    <VuAppToasts swipe-direction="left" />
  </vu-app-layout>
</template>
