<script setup lang="ts">
import type { TComboboxItems } from '../components/Combobox/types'
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import VuCheckbox from '../components/Checkbox/Checkbox.vue'
import VuCombobox from '../components/Combobox/Combobox.vue'
import VuOverflowContainer from '../components/OverflowContainer/OverflowContainer.vue'
import VuInput from '../components/Input/Input.vue'
import { ref } from 'vue'
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
const v1 = ref<string[] | undefined>([])
const asCheckboxes = ref(false)
const stackLabel = ref(false)
</script>
<template>
  <VuCard level="h2" class="with-bg relative">
    <VuCardHeader class="mb-$s">Comboboxes</VuCardHeader>

    <div class="flex gap-$l">
      <VuCheckbox label="Items as Checkboxes" v-model="asCheckboxes" />
      <VuCheckbox label="Stack Label" v-model="stackLabel" />
    </div>

    <div class="relative mb-$xxl flex flex-col gap-$l">
      <template v-for="state of states">
        <h4 class="text-mt-$m">{{ state.title }}</h4>
        <div class="flex gap-$m flex-wrap w-full">
          <VuCombobox
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
            :stack-label
            v-bind="state.bind"
          />
        </div>
      </template>

      <template v-for="state of states">
        <h4 class="text-mt-$m">Groupped ({{ state.title }})</h4>
        <div class="flex gap-$m flex-wrap w-full">
          <VuInput
            v-for="design of designs"
            :design
            class="w-full"
            v-bind="state.bind"
            :stack-label
            label="Group level label"
          >
            <VuCombobox
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
            <VuCombobox
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
            <VuCombobox
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
            <VuCombobox
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
          </VuInput>
        </div>
      </template>

      <div class="flex gap-$m flex-wrap w-full">
        <VuCombobox
          multiple
          :items
          class="w-400px"
          label="Tokens"
          design="filled"
          v-model="v1"
          :stack-label
        >
          <template v-slot:selected-items="scopeProps">
            <!-- <div class="i8-ta-wrapper"> -->
            <VuOverflowContainer
              :items="scopeProps.items"
              v-bind="scopeProps.inputAttrs"
              class="i8-input items-center text-body-s flex gap-$s absolute left-0 top-0 right-0 bottom-0"
            >
              <template v-slot="{ item }">
                <div
                  class="surface-50 border px-$xs rounded whitespace-nowrap flex items-center gap-$s opacity-90 hover:opacity-100"
                >
                  {{ item.label }}
                  <VuIcon
                    name="i--clear"
                    @click.stop="v1 = v1?.filter(i => i !== item.value)"
                    class="opacity-70 hover:opacity-100 cursor-pointer"
                  />
                </div>
              </template>
            </VuOverflowContainer>
            <!-- </div> -->
          </template>
        </VuCombobox>

        <VuCombobox
          multiple
          :stack-label
          :items
          class="w-400px"
          design="filled"
          icon-prepend="i--select"
          icon-before="i--config"
          icon-after="i--click"
        >
        </VuCombobox>
      </div>
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
