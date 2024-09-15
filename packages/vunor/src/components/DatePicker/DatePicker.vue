<script setup lang="ts">
import { DatePickerRootProps } from 'radix-vue'
import VuInput from '../Input/Input.vue'
import { TInputProps, useInputProps } from '../Input'
import type { DateValue } from '@internationalized/date'
import VuDatePickerBase from './DatePickerBase.vue'

const props = defineProps<
  DatePickerRootProps & {
    popupRounded?: boolean
    popupClass?: string | string[] | Record<string, boolean>
    openOnClick?: boolean
  } & TInputProps
>()
const open = defineModel<boolean>('open')
const modelValue = defineModel<DateValue>()
const inputProps = useInputProps()
</script>
<template>
  <VuInput
    v-bind="inputProps"
    design="filled"
    data-has-value
    :active="open"
    icon-append="i--calendar"
    @append-click="open = true"
  >
    <VuDatePickerBase v-bind="props" v-model="modelValue" v-model:open="open" />
  </VuInput>
</template>
