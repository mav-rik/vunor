<script setup lang="ts">
import VuDatePicker from '../components/DatePicker/DatePicker.vue'
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import VuCalendar from '../components/Calendar/Calendar.vue'
import { ref, type Ref } from 'vue'

import { CalendarDate } from '@internationalized/date'

const date = new CalendarDate(2022, 9, 1)

const d = ref(date) as Ref<CalendarDate>
</script>
<template>
  <VuCard level="h2" class="relative">
    <VuCardHeader class="mb-$s">Test</VuCardHeader>

    <div class="flex flex-col size-10em bg-red relative">
      <div
        class="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center animate-dialog-in animate-reverse bg-blue"
      ></div>
    </div>
  </VuCard>
</template>
