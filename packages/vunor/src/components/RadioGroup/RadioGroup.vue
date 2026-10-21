<script setup lang="ts" generic="T extends { value: string; label: string; disabled?: boolean }">
import { useId, RadioGroupRoot, RadioGroupItem, RadioGroupIndicator } from 'reka-ui'
import { computed } from 'vue'

import { useForwardToRoot } from '../forward-root'

import type { RadioGroupRootProps } from 'reka-ui'

const props = withDefaults(
  defineProps<
    Pick<RadioGroupRootProps, 'orientation' | 'dir' | 'loop' | 'name' | 'required'> & {
      items: Array<string | T>
      defaultValue?: string
      label?: string
      labelVisible?: boolean
      row?: boolean
      disabledValues?: string[]
      disabled?: boolean
      class?: string | Record<string, boolean>
      error?: string | boolean
      verticalMiddle?: boolean
      reverse?: boolean
    }
  >(),
  {
    // forwarded booleans: absent stays undefined (see forward-root.ts)
    loop: undefined,
    required: undefined,
  }
)

// RadioGroupRoot props declared on this component; the wrapper div takes fallthrough attrs
const rootProps = useForwardToRoot(RadioGroupRoot, props, undefined, [
  'modelValue',
  'defaultValue',
  'disabled',
  'asChild',
  'as',
])

const _items = computed<T[]>(() => {
  return props.items.map(item =>
    typeof item === 'string' ? ({ value: item, label: item } as T) : item
  )
})

const id = useId()

const modelValue = defineModel<string>()

function isDisabled(val: string) {
  return props.disabledValues?.includes(val)
}
</script>
<template>
  <div class="rb-container" :class>
    <label v-if="!!label && labelVisible" class="rb-label">{{ label }}</label>
    <RadioGroupRoot
      v-bind="rootProps"
      v-model="modelValue"
      class="rb-root"
      :class="{ 'rb-row': row }"
      :default-value
      :aria-label="label"
      :disabled
      :data-error="!!error"
      :aria-disabled="disabled"
    >
      <div
        class="rb-item-wrapper"
        :class="{
          'items-center': verticalMiddle,
          'items-start': !verticalMiddle,
          'flex-row-reverse': reverse,
        }"
        v-for="item of _items"
      >
        <RadioGroupItem
          :id="id + '-' + item.value"
          class="rb-item"
          :data-error="!!error"
          :value="item.value"
          :disabled="disabled || item.disabled || isDisabled(item.value)"
          :aria-disabled="disabled || item.disabled || isDisabled(item.value)"
        >
          <RadioGroupIndicator class="rb-item-indicator" />
        </RadioGroupItem>
        <label
          class="rb-item-label"
          :for="id + '-' + item.value"
          :aria-disabled="disabled || item.disabled || isDisabled(item.value)"
        >
          <slot v-bind="item">
            {{ item.label }}
          </slot>
        </label>
      </div>
    </RadioGroupRoot>
    <div
      v-if="!!error && typeof error === 'string'"
      class="text-caption text-error-500 text-mt-0"
      :class="{ 'text-right': reverse }"
    >
      {{ error }}
    </div>
  </div>
</template>
