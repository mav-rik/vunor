<script setup lang="ts">
import type { TSelectItems } from '../components/Select/types'
import { ref } from 'vue'

import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import VuSelectBase from '../components/Select/SelectBase.vue'
import VuSelect from '../components/Select/Select.vue'
import VuInput from '../components/Input/Input.vue'

const designs = ['flat', 'filled', 'round'] as const
const items: TSelectItems = {
  '': [{ value: null, label: 'None' }],
  'Fruits': [
    { value: '👍 Durian', label: '❓ Secret', search: 'durian' },
    '🍏 Apple',
    '🍌 Banana',
    '🫐 Blueberry',
    '🍇 Grapes',
    '🍍 Pineapple',
  ],
  'Vegetables': ['🍆 Aubergine', '🥦 Broccoli', '🥕 Carrot', 'Courgette', 'Leek'],
}
const disabled = ['Courgette']

const months: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const years: string[] = Array.from({ length: 2025 - 2017 + 1 }, (v, i) => String(2017 + i))

function getDays(month?: string, year?: string): string[] {
  if (!month) {
    return Array.from({ length: 31 }, (v, i) => String(i + 1))
  }

  const monthIndex = months.indexOf(month)
  if (monthIndex === -1) throw new Error('Invalid month')

  let days: number
  const daysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate()
  }

  if (year) {
    const yearNum = parseInt(year)

    days = daysInMonth(monthIndex, yearNum)
  } else {
    days = daysInMonth(monthIndex, 2001)
  }
  return Array.from({ length: days }, (v, i) => String(i + 1))
}

const day = ref<string>()
const month = ref<string>()
const year = ref<string>()

const v1 = ref<string>()
</script>
<template>
  <VuCard level="h2" class="with-bg relative">
    <VuCardHeader class="mb-$s">Selects</VuCardHeader>

    <div class="relative mb-$xxl flex flex-col gap-$l">
      <h4>Base Select</h4>
      <div
        class="flex gap-$m flex-wrap"
        v-for="scope of ['scope-primary', 'scope-secondary', 'scope-error']"
        :class="scope"
      >
        <VuSelectBase
          v-for="design of ['c8-filled', 'c8-outlined', 'c8-light', 'c8-flat']"
          class="w-15em pr-$m c8 btn px-0! min-w-100px inline-flex items-center justify-between"
          :class="{
            'btn-round': design === 'c8-filled',
            [design]: true,
          }"
          :value-class="{
            'pl-fingertip-half': design === 'c8-filled',
            'pl-$s': design !== 'c8-filled',
          }"
          :icon-class="{
            'mr-$m': design === 'c8-filled',
            'mr-$s': design !== 'c8-filled',
          }"
          :popup-class="{
            [scope]: true,
          }"
          :design
          :items
          :disabled-values="disabled"
          popup-position="popper"
          placeholder="Pick an item"
        />
      </div>

      <h4 class="text-mt-$m">Select (Inputs)</h4>
      <div class="flex gap-$m flex-wrap">
        <VuSelect
          v-for="design of designs"
          @append-click.stop="v1 ? (v1 = undefined) : ''"
          :popup-class="{
            'scope-primary': true,
          }"
          class="max-w-sm"
          v-model="v1"
          :design
          :items
          :disabled-values="disabled"
          :hint="`Value = ${v1}`"
          label="A fruit or Vegetable"
        />
      </div>

      <div class="flex gap-$m flex-wrap">
        <VuSelect
          v-for="design of designs"
          class="max-w-sm"
          :popup-class="{
            'scope-primary': true,
          }"
          :design
          :items
          :disabled-values="disabled"
          placeholder="Pick an item"
        />
      </div>
      <div class="flex gap-$m flex-wrap scope-good">
        <VuSelect
          v-for="design of designs"
          class="max-w-sm"
          :popup-class="{
            'scope-good': true,
          }"
          icon-append=""
          icon-prepend="i--chevron-down"
          :design
          :items
          :disabled-values="disabled"
          placeholder="Pick an item"
        />
      </div>
      <div class="flex gap-$m flex-wrap scope-warn">
        <VuSelect
          v-for="design of designs"
          class="max-w-sm"
          :popup-class="{
            'scope-warn': true,
          }"
          icon-append="i--search"
          :design
          :items
          :disabled-values="disabled"
          placeholder="Pick an item"
        />
      </div>
      <h4 class="text-mb-$s text-mt-$m">Groupped Selects</h4>
      <div class="relative mb-$xxl flex flex-col gap-$l max-w-lg">
        <VuInput design="round" icon-before="i--cake" group-template="2fr 3fr 2fr">
          <VuSelect
            group-item
            popup-position="popper"
            icon-prepend="i--day"
            :items="getDays(month, year)"
            :disabled-values="disabled"
            v-model="day"
            placeholder="Day"
            design="round"
          />
          <VuSelect
            group-item
            popup-position="popper"
            icon-prepend="i--month"
            :items="months"
            :disabled-values="disabled"
            v-model="month"
            placeholder="Month"
            design="round"
          />
          <VuSelect
            group-item
            popup-position="popper"
            :items="years"
            :disabled-values="disabled"
            v-model="year"
            placeholder="Year"
            design="round"
          />
        </VuInput>
      </div>
    </div>
  </VuCard>
</template>

<style scoped>
.with-bg {
  position: relative;
  min-height: 100vh;
}
.with-bg:before {
  content: ' ';
  position: fixed;
  pointer-events: none;
  margin-left: -2.5em;
  width: 80vw;
  top: 0;
  height: 100vh;
  background-image: url(/bg7.png);
  background-size: cover;
  mix-blend-mode: darken;
  opacity: 0.05;
}
.dark .with-bg:before {
  mix-blend-mode: overlay;
  opacity: 0.25;
}
</style>
