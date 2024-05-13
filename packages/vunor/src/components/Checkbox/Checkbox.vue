<script setup lang="ts">
const modelValue = defineModel<boolean | undefined | 'indeterminate'>()
defineProps<{
  label?: string
  disabled?: boolean
  error?: string | boolean
  required?: boolean
}>()
</script>

<template>
  <!-- [&>.checkbox]:hover:bg-neutral-100 -->
  <div>
    <label :aria-disabled="disabled" class="checkbox-root group" :data-error="!!error">
      <CheckboxRoot
        :disabled
        :required="true"
        :aria-required="required"
        v-model:checked="modelValue"
        class="checkbox"
      >
        <CheckboxIndicator class="checkbox-indicator">
          <Icon v-if="modelValue === 'indeterminate'" name="i--dash" class="checkbox-icon" />
          <Icon v-if="modelValue === true" name="i--checkmark" class="checkbox-icon" />
        </CheckboxIndicator>
      </CheckboxRoot>
      <span class="checkbox-label">{{ label }}</span>
    </label>
    <div v-if="!!error && typeof error === 'string'" class="text-caption text-error-500 text-mt-$s">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.checkbox-indicator > .checkbox-icon {
  animation: checkbox-indicator-appear 0.1s ease;
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
