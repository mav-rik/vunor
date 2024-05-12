<script setup lang="ts"></script>
<template>
  <Card level="h2" class="with-bg relative">
    <CardHeader class="mb-$s">Testing</CardHeader>

    <form class="flex flex-col gap-$s">
      <Checkbox label="Checkbox 1" />
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
