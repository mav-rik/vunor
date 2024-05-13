<script setup lang="ts">
import { useId } from 'radix-vue'

const props = defineProps<{
  items: (string | { value: string; label: string; disabled?: boolean })[]
  defaultValue?: string
  label?: string
  labelVisible?: boolean
  row?: boolean
  disabledValues?: string[]
  disabled?: boolean
  class?: string | Record<string, boolean>
  error?: string | boolean
}>()

const _items = computed(() => {
  return props.items.map(item => (typeof item === 'string' ? { value: item, label: item } : item))
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
      v-model="modelValue"
      class="rb-root"
      :class="{ 'rb-row': row }"
      :default-value
      :aria-label="label"
      :disabled
      :data-error="!!error"
      :aria-disabled="disabled"
    >
      <div class="rb-items" v-for="item of _items">
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
          {{ item.label }}
        </label>
      </div>
    </RadioGroupRoot>
    <div v-if="!!error && typeof error === 'string'" class="text-caption text-error-500 text-mt-0">
      {{ error }}
    </div>
  </div>
</template>
