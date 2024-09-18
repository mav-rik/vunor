<script setup lang="ts" generic="T extends TSelectItem">
import type { TInputProps, TInputBaseProps, TInputEmits } from 'vunor'
import { useInputBaseProps, useInputProps } from 'vunor'
import type { TSelectBaseProps, TSelectItem } from './types'
import VuSelectBase from './SelectBase.vue'
import { SelectTrigger, SelectValue } from 'radix-vue'
import VuInputBase from '../Input/InputBase.vue'
import VuInput from '../Input/Input.vue'
import { computed } from 'vue'

type Props = Omit<TInputProps & TInputBaseProps, 'active'> & TSelectBaseProps<T>

const props = withDefaults(defineProps<Props>(), {
  sideOffset: 2,
})
defineEmits<TInputEmits>()

const forwardProps = computed(() => {
  if (props.groupItem) {
    return useInputBaseProps()?.value
  }
  return useInputProps()?.value
})

const modelValue = defineModel<string>()

function onFocus(event: FocusEvent) {
  ;(event.target as HTMLDivElement | undefined)?.querySelector?.('input')?.focus()
}
</script>

<template>
  <VuSelectBase
    v-model="modelValue"
    :disabled-values
    :popup-class
    :popup-round
    :value-class
    :icon-class
    :class
    :items
    :required
    :disabled
    :placeholder
    :defaultValue
    :popupPosition
    :side
    :sideOffset
    :sticky
    :updatePositionStrategy
    v-slot="s"
  >
    <SelectTrigger as-child v-if="groupItem">
      <!-- prettier-ignore-attribute v-model -->
      <VuInputBase
        class="cursor-pointer select-none"
        v-bind="forwardProps"
        :icon-append="typeof iconAppend === 'string' ? iconAppend : s.icon"
        :model-value="(s.displayItem?.label || s.displayItem?.value) as string"
        :active="s.open"
        readonly
        @click="s.openPopup"
        tabindex="-1"
        @focus="onFocus"
      >
        <template #overlay>
          <SelectValue class="absolute left-0 right-0 h-0 invisible" />
        </template>
      </VuInputBase>
    </SelectTrigger>
    <!-- prettier-ignore-attribute v-model -->
    <VuInput
      v-else
      class="select-none"
      v-bind="forwardProps"
      :icon-append="typeof iconAppend === 'string' ? iconAppend : s.icon"
      :model-value="(s.displayItem?.label || s.displayItem?.value) as string"
      :active="s.open"
      :stack-label
      readonly
      @click="s.openPopup"
      v-slot="shellProps"
    >
      <SelectTrigger as-child>
        <!-- prettier-ignore-attribute v-model -->
        <VuInputBase
          class="cursor-pointer select-none"
          v-bind="shellProps"
          :model-value="(s.displayItem?.label || s.displayItem?.value) as string"
          readonly
          type="text"
          tabindex="-1"
          @focus="onFocus"
        >
          <template #overlay>
            <SelectValue class="absolute left-[-1px] right-0 h-0 invisible" />
          </template>
        </VuInputBase>
      </SelectTrigger>
    </VuInput>
  </VuSelectBase>
</template>
