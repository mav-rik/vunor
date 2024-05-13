<script setup lang="ts">
import { useInputPi } from './pi'

type Props = {
  label?: string
  placeholder?: string
  design?: 'flat' | 'filled' | 'round'
  error?: string | boolean
  hint?: string
  iconPrepend?: string
  iconAppend?: string
  iconBefore?: string
  iconAfter?: string
  type?: string
  rows?: number
  autoGrow?: boolean
  limit?: number
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  design: 'flat',
  rows: 3,
})
const modelValue = defineModel()

const { active } = useInputPi().provide()
</script>

<template>
  <div
    class="group"
    :class="{
      'i8-flat': design === 'flat',
      'i8-filled': design === 'filled' || design === 'round',
      'i8-round': design === 'round',
      'scope-error': !!error,
    }"
    :data-error="!!error"
    :data-group-active="active"
  >
    <div class="flex w-full">
      <div class="i8-before" v-if="$slots.before || !!iconBefore">
        <slot name="before">
          <Icon :name="iconBefore!" />
        </slot>
      </div>

      <div class="flex flex-col w-full">
        <div class="flex w-full">
          <slot>
            <Input
              class="w-full"
              :placeholder
              v-model="modelValue"
              :type
              :rows
              :auto-grow
              :label
              :design
              :icon-prepend
              :icon-append
              :limit
              :required
            />
          </slot>
        </div>
        <div class="i8-hint-wrapper">
          <div class="i8-hint">
            <slot v-if="$slots.error || (typeof error === 'string' && error.length)" name="error">
              <span class="text-error-500">
                {{ error }}
              </span>
            </slot>
            <slot v-else-if="!!hint || $slots.hint" name="hint">
              <span>{{ hint }}</span>
            </slot>
          </div>
          <div class="i8-counter" v-if="!!limit || $slots.counter">
            <slot name="counter"> {{ modelValue?.length || 0 }}/{{ limit }} </slot>
          </div>
        </div>
      </div>
      <div class="i8-after" v-if="$slots.after || !!iconAfter">
        <slot name="after">
          <Icon :name="iconAfter!" />
        </slot>
      </div>
    </div>
  </div>
</template>
