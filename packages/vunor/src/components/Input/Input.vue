<script setup lang="ts">
type Props = {
  label?: string
  placeholder?: string
}

defineProps<Props>()

const modelValue = defineModel()

const inputState = reactive({
  active: false,
})

function focus() {
  inputState.active = true
}
function blur() {
  inputState.active = false
}
</script>

<template>
  <div
    class="h-fingertip border rounded flex items-center px-$m select-none relative data-[active=true]:border-hl"
    :data-active="inputState.active"
  >
    <slot name="before" @focus="focus" @blur="blur"> </slot>
    <input
      v-model="modelValue"
      class="w-full outline-none lh-1em h-full bg-transparent"
      :placeholder
      @focus="focus"
      @blur="blur"
    />
    <slot name="after" @focus="focus" @blur="blur"></slot>
    <!-- <div class="absolute left-0 top-0 right-0 h-[1em] bg-green/20"></div>
    <div class="absolute left-0 bottom-0 right-0 h-[1em] bg-green/20"></div> -->
  </div>
</template>
