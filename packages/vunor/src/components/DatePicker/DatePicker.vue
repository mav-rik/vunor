<script setup lang="ts">
import { DatePickerRoot } from 'reka-ui'

import { useForwardToRoot, useModelState } from '../forward-root'
import VuInput from '../Input/Input.vue'
import { type TInputProps, useInputBaseProps, useInputProps } from '../Input/utils'
import VuDatePickerBase from './DatePickerBase.vue'

import type { DateValue } from '@internationalized/date'
import type { DatePickerRootProps } from 'reka-ui'
import type { TVueCssClass } from 'vunor/utils'

const props = withDefaults(
  defineProps<
    // `placeholder` is the input placeholder text (TInputProps), not Reka's placeholder date
    Omit<DatePickerRootProps, 'placeholder'> & {
      popupRounded?: boolean
      popupClass?: TVueCssClass
      openOnClick?: boolean
    } & TInputProps
  >(),
  {
    // forwarded booleans: absent stays undefined (see forward-root.ts)
    hideTimeZone: undefined,
    disabled: undefined,
    readonly: undefined,
    required: undefined,
    defaultOpen: undefined,
    modal: undefined,
    pagedNavigation: undefined,
    fixedWeeks: undefined,
    preventDeselect: undefined,
    closeOnSelect: undefined,
  }
)
const open = defineModel<boolean>('open', { default: undefined })
const modelValue = defineModel<DateValue>()
const emit = defineEmits<{
  (e: 'update:placeholder', date: DateValue): void
}>()

const inputProps = useInputProps()
// what the input shell sees: equals DatePickerRoot's open state (also when uncontrolled)
const isOpen = useModelState(open, DatePickerRoot, 'defaultOpen', props)
const inputBaseProps = useInputBaseProps()
// DatePickerRoot props declared on this component, for VuDatePickerBase (see there)
const rootProps = useForwardToRoot(DatePickerRoot, props, emit, [
  'modelValue',
  'open',
  'placeholder',
  'update:modelValue',
  'update:open',
])
</script>
<template>
  <VuInput v-bind="inputProps" design="filled" data-has-value :active="isOpen">
    <VuDatePickerBase
      v-bind="{ ...inputBaseProps, ...rootProps }"
      :popup-rounded
      :popup-class
      :open-on-click
      v-model="modelValue"
      v-model:open="open"
    />
  </VuInput>
</template>
