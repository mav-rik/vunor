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
    dropdownIcon: 'i--chevron-down',
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
  const r = [] as T[]
  for (const grp of groups.value) {
    for (const item of grp.items) {
      r.push(item)
    }
  }
  return r
})

const flatItemsMap = computed(() => {
  const r = new Map<string | number | null | undefined, T>()
  for (const item of flatItems.value) {
    r.set(item.value, item)
  }
  return r
})

function isItemSelected(v?: string | null) {
  return Array.isArray(modelValue.value)
    ? modelValue.value.includes(v as string)
    : modelValue.value === v
}

const selectedItems = computed(() => {
  if (modelValue.value && Array.isArray(modelValue.value)) {
    return modelValue.value.map(v => flatItemsMap.value.get(v)!) as T[]
  } else {
    const item = flatItemsMap.value.get(modelValue.value)
    if (item) {
      return [item] as T[]
    }
  }
  return [] as T[]
})

const selectedLabels = computed<string>(() => {
  if (!modelValue.value && (modelValue.value as unknown as number) !== 0) return ''
  return selectedItems.value
    .filter(item => !!item)
    .map(item => item.label || item.value)
    .join(', ')
})

function isItemDisabled(val: string | null | undefined) {
  return props.disabledValues?.includes(val)
}

const displayValue = computed(() => flatItemsMap.value.get(modelValue.value as string)?.label || '')

const input = computed(
  () => inputTemplate.value?.$el.querySelector('input') as HTMLInputElement | undefined
)

async function openPopup() {
  if (!props.readonly && !props.disabled && !usePopover.value) {
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
    [typeof props.popupClass === 'string' ? props.popupClass : '']: true,
    'select-content group/i8 rounded': true,
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
  if (props.disabled || props.readonly) {
    return
  }
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
          <ComboboxSeparator v-if="grpIndex > 0" class="select-separator" />
          <ComboboxLabel class="select-grp-label" v-if="!!g.grp">
            <slot name="group-label" v-bind="g">
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
              <slot name="item" v-bind="item" :selected="isItemSelected(item.value)">
                <VuCheckbox
                  v-if="checkboxItems"
                  readonly
                  vertical-middle
                  :label="item.label"
                  :model-value="isItemSelected(item.value)"
                />
                <template v-else>
                  {{ item.label }}
                </template>
              </slot>
            </span>
          </ComboboxItem>
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
        <!-- prettier-ignore-attribute v-model -->
        <VuInputShell
          @click="openPopup"
          :active="modelOpen"
          v-model="(modelValue as string)"
          v-bind="shellProps"
          :type="usePopover ? 'text' : shellProps?.type"
          :label="usePopover ? '' : shellProps?.label"
          :placeholder="usePopover ? 'Search' : shellProps?.placeholder"
          :design="usePopover ? 'filled' : shellProps?.design"
          :icon-append="usePopover ? undefined : dropdownIcon"
          :icon-prepend="usePopover ? 'i--search' : shellProps?.iconPrepend"
          :class="usePopover ? 'i8-no-border' : 'i8-combobox'"
          @append-click="openPopup"
          :data-expanded="usePopover ? undefined : modelOpen"
        >
          <template v-slot="slotProps">
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
          </template>

          <template #prepend v-if="!usePopover && !!$slots.prepend">
            <slot name="prepend"></slot>
          </template>

          <template #append v-if="!usePopover && !!$slots.append">
            <slot name="append"></slot>
          </template>
        </VuInputShell>
      </DefineInputShellTemplate>

      <div v-if="usePopover" class="sticky top-0 z-1 bg-current/100 border-b-1px">
        <UseInputShellTemplate ref="inputTemplate" />
      </div>
      <ComboboxAnchor v-else as-child>
        <UseInputShellTemplate ref="inputTemplate" />
      </ComboboxAnchor>

      <UseContentTemplate v-if="usePopover" />
      <ComboboxPortal v-else as-child>
        <UseContentTemplate />
      </ComboboxPortal>
    </ComboboxRoot>
  </DefineRootTemplate>

  <!-- reusabe templates end -->

  <template v-if="readonly || disabled">
    <!-- prettier-ignore-attribute v-model -->
    <VuInputShell
      v-if="groupItem"
      v-bind="shellProps"
      v-model="(modelValue as string)"
      :class
      :icon-append="props.iconAppend || dropdownIcon"
    >
      <template #prepend v-if="!!$slots.prepend">
        <slot name="prepend"></slot>
      </template>

      <template #append v-if="!!$slots.append">
        <slot name="append"></slot>
      </template>
    </VuInputShell>
    <!-- prettier-ignore-attribute v-model -->
    <VuInput
      v-else
      v-bind="forwardProps"
      v-model="(modelValue as string)"
      :class
      :icon-append="props.iconAppend || dropdownIcon"
    >
      <template #before v-if="!!$slots.before">
        <slot name="before"></slot>
      </template>
      <template #after v-if="!!$slots.after">
        <slot name="after"></slot>
      </template>

      <template #prepend v-if="!!$slots.prepend">
        <slot name="prepend"></slot>
      </template>
      <template #append v-if="!!$slots.append">
        <slot name="append"></slot>
      </template>
    </VuInput>
  </template>

  <template v-else-if="usePopover">
    <PopoverRoot v-model:open="popupOpen">
      <DefineItemsTemplate>
        <slot name="selected-items" :items="selectedItems">
          <div class="combobox-multi-input">
            <div class="combobox-multi-items">
              {{ selectedLabels }}
            </div>
          </div>
        </slot>
      </DefineItemsTemplate>

      <PopoverTrigger v-if="groupItem" as-child :data-expanded="popupOpen" class="i8-combobox">
        <VuInputShell
          class="combobox-embedded-input"
          tabindex="0"
          @keydown="onKeydown"
          @focus="onFocus"
          @blur="onBlur"
          v-bind="forwardProps"
          :model-value="selectedLabels"
          readonly
          :icon-append="dropdownIcon"
          @append-click="popupOpen = !popupOpen"
          :class
          :active="popupOpen || focused"
        >
          <template>
            <UseItemsTemplate />
          </template>

          <template #prepend v-if="!!$slots.prepend">
            <slot name="prepend"></slot>
          </template>
          <template #append v-if="!!$slots.append">
            <slot name="append"></slot>
          </template>
        </VuInputShell>
      </PopoverTrigger>
      <VuInput
        v-else
        v-bind="forwardProps"
        :model-value="selectedLabels"
        :class
        :active="popupOpen"
        :data-expanded="popupOpen"
        class="i8-combobox"
      >
        <template v-slot="slotProps">
          <PopoverTrigger as-child>
            <VuInputShell
              class="combobox-embedded-input"
              tabindex="0"
              @keydown="onKeydown"
              @focus="onFocus"
              @blur="onBlur"
              v-bind="slotProps"
              readonly
              :icon-append="dropdownIcon"
              @append-click="popupOpen = !popupOpen"
              :model-value="selectedLabels"
              :active="popupOpen || focused"
            >
              <UseItemsTemplate />

              <template #prepend v-if="!!$slots.prepend">
                <slot name="prepend"></slot>
              </template>
              <template v-slot:append="{ iconAppend }">
                <div class="flex gap-$s">
                  <VuIcon
                    v-if="!!selectedLabels && !readonly && !disabled"
                    name="i--clear"
                    @click.stop="clearValue"
                    class="combobox-c8-icon"
                  />
                  <VuIcon :name="dropdownIcon" class="combobox-c8-icon" />
                </div>
              </template>
            </VuInputShell>
          </PopoverTrigger>
        </template>

        <template #before v-if="!!$slots.before">
          <slot name="before"></slot>
        </template>
        <template #after v-if="!!$slots.after">
          <slot name="after"></slot>
        </template>
      </VuInput>

      <PopoverPortal>
        <PopoverContent
          v-bind="popoverContentProps"
          avoidCollisions
          :collision-padding="50"
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

    <!-- prettier-ignore-attribute v-model -->
    <VuInput v-else v-bind="forwardProps" v-model="(modelValue as string)" :class>
      <UseRootTemplate />
    </VuInput>
  </template>
</template>
