<script setup lang="ts">
import type { TComboboxItems } from '../components/Combobox/types'
const designs = ['flat', 'filled', 'round'] as const
const states = [
  {
    title: 'Single-Select',
    bind: { hint: 'Supporting Message' },
  },
  {
    title: 'Multi-Select',
    bind: { multiple: true },
  },
  {
    title: 'Readonly',
    bind: { readonly: true, modelValue: '🫐 Blueberry' },
  },
  {
    title: 'Readonly (Multi)',
    bind: { readonly: true, multiple: true, modelValue: '🫐 Blueberry' },
  },
  {
    title: 'Disabled',
    bind: { disabled: true, modelValue: '🫐 Blueberry' },
  },
  {
    title: 'Loading',
    bind: { loading: true, modelValue: '🫐 Blueberry' },
  },
  {
    title: 'Error State',
    bind: { error: 'Error Message' },
  },
] as const
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
const v1 = ref<string[]>([])
const asCheckboxes = ref(false)
</script>
<template>
  <Card level="h2" class="with-bg relative">
    <CardHeader class="mb-$s">Comboboxes</CardHeader>

    <Checkbox label="Items as Checkboxes" v-model="asCheckboxes" />

    <div class="relative mb-$xxl flex flex-col gap-$l">
      <template v-for="state of states">
        <h4 class="text-mt-$m">{{ state.title }}</h4>
        <div class="flex gap-$m flex-wrap w-full">
          <Combobox
            :checkbox-items="asCheckboxes"
            v-for="design of designs"
            :popup-class="{
              'scope-primary': true,
            }"
            class="max-w-sm w-full flex-grow"
            :design
            :items
            :disabled-values="disabled"
            label="A fruit or Vegetable"
            v-bind="state.bind"
          />
        </div>
      </template>

      <template v-for="state of states">
        <h4 class="text-mt-$m">Groupped ({{ state.title }})</h4>
        <div class="flex gap-$m flex-wrap w-full">
          <Input v-for="design of designs" :design class="w-full" v-bind="state.bind">
            <Combobox
              :checkbox-items="asCheckboxes"
              @append-click.stop="v1 ? (v1 = undefined) : ''"
              :popup-class="{
                'scope-primary': true,
              }"
              class=""
              :popup-round="design === 'round'"
              v-bind="state.bind"
              :design
              :items
              :disabled-values="disabled"
              label="Left Item"
              group-item
            />
            <Combobox
              :checkbox-items="asCheckboxes"
              @append-click.stop="v1 ? (v1 = undefined) : ''"
              :popup-class="{
                'scope-primary': true,
              }"
              class=""
              :popup-round="design === 'round'"
              v-bind="state.bind"
              :design
              :items
              :disabled-values="disabled"
              label="Center Left Item"
              group-item
            />
            <Combobox
              :checkbox-items="asCheckboxes"
              @append-click.stop="v1 ? (v1 = undefined) : ''"
              :popup-class="{
                'scope-primary': true,
              }"
              class=""
              :popup-round="design === 'round'"
              v-bind="state.bind"
              :design
              :items
              :disabled-values="disabled"
              label="Center Right Item"
              group-item
            />
            <Combobox
              :checkbox-items="asCheckboxes"
              @append-click.stop="v1 ? (v1 = undefined) : ''"
              :popup-class="{
                'scope-primary': true,
              }"
              class=""
              :popup-round="design === 'round'"
              v-bind="state.bind"
              :design
              :items
              :disabled-values="disabled"
              label="Right Item"
              group-item
            />
          </Input>
        </div>
      </template>

      <div class="flex gap-$m flex-wrap w-full">
        <Combobox multiple :items class="w-400px" label="Tokens" design="filled" v-model="v1">
          <template v-slot:selected-items="{ items }">
            <!-- <div class="i8-ta-wrapper"> -->
            <OverflowContainer
              :items
              class="i8-input items-center text-body-s flex gap-$s absolute left-0 top-0 right-0 bottom-0"
            >
              <template v-slot="{ item }">
                <div
                  class="surface-50 border px-$xs rounded whitespace-nowrap flex items-center gap-$s opacity-90 hover:opacity-100"
                >
                  {{ item.label }}
                  <Icon
                    name="i--clear"
                    @click.stop="v1 = v1.filter(i => i !== item.value)"
                    class="opacity-70 hover:opacity-100 cursor-pointer"
                  />
                </div>
              </template>
            </OverflowContainer>
            <!-- </div> -->
          </template>
        </Combobox>

        <Combobox
          multiple
          :items
          class="w-400px"
          design="filled"
          icon-prepend="i--select"
          icon-before="i--config"
          icon-after="i--click"
        >
        </Combobox>
      </div>

      <!-- <OverflowContainer
        :items="v1"
        class="surface-100 w-300px overflow-hidden text-body-s p-$s gap-$xs"
      >
        <template v-slot="{ item }">
          <span
            class="surface-50 border px-$xs rounded whitespace-nowrap flex items-center gap-$s opacity-90 hover:opacity-100"
            >{{ item }}</span
          >
        </template>
      </OverflowContainer> -->
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
