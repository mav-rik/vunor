<script setup lang="ts" generic="T extends TSelectItem">
import type { TSelectBaseProps, TSelectItem } from './types'
import {
  SelectRoot,
  SelectTrigger,
  SelectPortal,
  SelectContent,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectViewport,
  SelectSeparator,
  SelectLabel,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectValue,
} from 'radix-vue'

import VuIcon from '../Icon/Icon.vue'

import { computed } from 'vue'

const props = defineProps<TSelectBaseProps<T>>()

const open = defineModel<boolean>('open')
const modelValue = defineModel<string>()

const groups = computed(() => {
  if (Array.isArray(props.items)) {
    return [
      {
        grp: '',
        items: props.items.map(item =>
          typeof item === 'string' ? ({ value: item, label: item } as T) : item
        ),
      },
    ]
  } else {
    const r = [] as { grp: string; items: T[] }[]
    for (const [key, val] of Object.entries(props.items)) {
      r.push({
        grp: key,
        items: val.map(item =>
          typeof item === 'string' ? ({ value: item, label: item } as T) : item
        ),
      })
    }
    return r
  }
})

const flatItems = computed(() => {
  const r = new Map<string | null | undefined, T>()
  for (const grp of groups.value) {
    for (const item of grp.items) {
      r.set(item.value, item)
    }
  }
  return r
})

function isItemDisabled(val: string | null | undefined) {
  return props.disabledValues?.includes(val)
}

async function openPopup() {
  if (!props.disabled) {
    open.value = !open.value
  }
}

const displayItem = computed(() => flatItems.value.get(modelValue.value))

function getSearchValue(item: T) {
  return item.search || item.label?.replace(/[^\p{L}\p{N}\p{P}\p{M}\p{Zs}]/gu, '').trim()
}
</script>

<template>
  <!-- prettier-ignore-attribute default-value -->
  <SelectRoot
    v-model="modelValue"
    v-model:open="open"
    :disabled
    :required
    :default-value="defaultValue as string"
  >
    <slot :displayItem="displayItem" :value="modelValue" :openPopup :open :icon="'i--chevron-down'">
      <SelectTrigger :class>
        <VuIcon
          v-if="!!displayItem?.icon"
          :name="displayItem.icon"
          class="inline-block vertical-middle mr-$xs"
          style="color: currentColor"
        />
        <SelectValue :placeholder :class="valueClass">
          {{ displayItem?.label }}
        </SelectValue>
        <VuIcon name="i--chevron-down" :class="iconClass" />
      </SelectTrigger>
    </slot>

    <SelectPortal>
      <SelectContent
        class="select-content group"
        :style="{
          'min-width': 'var(--radix-popper-anchor-width)',
          'max-height': popupPosition === 'popper' ? 'var(--radix-popper-available-height)' : '',
          'overflow': popupPosition === 'popper' ? 'auto' : '',
        }"
        :data-design="popupRound ? 'round' : undefined"
        :class="popupClass"
        :position="popupPosition"
        :side
        :side-offset
        :sticky
        :update-position-strategy
      >
        <SelectScrollUpButton class="select-scroll-btn">
          <VuIcon name="i--chevron-up" class="size-1em" />
        </SelectScrollUpButton>

        <SelectViewport>
          <template v-for="(g, grpIndex) of groups" :key="grpIndex">
            <SelectSeparator v-if="grpIndex > 0" class="select-separator" />
            <SelectLabel class="select-grp-label" v-if="!!g.grp">
              <slot name="group" v-bind="g">
                <span>{{ g.grp }}</span>
              </slot>
            </SelectLabel>
            <SelectGroup>
              <SelectItem
                v-for="(item, index) in g.items"
                :key="index"
                class="select-item relative"
                :value="String(item.value)"
                :disabled="disabled || item.disabled || isItemDisabled(item.value)"
                :aria-disabled="disabled || item.disabled || isItemDisabled(item.value)"
              >
                <SelectItemText class="absolute">
                  <span class="hidden">
                    {{ getSearchValue(item) }}
                  </span>
                </SelectItemText>
                <span>
                  <slot name="item" v-bind="item">
                    <VuIcon
                      v-if="!!item.icon"
                      :name="item.icon"
                      class="inline-block vertical-middle mr-$xs"
                      style="color: currentColor"
                    />
                    {{ item.label }}
                  </slot>
                </span>
              </SelectItem>
            </SelectGroup>
          </template>
        </SelectViewport>

        <SelectScrollDownButton class="select-scroll-btn">
          <VuIcon name="i--chevron-down" class="size-1em" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
