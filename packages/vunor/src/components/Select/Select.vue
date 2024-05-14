<script
  setup
  lang="ts"
  generic="
    T extends {
      icon?: string
      value: string
      label?: string
      disabled?: boolean
    }
  "
>
import type { TInputProps, TInputShellProps, TInputEmits } from '../Input/types'
import { useInputShellProps, useInputProps } from '../Input/utils'

type Props = Omit<TInputProps & TInputShellProps, 'active'> & {
  disabledValues?: string[]
  popupClass?: string
  bodyPointerEvents?: boolean
  items: (T | string)[] | Record<string, (T | string)[]>
}

const props = defineProps<Props>()
defineEmits<TInputEmits>()

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

function isItemDisabled(val: string) {
  return props.disabledValues?.includes(val)
}

async function enableBodyPointerEvents() {
  console.log('enableBodyPointerEvents')
  if (open.value && props.bodyPointerEvents) {
    await nextTick()
    await nextTick()
    document.body.style.pointerEvents = ''
  }
}
watch([open], enableBodyPointerEvents)

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

onMounted(updatePlaceholder)
watch(() => [props.placeholder], updatePlaceholder)
</script>

<template>
  <SelectRoot v-model="modelValue" v-model:open="open" :disabled>
    <InputShell
      v-if="groupItem"
      class="cursor-pointer select-none"
      v-bind="useInputShellProps() || {}"
      :icon-append="typeof iconAppend === 'string' ? iconAppend : 'i--chevron-down'"
      :model-value="modelValue"
      :active="open"
      readonly
      @click="openPopup"
      v-slot="slotScope"
    >
      <SelectTrigger as-child :aria-label="label" class="w-full h-full text-left">
        <SelectValue
          as="input"
          class="i8-input cursor-pointer"
          v-bind="slotScope"
          :value="modelValue || ''"
          type="text"
          @click="open = !open"
          readonly
          ref="inputEl"
        />
      </SelectTrigger>
    </InputShell>
    <Input
      v-else
      class="cursor-pointer select-none"
      v-bind="useInputProps() || {}"
      :icon-append="typeof iconAppend === 'string' ? iconAppend : 'i--chevron-down'"
      :model-value="modelValue"
      :active="open"
      readonly
      @click="openPopup"
      v-slot:input="slotScope"
    >
      <SelectTrigger
        as-child
        :data-placeholder="slotScope.placeholder"
        :aria-label="label"
        class="w-full h-full text-left"
      >
        <SelectValue
          as="input"
          class="i8-input cursor-pointer"
          v-bind="slotScope"
          :value="modelValue"
          type="text"
          @click="open = !open"
          readonly
          ref="inputEl"
        />
      </SelectTrigger>
    </Input>

    <SelectPortal>
      <SelectContent
        :class="popupClass || 'scope-primary'"
        class="select-content"
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
                class="select-item"
                :value="item.value"
                :disabled="disabled || item.disabled || isItemDisabled(item.value)"
                :aria-disabled="disabled || item.disabled || isItemDisabled(item.value)"
              >
                <SelectItemText>
                  <slot name="item" v-bind="item">
                    {{ item.label }}
                  </slot>
                </SelectItemText>
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
