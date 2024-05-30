<script setup lang="ts">
import MenuItem from './MenuItem.vue'
import Input from '../Input/Input.vue'

type AcceptableValue = string | number | boolean | Record<string, any>
type TItem = { label: string; value: AcceptableValue; icon?: string; group?: string }
type Props = {
  items: (string | TItem)[]
  emptyText?: string
}
const props = defineProps<Props>()

const modelValue = defineModel<AcceptableValue>()

const groups = computed(() => {
  const grps = {} as Record<string, TItem[]>
  for (const item of props.items) {
    const _item: TItem =
      typeof item === 'string'
        ? {
            label: item,
            value: item,
            icon: '',
            group: '',
          }
        : item
    if (!_item.group) {
      _item.group = ''
    }
    grps[_item.group] = grps[_item.group] || []
    grps[_item.group].push(_item)
  }
  return Object.entries(grps)
    .sort(([a], [b]) => (a === '' ? -1 : b === '' ? 1 : 0))
    .map(([group, items]) => ({ group, items }))
})

function handleHomeEnd(event: KeyboardEvent) {
  const target = event.target as HTMLInputElement
  const length = event.key === 'Home' ? 0 : target.value.length
  if (event.shiftKey) {
    target.setSelectionRange(
      event.key === 'Home' ? 0 : target.selectionEnd ?? target.value.length,
      event.key === 'Home' ? target.selectionStart ?? 0 : target.value.length
    )
  } else {
    target.setSelectionRange(length, length)
  }
}
</script>

<template>
  <ComboboxRoot
    :open="true"
    model-value=""
    @update:model-value="modelValue = $event"
    class="menu-root"
  >
    <!-- input -->
    <ComboboxInput
      auto-focus
      design="flat"
      icon-prepend="i--search"
      class="px-$m mb-$s"
      placeholder="Search"
      :as="Input"
      @keydown.home.end="handleHomeEnd"
    />

    <!-- list -->
    <ComboboxContent class="overflow-y-auto overflow-x-hidden" :dismissable="false">
      <div role="presentation">
        <!-- empty -->
        <ComboboxEmpty v-if="$slots.empty || emptyText">
          <slot name="empty">
            <div class="w-full text-center py-$xs" v-if="!!emptyText">
              {{ emptyText }}
            </div>
          </slot>
        </ComboboxEmpty>
        <!-- group -->
        <ComboboxGroup v-for="grp of groups" class="">
          <ComboboxLabel v-if="grp.group" class="px-$m text-mt-$l text-mb-$m">
            <span class="text-caption fw-bold">{{ grp.group }}</span>
          </ComboboxLabel>
          <!-- command item -->
          <ComboboxItem
            v-for="item of grp.items"
            :value="item.value"
            :icon="item.icon"
            :label="item.label"
            :selected="modelValue === item.value"
            :as="MenuItem"
          />
        </ComboboxGroup>
        <!--  -->
      </div>
    </ComboboxContent>
  </ComboboxRoot>
</template>
