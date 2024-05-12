<script setup lang="ts">
const designs = ['c8-filled', 'c8-outlined', 'c8-light', 'c8-flat'] as const
const scopes = ['scope-primary', 'scope-neutral', 'scope-error'] as const
</script>
<template>
  <Card level="h2" class="with-bg relative">
    <CardHeader class="mb-$s">Buttons</CardHeader>
    <div v-for="scope of scopes" class="flex flex-col" :class="scope">
      <h4 class="mb-$xs text-scope-color-500">{{ scope }}</h4>
      <div class="flex flex-wrap mb-$l gap-$m">
        <Button v-for="design of designs" :class="design" :label="design"></Button>
        <Button class="c8-filled w-md" label="c8-filled w-md"></Button>
      </div>
    </div>

    <h3 class="mb-$xs mt-$m">Rounded</h3>
    <div v-for="scope of scopes" class="flex flex-col" :class="scope">
      <h4 class="mb-$xs text-scope-color-500">{{ scope }}</h4>
      <div class="flex flex-wrap mb-$l gap-$m">
        <Button v-for="design of designs" :class="design" class="rounded" :label="design"></Button>
        <Button class="c8-filled w-md rounded" label="c8-filled w-md"></Button>
      </div>
    </div>

    <h3 class="mb-$xs mt-$m">Rounded 50%</h3>
    <div v-for="scope of scopes" class="flex flex-col" :class="scope">
      <h4 class="mb-$xs text-scope-color-500">{{ scope }}</h4>
      <div class="flex flex-wrap mb-$l gap-$m">
        <Button
          v-for="design of designs"
          :class="design"
          class="btn-round"
          :label="design"
        ></Button>
        <Button class="c8-filled w-md btn-round" label="c8-filled w-md"></Button>
      </div>
    </div>

    <h3 class="mb-$xs mt-$m">Buttons with Icons</h3>
    <div v-for="scope of scopes" class="flex flex-col" :class="scope">
      <h4 class="mb-$xs text-scope-color-500">{{ scope }}</h4>
      <div class="flex flex-wrap mb-$l gap-$m">
        <Button v-for="design of designs" :class="design" :label="design" icon="i--config" />
        <Button class="c8-filled w-md" icon="i--config" label="c8-filled w-md"></Button>
      </div>
    </div>

    <h3 class="mb-$xs mt-$m">Rounded 50% with Icons</h3>
    <div v-for="scope of scopes" class="flex flex-col" :class="scope">
      <h4 class="mb-$xs text-scope-color-500">{{ scope }}</h4>
      <div class="flex flex-wrap mb-$l gap-$m">
        <Button
          v-for="design of designs"
          :class="design"
          class="btn-round"
          :label="design"
          icon="i--config"
        ></Button>
        <Button class="c8-filled w-md btn-round" label="c8-filled w-md" icon="i--config"></Button>
      </div>
    </div>

    <h3 class="mb-$xs mt-$m">Icon buttons</h3>
    <div v-for="scope of scopes" class="flex flex-col" :class="scope">
      <h4 class="mb-$xs text-scope-color-500">{{ scope }}</h4>
      <div class="flex flex-wrap mb-$l gap-$m">
        <Button
          v-for="design of designs"
          :class="design"
          class="btn-square"
          :label="design"
          icon="i--config"
        />
        <Button
          v-for="design of designs"
          :class="design"
          class="btn-round btn-square"
          :label="design"
          icon="i--config"
        />
      </div>
    </div>
  </Card>
</template>
