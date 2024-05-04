<script setup lang="ts">
type AcceptableValue = string | number | boolean | Record<string, any>
type TItem = { label: string; value: AcceptableValue; icon?: string; group?: string }
type Props = {
  items: (string | TItem)[]
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
</script>

<template>
  <ComboboxRoot
    :open="true"
    model-value=""
    @update:model-value="modelValue = $event"
    class="menu-root"
  >
    <!-- input -->
    <div class="flex items-center border-b px-3" cmdk-input-wrapper>
      <div class="i--search mr-2 h-4 w-4 shrink-0 opacity-50" />
      <ComboboxInput
        auto-focus
        placeholder="Type a command or search"
        class="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>

    <!-- list -->
    <ComboboxContent class="overflow-y-auto overflow-x-hidden" :dismissable="false">
      <div role="presentation">
        <!-- empty -->
        <ComboboxEmpty class="py-6 text-center text-sm"> No commands found </ComboboxEmpty>
        <!-- group -->
        <ComboboxGroup v-for="grp of groups" class="">
          <ComboboxLabel v-if="grp.group" class="px-$m text-mt-$l text-mb-$m">
            <span class="text-caption fw-bold">{{ grp.group }}</span>
          </ComboboxLabel>
          <!-- command item -->
          <ComboboxItem
            v-for="item of grp.items"
            :value="item.value"
            :data-active="modelValue === item.value"
            class="menu-item relative"
          >
            <span
              v-if="item.icon"
              :class="{
                [item.icon]: true,
              }"
              class="size-[1.25em] icon-color"
            ></span>
            <span class="">{{ item.label }}</span>
            <!-- <div class="absolute left-0 top-0 right-0 h-[1em] bg-green/20"></div>
            <div class="absolute left-0 bottom-0 right-0 h-[1em] bg-green/20"></div> -->
          </ComboboxItem>
        </ComboboxGroup>
        <!--  -->
      </div>
    </ComboboxContent>
  </ComboboxRoot>
</template>
