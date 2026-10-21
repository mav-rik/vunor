<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from 'reka-ui'
import {
  type ComponentInstance,
  callWithAsyncErrorHandling,
  camelize,
  computed,
  ErrorCodes,
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
  toHandlerKey,
  useAttrs,
  watch,
} from 'vue'
import { mergeCssClasses, type TVueCssClass } from 'vunor/utils'

import VuButton from '../Button/Button.vue'
import VuCard from '../Card/Card.vue'
import VuCardHeader from '../Card/CardHeader.vue'
import { useForwardToRoot, useModelState } from '../forward-root'
import VuIcon from '../Icon/Icon.vue'

interface TFooterButton {
  label: string
  icon?: string
  class?: string
  closeDialog?: boolean
}

// DialogRoot renders no element of its own: fallthrough attrs go to the dialog card.
defineOptions({ inheritAttrs: false })

const open = defineModel<boolean>('open', { default: undefined })
const internalOpen = ref(false)
const props = withDefaults(
  defineProps<{
    defaultOpen?: boolean
    /** Styles the overlay as a modal backdrop. The dialog itself is always modal. */
    modal?: boolean
    /** Forwarded to Reka `DialogContent`. */
    disableOutsidePointerEvents?: boolean
    rounded?: boolean
    title?: string
    focusFirstSelector?: string
    class?: TVueCssClass
    overlayClass?: TVueCssClass
    contentClass?: TVueCssClass
    closeButton?: boolean
    footerButtons?: Array<TFooterButton | string>
    level?:
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6'
      | 'subheading'
      | 'body-l'
      | 'body'
      | 'body-s'
      | 'callout'
    onEscapeKeyDown?: ((event: KeyboardEvent) => void) | undefined
    onPointerDownOutside?: ((event: unknown) => void) | undefined
    onFocusOutside?: ((event: unknown) => void) | undefined
    onInteractOutside?: ((event: unknown) => void) | undefined
    onOpenAutoFocus?: ((event: Event) => void) | undefined
    onCloseAutoFocus?: ((event: Event) => void) | undefined
  }>(),
  {
    // forwarded booleans: absent stays undefined (see forward-root.ts)
    disableOutsidePointerEvents: undefined,
    level: 'h4',
    focusFirstSelector: 'input',
    contentClass: 'px-$card-spacing py-$m flex-grow-1 overflow-auto',
  }
)
// the dialog's open state: the bound model, else default-open (DialogRoot itself is driven
// by `internalOpen`, which follows this with a delay for the closing animation)
const isOpen = useModelState(open, DialogRoot, 'defaultOpen', props)

// DialogContent props declared on this component (disableOutsidePointerEvents)
const contentProps = useForwardToRoot(DialogContent, props, undefined, [
  'forceMount',
  'asChild',
  'as',
])

const emit = defineEmits<{
  (e: 'footer-click', button: string, event: MouseEvent): void
}>()

/*
 * `footer-click-<label>` (`@footer-click-ok`): one event per footer button, named after its
 * label, so no `emits` option can declare it (Vue's `emit` would warn in development and
 * leave the listener in `$attrs`). The listener is called the way Vue's `emit` calls it:
 * `onX` or its camelCase form, then `onXOnce` once per dialog.
 */
const instance = getCurrentInstance()
const firedOnce = new Set<string>()
function emitFooterLabel(event: string, ...args: unknown[]) {
  const listeners = (instance?.vnode.props ?? {}) as Record<string, unknown>
  let handlerName = toHandlerKey(event)
  let handler = listeners[handlerName]
  if (!handler) {
    handlerName = toHandlerKey(camelize(event))
    handler = listeners[handlerName]
  }
  const call = (fn: unknown) =>
    callWithAsyncErrorHandling(
      fn as (...a: unknown[]) => unknown,
      instance,
      ErrorCodes.COMPONENT_EVENT_HANDLER,
      args
    )
  if (handler) {
    call(handler)
  }
  const onceHandler = listeners[`${handlerName}Once`]
  if (onceHandler && !firedOnce.has(handlerName)) {
    firedOnce.add(handlerName)
    call(onceHandler)
  }
}
// those listeners belong to the dialog, not to the card element `$attrs` is bound to
const FOOTER_LISTENER = /^on(FooterClick|Footer-click-)/
const attrs = useAttrs()
// read on render ($attrs is not reactive, so no computed)
function cardAttrs() {
  const keys = Object.keys(attrs)
  if (!keys.some(key => FOOTER_LISTENER.test(key))) {
    return attrs
  }
  return Object.fromEntries(keys.filter(key => !FOOTER_LISTENER.test(key)).map(k => [k, attrs[k]]))
}

async function applyFocusFirstSelector() {
  await nextTick()
  const input = root.value?.$el?.querySelector(props.focusFirstSelector)
  if (input) {
    input.focus()
  } else {
    root.value?.$el
      ?.querySelector(
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      )
      ?.focus()
  }
}

const _footerButtons = computed<TFooterButton[]>(() => {
  const b = [] as TFooterButton[]
  for (const btn of props.footerButtons || []) {
    if (typeof btn === 'string') {
      const closeDialog = ['close', 'cancel'].includes(btn.toLowerCase())
      b.push({
        label: btn,
        class: closeDialog ? 'c8-flat' : 'c8-filled',
        closeDialog,
      })
    } else {
      b.push(btn)
    }
  }

  return b
})

const root = ref<ComponentInstance<typeof VuCard>>()

function emitFooterClick(btn: string, event: MouseEvent) {
  emitFooterLabel(`footer-click-${btn.toLowerCase().replace(/\s*/g, '')}`, event)
  emit('footer-click', btn, event)
}

const closing = ref(false)

watch(isOpen, () => {
  if (isOpen.value) {
    internalOpen.value = true
    closing.value = false
    applyFocusFirstSelector()
  } else {
    closing.value = true
    setTimeout(() => {
      internalOpen.value = false
    }, 150)
  }
})

function onUpdateOpen(newValue: boolean) {
  isOpen.value = newValue
}

onMounted(() => {
  internalOpen.value = isOpen.value
  applyFocusFirstSelector()
})
</script>

<template>
  <DialogRoot :open="internalOpen" @update:open="onUpdateOpen" modal>
    <DialogPortal>
      <DialogOverlay
        :class="mergeCssClasses({ 'dialog-overlay': modal }, overlayClass)"
        :data-closing="closing ? '' : undefined"
      />
      <DialogContent
        v-bind="contentProps"
        as-child
        :onEscapeKeyDown
        :onPointerDownOutside
        :onFocusOutside
        :onInteractOutside
        :onOpenAutoFocus
        :onCloseAutoFocus
      >
        <!-- VuDialog renders no DialogDescription: drop Reka's dangling aria-describedby
             unless the consumer passes one -->
        <VuCard
          v-bind="{
            ...(closing ? { 'data-closing': '' } : {}),
            ...cardAttrs(),
            'aria-describedby': $attrs['aria-describedby'],
          }"
          ref="root"
          :level
          no-padding
          :rounded
          class="dialog-card"
          :class="props.class"
        >
          <DialogTitle as-child v-if="title || $slots.header || $slots.title">
            <slot name="header">
              <header class="dialog-header">
                <VuCardHeader class="dialog-title">
                  <slot name="title">
                    {{ title }}
                  </slot>
                </VuCardHeader>
                <DialogClose v-if="closeButton" as-child>
                  <button class="dialog-close">
                    <VuIcon name="i--close" />
                  </button>
                </DialogClose>
              </header>
            </slot>
          </DialogTitle>

          <section :class="contentClass">
            <slot> </slot>
          </section>

          <slot name="footer" v-if="_footerButtons?.length || $slots.footer">
            <footer class="dialog-footer">
              <template v-for="button of _footerButtons">
                <VuButton
                  v-if="!button.closeDialog"
                  :label="button.label"
                  :icon="button.icon"
                  :class="button.class"
                  @click="emitFooterClick(button.label, $event)"
                />

                <DialogClose v-else as-child>
                  <VuButton
                    :label="button.label"
                    :icon="button.icon"
                    :class="button.class"
                    @click="emitFooterClick(button.label, $event)"
                  />
                </DialogClose>
              </template>
            </footer>
          </slot>
        </VuCard>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
