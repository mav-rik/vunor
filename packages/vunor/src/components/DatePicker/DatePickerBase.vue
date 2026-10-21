<script setup lang="ts">
import { DatePickerRoot, type DatePickerRootProps, DatePickerTrigger } from 'reka-ui'
import { type ComponentPublicInstance, computed, ref, watch, nextTick } from 'vue'

import { claimToggle, useForwardToRoot, useModelState, useRootBinding } from '../forward-root'
import VuIcon from '../Icon/Icon.vue'
import VuInputBase from '../Input/InputBase.vue'
import { type TInputProps, useInputProps } from '../Input/utils'
import VuDatePickerInner from './DatePickerInner.vue'
import VuDatePickerPopup from './DatePickerPopup.vue'

import type { DateValue } from '@internationalized/date'
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
// DatePickerRoot renders no element of its own: fallthrough attrs go to the input shell.
defineOptions({ inheritAttrs: false })

const open = defineModel<boolean>('open', { default: undefined })
const modelValue = defineModel<DateValue>()
const emit = defineEmits<{
  (e: 'keydown-enter'): void
  (e: 'update:placeholder', date: DateValue): void
}>()

// DatePickerRoot props declared on this component. `placeholder` is excluded: on vunor
// inputs it is the placeholder text; set the initially shown month with `defaultPlaceholder`.
const rootProps = useForwardToRoot(DatePickerRoot, props, emit, [
  'modelValue',
  'open',
  'placeholder',
  'update:modelValue',
  'update:open',
])
const inputProps = useInputProps()
// what the shell, the popup and the click handlers see: equals DatePickerRoot's open state
const isOpen = useModelState(open, DatePickerRoot, 'defaultOpen', props)

const rootOpen = useRootBinding(open, isOpen)

// The default append icon is Reka's DatePickerTrigger (`data-vu-trigger`), which toggles the
// root itself; claimToggle leaves its clicks to it, so only custom append content (calling
// `emitClick`) opens the picker here.
function onAppendClick(event: MouseEvent) {
  if (claimToggle(event)) {
    isOpen.value = true
  }
}

// the trigger icon is a focusable div: Enter / Space activate it like a click
function activateTrigger(event: KeyboardEvent) {
  ;(event.currentTarget as HTMLElement | null)?.click()
}

const popupProps = computed(() => {
  return {
    popupRounded: props.popupRounded,
    popupClass: props.popupClass,
  }
})

function onClick($event: MouseEvent) {
  if (props.openOnClick) {
    if (claimToggle($event)) {
      isOpen.value = true
    }
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
 * because in the current version of reka-ui there's an issue
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
  if (!newValue && !isOpen.value) {
    await nextTick()
    inputBase.value?.$el.querySelector('[tabindex="0"]')?.focus()
  }
}
</script>
<template>
  <DatePickerRoot
    v-bind="rootProps"
    :open="rootOpen"
    @update:open="(value: boolean) => (open = value)"
    v-model="modelValue"
    @update:model-value="onUpdate"
  >
    <VuInputBase
      v-bind="{ 'data-has-value': '', ...$attrs, ...inputProps }"
      ref="inputBase"
      :active="isOpen"
      icon-append="i--calendar"
      @append-click="onAppendClick"
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
            <div
              class="i8-icon-wrap"
              data-vu-trigger
              role="button"
              tabindex="0"
              aria-label="Open calendar"
              @click="emitClick"
              @keydown.enter.space.prevent="activateTrigger"
            >
              <VuIcon :name="iconAppend!" />
            </div>
          </DatePickerTrigger>
        </slot>
      </template>
    </VuInputBase>
    <VuDatePickerPopup v-bind="popupProps" v-if="isOpen" />
  </DatePickerRoot>
</template>
