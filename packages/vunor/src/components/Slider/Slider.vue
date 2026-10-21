<script setup lang="ts">
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from 'reka-ui'

import { useForwardToRoot, useModelState } from '../forward-root'
import VuLabel from '../Label/Label.vue'

import type { SliderRootEmits, SliderRootProps } from 'reka-ui'

type TClass = string | Record<string, boolean>

const props = withDefaults(
  defineProps<
    SliderRootProps & {
      class?: TClass
      rootClass?: TClass
      trackClass?: TClass
      rangeClass?: TClass
      hideRange?: boolean
      thumbs?: number
      labels?: string[]
      sliderClass?: TClass | TClass[]
      label?: string
      displayValue?: boolean
    }
  >(),
  {
    // forwarded booleans: absent stays undefined (see forward-root.ts)
    disabled: undefined,
    inverted: undefined,
    asChild: undefined,
    required: undefined,
  }
)
const emits = defineEmits<SliderRootEmits>()

// SliderRoot props/emits; the model is bound with v-model (forwarding its listener too
// would call @update:model-value twice)
const forwarded = useForwardToRoot(SliderRoot, props, emits, ['modelValue', 'update:modelValue'])
const modelValue = defineModel<number[]>()
// what the value label shows: equals SliderRoot's value (also with default-value)
const value = useModelState(modelValue, SliderRoot, 'defaultValue', props)
function getSliderClass(n: number) {
  if (Array.isArray(props.sliderClass)) {
    return props.sliderClass[n]
  } else if (props.sliderClass !== undefined) {
    return props.sliderClass
  }
  return undefined
}
</script>

<template>
  <div :class>
    <div class="flex justify-between" v-if="!!label || displayValue">
      <VuLabel>{{ label || '' }}</VuLabel>
      <span class="text-label text-grey-400">{{ value?.join(' | ') }}</span>
    </div>
    <SliderRoot v-bind="forwarded" v-model="modelValue" class="slider" :class="rootClass">
      <SliderTrack :class="trackClass || 'slider-track'">
        <SliderRange v-if="!hideRange" :class="rangeClass || 'slider-range'" />
      </SliderTrack>

      <slot>
        <SliderThumb
          v-for="n in thumbs || 1"
          :class="getSliderClass(n) || 'slider-thumb'"
          :aria-label="labels?.[n]"
        />
      </slot>
    </SliderRoot>
  </div>
</template>
