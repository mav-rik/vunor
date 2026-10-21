<script setup lang="ts">
import {
  ToastAction,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from 'reka-ui'
import { type TToastInternal, useAppToasts } from 'vunor'

import VuButton from '../Button/Button.vue'
import { useForwardToRoot } from '../forward-root'

import type { ToastProviderProps } from 'reka-ui'
import type { TVueCssClass } from 'vunor/utils'

// ToastProvider renders no element of its own: fallthrough attrs go to the viewport
// (where `class` goes as well).
defineOptions({ inheritAttrs: false })

const { toasts, close } = useAppToasts()

const props = withDefaults(
  defineProps<
    ToastProviderProps & {
      class?: TVueCssClass
      /** Keys that focus the toast viewport (Reka `ToastViewport`), default F8 */
      hotkey?: string[]
    }
  >(),
  {
    // forwarded booleans: absent stays undefined (see forward-root.ts)
    disableSwipe: undefined,
    swipeDirection: 'left',
  }
)

// ToastProvider props declared on this component
const providerProps = useForwardToRoot(ToastProvider, props)

const defaultActions = (toast: TToastInternal): Required<TToastInternal>['actions'] => [
  {
    text: 'Dismiss',
    action: () => {
      close(toast.id)
    },
  },
]
</script>

<template>
  <ToastProvider v-bind="providerProps">
    <!-- prettier-ignore-attribute class -->
    <ToastRoot
      v-for="toast of toasts"
      :key="toast.id"
      :duration="toast.duration"
      v-model:open="toast.open"
      :data-swipe="swipeDirection"
      @update:open="
        open => {
          if (!open) {
            close(toast.id)
          }
        }
      "
      :class="toast.class"
      class="toast-root"
    >
      <ToastTitle class="[grid-area:_title] mb-$s fw-$bold">
        <span> {{ toast.title }} </span>
      </ToastTitle>
      <ToastDescription as-child>
        <span class="text-body-s">{{ toast.message }}</span>
      </ToastDescription>
      <ToastAction
        class="[grid-area:_action]"
        as-child
        v-for="action of toast.actions || defaultActions(toast)"
        :alt-text="action.text"
        :key="action.text"
      >
        <VuButton @click="action.action()" class="c8-flat text-body-s" :label="action.text" />
      </ToastAction>
    </ToastRoot>
    <ToastViewport
      v-bind="$attrs"
      :hotkey="props.hotkey"
      :class="props.class"
      class="toasts-viewport"
    />
  </ToastProvider>
</template>
