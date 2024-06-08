<script setup lang="ts">
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

const type = ref('text')
const stackLabel = ref(false)
</script>
<template>
  <VuCard level="h2" class="with-bg relative">
    <VuCardHeader class="mb-$s">Inputs</VuCardHeader>

    <div class="layer-4 pa-$m rounded-$m backdrop-blur-md">
      <div class="flex gap-$m mt-$s items-center">
        <VuSelect :items="typeItems" v-model="type" label="Type" design="filled" :stack-label />
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
              <VuInputShell
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
