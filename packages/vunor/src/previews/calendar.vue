<script setup lang="ts">
import VuDatePicker from '../components/DatePicker/DatePicker.vue'
import VuDatePickerBase from '../components/DatePicker/DatePickerBase.vue'
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import VuCalendar from '../components/Calendar/Calendar.vue'
import VuInput from '../components/Input/Input.vue'
import { ref, type Ref } from 'vue'

import { CalendarDate } from '@internationalized/date'

const date = new CalendarDate(2022, 9, 1)

const d = ref(date) as Ref<CalendarDate>
// const range = ref({ start: new CalendarDate(2022, 9, 1), end: new CalendarDate(2022, 9, 7) })
const multiDates = ref([
  new CalendarDate(2022, 9, 1),
  new CalendarDate(2022, 9, 15),
  new CalendarDate(2022, 9, 30),
]) as Ref<CalendarDate[]>
</script>
<template>
  <VuCard level="h2" class="relative">
    <VuCardHeader class="mb-$s">Calendar</VuCardHeader>

    <div class="flex flex-col gap-$m max-w-30em">
      <div>
        <h6>Default Calendar</h6>
        <VuCalendar v-model="d" rounded class="border" locale="en-UK" />
      </div>
      <!-- <div>
        <h6>Range Selection Calendar</h6>
        <VuCalendar v-model="range" rounded class="border" locale="en-UK" selection-mode="range" />
      </div> -->
      <div>
        <h6>Multiple Dates Selection Calendar</h6>
        <VuCalendar v-model="multiDates" rounded class="border" locale="en-UK" multiple />
      </div>

      <div>
        <h6>Default DatePicker</h6>
        <VuDatePicker design="filled" v-model="d" locale="en-UK" popup-rounded />
      </div>
      <div>
        <h6>DatePicker with Label</h6>
        <VuDatePicker
          design="filled"
          v-model="d"
          locale="en-UK"
          label="Select Date"
          popup-rounded
        />
      </div>
      <div>
        <h6>DatePicker with Open on Click</h6>
        <VuDatePicker design="filled" v-model="d" locale="en-UK" popup-rounded open-on-click />
      </div>
      <div>
        <h6>Segmented</h6>
        <VuInput design="filled">
          <VuDatePickerBase
            design="filled"
            v-model="d"
            label="Date"
            locale="en-UK"
            popup-rounded
            open-on-click
            group-item
          />
          <VuDatePickerBase
            design="filled"
            v-model="d"
            label="Date"
            locale="en-UK"
            popup-rounded
            open-on-click
            group-item
          />
        </VuInput>
      </div>
      <!-- <div>
        <h6>Range DatePicker</h6>
        <VuDatePicker v-model="range" locale="en-UK" popup-rounded selection-mode="range" />
      </div> -->
    </div>
  </VuCard>
</template>
