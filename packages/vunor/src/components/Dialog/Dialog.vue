<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from 'radix-vue'
import VuCard from '../Card/Card.vue'
import VuCardHeader from '../Card/CardHeader.vue'
import VuButton from '../Button/Button.vue'
import VuIcon from '../Icon/Icon.vue'
import { ComponentInstance, nextTick, ref, onMounted, computed, watch } from 'vue'
import { mergeCssClasses, type TVueCssClass } from '../utils/merge-class'

type TFooterButton = { label: string; icon?: string; class?: string; closeDialog?: boolean }

const open = defineModel<boolean>('open')
const internalOpen = ref(false)
const props = withDefaults(
  defineProps<{
    defaultOpen?: boolean
    modal?: boolean
    rounded?: boolean
    title?: string
    focusFirstSelector?: string
    class?: TVueCssClass
    overlayClass?: TVueCssClass
    contentClass?: TVueCssClass
    closeButton?: boolean
    footerButtons?: (TFooterButton | string)[]
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
    onEscapeKeyDown?: ((event: KeyboardEvent) => any) | undefined
    onPointerDownOutside?: ((event: unknown) => any) | undefined
    onFocusOutside?: ((event: unknown) => any) | undefined
    onInteractOutside?: ((event: unknown) => any) | undefined
    onOpenAutoFocus?: ((event: Event) => any) | undefined
    onCloseAutoFocus?: ((event: Event) => any) | undefined
  }>(),
  {
    level: 'h4',
    focusFirstSelector: 'input',
    contentClass: 'px-$card-spacing py-$m flex-grow-1 overflow-auto',
  }
)
const emit = defineEmits<{
  (e: 'footer-click', button: string, event: MouseEvent): void
  <T extends string>(e: `footer-click-${T}`, event: MouseEvent): void
}>()

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
  emit<typeof btn>(`footer-click-${btn.toLowerCase().replace(/\s*/g, '')}`, event)
  emit(`footer-click`, btn, event)
}

const closing = ref(false)

watch([open], () => {
  if (open.value) {
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
  open.value = newValue
}

onMounted(() => {
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
        as-child
        :onEscapeKeyDown
        :onPointerDownOutside
        :onFocusOutside
        :onInteractOutside
        :onOpenAutoFocus
        :onCloseAutoFocus
      >
        <VuCard
          ref="root"
          :level
          no-padding
          :rounded
          class="dialog-card"
          :data-closing="closing ? '' : undefined"
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
