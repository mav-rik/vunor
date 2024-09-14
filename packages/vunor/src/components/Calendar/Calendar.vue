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
} from 'radix-vue'
import VuCard from '../Card/Card.vue'
import VuButton from '../Button/Button.vue'
import type { DateValue } from '@internationalized/date'
import type { CalendarRootProps } from 'radix-vue'

const props = defineProps<CalendarRootProps>()
const modelValue = defineModel<DateValue | DateValue[]>()
</script>

<template>
  <CalendarRoot v-bind="props" v-slot="{ weekDays, grid }" as-child v-model="modelValue">
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
