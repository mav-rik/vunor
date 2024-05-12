<script setup lang="ts">
const modelValue = defineModel<boolean | undefined>(undefined)
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
          <Icon v-if="modelValue === undefined" name="i--search" class="checkbox-icon" />
          <Icon v-if="modelValue" name="i--checkmark" class="checkbox-icon" />
        </CheckboxIndicator>
      </CheckboxRoot>
      <span class="checkbox-label">{{ label }}</span>
    </label>
    <div v-if="!!error && typeof error === 'string'" class="text-caption text-error-500 text-mt-$s">
      {{ error }}
    </div>
  </div>
</template>
