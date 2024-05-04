<script setup lang="ts">
const scopes = [
  'scope-background',
  'scope-neutral',
  'scope-primary',
  'scope-secondary',
  'scope-good',
  'scope-warn',
  'scope-error',
]
</script>

<template>
  <Card level="h2">
    <CardHeader class="mb-$s">Layers</CardHeader>

    <div v-for="scope of scopes" :class="scope" class="mb-$xxl">
      <h3>Scope "{{ scope }}"</h3>
      <div class="layer-0 py-$xl px-$m">Layer-0</div>
      <div class="layer-1 py-$xl px-$m">Layer-1</div>
      <div class="layer-2 py-$xl px-$m">Layer-2</div>
      <div class="layer-3 py-$xl px-$m">Layer-3</div>
      <div class="layer-4 py-$xl px-$m">Layer-4</div>
    </div>
  </Card>
</template>
