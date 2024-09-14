<script setup lang="ts">
import { DatePickerRoot, DatePickerRootProps, DatePickerTrigger } from 'radix-vue'
import VuIcon from '../Icon/Icon.vue'
import VuInput from '../Input/Input.vue'
import VuDatePickerPopup from './DatePickerPopup.vue'
import VuDatePickerInner from './DatePickerInner.vue'
import { computed } from 'vue'
import { TInputProps, useInputProps } from '../Input'
import { DateValue } from '@internationalized/date'

const props = defineProps<
  DatePickerRootProps & {
    popupRounded?: boolean
    popupClass?: string | string[] | Record<string, boolean>
    openOnClick?: boolean
  } & TInputProps
>()
const open = defineModel<boolean>('open')
const modelValue = defineModel<DateValue>()

const datePickerRootProps = computed(() => {
  return {
    isDateDisabled: props.isDateDisabled,
    pagedNavigation: props.pagedNavigation,
    weekStartsOn: props.weekStartsOn,
    weekdayFormat: props.weekdayFormat,
    fixedWeeks: props.fixedWeeks,
    numberOfMonths: props.numberOfMonths,
    preventDeselect: props.preventDeselect,
    defaultValue: props.defaultValue,
    defaultPlaceholder: props.defaultPlaceholder,
    placeholder: props.placeholder,
    modelValue: props.modelValue,
    hourCycle: props.hourCycle,
    granularity: props.granularity,
    hideTimeZone: props.hideTimeZone,
    maxValue: props.maxValue,
    minValue: props.minValue,
    locale: props.locale,
    disabled: props.disabled,
    readonly: props.readonly,
    isDateUnavailable: props.isDateUnavailable,
    required: props.required,
    id: props.id,
    dir: props.dir,
    defaultOpen: props.defaultOpen,
    modal: props.modal,
  } as DatePickerRootProps
})
const inputProps = useInputProps()

const popupProps = computed(() => {
  return {
    popupRounded: props.popupRounded,
    popupClass: props.popupClass,
  }
})

function onClick($event: MouseEvent) {
  if (props.openOnClick) {
    open.value = true
  } else {
    const focusableElement = ($event.target as HTMLElement)?.querySelector(
      '[tabindex="0"]'
    ) as HTMLElement
    focusableElement?.focus()
  }
}
</script>
<template>
  <DatePickerRoot v-bind="datePickerRootProps" v-model:open="open" v-model="modelValue">
    <VuInput
      v-bind="inputProps"
      design="filled"
      data-has-value
      :active="open"
      icon-append="i--calendar"
      @append-click="open = true"
    >
      <template v-slot:input="slotProps">
        <VuDatePickerInner
          class="i8-input flex items-center"
          v-bind="slotProps"
          @click="onClick"
          :style="{ cursor: props.openOnClick ? 'pointer' : 'text' }"
        />
      </template>
      <template v-slot:append="{ iconAppend, emitClick }">
        <slot name="append" :iconAppend="iconAppend" :emitClick="emitClick">
          <DatePickerTrigger as-child>
            <div class="i8-icon-wrap" @click="emitClick" tabindex="0">
              <VuIcon :name="iconAppend!" />
            </div>
          </DatePickerTrigger>
        </slot>
      </template>
    </VuInput>
    <VuDatePickerPopup v-bind="popupProps" v-if="open" />
  </DatePickerRoot>
</template>
