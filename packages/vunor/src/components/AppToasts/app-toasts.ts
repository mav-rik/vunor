import { ref } from 'vue'

export interface TAppToast {
  title: string
  message: string
  duration?: number
  icon?: string
  class?: string
  actions?: Array<{
    text: string
    action: () => void
  }>
}

export type TToastInternal = TAppToast & { open: boolean; id: number }

const toasts = ref<TToastInternal[]>([])

export function useAppToasts() {
  function create(toast: TAppToast) {
    const id = Math.random()
    toasts.value.push({ ...toast, open: true, id })
    return () => {
      close(id)
    }
  }

  function close(id: number) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index >= 0) {
      toasts.value[index].open = false
    }
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 200)
  }

  return {
    create,
    toasts,
    close,
  }
}
