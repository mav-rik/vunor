<script setup lang="ts">
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import VuCheckbox from '../components/Checkbox/Checkbox.vue'
import { ref } from 'vue'

const c = ref<boolean | 'indeterminate'>('indeterminate')
</script>
<template>
  <VuCard level="h2" class="relative">
    <VuCardHeader class="mb-$s">Checkboxes</VuCardHeader>

    <form class="flex flex-col gap-$s relative">
      <VuCheckbox
        class="max-w-md"
        label="Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque maxime, quisquam nam libero dicta animi nulla! Iste tempora et laborum. Consequatur esse veritatis quaerat quos earum nam, cum sint doloribus."
        v-model="c"
        vertical-middle
      />
      <VuCheckbox label="Checkbox (scope-secondary)" class="scope-secondary" />
      <VuCheckbox label="Checkbox Readonly" readonly />
      <VuCheckbox label="Checkbox Readonly" readonly :model-value="true" />
      <VuCheckbox label="Checkbox Disabled" disabled />
      <VuCheckbox label="Checkbox (scope-secondary) disabled" class="scope-secondary" disabled />
      <VuCheckbox :model-value="true" label="Checkbox Disabled" disabled />
      <VuCheckbox
        :model-value="true"
        label="Checkbox (scope-secondary) disabled"
        class="scope-secondary"
        disabled
      />
      <VuCheckbox label="Checkbox 1 with error" error="Has Error" />
      <VuCheckbox
        label="Checkbox (scope-secondary) with error"
        error="Has Error"
        class="scope-secondary"
      />
      <VuCheckbox label="Checkbox 1 (required)" required />
      <VuCheckbox label="Checkbox (scope-secondary) (required)" required class="scope-secondary" />

      <VuCheckbox class="max-w-md" label="Checkbox 1 (reverse)" reverse />
      <VuCheckbox
        class="max-w-md scope-secondary"
        label="Checkbox (scope-secondary) (reverse)"
        reverse
        error="Error text"
      />
    </form>

    <form class="flex flex-col gap-$s text-h3 mt-$xl relative">
      <VuCheckbox label="Checkbox 1" v-model="c" />
      <VuCheckbox label="Checkbox (scope-secondary)" class="scope-secondary" />
      <VuCheckbox label="Checkbox Disabled" disabled />
      <VuCheckbox label="Checkbox (scope-secondary) disabled" class="scope-secondary" disabled />
      <VuCheckbox :model-value="true" label="Checkbox Disabled" disabled />
      <VuCheckbox
        :model-value="true"
        label="Checkbox (scope-secondary) disabled"
        class="scope-secondary"
        disabled
      />
      <VuCheckbox label="Checkbox 1 with error" error="Has Error" />
      <VuCheckbox
        label="Checkbox (scope-secondary) with error"
        error="Has Error"
        class="scope-secondary"
      />
      <VuCheckbox label="Checkbox 1 (required)" required />
      <VuCheckbox label="Checkbox (scope-secondary) (required)" required class="scope-secondary" />
    </form>
  </VuCard>
</template>
