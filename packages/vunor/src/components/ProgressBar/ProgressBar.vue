<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'reka-ui'

import { useForwardToRoot } from '../forward-root'

import type { ProgressRootEmits, ProgressRootProps } from 'reka-ui'

const props = withDefaults(defineProps<ProgressRootProps & { loading?: boolean }>(), {
  // forwarded booleans: absent stays undefined (see forward-root.ts)
  asChild: undefined,
  max: 100,
  loading: true,
})
// model listeners of declared props do not fall through: re-emit them explicitly
const emit = defineEmits<ProgressRootEmits>()
const rootProps = useForwardToRoot(ProgressRoot, props, emit)
</script>
<template>
  <ProgressRoot
    v-bind="rootProps"
    class="progress-track"
    style="transform: translateZ(0)"
    :data-loading="loading !== false && Number(modelValue) < max ? '' : undefined"
  >
    <ProgressIndicator
      class="progress-bar"
      :style="`transform: translateX(-${100 - (Number(modelValue) / Number(max)) * 100}%)`"
    />
  </ProgressRoot>
</template>
