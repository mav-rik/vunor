<script setup lang="ts">
import { ref } from 'vue'

import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import VuCheckbox from '../components/Checkbox/Checkbox.vue'
import VuInputBase from '../components/Input/InputBase.vue'
import VuInput from '../components/Input/Input.vue'
import VuSelect from '../components/Select/Select.vue'

const states3 = [{ design: 'flat' }, { design: 'filled' }, { design: 'round' }] as const
const states2 = [
  { placeholder: 'Placeholder' },
  { label: 'Label' },
  { label: 'Label', placeholder: 'Placeholder' },
]
const states1 = [
  {
    title: 'Normal State',
    bind: {},
  },
  {
    title: 'Loading State',
    bind: { loading: true, modelValue: 'Text' },
  },
  {
    title: 'Readonly State',
    bind: { readonly: true, modelValue: 'Text' },
  },
  {
    title: 'Disabled State',
    bind: { disabled: true, modelValue: 'Text' },
  },
  {
    title: 'Error State',
    bind: { error: 'Error Message' },
  },
] as const

const iconItems = [
  { label: '-', value: 'undefined' },
  { label: 'Search', value: 'i--search', icon: 'i--search' },
  { label: 'Clear', value: 'i--clear', icon: 'i--clear' },
  { label: 'Config', value: 'i--config', icon: 'i--config' },
  { label: 'Eye', value: 'i--eye', icon: 'i--eye' },
]
const typeItems = ['text', 'textarea', 'password', 'number']

const iconBefore = ref<string>('undefined')
const iconAfter = ref<string>('undefined')
const iconPrepend = ref<string>('undefined')
const iconAppend = ref<string>('undefined')
const large = ref(false)

const type = ref('text')
const stackLabel = ref(false)

function onBlur() {
  console.log('blurred!')
}
</script>
<template>
  <VuCard
    level="h2"
    class="relative"
    :class="{
      'fingertip-l': large,
    }"
  >
    <VuCardHeader class="mb-$s">Inputs</VuCardHeader>

    <div class="layer-4 pa-$m rounded-$m backdrop-blur-md">
      <div class="flex gap-$m mt-$s items-center">
        <VuSelect :items="typeItems" v-model="type" label="Type" design="filled" :stack-label />
        <VuCheckbox label="Stack Label" v-model="stackLabel" />
        <VuCheckbox label="Large" v-model="large" />
      </div>
      <div class="flex gap-$m mt-$s">
        <VuSelect
          :stack-label
          :items="iconItems"
          v-model="iconBefore"
          label="Icon Before"
          design="filled"
        />
        <VuSelect
          :stack-label
          :items="iconItems"
          v-model="iconPrepend"
          label="Icon Prepend"
          design="filled"
        />
        <VuSelect
          :stack-label
          :items="iconItems"
          v-model="iconAppend"
          label="Icon Append"
          design="filled"
        />
        <VuSelect
          :stack-label
          :items="iconItems"
          v-model="iconAfter"
          label="Icon After"
          design="filled"
        />
      </div>
    </div>

    <div class="relative mb-$xxl flex flex-col gap-$l">
      <template v-for="state1 of states1">
        <h4 class="text-mt-$m">{{ state1.title }}</h4>
        <div v-for="state2 of states2">
          <div class="flex gap-$m flex-wrap w-full max-w-1020px">
            <VuInput
              @blur="onBlur"
              class="flex-grow"
              v-for="state3 of states3"
              v-bind="{ ...state1.bind, ...state2, ...state3 }"
              :stack-label
              :icon-before="iconBefore === 'undefined' ? undefined : iconBefore"
              :icon-after="iconAfter === 'undefined' ? undefined : iconAfter"
              :icon-prepend="iconPrepend === 'undefined' ? undefined : iconPrepend"
              :icon-append="iconAppend === 'undefined' ? undefined : iconAppend"
              :type
            />
          </div>
        </div>
      </template>
    </div>

    <h3>Groupped Inputs</h3>

    <div class="layer-2 pa-$m rounded-$m backdrop-blur-md">
      <div class="flex gap-$m mt-$s items-center">
        <VuSelect :stack-label :items="typeItems" v-model="type" label="Type" design="filled" />
        <VuCheckbox label="Stack Label" v-model="stackLabel" />
      </div>
      <div class="flex gap-$m mt-$s">
        <VuSelect
          :stack-label
          :items="iconItems"
          v-model="iconBefore"
          label="Icon Before"
          design="filled"
        />
        <VuSelect
          :stack-label
          :items="iconItems"
          v-model="iconPrepend"
          label="Icon Prepend"
          design="filled"
        />
        <VuSelect
          :stack-label
          :items="iconItems"
          v-model="iconAppend"
          label="Icon Append"
          design="filled"
        />
        <VuSelect
          :stack-label
          :items="iconItems"
          v-model="iconAfter"
          label="Icon After"
          design="filled"
        />
      </div>
    </div>

    <div class="relative mb-$xxl flex flex-col gap-$l">
      <template v-for="state1 of states1">
        <h4 class="text-mt-$m">{{ state1.title }}</h4>
        <div v-for="state2 of states2">
          <div class="flex gap-$m flex-wrap w-full max-w-1020px">
            <VuInput
              class="flex-grow"
              v-for="state3 of states3"
              v-bind="{ ...state1.bind, ...state2, ...state3 }"
              :icon-before="iconBefore === 'undefined' ? undefined : iconBefore"
              :icon-after="iconAfter === 'undefined' ? undefined : iconAfter"
              :stack-label
            >
              <VuInputBase
                v-for="n in 3"
                v-bind="{ ...state1.bind, ...state2, ...state3 }"
                :icon-prepend="iconPrepend === 'undefined' ? undefined : iconPrepend"
                :icon-append="iconAppend === 'undefined' ? undefined : iconAppend"
                :type
                group-item
              />
            </VuInput>
          </div>
        </div>
      </template>
    </div>
  </VuCard>
</template>
