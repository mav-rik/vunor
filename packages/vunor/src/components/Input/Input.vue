<script setup lang="ts">
import { useInputPi } from './pi'
import type { TInputProps, TInputEmits } from './types'
import { useInputBaseProps } from './utils'
import VuInputBase from './InputBase.vue'
import VuIcon from '../Icon/Icon.vue'
import VuLabel from '../Label/Label.vue'

withDefaults(defineProps<TInputProps>(), {
  groupTemplate: 'repeat(1, 1fr)',
})
const baseProps = useInputBaseProps()
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
          <div class="i8-icon-wrap" @click="emit('beforeClick', $event)">
            <VuIcon :name="iconBefore!" />
          </div>
        </slot>
      </div>

      <div class="w-full relative">
        <div class="i8-stack-label" v-if="!!label && stackLabel">
          <VuLabel>{{ label }}</VuLabel>
        </div>

        <div
          class="w-full"
          :style="{
            'display': 'grid',
            'grid-template-columns': groupTemplate,
            'grid-auto-flow': 'column',
            'grid-auto-columns': '1fr',
          }"
          @click="emit('click', $event)"
          :class="{
            'cursor-pointer': !!onClick,
          }"
        >
          <slot v-bind="baseProps!">
            <VuInputBase v-model="modelValue" v-bind="baseProps!">
              <template #overlay v-if="!!$slots.overlay">
                <slot name="overlay"></slot>
              </template>

              <template v-slot:prepend="slotProps" v-if="!!$slots.prepend">
                <slot name="prepend" v-bind="slotProps"></slot>
              </template>

              <template v-if="!!$slots.input" v-slot="slotScope">
                <slot name="input" v-bind="slotScope"> </slot>
              </template>

              <template v-slot:append="slotProps" v-if="!!$slots.append">
                <slot name="append" v-bind="slotProps"></slot>
              </template>
            </VuInputBase>
          </slot>
        </div>

        <div :class="stackLabel ? 'i8-hint-wrapper-stack' : 'i8-hint-wrapper'">
          <div class="i8-hint" v-if="hint || error">
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
          <div class="i8-icon-wrap" @click="emit('afterClick', $event)">
            <VuIcon :name="iconAfter!" />
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
