<script setup lang="ts">
import type { SliderRootEmits, SliderRootProps } from 'radix-vue'
import { useForwardPropsEmits } from 'radix-vue'

type TClass = string | Record<string, boolean>

const props = defineProps<
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
>()
const emits = defineEmits<SliderRootEmits>()

const delegatedProps = computed(() => {
  const {
    class: _,
    rootClass,
    hideRange,
    trackClass,
    rangeClass,
    thumbs,
    labels,
    sliderClass,
    label,
    displayValue,
    ...delegated
  } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
const modelValue = defineModel<number[]>()
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
      <Label>{{ label || '' }}</Label>
      <span class="text-label text-grey-400">{{ modelValue?.join(' | ') }}</span>
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
