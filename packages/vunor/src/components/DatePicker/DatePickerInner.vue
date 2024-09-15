<script setup lang="ts">
import { DatePickerField, DatePickerInput } from 'radix-vue'
const emit = defineEmits<{
  (e: 'keydown-enter'): void
}>()
</script>

<template>
  <DatePickerField v-slot="{ segments }">
    <div class="flex items-center">
      <template v-for="item in segments" :key="item.part">
        <DatePickerInput
          v-if="item.part === 'literal'"
          :part="item.part"
          @click.stop
          class="date-picker-literal"
          @keydown.enter="emit('keydown-enter')"
        >
          {{ item.value === '/' ? '.' : item.value }}
        </DatePickerInput>
        <DatePickerInput v-else @click.stop :part="item.part" class="date-picker-input px-0">
          {{ item.value }}
        </DatePickerInput>
      </template>
    </div>
  </DatePickerField>
</template>
