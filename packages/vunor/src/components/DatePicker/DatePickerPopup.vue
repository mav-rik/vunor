<script setup lang="ts">
import {
  DatePickerContent,
  DatePickerArrow,
  DatePickerCalendar,
  DatePickerHeader,
  DatePickerPrev,
  DatePickerHeading,
  DatePickerNext,
  DatePickerGrid,
  DatePickerGridHead,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerGridBody,
  DatePickerCell,
  DatePickerCellTrigger,
} from 'radix-vue'
import VuCard from '../Card/Card.vue'
import VuButton from '../Button/Button.vue'
import type { TVueCssClass } from 'vunor/utils'

const props = defineProps<{
  popupRounded?: boolean
  popupClass?: TVueCssClass
}>()
</script>
<template>
  <DatePickerContent as-child>
    <VuCard
      level="body"
      class="date-picker-root"
      v-bind="$attrs"
      :rounded="popupRounded"
      :class="popupClass"
    >
      <DatePickerArrow class="fill-current-bg" />
      <DatePickerCalendar v-slot="{ weekDays, grid }">
        <DatePickerHeader class="calendar-header">
          <DatePickerPrev as-child>
            <VuButton class="c8-flat btn-square" icon="i--chevron-left" />
          </DatePickerPrev>

          <DatePickerHeading />

          <DatePickerNext as-child>
            <VuButton class="c8-flat btn-square" icon="i--chevron-right" />
          </DatePickerNext>
        </DatePickerHeader>

        <div class="calendar-month-grid">
          <DatePickerGrid v-for="month in grid" :key="month.value.toString()" class="select-none">
            <DatePickerGridHead>
              <DatePickerGridRow class="calendar-grid-row">
                <DatePickerHeadCell v-for="day in weekDays" :key="day" class="wf-$bold">
                  {{ day }}
                </DatePickerHeadCell>
              </DatePickerGridRow>
            </DatePickerGridHead>
            <DatePickerGridBody>
              <DatePickerGridRow
                v-for="(weekDates, index) in month.rows"
                :key="`weekDate-${index}`"
                class="calendar-grid-row"
              >
                <DatePickerCell
                  v-for="weekDate in weekDates"
                  :key="weekDate.toString()"
                  :date="weekDate"
                  class="relative text-center"
                >
                  <DatePickerCellTrigger
                    :day="weekDate"
                    :month="month.value"
                    class="calendar-cell"
                  />
                </DatePickerCell>
              </DatePickerGridRow>
            </DatePickerGridBody>
          </DatePickerGrid>
        </div>
      </DatePickerCalendar>
    </VuCard>
  </DatePickerContent>
</template>
