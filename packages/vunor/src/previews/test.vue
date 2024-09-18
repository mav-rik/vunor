<script setup lang="ts">
import VuDatePicker from '../components/DatePicker/DatePicker.vue'
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import VuProgressBar from '../components/ProgressBar/ProgressBar.vue'
import VuButton from '../components/Button/Button.vue'
import { ref, type Ref } from 'vue'

import { CalendarDate } from '@internationalized/date'
import { set } from '@vueuse/core'
import { useAppToasts } from 'vunor'

const { create } = useAppToasts()

const m1 = ref(0)
const m2 = ref(66)
const m3 = ref(100)
const m4 = ref(0)
setInterval(() => {
  m4.value += 25
  if (m4.value >= 150) {
    m4.value = 0
  }
}, 1000)
</script>
<template>
  <VuCard level="h2" class="relative">
    <VuCardHeader class="mb-$s">Test</VuCardHeader>

    <VuButton
      label="Toast"
      class="c8-filled"
      @click="
        create({
          title: 'Title',
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          icon: 'i--info',
          duration: 5000,
          class: 'scope-good surface-100 shadow-none',
        })
      "
    />

    <div class="flex flex-col gap-$l">
      <div class="flex flex-col gap-$m max-w-30em">
        <VuProgressBar v-model="m1" class="h-$m" />
        <VuProgressBar v-model="m2" class="h-$m" />
        <VuProgressBar v-model="m3" class="h-$m" />
        <VuProgressBar v-model="m4" class="h-$m border border-primary bg-current" />
      </div>
      <div class="flex flex-col gap-$m max-w-30em scope-good">
        <VuProgressBar v-model="m2" class="h-$m" />
        <VuProgressBar v-model="m3" class="h-$m" />
        <VuProgressBar v-model="m4" class="h-$m" />
      </div>
      <div class="flex flex-col gap-$m max-w-30em scope-warn">
        <VuProgressBar v-model="m2" class="h-$m" />
        <VuProgressBar v-model="m3" class="h-$m" />
        <VuProgressBar v-model="m4" class="h-$m" />
      </div>
      <div class="flex flex-col gap-$m max-w-30em scope-error">
        <VuProgressBar v-model="m2" class="h-$m" />
        <VuProgressBar v-model="m3" class="h-$m" />
        <VuProgressBar v-model="m4" class="h-$m" />
      </div>
    </div>
  </VuCard>
</template>
