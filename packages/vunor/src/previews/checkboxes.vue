<script setup lang="ts">
const c = ref<boolean | 'indeterminate'>('indeterminate')
</script>
<template>
  <Card level="h2" class="with-bg relative">
    <CardHeader class="mb-$s">Checkboxes</CardHeader>

    <form class="flex flex-col gap-$s relative">
      <Checkbox
        class="max-w-md"
        label="Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque maxime, quisquam nam libero dicta animi nulla! Iste tempora et laborum. Consequatur esse veritatis quaerat quos earum nam, cum sint doloribus."
        v-model="c"
        vertical-middle
      />
      <Checkbox label="Checkbox (scope-secondary)" class="scope-secondary" />
      <Checkbox label="Checkbox Readonly" readonly />
      <Checkbox label="Checkbox Readonly" readonly :model-value="true" />
      <Checkbox label="Checkbox Disabled" disabled />
      <Checkbox label="Checkbox (scope-secondary) disabled" class="scope-secondary" disabled />
      <Checkbox :model-value="true" label="Checkbox Disabled" disabled />
      <Checkbox
        :model-value="true"
        label="Checkbox (scope-secondary) disabled"
        class="scope-secondary"
        disabled
      />
      <Checkbox label="Checkbox 1 with error" error="Has Error" />
      <Checkbox
        label="Checkbox (scope-secondary) with error"
        error="Has Error"
        class="scope-secondary"
      />
      <Checkbox label="Checkbox 1 (required)" required />
      <Checkbox label="Checkbox (scope-secondary) (required)" required class="scope-secondary" />

      <Checkbox class="max-w-md" label="Checkbox 1 (reverse)" reverse />
      <Checkbox
        class="max-w-md scope-secondary"
        label="Checkbox (scope-secondary) (reverse)"
        reverse
        error="Error text"
      />
    </form>

    <form class="flex flex-col gap-$s text-h3 mt-$xl relative">
      <Checkbox label="Checkbox 1" v-model="c" />
      <Checkbox label="Checkbox (scope-secondary)" class="scope-secondary" />
      <Checkbox label="Checkbox Disabled" disabled />
      <Checkbox label="Checkbox (scope-secondary) disabled" class="scope-secondary" disabled />
      <Checkbox :model-value="true" label="Checkbox Disabled" disabled />
      <Checkbox
        :model-value="true"
        label="Checkbox (scope-secondary) disabled"
        class="scope-secondary"
        disabled
      />
      <Checkbox label="Checkbox 1 with error" error="Has Error" />
      <Checkbox
        label="Checkbox (scope-secondary) with error"
        error="Has Error"
        class="scope-secondary"
      />
      <Checkbox label="Checkbox 1 (required)" required />
      <Checkbox label="Checkbox (scope-secondary) (required)" required class="scope-secondary" />
    </form>
  </Card>
</template>

<style scoped>
.with-bg {
  position: relative;
  min-height: 100vh;
}
.with-bg:before {
  content: ' ';
  position: fixed;
  pointer-events: none;
  margin-left: -2.5em;
  width: 80vw;
  top: 0;
  height: 100vh;
  background-image: url(/bg7.png);
  background-size: cover;
  mix-blend-mode: darken;
  opacity: 0.05;
}
.dark .with-bg:before {
  mix-blend-mode: overlay;
  opacity: 0.25;
}
</style>
