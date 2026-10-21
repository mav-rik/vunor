<script setup lang="ts" generic="T extends TSelectItem, M extends boolean = false">
import { SelectRoot, SelectTrigger, SelectValue } from 'reka-ui'
import { computed } from 'vue'
import { useInputBaseProps, useInputProps } from 'vunor'

import { useForwardToRoot } from '../forward-root'
import VuInput from '../Input/Input.vue'
import VuInputBase from '../Input/InputBase.vue'
import VuSelectBase from './SelectBase.vue'

import type { TInputProps, TInputBaseProps, TInputEmits } from '../Input/utils'
import type { TSelectBaseProps, TSelectItem, TSelectModel } from './types'

type Props = Omit<TInputProps & TInputBaseProps, 'active'> & TSelectBaseProps<T, M>

// The rendered root is the trigger shell inside VuSelectBase's slot (SelectRoot renders
// no element), so `class` and fallthrough attrs are bound to it explicitly.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Props>(), {
  // forwarded booleans: absent stays undefined (see forward-root.ts)
  defaultOpen: undefined,
  multiple: undefined,
  sideOffset: 2,
})
defineEmits<TInputEmits>()

const inputProps = useInputProps()
const inputBaseProps = useInputBaseProps()
const forwardProps = computed(() => {
  if (props.groupItem) {
    // VuInputBase has no `click` event: pass the listener on as a native one
    return { ...inputBaseProps?.value, onClick: props.onClick }
  }
  return inputProps?.value
})

const modelValue = defineModel<TSelectModel<M>>()
const open = defineModel<boolean>('open', { default: undefined })

// SelectRoot props declared on this component (name, by, dir, multiple, ...), for VuSelectBase
const rootProps = useForwardToRoot(SelectRoot, props, undefined, [
  'modelValue',
  'open',
  'disabled',
  'required',
])

function onFocus(event: FocusEvent) {
  ;(event.target as HTMLDivElement | undefined)?.querySelector?.('input')?.focus()
}
</script>

<template>
  <VuSelectBase
    v-bind="rootProps"
    v-model="modelValue"
    v-model:open="open"
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
    :popupPosition
    :side
    :sideOffset
    :sticky
    :updatePositionStrategy
    v-slot="s"
  >
    <SelectTrigger as-child v-if="groupItem" v-bind="$attrs" :class>
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
      :class
      v-bind="{ ...$attrs, ...forwardProps }"
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
