<script setup lang="ts" generic="T extends TSelectItem">
import type { TInputProps, TInputShellProps, TInputEmits } from '../Input/types'
import { useInputShellProps, useInputProps } from '../Input/utils'
import type { TSelectBaseProps, TSelectItem } from './types'

type Props = Omit<TInputProps & TInputShellProps, 'active'> & TSelectBaseProps<T>

const props = withDefaults(defineProps<Props>(), {
  sideOffset: 2,
})
defineEmits<TInputEmits>()

const forwardProps = computed(() => {
  if (props.groupItem) {
    return useInputShellProps()?.value
  }
  return useInputProps()?.value
})

const modelValue = defineModel<string>()
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
      <VuInputShell
        class="cursor-pointer select-none"
        v-bind="forwardProps"
        :icon-append="typeof iconAppend === 'string' ? iconAppend : s.icon"
        :model-value="(s.displayItem?.label || s.displayItem?.value) as string"
        :active="s.open"
        readonly
        @click="s.openPopup"
        tabindex="-1"
        @focus="$event.target.querySelector('input')?.focus()"
      >
        <template #overlay>
          <SelectValue class="absolute left-0 right-0 h-0 invisible" />
        </template>
      </VuInputShell>
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
        <VuInputShell
          class="cursor-pointer select-none"
          v-bind="shellProps"
          :model-value="(s.displayItem?.label || s.displayItem?.value) as string"
          readonly
          type="text"
          tabindex="-1"
          @focus="$event.target.querySelector('input')?.focus()"
        >
          <template #overlay>
            <SelectValue class="absolute left-[-1px] right-0 h-0 invisible" />
          </template>
        </VuInputShell>
      </SelectTrigger>
    </VuInput>
  </VuSelectBase>
</template>
