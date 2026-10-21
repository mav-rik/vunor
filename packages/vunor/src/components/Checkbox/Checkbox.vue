<script setup lang="ts">
import { CheckboxRoot, CheckboxIndicator } from 'reka-ui'

import { useForwardToRoot } from '../forward-root'
import VuIcon from '../Icon/Icon.vue'

import type { CheckboxRootProps } from 'reka-ui'

const modelValue = defineModel<boolean | undefined | 'indeterminate'>({ default: undefined })
const props = withDefaults(
  defineProps<
    Pick<CheckboxRootProps, 'defaultValue' | 'value' | 'trueValue' | 'falseValue' | 'name'> & {
      /** Id of the checkbox control (the focusable element), for `<label for>` */
      id?: string
      label?: string
      disabled?: boolean
      error?: string | boolean
      required?: boolean
      verticalMiddle?: boolean
      reverse?: boolean
      readonly?: boolean
    }
  >(),
  {
    // forwarded booleans: absent stays undefined (see forward-root.ts)
    defaultValue: undefined,
  }
)

// CheckboxRoot props declared on this component; the wrapper div takes fallthrough attrs
const rootProps = useForwardToRoot(CheckboxRoot, props, undefined, [
  'modelValue',
  'disabled',
  'required',
  'asChild',
  'as',
])
</script>

<template>
  <div>
    <!-- [&>.checkbox]:hover:bg-neutral-100 -->
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
        v-bind="rootProps"
        :disabled
        :required
        v-model="modelValue"
        :tabindex="readonly ? '-1' : undefined"
        class="checkbox"
        :aria-readonly="readonly || undefined"
        v-slot="{ state }"
      >
        <!-- Reka's own state: custom true / false values, a CheckboxGroupRoot's model -->
        <CheckboxIndicator class="checkbox-indicator">
          <VuIcon v-if="state === 'indeterminate'" name="i--dash" class="checkbox-icon" />
          <VuIcon v-if="state === true" name="i--checkmark" class="checkbox-icon" />
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
