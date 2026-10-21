<script setup lang="ts">
import { PopoverRoot, PopoverTrigger, PopoverPortal, PopoverContent } from 'reka-ui'
import { computed, getCurrentInstance } from 'vue'

import VuButton from '../Button/Button.vue'
import { useForwardToRoot, useModelState, useRootBinding } from '../forward-root'

import type { PopoverContentEmits, PopoverContentProps, PopoverRootProps } from 'reka-ui'

// PopoverRoot renders no element of its own: fallthrough attrs go to the trigger.
// The trigger's `id` stays Reka's: it links the trigger and the popup for assistive tech.
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<
    PopoverContentProps &
      Pick<PopoverRootProps, 'defaultOpen' | 'modal'> & {
        class?: string | Record<string, boolean>
        icon?: string
        label?: string
        asLink?: boolean
      }
  >(),
  {
    // forwarded booleans: absent stays undefined (see forward-root.ts)
    defaultOpen: undefined,
    modal: undefined,
    forceMount: undefined,
    hideWhenDetached: undefined,
    disableUpdateOnLayoutShift: undefined,
    prioritizePosition: undefined,
    disableOutsidePointerEvents: undefined,
    asChild: undefined,
    // 0.3.2 passed these as false (Reka defaults them to true): keep that
    sideFlip: false,
    alignFlip: false,
    avoidCollisions: false,
    hideShiftedArrow: false,
  }
)
const emit = defineEmits<PopoverContentEmits>()

// `v-model` (modelValue) and `v-model:open` both control the open state
const modelValue = defineModel<boolean>({ default: undefined })
const openModel = defineModel<boolean>('open', { default: undefined })
const vm = getCurrentInstance()
// the model bound to PopoverRoot (undefined = uncontrolled: Reka applies default-open)
const rawOpen = computed({
  get: () => ('open' in (vm?.vnode.props ?? {}) ? openModel.value : modelValue.value),
  set: (value: boolean) => {
    modelValue.value = value
    openModel.value = value
  },
})
// what the slot, the trigger styling and open()/close() see: equals PopoverRoot's state
const isOpen = useModelState(rawOpen, PopoverRoot, 'defaultOpen', props)
const rootOpen = useRootBinding(rawOpen, isOpen)

const rootProps = useForwardToRoot(PopoverRoot, props, undefined, ['open'])
const contentProps = useForwardToRoot(PopoverContent, props, emit, ['asChild', 'as'])

function open() {
  isOpen.value = true
}
function close() {
  isOpen.value = false
}
</script>

<template>
  <PopoverRoot
    v-bind="rootProps"
    :open="rootOpen"
    @update:open="(value: boolean) => (rawOpen = value)"
  >
    <PopoverTrigger as-child v-bind="$attrs" data-vu-trigger>
      <slot :isOpen="isOpen" :close :open
        ><VuButton
          :as-link
          :icon="icon || 'i--more-vert'"
          :class
          :label
          :data-active="$attrs['data-active'] ?? (isOpen ? '' : undefined)"
      /></slot>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        v-bind="contentProps"
        :style="{
          'max-height': 'var(--reka-popper-available-height)',
          'overflow': 'auto',
        }"
        as-child
      >
        <slot name="content" :isOpen="isOpen" :close :open>
          <div></div>
        </slot>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
