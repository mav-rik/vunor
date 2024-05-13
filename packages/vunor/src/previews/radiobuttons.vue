<script setup lang="ts">
const items = ['item 1', 'item 2', 'item 3', 'item 4']
const disabledValues = ['item 3']
const v1 = ref('item 1')
const v2 = ref('item 2')
const v3 = ref('item 3')
</script>
<template>
  <Card level="h2" class="with-bg relative">
    <CardHeader class="mb-$s">Radiobuttons</CardHeader>

    <div class="relative mb-$xxl flex flex-col gap-$l">
      <RadioGroup :items="items" :disabledValues label-visible label="Test rb-group" v-model="v1" />
      <RadioGroup
        class="scope-secondary"
        :items="items"
        :disabledValues
        label-visible
        label="Test rb-group (Row)"
        row
        v-model="v2"
      />
      <RadioGroup
        :items="items"
        :disabledValues
        label-visible
        label="Test rb-group (Row)"
        row
        disabled
        v-model="v3"
      />
      <RadioGroup
        :items="items"
        :disabledValues
        label-visible
        label="Test rb-group"
        v-model="v1"
        error="Error text"
      />
    </div>
    <div class="relative mb-$l flex flex-col gap-$l text-h3">
      <RadioGroup :items="items" :disabledValues label-visible label="Test rb-group" v-model="v1" />
      <RadioGroup
        class="scope-secondary"
        :items="items"
        :disabledValues
        label-visible
        label="Test rb-group (Row)"
        row
        v-model="v2"
      />
      <RadioGroup
        :items="items"
        :disabledValues
        label-visible
        label="Test rb-group (Row)"
        row
        disabled
        v-model="v3"
      />
      <RadioGroup
        :items="items"
        :disabledValues
        label-visible
        label="Test rb-group"
        v-model="v1"
        error="Error text"
      />
    </div>
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
