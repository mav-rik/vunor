<script setup lang="ts">
import {
  CalendarRoot,
  CalendarHeader,
  CalendarPrev,
  CalendarNext,
  CalendarHeading,
  CalendarGrid,
  CalendarGridHead,
  CalendarGridBody,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarCell,
  CalendarCellTrigger,
} from 'reka-ui'

import VuButton from '../Button/Button.vue'
import VuCard from '../Card/Card.vue'
import { useForwardToRoot } from '../forward-root'

import type { DateValue } from '@internationalized/date'
import type { CalendarRootProps } from 'reka-ui'

// CalendarRoot (as-child) renders a Fragment (card + live region), so fallthrough
// attrs are bound explicitly to the card.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Omit<CalendarRootProps, 'as' | 'asChild'>>(), {
  // forwarded booleans: absent stays undefined (see forward-root.ts)
  pagedNavigation: undefined,
  preventDeselect: undefined,
  fixedWeeks: undefined,
  disabled: undefined,
  readonly: undefined,
  initialFocus: undefined,
  multiple: undefined,
  disableDaysOutsideCurrentView: undefined,
})
const modelValue = defineModel<DateValue | DateValue[]>()
const emit = defineEmits<{
  (e: 'update:placeholder', date: DateValue): void
}>()

// CalendarRoot props/emits declared on this component (as-child is layout-controlled)
const rootProps = useForwardToRoot(CalendarRoot, props, emit, [
  'modelValue',
  'as',
  'asChild',
  'update:modelValue',
])
</script>

<template>
  <CalendarRoot v-bind="rootProps" v-slot="{ weekDays, grid }" as-child v-model="modelValue">
    <VuCard level="body" class="calendar-root" v-bind="$attrs">
      <CalendarHeader class="calendar-header">
        <CalendarPrev as-child>
          <VuButton class="c8-flat btn-square" icon="i--chevron-left" />
        </CalendarPrev>

        <CalendarHeading />

        <CalendarNext as-child>
          <VuButton class="c8-flat btn-square" icon="i--chevron-right" />
        </CalendarNext>
      </CalendarHeader>

      <div class="calendar-month-grid">
        <CalendarGrid v-for="month in grid" :key="month.value.toString()" class="select-none">
          <CalendarGridHead>
            <CalendarGridRow class="calendar-grid-row">
              <CalendarHeadCell v-for="day in weekDays" :key="day" class="fw-$bold">
                {{ day }}
              </CalendarHeadCell>
            </CalendarGridRow>
          </CalendarGridHead>

          <CalendarGridBody class="grid mt-$s">
            <CalendarGridRow
              v-for="(weekDates, index) in month.rows"
              :key="`weekDate-${index}`"
              class="calendar-grid-row"
            >
              <CalendarCell
                v-for="weekDate in weekDates"
                :key="weekDate.toString()"
                :date="weekDate"
                class="relative text-center"
              >
                <CalendarCellTrigger :day="weekDate" :month="month.value" class="calendar-cell" />
              </CalendarCell>
            </CalendarGridRow>
          </CalendarGridBody>
        </CalendarGrid>
      </div>
    </VuCard>
  </CalendarRoot>
</template>
