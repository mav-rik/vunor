<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import {
  ToastAction,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from 'radix-vue'
import type { ToastProviderProps } from 'radix-vue'
import { type TToastInternal, useAppToasts } from 'vunor'
import { TVueCssClass } from 'vunor/utils'
import VuButton from '../Button/Button.vue'

const { toasts, close } = useAppToasts()

const props = withDefaults(
  defineProps<
    ToastProviderProps & {
      class?: TVueCssClass
    }
  >(),
  {
    swipeDirection: 'left',
  }
)

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
  <ToastProvider v-bind="props" :class="undefined">
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
    <ToastViewport :class="props.class" class="toasts-viewport" />
  </ToastProvider>
</template>
