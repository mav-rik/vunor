<script setup lang="ts">
import type { DatePickerRootProps } from 'radix-vue'
import VuInput from '../Input/Input.vue'
import { type TInputProps, useInputProps } from 'vunor'
import type { DateValue } from '@internationalized/date'
import VuDatePickerBase from './DatePickerBase.vue'
import type { TVueCssClass } from '../utils/merge-class'

const props = defineProps<
  DatePickerRootProps & {
    popupRounded?: boolean
    popupClass?: TVueCssClass
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
