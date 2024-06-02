<script setup lang="ts">
const modelValue = defineModel<boolean | undefined | 'indeterminate'>()
defineProps<{
  label?: string
  disabled?: boolean
  error?: string | boolean
  required?: boolean
  verticalMiddle?: boolean
  reverse?: boolean
  readonly?: boolean
}>()
</script>

<template>
  <!-- [&>.checkbox]:hover:bg-neutral-100 -->
  <div>
    <label
      :style="{
        'pointer-events': readonly ? 'none' : undefined,
      }"
      :aria-disabled="disabled"
      class="checkbox-root group/cb"
      :aria-readonly="readonly || undefined"
      :data-error="!!error"
      :class="{
        'items-center': verticalMiddle,
        'items-start': !verticalMiddle,
        'flex-row-reverse': reverse,
      }"
    >
      <CheckboxRoot
        :disabled
        :required="true"
        :aria-required="required"
        v-model:checked="modelValue"
        :tabindex="readonly ? '-1' : undefined"
        class="checkbox"
        :aria-readonly="readonly || undefined"
      >
        <CheckboxIndicator class="checkbox-indicator">
          <Icon v-if="modelValue === 'indeterminate'" name="i--dash" class="checkbox-icon" />
          <Icon v-if="modelValue === true" name="i--checkmark" class="checkbox-icon" />
        </CheckboxIndicator>
      </CheckboxRoot>
      <span class="checkbox-label">
        <slot :label="label">
          {{ label }}
        </slot>
      </span>
    </label>
    <div
      v-if="!!error && typeof error === 'string'"
      class="text-caption text-error-500 text-mt-$s"
      :class="{ 'text-right': reverse }"
    >
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.checkbox-indicator > .checkbox-icon {
  animation: checkbox-indicator-appear 0.2s ease;
}

@keyframes checkbox-indicator-appear {
  0% {
    clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
  }
  100% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
}
</style>
