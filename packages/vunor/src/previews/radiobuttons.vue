<script setup lang="ts">
import { ref } from 'vue'

import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import VuRadioGroup from '../components/RadioGroup/RadioGroup.vue'
import VuIcon from '../components/Icon/Icon.vue'

const items = ['item 1', 'item 2', 'item 3', { value: 'item 4', label: 'item 4', icon: 'i--eye' }]
const disabledValues = ['item 3']
const v1 = ref('item 1')
const v2 = ref('item 2')
const v3 = ref('item 3')
const items2 = [
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo et assumenda cupiditate doloremque fugiat laudantium veniam eius quidem quaerat? Odio non delectus assumenda aperiam quod at ab reprehenderit doloremque repellendus.',
  'item 2',
  'Is there no way for men to be but women; Must be half-workers? We are all bastards; And that most venerable man which I Did call my father, was I know not where',
  'item 4',
]
</script>
<template>
  <VuCard level="h2" class="with-bg relative">
    <VuCardHeader class="mb-$s">Radiobuttons</VuCardHeader>

    <div class="relative mb-$l flex flex-col gap-$l">
      <VuRadioGroup
        :items="items"
        :disabledValues
        label-visible
        label="Test rb-group"
        v-model="v1"
        v-slot="{ icon, label }"
      >
        <div class="flex gap-$xs items-center">
          <span>{{ label }}</span>
          <VuIcon :name="icon" class="current-icon-grey-400" />
        </div>
      </VuRadioGroup>
      <VuRadioGroup
        class="max-w-200px"
        :items="items"
        :disabledValues
        label-visible
        label="Test rb-group (reverse)"
        v-model="v1"
        reverse
        v-slot="{ icon, label }"
      >
        <div class="flex gap-$xs items-center">
          <span>{{ label }}</span>
          <VuIcon :name="icon" class="current-icon-grey-400" />
        </div>
      </VuRadioGroup>
      <VuRadioGroup
        class="scope-secondary"
        :items="items"
        :disabledValues
        label-visible
        label="Test rb-group (Row)"
        row
        v-model="v2"
        v-slot="{ icon, label }"
      >
        <div class="flex gap-$xs items-center">
          <span>{{ label }}</span>
          <VuIcon :name="icon" class="current-icon-grey-400" />
        </div>
      </VuRadioGroup>
      <VuRadioGroup
        class="max-w-200px"
        :items="items"
        :disabledValues
        label-visible
        label="Test rb-group (Row, Disabled)"
        row
        disabled
        v-model="v3"
      />
      <VuRadioGroup
        :items="items"
        :disabledValues
        label-visible
        label="Test rb-group"
        v-model="v1"
        error="Error text"
      />
    </div>

    <div class="relative mb-$xxl flex flex-col gap-$l">
      <VuRadioGroup
        :items="items2"
        :disabledValues
        label-visible
        label="Test rb-group (vertical-middle)"
        v-model="v1"
        vertical-middle
        class="w-md"
      />
      <VuRadioGroup
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
      </VuRadioGroup>
      <VuRadioGroup
        :items="items2"
        :disabledValues
        label-visible
        label="Test rb-group (Row, Disabled)"
        row
        disabled
        v-model="v3"
        class="w-xxl"
        v-slot="{ label }"
      >
        <div class="max-w-200px">{{ label }}</div>
      </VuRadioGroup>
      <VuRadioGroup
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
      <VuRadioGroup
        :items="items"
        :disabledValues
        label-visible
        label="Test rb-group"
        v-model="v1"
      />
      <VuRadioGroup
        class="scope-secondary"
        :items="items"
        :disabledValues
        label-visible
        label="Test rb-group (Row)"
        row
        v-model="v2"
      />
      <VuRadioGroup
        :items="items"
        :disabledValues
        label-visible
        label="Test rb-group (Row, Disabled)"
        row
        disabled
        v-model="v3"
      />
      <VuRadioGroup
        :items="items"
        :disabledValues
        label-visible
        label="Test rb-group"
        v-model="v1"
        error="Error text"
      />
    </div>
  </VuCard>
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
