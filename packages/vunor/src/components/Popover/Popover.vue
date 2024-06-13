<script setup lang="ts">
import type { PopoverContentProps } from 'radix-vue'

const props = defineProps<
  PopoverContentProps & {
    class?: string | Record<string, boolean>
    icon?: string
    label?: string
    asLink?: boolean
  }
>()

const popupContentProps = computed(() => {
  const obj = {} as PopoverContentProps
  for (const [key, value] of Object.entries(props)) {
    if (!['class', 'label', 'icon'].includes(key)) {
      obj[key as keyof PopoverContentProps] = value as undefined
    }
  }
  return obj
})
const modelValue = defineModel<boolean>()
function open() {
  modelValue.value = true
}
function close() {
  modelValue.value = false
}
</script>

<template>
  <PopoverRoot as-child v-model:open="modelValue">
    <PopoverTrigger as-child>
      <slot :isOpen="modelValue" :close :open
        ><VuButton
          :as-link
          :icon="icon || 'i--more-vert'"
          :class
          :label
          :data-active="modelValue ? '' : undefined"
      /></slot>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        v-bind="popupContentProps"
        :style="{
          'max-height': 'var(--radix-popper-available-height)',
          'overflow': 'auto',
        }"
        as-child
      >
        <slot name="content" :isOpen="modelValue" :close :open>
          <div></div>
        </slot>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
