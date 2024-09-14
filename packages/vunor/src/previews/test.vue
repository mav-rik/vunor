<script setup lang="ts">
import VuDatePicker from '../components/DatePicker/DatePicker.vue'
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import VuCalendar from '../components/Calendar/Calendar.vue'
import { ref } from 'vue'

const d = ref()
</script>
<template>
  <VuCard level="h2" class="relative">
    <VuCardHeader class="mb-$s">Test</VuCardHeader>

    <div class="flex flex-col gap-$m max-w-20em">
      <div>
        {{ JSON.stringify(d) }}
      </div>
      <div>
        <VuCalendar v-model="d" rounded class="border" locale="en-UK" />
      </div>

      <VuDatePicker v-model="d" locale="en-UK" popup-rounded />
      <VuDatePicker v-model="d" locale="en-UK" label="Date" popup-rounded />
      <VuDatePicker v-model="d" locale="en-UK" popup-rounded open-on-click />
      <VuDatePicker v-model="d" locale="en-UK" label="Date" popup-rounded open-on-click />
      <div
        class="bg-red size-5em relative [&[data-today]::before]:content-[''] underline"
        data-today
      >
        test
      </div>
    </div>
  </VuCard>
</template>
