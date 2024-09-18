<script setup lang="ts">
import { CheckboxRoot, CheckboxIndicator } from 'radix-vue'
import VuIcon from '../Icon/Icon.vue'

const modelValue = defineModel<boolean | undefined | 'indeterminate'>()
defineProps<{
  label?: string
  disabled?: boolean
  error?: string | boolean
  required?: boolean
  verticalMiddle?: boolean
  reverse?: boolean
  readonly?: boolean
}>()
</script>

<template>
  <!-- [&>.checkbox]:hover:bg-neutral-100 -->
  <div>
    <label
      :style="{
        'pointer-events': readonly ? 'none' : undefined,
      }"
      :aria-disabled="disabled"
      class="checkbox-root group/cb"
      :aria-readonly="readonly || undefined"
      :data-error="!!error"
      :class="{
        'items-center': verticalMiddle,
        'items-start': !verticalMiddle,
        'flex-row-reverse': reverse,
      }"
    >
      <CheckboxRoot
        :disabled
        :required="true"
        :aria-required="required"
        v-model:checked="modelValue"
        :tabindex="readonly ? '-1' : undefined"
        class="checkbox"
        :aria-readonly="readonly || undefined"
      >
        <CheckboxIndicator class="checkbox-indicator">
          <VuIcon v-if="modelValue === 'indeterminate'" name="i--dash" class="checkbox-icon" />
          <VuIcon v-if="modelValue === true" name="i--checkmark" class="checkbox-icon" />
        </CheckboxIndicator>
      </CheckboxRoot>
      <span v-if="label || $slots.label" class="checkbox-label">
        <slot :label="label">
          {{ label }}
        </slot>
      </span>
    </label>
    <div
      v-if="!!error && typeof error === 'string'"
      class="text-caption text-error-500 text-mt-$s"
      :class="{ 'text-right': reverse }"
    >
      {{ error }}
    </div>
  </div>
</template>
