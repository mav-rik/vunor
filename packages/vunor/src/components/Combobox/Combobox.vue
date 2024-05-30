<script setup lang="ts" generic="T extends TComboboxItem = TComboboxItem">
import type { TComboboxProps, TComboboxItem } from './types'
import type { TInputProps, TInputShellProps, TInputEmits } from '../Input/types'
import { createReusableTemplate } from '@vueuse/core'
import { useInputShellProps, useInputProps } from '../Input/utils'

const [DefineContentTemplate, UseContentTemplate] = createReusableTemplate()
const [DefineRootTemplate, UseRootTemplate] = createReusableTemplate()
const [DefineInputShellTemplate, UseInputShellTemplate] = createReusableTemplate()
const [DefineItemsTemplate, UseItemsTemplate] = createReusableTemplate()

const props = withDefaults(
  defineProps<Omit<TInputProps & TInputShellProps, 'active'> & TComboboxProps<T>>(),
  {
    sideOffset: 2,
    popupPosition: 'popper',
  }
)
defineEmits<TInputEmits>()

const forwardProps = computed(() => {
  if (props.groupItem) {
    return useInputShellProps()?.value
  }
  return useInputProps()?.value
})
const shellProps = computed(() => {
  return useInputShellProps()?.value
})

const modelOpen = defineModel<boolean>('open')
const modelValue = defineModel<string | string[]>()

const modelValueString = computed<string>(() => {
  if (!modelValue.value && (modelValue.value as unknown as number) !== 0) return ''
  return typeof modelValue.value === 'string'
    ? modelValue.value
    : Array.isArray(modelValue.value)
      ? modelValue.value.map(item => flatItems.value.get(item as string) || '').join(', ')
      : String(modelValue.value)
})

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

const displayValue = computed(() => flatItems.value.get(modelValue.value as string) || '')

const input = computed(
  () => inputTemplate.value?.$el.querySelector('input') as HTMLInputElement | undefined
)

async function openPopup() {
  if (!props.disabled && !usePopover.value) {
    modelOpen.value = !modelOpen.value
    await nextTick()
    if (input.value) {
      const el = input.value
      if (el) {
        const valueLength = el.value.length
        el.focus()
        el.setSelectionRange(valueLength, valueLength)
      }
    }
  }
}

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

const searchTerm = ref('')

const usePopover = computed(() => props.multiple)
if (usePopover.value) {
  modelOpen.value = true
}
watch([usePopover], () => {
  if (usePopover.value) {
    modelOpen.value = true
  }
})

const sideOffsetHack = ref(false)
const _sideOffset = computed<number>(() => (sideOffsetHack.value ? -1 : props.sideOffset))

watch([modelOpen], async () => {
  sideOffsetHack.value = true
  await nextTick()
  sideOffsetHack.value = false
})

const popoverProps = computed(() => ({
  class: {
    [typeof props.popupClass === 'string' ? props.popupClass : 'scope-primary']: true,
    'select-content group rounded': true,
    ...(typeof props.popupClass === 'object' ? props.popupClass : {}),
  },
  dataDesign: props.popupRound ? 'round' : undefined,
  style: {
    'min-width': 'var(--radix-popper-anchor-width)',
  },
  side: props.side,
  sideOffset: _sideOffset.value,
  updatePositionStrategy: props.updatePositionStrategy,
  bodyLock: props.bodyLock,
}))

const comboboxContentProps = computed(() => {
  if (usePopover.value) return {}
  return popoverProps.value
})
const popoverContentProps = computed(() => {
  if (usePopover.value) return popoverProps.value
  return {}
})
const popupOpen = ref(false)
watch(popupOpen, () => {
  if (popupOpen.value) {
    modelOpen.value = true
  }
})
watch(modelOpen, () => {
  if (usePopover.value) {
    popupOpen.value = !!modelOpen.value
  }
})
const inputTemplate = ref<{ $el: HTMLDivElement }>()
async function focusOnInput() {
  await nextTick()
  input.value?.focus({
    preventScroll: true,
  })
}
async function clearValue() {
  modelValue.value = undefined
  await nextTick()
  input.value?.focus()
}

const focused = ref(false)
function onFocus() {
  focused.value = true
}
function onBlur() {
  focused.value = false
}
function onKeydown(event: KeyboardEvent) {
  if (['Enter', 'Space'].includes(event.code)) {
    popupOpen.value = true
  } else if (/Key[a-zA-Z0-9]/.test(event.code)) {
    popupOpen.value = true
  }
}
</script>

<template>
  <!-- reusabe templates start -->
  <DefineContentTemplate>
    <ComboboxContent v-bind="comboboxContentProps" :position="usePopover ? 'inline' : 'popper'">
      <ComboboxViewport class="">
        <ComboboxEmpty class="select-grp-label">
          <slot name="empty">
            <span>No Options</span>
          </slot>
        </ComboboxEmpty>

        <ComboboxGroup v-for="(g, grpIndex) of groups" :key="grpIndex">
          <ComboboxSeparator v-if="grpIndex > 0" class="h-[1px] bg-grey-500/10 mx-$s" />
          <ComboboxLabel class="select-grp-label" v-if="!!g.grp">
            <slot name="group" v-bind="g">
              <span>{{ g.grp }}</span>
            </slot>
          </ComboboxLabel>

          <ComboboxItem
            v-for="(item, index) in g.items"
            :key="index"
            class="select-item relative"
            :value="String(item.value)"
            :disabled="disabled || item.disabled || isItemDisabled(item.value)"
            :aria-disabled="disabled || item.disabled || isItemDisabled(item.value)"
            @click="focusOnInput"
          >
            <span>
              <slot name="item" v-bind="item">
                {{ item.label }}
              </slot>
            </span>
          </ComboboxItem>
          <ComboboxSeparator class="h-[1px] bg-grass6 m-[5px]" />
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxContent>
  </DefineContentTemplate>

  <DefineRootTemplate v-slot="templateProps">
    <ComboboxRoot
      :class="templateProps.class"
      class="relative w-full h-full"
      v-model="modelValue"
      :default-open="usePopover"
      v-model:open="modelOpen"
      v-model:search-term="searchTerm"
      :display-value="() => displayValue"
      :disabled
      :required
      :multiple
      :as-child="usePopover || groupItem"
    >
      <DefineInputShellTemplate>
        <InputShell
          @click="openPopup"
          :active="modelOpen"
          v-model="modelValue"
          v-bind="shellProps"
          v-slot="slotProps"
          :label="usePopover ? '' : shellProps?.label"
          :placeholder="usePopover ? 'Search' : shellProps?.placeholder"
          :design="usePopover ? 'filled' : shellProps?.design"
          :icon-append="usePopover ? undefined : 'i--chevron-down'"
          :icon-prepend="usePopover ? 'i--search' : shellProps?.iconPrepend"
          :class="usePopover ? 'i8-no-border' : ''"
        >
          <ComboboxInput as-child class="i8-input">
            <input
              class="i8-input"
              ref="input"
              v-bind="slotProps"
              @focus="slotProps.onFocus"
              @blur="slotProps.onBlur"
              @keydown.home.end="handleHomeEnd"
            />
          </ComboboxInput>
        </InputShell>
      </DefineInputShellTemplate>

      <div v-if="usePopover" class="sticky top-0 z-1 bg-current/100 border-b-1px">
        <UseInputShellTemplate ref="inputTemplate" />
      </div>
      <ComboboxAnchor v-else as-child>
        <UseInputShellTemplate ref="inputTemplate" />
      </ComboboxAnchor>

      <UseContentTemplate v-if="usePopover" />
      <ComboboxPortal as-child v-else>
        <UseContentTemplate />
      </ComboboxPortal>
    </ComboboxRoot>
  </DefineRootTemplate>

  <!-- reusabe templates end -->

  <template v-if="usePopover">
    <PopoverRoot v-model:open="popupOpen">
      <DefineItemsTemplate>
        <!-- <div class="i8-ta-wrapper">
          <div class="i8-textarea flex items-center">
            {{ modelValueString }}
          </div>
        </div> -->
        <div class="i8-input relative flex items-center">
          <div class="text-ellipsis overflow-hidden whitespace-nowrap absolute max-w-full pr-$m">
            {{ modelValueString }}
          </div>
        </div>
      </DefineItemsTemplate>

      <PopoverTrigger v-if="groupItem" as-child>
        <InputShell
          class="text-left outline-0 outline-offset-0"
          tabindex="0"
          @keydown="onKeydown"
          @focus="onFocus"
          @blur="onBlur"
          v-bind="forwardProps"
          :model-value="modelValueString"
          readonly
          icon-append="i--chevron-down"
          :class
          :active="popupOpen || focused"
          ><UseItemsTemplate />
        </InputShell>
      </PopoverTrigger>
      <Input
        v-else
        v-bind="forwardProps"
        :model-value="modelValueString"
        :class
        :active="popupOpen"
        v-slot="slotProps"
      >
        <PopoverTrigger as-child>
          <InputShell
            class="text-left outline-0 outline-offset-0"
            tabindex="0"
            @keydown="onKeydown"
            @focus="onFocus"
            @blur="onBlur"
            v-bind="slotProps"
            readonly
            icon-append="i--chevron-down"
            :model-value="modelValueString"
            :active="popupOpen || focused"
          >
            <UseItemsTemplate />
            <template v-slot:append="{ iconAppend }">
              <div class="flex gap-$s">
                <Icon
                  v-if="!!modelValueString"
                  name="i--clear"
                  @click.stop="clearValue"
                  class="hover:current-icon-scope-color-500 hover:icon-current cursor-pointer"
                />
                <Icon
                  :name="iconAppend!"
                  class="hover:current-icon-scope-color-500 hover:icon-current cursor-pointer"
                />
              </div>
            </template>
          </InputShell>
        </PopoverTrigger>
      </Input>

      <PopoverPortal>
        <PopoverContent
          v-bind="popoverContentProps"
          :style="{
            'max-height': 'var(--radix-popper-available-height)',
            'overflow': 'auto',
          }"
        >
          <UseRootTemplate />
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </template>

  <template v-else>
    <UseRootTemplate v-if="groupItem" :class />
    <Input v-else v-bind="forwardProps" v-model="modelValue" :class>
      <UseRootTemplate />
    </Input>
  </template>
</template>

<style>
.select-content > div[data-radix-combobox-viewport] {
  max-height: var(--radix-popper-available-height);
  scrollbar-width: auto;
}

.select-content > div[data-radix-combobox-viewport]::-webkit-scrollbar {
  display: block;
}
</style>
