<script
  setup
  lang="ts"
  generic="
    T extends {
      icon?: string
      search?: string
      value: string | null | undefined
      label?: string
      disabled?: boolean
    }
  "
>
import type { TInputProps, TInputShellProps, TInputEmits } from '../Input/types'
import { useInputShellProps, useInputProps } from '../Input/utils'

type Props = Omit<TInputProps & TInputShellProps, 'active'> & {
  disabledValues?: (string | null | undefined)[]
  popupClass?: string | Record<string, boolean>
  items: (T | string)[] | Record<string, (T | string)[]>
}

const props = defineProps<Props>()
defineEmits<TInputEmits>()

const forwardProps = computed(() => {
  if (props.groupItem) {
    return useInputShellProps()?.value
  }
  return useInputProps()?.value
})

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
  const r = new Map<string | null | undefined, string>()
  for (const grp of groups.value) {
    for (const item of grp.items) {
      r.set(item.value, item.label || String(item.value))
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
const inputEl = ref<{ $el: HTMLInputElement }>()

function updatePlaceholder() {
  if (inputEl.value) {
    inputEl.value.$el.placeholder = props.placeholder || ''
  }
}

watch(() => [props.placeholder], updatePlaceholder)

const displayValue = computed(() => flatItems.value.get(modelValue.value) || '')

function getSearchValue(item: T) {
  return item.search || item.label?.replace(/[^\p{L}\p{N}\p{P}\p{M}\p{Zs}]/gu, '').trim()
}
</script>

<template>
  <SelectRoot v-model="modelValue" v-model:open="open" :disabled>
    <SelectTrigger as-child v-if="groupItem">
      <InputShell
        class="cursor-pointer select-none"
        v-bind="forwardProps"
        :icon-append="typeof iconAppend === 'string' ? iconAppend : 'i--chevron-down'"
        :model-value="displayValue"
        :active="open"
        readonly
        @click="openPopup"
        tabindex="-1"
        @focus="$event.target.querySelector('input')?.focus()"
      >
        <template #overlay>
          <SelectValue class="absolute left-0 right-0 h-0 invisible" />
        </template>
      </InputShell>
    </SelectTrigger>
    <Input
      v-else
      class="select-none"
      v-bind="forwardProps"
      :icon-append="typeof iconAppend === 'string' ? iconAppend : 'i--chevron-down'"
      :model-value="displayValue"
      :active="open"
      readonly
      @click="openPopup"
      v-slot="shellProps"
    >
      <SelectTrigger as-child>
        <InputShell
          class="cursor-pointer select-none"
          v-bind="shellProps"
          :model-value="displayValue"
          readonly
          type="text"
          tabindex="-1"
          @focus="$event.target.querySelector('input')?.focus()"
        >
          <template #overlay>
            <SelectValue class="absolute left-[-1px] right-0 h-0 invisible" />
          </template>
        </InputShell>
      </SelectTrigger>
    </Input>

    <SelectPortal>
      <SelectContent
        class="select-content group"
        :data-design="design"
        :class="popupClass || 'scope-primary'"
        :side-offset="0"
        position="item-aligned"
      >
        <SelectScrollUpButton class="select-scroll-btn">
          <Icon name="i--chevron-up" class="size-1em" />
        </SelectScrollUpButton>

        <SelectViewport>
          <template v-for="(g, grpIndex) of groups" :key="grpIndex">
            <SelectSeparator v-if="grpIndex > 0" class="h-[1px] bg-grey-500/10 mx-$m" />
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
                :value="item.value"
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
                    {{ item.label }}
                  </slot>
                </span>
              </SelectItem>
            </SelectGroup>
          </template>
        </SelectViewport>

        <SelectScrollDownButton class="select-scroll-btn">
          <Icon name="i--chevron-down" class="size-1em" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
