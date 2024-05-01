<script setup lang="ts">
const lorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet pariatur ab maiores voluptatibus ipsum officia nobis! Eveniet error rerum dolore eligendi, tempora qui nobis soluta fugit quibusdam cupiditate, ducimus magnam!'
const surfaces = [
  'surface-0',
  'surface-1',
  'surface-2',
  'surface-3',
  'surface-4',
  'surface-50',
  'surface-100',
  'surface-200',
  'surface-300',
  'surface-400',
  'surface-500',
  'surface-600',
  'surface-700',
  'surface-800',
  'surface-900',
] as const
</script>
<template>
  <Card level="h2">
    <CardHeader class="mb-$s">Surfaces</CardHeader>
    <h3 class="mb-$s border-b border-b-2px">Scope "background"</h3>
    <div class="flex flex-wrap gap-$l">
      <Card v-for="s of surfaces" level="h4" rounded class="border w-sm" :class="s">
        <CardHeader class="mb-$s fw-bold">{{ s }}</CardHeader>
        <p class="text-my-0">{{ lorem }}</p>
      </Card>
    </div>

    <h3 class="mb-$s mt-$l border-b border-b-2px">Scope "info"</h3>
    <div class="flex flex-wrap gap-$l scope-info">
      <Card v-for="s of surfaces" level="h4" rounded class="border w-sm" :class="s">
        <CardHeader class="mb-$s fw-bold">{{ s }}</CardHeader>
        <p class="text-my-0">{{ lorem }}</p>
      </Card>
    </div>

    <h3 class="mb-$s mt-$l border-b border-b-2px">Scope "primary"</h3>
    <div class="flex flex-wrap gap-$l scope-primary">
      <Card v-for="s of surfaces" level="h4" rounded class="border w-sm" :class="s">
        <CardHeader class="mb-$s fw-bold">{{ s }}</CardHeader>
        <p class="text-my-0">{{ lorem }}</p>
      </Card>
    </div>

    <h3 class="mb-$s mt-$l border-b border-b-2px">Scope "good"</h3>
    <div class="flex flex-wrap gap-$l scope-good">
      <Card v-for="s of surfaces" level="h4" rounded class="border w-sm" :class="s">
        <CardHeader class="mb-$s fw-bold">{{ s }}</CardHeader>
        <p class="text-my-0">{{ lorem }}</p>
      </Card>
    </div>

    <h3 class="mb-$s mt-$l border-b border-b-2px">Scope "warn"</h3>
    <div class="flex flex-wrap gap-$l scope-warn">
      <Card v-for="s of surfaces" level="h4" rounded class="border w-sm" :class="s">
        <CardHeader class="mb-$s fw-bold">{{ s }}</CardHeader>
        <p class="text-my-0">{{ lorem }}</p>
      </Card>
    </div>

    <h3 class="mb-$s mt-$l border-b border-b-2px">Scope "error"</h3>
    <div class="flex flex-wrap gap-$l scope-error">
      <Card v-for="s of surfaces" level="h4" rounded class="border w-sm" :class="s">
        <CardHeader class="mb-$s fw-bold">{{ s }}</CardHeader>
        <p class="text-my-0">{{ lorem }}</p>
      </Card>
    </div>
  </Card>
</template>
