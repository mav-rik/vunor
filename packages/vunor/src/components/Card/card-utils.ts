import type { ComponentInternalInstance } from 'vue'

export const useCardPI = () =>
  useProvideInject('__vunor_card_PI', () => {
    const headerLevel = ref('')

    function updateCardLevel(v: string) {
      console.log('updateCardLevel', v)
      if (v) {
        headerLevel.value = v
      }
    }

    const safeTag = (t?: string) => (t && /^h[123456]$/.test(t) ? t : '')

    function handleInject(instance: ComponentInternalInstance) {
      if (instance) {
        const v = (instance.props.level || safeTag(instance.props.as as string)) as string
        console.log(instance.props)
        if (!v) {
          onMounted(() => {
            const v = (instance.props.level || safeTag(instance.props.as as string)) as string
            const tag = instance.vnode.el?.tagName.toLowerCase()
            updateCardLevel(v || safeTag(tag) ? tag : '')
          })
        } else {
          updateCardLevel(v)
        }
        watch(
          () => [instance.props.level, instance.props.as],
          () => updateCardLevel((instance.props.level || instance.props.as) as string)
        )
      }
    }

    return {
      toReturn: {
        headerLevel,
      },
      toProvide: {
        headerLevel,
        handleInject,
      },
    }
  })

export interface TProvideInjectBody<TP, TR> {
  toReturn: TR
  toProvide: {
    handleInject?: (instance: ComponentInternalInstance | null) => void
  } & TP
}

export const useProvideInject = <TP, TR>(key: string, init: () => TProvideInjectBody<TP, TR>) => {
  return {
    provide: () => {
      const body = init()
      provide<TP>(key, body.toProvide)
      return body.toReturn
    },
    inject: () => {
      const injected = inject<TProvideInjectBody<TP, TR>['toProvide']>(key)
      if (injected?.handleInject) {
        injected.handleInject(getCurrentInstance())
      }
      return injected as TP
    },
  }
}
