<!--
  This component implements a delayed switch mechanism, primarily designed to delay
  switching off an input value. It's particularly useful for maintaining dialog
  closing animations when using v-if directives on dialogs.

  The main purpose is to keep the dialog visible for a specified duration (delayOff)
  after it has been instructed to close. This allows the closing animation to complete
  before the dialog is removed from the DOM.

  Props:
  - value: boolean - The input value to be delayed
  - delayOn: number - Delay in milliseconds for switching on (default: 0)
  - delayOff: number - Delay in milliseconds for switching off (default: 200)

  Usage:
  Wrap your dialog component with this DelayedSwitch and use the 'on' value
  provided in the slot scope for conditional rendering.
-->
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = withDefaults(
  defineProps<{
    value?: boolean
    delayOn?: number
    delayOff?: number
  }>(),
  {
    delayOn: 0,
    delayOff: 200,
  }
)

const on = ref(props.value)

watch(
  () => [props.value],
  () => {
    const delay = props.value ? props.delayOn : props.delayOff
    if (delay) {
      setTimeout(() => {
        on.value = props.value
      }, delay)
    } else {
      on.value = props.value
    }
  }
)
</script>
<template>
  <slot :on> </slot>
</template>
