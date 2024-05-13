<script setup lang="ts">
const items2 = [
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo et assumenda cupiditate doloremque fugiat laudantium veniam eius quidem quaerat? Odio non delectus assumenda aperiam quod at ab reprehenderit doloremque repellendus.',
  'item 2',
  'Is there no way for men to be but women; Must be half-workers? We are all bastards; And that most venerable man which I Did call my father, was I know not where',
  'item 4',
]
const disabledValues = ['item 2']
const v1 = ref('item 4')
const v2 = ref('item 4')
const v3 = ref('item 4')
</script>
<template>
  <Card level="h2" class="with-bg relative">
    <CardHeader class="mb-$s">Testing</CardHeader>

    <div class="relative mb-$xxl flex flex-col gap-$l">
      <RadioGroup
        :items="items2"
        :disabledValues
        label-visible
        label="Test rb-group"
        v-model="v1"
        class="w-md"
      />
      <RadioGroup
        class="scope-secondary"
        :items="items2"
        :disabledValues
        label-visible
        label="Test rb-group (Row)"
        row
        v-model="v2"
        v-slot="{ label }"
      >
        <div class="max-w-200px">{{ label }}</div>
      </RadioGroup>
      <RadioGroup
        :items="items2"
        :disabledValues
        label-visible
        label="Test rb-group (Row)"
        row
        disabled
        v-model="v3"
        class="w-md"
      />
      <RadioGroup
        :items="items2"
        :disabledValues
        label-visible
        label="Test rb-group"
        v-model="v1"
        error="Error text"
        class="w-md"
      />
    </div>
    <div class="relative mb-$l flex flex-col gap-$l text-h3">
      <RadioGroup
        :items="items2"
        :disabledValues
        label-visible
        label="Test rb-group"
        v-model="v1"
      />
      <RadioGroup
        class="scope-secondary"
        :items="items2"
        :disabledValues
        label-visible
        label="Test rb-group (Row)"
        row
        v-model="v2"
      />
      <RadioGroup
        :items="items2"
        :disabledValues
        label-visible
        label="Test rb-group (Row)"
        row
        disabled
        v-model="v3"
      />
      <RadioGroup
        :items="items2"
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
