<script setup lang="ts" generic="T extends TComboboxItem = TComboboxItem">
import {
  ComboboxRoot,
  ComboboxContent,
  ComboboxViewport,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxSeparator,
  ComboboxLabel,
  ComboboxItem,
  ComboboxInput,
  ComboboxAnchor,
  ComboboxPortal,
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
} from 'reka-ui'
import { watch, ref, computed, nextTick } from 'vue'
import { useInputBaseProps, useInputProps } from 'vunor'

import VuCheckbox from '../Checkbox/Checkbox.vue'
import { claimToggle, useForwardToRoot, useModelState, useRootBinding } from '../forward-root'
import VuIcon from '../Icon/Icon.vue'
import VuInput from '../Input/Input.vue'
import VuInputBase from '../Input/InputBase.vue'
import { createReusableTemplate } from './reusable-template'

import type { TInputProps, TInputBaseProps, TInputEmits } from '../Input/utils'
import type { TComboboxProps, TComboboxItem } from './types'

const [DefineContentTemplate, UseContentTemplate] = createReusableTemplate()
const [DefineRootTemplate, UseRootTemplate] = createReusableTemplate()
const [DefineInputBaseTemplate, UseInputBaseTemplate] = createReusableTemplate()
const [DefineItemsTemplate, UseItemsTemplate] = createReusableTemplate()

// The template renders several roots (the reusable-template definitions plus one of
// the readonly / multiple / single branches), so fallthrough attrs are bound
// explicitly to the outermost element of whichever branch renders.
defineOptions({ inheritAttrs: false })
// Template note: ComboboxRoot gets its wrapper classes only when it renders its own
// element. As-child (multiple / groupItem), it merges class into its first child (the
// sticky search header or the trigger shell), where they do not belong.

const props = withDefaults(
  defineProps<
    Omit<TInputProps & TInputBaseProps, 'active'> &
      TComboboxProps<T> & {
        align?: 'start' | 'center' | 'end'
      }
  >(),
  {
    // forwarded booleans: absent stays undefined (see forward-root.ts)
    // vunor keeps the typed text on blur (Reka clears it by default)
    resetSearchTermOnBlur: false,
    resetSearchTermOnSelect: undefined,
    openOnFocus: undefined,
    openOnClick: undefined,
    ignoreFilter: undefined,
    resetModelValueOnClear: undefined,
    highlightOnHover: undefined,
    sideOffset: 2,
    popupPosition: 'popper',
    dropdownIcon: 'i--chevron-down',
  }
)
const emit = defineEmits<
  TInputEmits & {
    (e: 'enter', event: KeyboardEvent): void
    (e: 'highlight', payload: unknown): void
  }
>()

// ComboboxRoot props/emits declared on this component (name, by, dir, highlight, ...)
const rootProps = useForwardToRoot(ComboboxRoot, props, emit, [
  'open',
  'modelValue',
  'defaultOpen',
  'multiple',
  'disabled',
  'required',
  'asChild',
  'as',
  'update:open',
  'update:modelValue',
])

const inputProps = useInputProps()
const shellProps = useInputBaseProps()
const forwardProps = computed(() => {
  if (props.groupItem) {
    // VuInputBase has no `click` event: pass the listener on as a native one
    return { ...shellProps?.value, onClick: props.onClick }
  }
  return inputProps?.value
})

// `open`: the popup the user opens. With `multiple` that is the popover around the list
// (the list itself is always open inside it), otherwise ComboboxRoot's own popup.
const modelOpen = defineModel<boolean>('open', { default: undefined })
const modelValue = defineModel<string | string[]>()
const searchTerm = defineModel<string>('searchTerm')
// what the shell, the labels and openPopup() see: equals the open state of the popup root
// (ComboboxRoot, or PopoverRoot with `multiple`) and ComboboxRoot's value (the roots stay
// bound to the raw models, so they are uncontrolled until those are set)
const isOpen = useModelState(modelOpen, ComboboxRoot, 'defaultOpen', props)
const value = useModelState(modelValue, ComboboxRoot, 'defaultValue', props)
const rootOpen = useRootBinding(modelOpen, isOpen)

// with `multiple` the list is always open inside the popover: ComboboxRoot's own close
// request (Escape in the search field) closes the popover
function onComboboxRootOpen(next: boolean) {
  if (!usePopover.value || !next) {
    modelOpen.value = next
  }
}

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
    const r = [] as Array<{ grp: string; items: T[] }>
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
  return Array.isArray(value.value) ? value.value.includes(v as string) : value.value === v
}

const selectedItems = computed<T[]>(() => {
  if (value.value && Array.isArray(value.value)) {
    return value.value
      .map(v => flatItemsMap.value.get(v))
      .filter((item): item is T => item !== undefined)
  } else {
    const item = flatItemsMap.value.get(value.value)
    if (item) {
      return [item] as T[]
    }
  }
  return [] as T[]
})

const selectedLabels = computed<string>(() => {
  if (!value.value && (value.value as unknown as number) !== 0) {
    return ''
  }
  return selectedItems.value
    .filter(item => !!item)
    .map(item => item.label || item.value)
    .join(', ')
})

function isItemDisabled(val: string | null | undefined) {
  return props.disabledValues?.includes(val)
}

const displayValue = computed(() => flatItemsMap.value.get(value.value as string)?.label || '')

const input = computed(
  () => inputTemplate.value?.$el?.querySelector?.('input') as HTMLInputElement | undefined
)

async function openPopup(event?: Event) {
  // the chevron's appendClick and the shell's click are one gesture: toggle once
  if (!claimToggle(event)) {
    return
  }
  if (!props.readonly && !props.disabled && !usePopover.value) {
    // with `openOnClick` / `openOnFocus` Reka's input opens the popup itself: a click on
    // the input only opens it (toggling would close what Reka just opened)
    const onInput =
      (props.openOnClick || props.openOnFocus) &&
      !!event?.target &&
      !!input.value?.contains(event.target as Node)
    isOpen.value = onInput ? true : !isOpen.value
    await nextTick()
    // with `openOnFocus`, focusing the input after a close would reopen the popup
    const el = input.value
    if (el && (isOpen.value || !props.openOnFocus)) {
      const valueLength = el.value.length
      el.focus()
      el.setSelectionRange(valueLength, valueLength)
    }
  }
}

function handleHomeEnd(event: KeyboardEvent) {
  const target = event.target as HTMLInputElement
  const length = event.key === 'Home' ? 0 : target.value.length
  if (event.shiftKey) {
    target.setSelectionRange(
      event.key === 'Home' ? 0 : (target.selectionEnd ?? target.value.length),
      event.key === 'Home' ? (target.selectionStart ?? 0) : target.value.length
    )
    event.stopPropagation()
    event.preventDefault()
  } else {
    target.setSelectionRange(length, length)
  }
}

const usePopover = computed(() => props.multiple)

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
    'min-width': 'var(--reka-popper-anchor-width)',
  },
  side: props.side,
  sideOffset: _sideOffset.value,
  updatePositionStrategy: props.updatePositionStrategy,
  sticky: props.sticky,
  bodyLock: props.bodyLock,
  align: props.align,
}))

const comboboxContentProps = computed(() => {
  if (usePopover.value) {
    return {}
  }
  return popoverProps.value
})
const popoverContentProps = computed(() => {
  if (usePopover.value) {
    return popoverProps.value
  }
  return {}
})
const inputTemplate = ref<{ $el: HTMLDivElement }>()
async function focusOnInput() {
  await nextTick()
  input.value?.focus({
    preventScroll: true,
  })
}
async function clearValue() {
  // an empty selection (undefined would make an uncontrolled root keep its own value)
  modelValue.value = Array.isArray(value.value) ? [] : undefined
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
  if (['Enter', 'Space'].includes(event.code) || /Key[a-zA-Z0-9]/.test(event.code)) {
    isOpen.value = true
  }
}
function onEnter(event: KeyboardEvent) {
  emit('enter', event)
}
</script>

<template>
  <!-- reusable templates start -->
  <DefineInputBaseTemplate>
    <VuInputBase
      v-bind="groupItem && !usePopover ? forwardProps : shellProps"
      @click="openPopup"
      :active="isOpen"
      :model-value="usePopover ? undefined : (value as string)"
      :type="usePopover ? 'text' : shellProps?.type"
      :label="usePopover ? '' : shellProps?.label"
      :placeholder="usePopover ? 'Search' : shellProps?.placeholder"
      :design="usePopover ? 'filled' : shellProps?.design"
      :icon-append="usePopover ? undefined : dropdownIcon"
      :icon-prepend="usePopover ? 'i--search' : shellProps?.iconPrepend"
      :class="usePopover ? 'i8-border-none i8-outline-none' : 'i8-combobox'"
      :no-underline="usePopover"
      :data-expanded="usePopover ? undefined : isOpen"
    >
      <template v-slot="slotProps">
        <ComboboxInput
          as-child
          v-model="searchTerm"
          :display-value="() => displayValue"
          class="i8-input"
        >
          <input
            class="i8-input"
            v-bind="slotProps"
            @focus="slotProps.onFocus"
            @blur="slotProps.onBlur"
            @keydown.home.end.capture="handleHomeEnd"
            @keydown.enter.capture="onEnter"
          />
        </ComboboxInput>
      </template>

      <template #prepend v-if="!usePopover && !!$slots.prepend">
        <slot name="prepend"></slot>
      </template>

      <template #append v-if="!usePopover && !!$slots.append">
        <slot name="append"></slot>
      </template>
    </VuInputBase>
  </DefineInputBaseTemplate>

  <DefineContentTemplate>
    <ComboboxContent
      v-bind="comboboxContentProps"
      :position="usePopover ? 'inline' : popupPosition"
    >
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

  <DefineRootTemplate>
    <ComboboxRoot
      v-bind="rootProps"
      :class="usePopover || groupItem ? undefined : 'relative w-full h-full'"
      v-model="modelValue"
      :default-open="usePopover || defaultOpen"
      :open="usePopover ? true : rootOpen"
      @update:open="onComboboxRootOpen"
      :disabled
      :required
      :multiple
      :as-child="usePopover || groupItem"
    >
      <div v-if="usePopover" class="sticky top-0 z-1 bg-current/100 border-b-1px">
        <UseInputBaseTemplate ref="inputTemplate" />
      </div>
      <ComboboxAnchor v-else as-child>
        <UseInputBaseTemplate ref="inputTemplate" />
      </ComboboxAnchor>

      <UseContentTemplate v-if="usePopover" />
      <ComboboxPortal v-else>
        <UseContentTemplate />
      </ComboboxPortal>
    </ComboboxRoot>
  </DefineRootTemplate>

  <!-- reusable templates end -->

  <template v-if="readonly || disabled">
    <VuInputBase
      v-if="groupItem"
      v-bind="{ ...$attrs, ...forwardProps }"
      :model-value="value as string"
      :class
      :icon-append="props.iconAppend || dropdownIcon"
    >
      <template #prepend v-if="!!$slots.prepend">
        <slot name="prepend"></slot>
      </template>

      <template #append v-if="!!$slots.append">
        <slot name="append"></slot>
      </template>
    </VuInputBase>
    <VuInput
      v-else
      v-bind="{ ...$attrs, ...forwardProps }"
      :model-value="value as string"
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
    <PopoverRoot
      :default-open="defaultOpen"
      :open="rootOpen"
      @update:open="(value: boolean) => (modelOpen = value)"
      modal
    >
      <DefineItemsTemplate v-slot="{ inputAttrs }">
        <slot name="selected-items" :items="selectedItems" :input-attrs>
          <div class="i8-input combobox-multi-input" v-bind="inputAttrs">
            <div class="combobox-multi-items">
              {{ selectedLabels }}
            </div>
          </div>
        </slot>
      </DefineItemsTemplate>

      <PopoverTrigger
        v-if="groupItem"
        v-bind="{ 'data-expanded': isOpen, ...$attrs }"
        as-child
        data-vu-trigger
        class="i8-combobox"
      >
        <VuInputBase
          class="combobox-embedded-input"
          tabindex="0"
          @keydown="onKeydown"
          @focus="onFocus"
          @blur="onBlur"
          v-bind="forwardProps"
          :model-value="selectedLabels"
          readonly
          :icon-append="dropdownIcon"
          :class
          :active="isOpen || focused"
        >
          <template v-slot="inputAttrs">
            <UseItemsTemplate :input-attrs="inputAttrs" />
          </template>

          <template #prepend v-if="!!$slots.prepend">
            <slot name="prepend"></slot>
          </template>
          <template #append v-if="!!$slots.append">
            <slot name="append"></slot>
          </template>
        </VuInputBase>
      </PopoverTrigger>
      <VuInput
        v-else
        v-bind="{ 'data-expanded': isOpen, ...$attrs, ...forwardProps }"
        :model-value="selectedLabels"
        :class
        :active="isOpen"
        class="i8-combobox"
      >
        <template v-slot="slotProps">
          <PopoverTrigger as-child data-vu-trigger>
            <VuInputBase
              class="combobox-embedded-input"
              tabindex="0"
              @keydown="onKeydown"
              @focus="onFocus"
              @blur="onBlur"
              v-bind="slotProps"
              readonly
              :icon-append="dropdownIcon"
              :model-value="selectedLabels"
              :active="isOpen || focused"
            >
              <template v-slot="inputAttrs">
                <UseItemsTemplate :input-attrs="inputAttrs" />
              </template>

              <template #prepend v-if="!!$slots.prepend">
                <slot name="prepend"></slot>
              </template>
              <template v-slot:append="{ iconAppend }">
                <div class="flex">
                  <div
                    class="i8-icon-wrap"
                    @click.stop="clearValue"
                    v-if="!!selectedLabels && !readonly && !disabled"
                  >
                    <VuIcon name="i--clear" class="combobox-c8-icon" />
                  </div>
                  <div class="i8-icon-wrap">
                    <VuIcon :name="dropdownIcon" class="combobox-c8-icon" />
                  </div>
                </div>
              </template>
            </VuInputBase>
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
          avoid-collisions
          :style="{
            'max-height': 'var(--reka-popper-available-height)',
            'overflow': 'auto',
          }"
        >
          <UseRootTemplate />
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </template>

  <template v-else>
    <UseRootTemplate v-if="groupItem" v-bind="$attrs" :class />

    <VuInput
      v-else
      v-bind="{ ...$attrs, ...forwardProps }"
      :model-value="value as string"
      :active="isOpen"
      :class
    >
      <UseRootTemplate />
    </VuInput>
  </template>
</template>
