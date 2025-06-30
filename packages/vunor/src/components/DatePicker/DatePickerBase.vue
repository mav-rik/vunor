<script setup lang="ts">
import { DatePickerRoot, type DatePickerRootProps, DatePickerTrigger } from 'radix-vue'
import VuIcon from '../Icon/Icon.vue'
import VuInputBase from '../Input/InputBase.vue'
import VuDatePickerPopup from './DatePickerPopup.vue'
import VuDatePickerInner from './DatePickerInner.vue'
import { type ComponentPublicInstance, computed } from 'vue'
import { type TInputProps, useInputProps } from '../Input/utils'
import type { DateValue } from '@internationalized/date'
import { ref, watch, nextTick } from 'vue'
import type { TVueCssClass } from 'vunor/utils'

const props = defineProps<
  DatePickerRootProps & {
    popupRounded?: boolean
    popupClass?: TVueCssClass
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
    // if not open on click, then the input should be focused when clicking
    const focusableElement = ($event.target as HTMLElement)?.querySelector(
      '[tabindex="0"]'
    ) as HTMLElement
    focusableElement?.focus()
  }
}

const datePickerInnerKey = ref(0) // used to force an update of the datepicker input
const inputBase = ref<ComponentPublicInstance<typeof VuInputBase> | null>(null)

/*
 * This watch is used to force an update of the datepicker input,
 * because in the current version of radix-vue there's an issue
 * where the date is not updated when the model is set to undefined.
 */
watch([modelValue], () => {
  if (!modelValue.value) {
    datePickerInnerKey.value += 1
  }
})

/**
 * Handles the update event for the date picker.
 * If the new value is empty and the picker is closed, it focuses the input element.
 * @param {DateValue} [newValue] - The new date value
 */
async function onUpdate(newValue?: DateValue) {
  if (!newValue && !open.value) {
    await nextTick()
    inputBase.value?.$el.querySelector('[tabindex="0"]')?.focus()
  }
}
const emit = defineEmits<{
  (e: 'keydown-enter'): void
}>()
</script>
<template>
  <DatePickerRoot
    v-bind="datePickerRootProps"
    v-model:open="open"
    v-model="modelValue"
    @update:model-value="onUpdate"
  >
    <VuInputBase
      v-bind="inputProps"
      ref="inputBase"
      data-has-value
      :active="open"
      icon-append="i--calendar"
      @append-click="open = true"
    >
      <template v-slot="slotProps">
        <VuDatePickerInner
          :key="String(datePickerInnerKey)"
          class="i8-input flex items-center"
          v-bind="slotProps"
          @click="onClick"
          @keydown.enter="emit('keydown-enter')"
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
    </VuInputBase>
    <VuDatePickerPopup v-bind="popupProps" v-if="open" />
  </DatePickerRoot>
</template>
