<script setup lang="ts">
import type { TSelectItems } from '../components/Select/types'
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
  <Card level="h2" class="with-bg relative">
    <CardHeader class="mb-$s">Selects</CardHeader>

    <div class="relative mb-$xxl flex flex-col gap-$l">
      <div class="flex gap-$m flex-wrap">
        <Select
          v-for="design of designs"
          @append-click.stop="v1 ? (v1 = undefined) : ''"
          :icon-append="!!v1 ? 'i--clear' : undefined"
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
        <Select
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
        <Select
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
        <Select
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
    </div>

    <div class="relative mb-$xxl flex flex-col gap-$l max-w-sm">
      <Input design="round" icon-before="i--cake">
        <Select
          group-item
          icon-prepend="i--day"
          :items="getDays(month, year)"
          :disabled-values="disabled"
          v-model="day"
          placeholder="Day"
          design="round"
        />
        <Select
          group-item
          icon-prepend="i--month"
          :items="months"
          :disabled-values="disabled"
          v-model="month"
          placeholder="Month"
          design="round"
        />
        <Select
          group-item
          :items="years"
          :disabled-values="disabled"
          v-model="year"
          placeholder="Year"
          design="round"
        />
      </Input>
    </div>
  </Card>
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
