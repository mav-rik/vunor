<script setup lang="ts">
import { useInputPi } from 'vunor'
import type { TInputBaseProps, TInputBaseEmits } from 'vunor'
import { useInputDataAttrs, useHtmlInputAttrs } from 'vunor'
import { Primitive } from 'radix-vue'
import { ref, computed } from 'vue'

import VuLoadingIndicator from '../Loading/LoadingIndicator.vue'
import VuIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<TInputBaseProps>(), {
  design: 'flat',
  rows: 3,
})

const emit = defineEmits<TInputBaseEmits>()

const modelValue = defineModel<string | number>()

const focused = ref<boolean>(false)

useInputPi().inject(focused)

const attrs = useInputDataAttrs()
const inputAttrs = useHtmlInputAttrs()

function onFocus(event: FocusEvent) {
  focused.value = true
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  focused.value = false
  emit('blur', event)
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

const hasValue = computed(() => (modelValue.value ? '' : undefined))
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
    :data-has-value="hasValue"
    :data-active="focused || active"
  >
    <span v-if="!noUnderline" class="i8-underline" />
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
      <slot name="prepend" v-bind="attrs" :data-has-value="hasValue">
        <div class="i8-icon-wrap" @click="emit('prependClick', $event)">
          <VuIcon :name="iconPrepend!" />
        </div>
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
      <div class="i8-loading">
        <VuLoadingIndicator v-if="loading" />
      </div>
      <slot
        v-if="$slots.append || !!iconAppend"
        name="append"
        v-bind="attrs"
        :data-has-value="hasValue"
        :emitClick="(event: MouseEvent) => emit('appendClick', event)"
        :iconAppend
      >
        <div class="i8-icon-wrap" @click="emit('appendClick', $event)">
          <VuIcon :name="iconAppend!" />
        </div>
      </slot>
    </div>
  </Primitive>
</template>
