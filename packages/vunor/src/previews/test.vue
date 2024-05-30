<script setup lang="ts">
import type { TComboboxItems } from '../components/Combobox/types'
const designs = ['flat', 'filled', 'round'] as const
const items: TComboboxItems = {
  '': [{ value: null, label: 'None' }],
  'Fruits': [
    { value: '👍 Durian', label: '❓ Secret', search: 'durian' },
    '🍏 Apple',
    '🍌 Banana',
    '🫐 Blueberry',
    '🍇 Grapes',
    '🍍 Pineapple',
  ],
  'Vegetables': ['🍆 Aubergine', '🥦 Broccoli', '🥕 Carrot', 'Courgette', 'Leek'],
}
const disabled = ['Courgette']
const v1 = ref<string>()
</script>
<template>
  <Card level="h2" class="with-bg relative">
    <CardHeader class="mb-$s">Testing</CardHeader>

    <div class="relative mb-$xxl flex flex-col gap-$l">
      <h4 class="text-mt-$m">Combobox (Inputs)</h4>
      <div class="flex gap-$m flex-wrap w-full">
        <Combobox
          v-for="design of designs"
          @append-click.stop="v1 ? (v1 = undefined) : ''"
          :popup-class="{
            'scope-primary': true,
          }"
          class="max-w-sm w-full flex-grow"
          :design
          :items
          :disabled-values="disabled"
          :hint="`Value = ${v1}`"
          label="A fruit or Vegetable"
        />
      </div>
      <h4 class="text-mt-$m">Combobox (Multiple)</h4>
      <div class="flex gap-$m flex-wrap w-full">
        <Combobox
          v-for="design of designs"
          @append-click.stop="v1 ? (v1 = undefined) : ''"
          :popup-class="{
            'scope-primary': true,
          }"
          :popup-round="design === 'round'"
          multiple
          class="max-w-sm w-full"
          :design
          :items
          :disabled-values="disabled"
          :hint="`Value = ${v1}`"
          label="A fruit or Vegetable"
        />
      </div>
      <h4 class="text-mt-$m">Combobox (Groupped)</h4>
      <div class="flex gap-$m flex-wrap w-full">
        <Input v-for="design of designs" :design>
          <Combobox
            @append-click.stop="v1 ? (v1 = undefined) : ''"
            :popup-class="{
              'scope-primary': true,
            }"
            :popup-round="design === 'round'"
            :design
            :items
            :disabled-values="disabled"
            label="Left Item"
            group-item
          />
          <Combobox
            @append-click.stop="v1 ? (v1 = undefined) : ''"
            :popup-class="{
              'scope-primary': true,
            }"
            multiple
            :popup-round="design === 'round'"
            :design
            :items
            :disabled-values="disabled"
            label="Center Left Item"
            group-item
          />
          <Combobox
            @append-click.stop="v1 ? (v1 = undefined) : ''"
            :popup-class="{
              'scope-primary': true,
            }"
            :popup-round="design === 'round'"
            :design
            :items
            :disabled-values="disabled"
            label="Center Right Item"
            group-item
          />
          <Combobox
            @append-click.stop="v1 ? (v1 = undefined) : ''"
            :popup-class="{
              'scope-primary': true,
            }"
            multiple
            :popup-round="design === 'round'"
            :design
            :items
            :disabled-values="disabled"
            label="Right Item"
            group-item
          />
        </Input>
      </div>

      <Combobox
        :popup-class="{
          'scope-primary': true,
        }"
        multiple
        class="w-full"
        :items
        :disabled-values="disabled"
        label="A fruit or Vegetable"
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
