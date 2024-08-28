<script setup lang="ts" generic="T extends { icon?: string; label?: string; value: string }">
import { TabsRoot, TabsList, TabsIndicator, TabsTrigger, TabsContent } from 'radix-vue'

withDefaults(
  defineProps<{
    tabs: T[]
    defaultValue?: string
    activationMode?: 'automatic' | 'manual'
    dir?: 'ltr' | 'rtl'
    indicator?: boolean
    noContent?: boolean
    orientation?: 'vertical' | 'horizontal'
    tabsListClass?: string | Record<string, boolean> | string[]
    tabGrow?: boolean
    tabClass?: string
  }>(),
  {
    tabsListClass: 'flex relative',
    tabClass: 'c8-flat',
  }
)

const modelValue = defineModel<string>()
</script>

<template>
  <TabsRoot v-model="modelValue" :default-value :activation-mode :dir :orientation>
    <TabsList :class="tabsListClass">
      <TabsIndicator v-if="indicator" class="tabs-indicator"> </TabsIndicator>
      <TabsTrigger v-for="tab of tabs" as-child :value="tab.value">
        <slot v-bind="tab">
          <div class="tab" :class="{ grow: tabGrow, [tabClass]: true }">
            {{ tab.label ?? tab.value }}
          </div>
        </slot>
      </TabsTrigger>
    </TabsList>
    <TabsContent v-if="!noContent" v-for="tab of tabs" as-child :value="tab.value">
      <slot :name="tab.value"></slot>
    </TabsContent>
  </TabsRoot>
</template>
