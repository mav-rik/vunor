<script setup lang="ts">
import { useInputPi } from './pi'
import type { TInputShellProps, TInputShellEmits } from './types'
import { useInputDataAttrs, useHtmlInputAttrs } from './utils'

const props = withDefaults(defineProps<TInputShellProps>(), {
  design: 'flat',
  rows: 3,
})

const emit = defineEmits<TInputShellEmits>()

const modelValue = defineModel<string | number>()

const focused = ref<boolean>(false)

useInputPi().inject(focused)

const attrs = useInputDataAttrs()
const inputAttrs = useHtmlInputAttrs()

function onFocus() {
  focused.value = true
}

function onBlur() {
  focused.value = false
}

function taGrow(event: Event) {
  if (props.autoGrow) {
    const ta = event.target as HTMLTextAreaElement | undefined
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = ta.scrollHeight + 'px'
    }
  }
}

function focusInput(event: MouseEvent) {
  const input = (event.target as HTMLDivElement | undefined)?.querySelector(
    'input, textarea'
  ) as HTMLInputElement
  if (input) {
    input.focus()
  }
}
</script>

<template>
  <Primitive
    @click="focusInput"
    class="i8 group/i8 flex-grow"
    :class="{
      'i8-flat': design === 'flat',
      'i8-filled': design === 'filled' || design === 'round',
      'i8-round': design === 'round',
      'segmented': groupItem,
    }"
    v-bind="attrs"
    :data-active="focused || active"
  >
    <span class="i8-underline" />
    <span class="absolute left-0 right-0 top-0 bottom-0" v-if="!!$slots.overlay">
      <slot name="overlay"></slot>
    </span>

    <div
      v-if="$slots.prepend || !!iconPrepend"
      class="i8-prepend"
      :class="{
        'i8-icon-clickable': !!onPrependClick,
      }"
    >
      <slot name="prepend" v-bind="attrs">
        <Icon :name="iconPrepend!" @click="emit('prependClick', $event)" />
      </slot>
    </div>

    <div class="i8-input-wrapper">
      <div
        v-if="!!label"
        class="i8-label-wrapper"
        :data-has-prepend="inputAttrs?.['data-has-prepend']"
        :data-has-append="inputAttrs?.['data-has-append']"
      >
        <label v-if="!!label" class="i8-label" :data-required="required">{{ label }}</label>
      </div>

      <slot v-bind="inputAttrs!" :onFocus :onBlur>
        <div v-if="type === 'textarea'" class="i8-ta-wrapper">
          <textarea
            v-bind="inputAttrs"
            style="resize: none"
            class="i8-textarea"
            v-model="modelValue"
            @input="taGrow"
            @focus="onFocus"
            @blur="onBlur"
          />
        </div>
        <input
          v-else
          v-bind="inputAttrs"
          class="i8-input"
          v-model="modelValue"
          @focus="onFocus"
          @blur="onBlur"
        />
      </slot>
    </div>

    <div
      v-if="$slots.append || !!iconAppend || loading"
      class="i8-append"
      :class="{
        'i8-icon-clickable': !!onAppendClick,
      }"
    >
      <LoadingIndicator v-if="loading" class="text-grey" />
      <slot
        name="append"
        v-bind="attrs"
        :emitClick="(event: MouseEvent) => emit('appendClick', event)"
        :iconAppend
      >
        <Icon :name="iconAppend!" @click="emit('appendClick', $event)" />
      </slot>
    </div>
  </Primitive>
</template>
