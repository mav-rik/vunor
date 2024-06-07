<script setup lang="ts">
import { useInputPi } from './pi'
import type { TInputProps, TInputEmits } from './types'
import { useInputShellProps } from './utils'

withDefaults(defineProps<TInputProps>(), {
  groupTemplate: 'repeat(1, 1fr)',
})
const shellProps = useInputShellProps()
const modelValue = defineModel<string | number>()

const { focused } = useInputPi().provide()

const emit = defineEmits<TInputEmits>()
</script>

<template>
  <div
    class="group/i8"
    :class="{
      'i8-flat': design === 'flat',
      'i8-filled': design === 'filled' || design === 'round',
      'i8-round': design === 'round',
      'scope-error': !!error,
    }"
    :data-error="!!error"
    :data-group-active="focused || active"
  >
    <div class="flex w-full">
      <div
        class="i8-before"
        :class="{
          'i8-icon-clickable': !!onBeforeClick,
        }"
        v-if="$slots.before || !!iconBefore"
      >
        <slot name="before">
          <Icon :name="iconBefore!" @click="emit('beforeClick', $event)" />
        </slot>
      </div>

      <div class="w-full relative">
        <div class="i8-stack-label" v-if="!!label && stackLabel">
          <Label>{{ label }}</Label>
        </div>

        <div
          class="i8-input-group w-full"
          @click="emit('click', $event)"
          :class="{
            'cursor-pointer': !!onClick,
          }"
        >
          <slot v-bind="shellProps!">
            <InputShell v-model="modelValue" v-bind="shellProps!">
              <template #overlay v-if="!!$slots.overlay">
                <slot name="overlay"></slot>
              </template>
              <template #prepend v-if="!!$slots.prepend">
                <slot name="prepend"></slot>
              </template>
              <template v-if="!!$slots.input" v-slot="slotScope">
                <slot name="input" v-bind="slotScope"> </slot>
              </template>

              <template #append v-if="!!$slots.append">
                <slot name="append"></slot>
              </template>
            </InputShell>
          </slot>
        </div>

        <div :class="stackLabel ? 'i8-hint-wrapper-stack' : 'i8-hint-wrapper'">
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
          <div class="i8-counter" v-if="!!maxlength || $slots.counter">
            <slot name="counter"> {{ String(modelValue || '').length || 0 }}/{{ maxlength }} </slot>
          </div>
        </div>
      </div>

      <div
        class="i8-after"
        :class="{
          'i8-icon-clickable': !!onAfterClick,
        }"
        v-if="$slots.after || !!iconAfter"
      >
        <slot name="after">
          <Icon :name="iconAfter!" @click="emit('afterClick', $event)" />
        </slot>
      </div>
    </div>
  </div>
</template>

<style>
.i8-input-group {
  display: grid;
  grid-template-columns: v-bind(groupTemplate);
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
}
</style>
