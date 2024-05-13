<script setup lang="ts">
import { useInputPi } from './pi'

type Props = {
  label?: string
  placeholder?: string
  design?: 'flat' | 'filled' | 'round'
  iconPrepend?: string
  iconAppend?: string
  groupItem?: boolean
  type?: string
  rows?: number
  autoGrow?: boolean
  limit?: number
  required?: boolean

  // listeners
  onAppendClick?: (event: MouseEvent) => void
  onPrependClick?: (event: MouseEvent) => void
}

const props = withDefaults(defineProps<Props>(), {
  design: 'flat',
  rows: 3,
})

const emit = defineEmits<{
  (e: 'appendClick', event: MouseEvent): void
  (e: 'prependClick', event: MouseEvent): void
}>()

const modelValue = defineModel<string | number>()

const active = ref<boolean>(false)

useInputPi().inject(active)

function focus() {
  active.value = true
}
function blur() {
  active.value = false
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
  <div
    @click="focusInput"
    class="i8 group"
    :class="{
      'i8-flat': design === 'flat',
      'i8-filled': design === 'filled' || design === 'round',
      'i8-round': design === 'round',
      'i8-group-item': groupItem,
    }"
    :data-has-label="!!label"
    :data-has-placeholder="!!placeholder"
    :data-has-value="modelValue !== undefined && modelValue !== null"
    :data-active="active"
    :data-type="type || 'text'"
  >
    <span class="i8-underline" />

    <div
      v-if="$slots.prepend || !!iconPrepend"
      class="i8-prepend"
      :class="{
        'i8-icon-clickable': !!onPrependClick,
      }"
    >
      <slot name="prepend">
        <Icon :name="iconPrepend!" @click="emit('prependClick', $event)" />
      </slot>
    </div>

    <div class="i8-input-wrapper">
      <div
        v-if="!!label"
        class="i8-label-wrapper"
        :data-has-prepend="!!$slots.prepend || !!iconPrepend"
        :data-has-append="!!$slots.append || !!iconAppend"
      >
        <label v-if="!!label" class="i8-label" :data-required="required">{{ label }}</label>
      </div>

      <slot :focus :blur>
        <div v-if="type === 'textarea'" class="i8-ta-wrapper">
          <textarea
            :data-has-prepend="!!$slots.prepend || !!iconPrepend"
            :data-has-append="!!$slots.append || !!iconAppend"
            :data-has-label="!!label"
            :maxlength="limit"
            style="resize: none"
            class="i8-textarea"
            v-model="modelValue"
            :placeholder
            :rows
            :required
            @input="taGrow"
            @focus="focus"
            @blur="blur"
          />
        </div>
        <input
          v-else
          :data-has-prepend="!!$slots.prepend || !!iconPrepend"
          :data-has-append="!!$slots.append || !!iconAppend"
          :data-has-label="!!label"
          :maxlength="limit"
          :required
          :placeholder
          :type="type || 'text'"
          class="i8-input"
          v-model="modelValue"
          @focus="focus"
          @blur="blur"
        />
      </slot>
    </div>

    <div
      v-if="$slots.append || !!iconAppend"
      class="i8-append"
      :class="{
        'i8-icon-clickable': !!onAppendClick,
      }"
    >
      <slot name="append">
        <Icon :name="iconAppend!" @click="emit('appendClick', $event)" />
      </slot>
    </div>
  </div>
</template>
