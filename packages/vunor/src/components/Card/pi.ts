import { useProvideInject } from '../utils/provide-inject'

const safeTag = (t?: string) => (t && /^h[123456]$/.test(t) ? t : '')

export const useCardPI = () =>
  useProvideInject('__vunor_card_PI', () => {
    const headerLevel = ref('')

    function updateCardLevel(v: string) {
      if (v) {
        headerLevel.value = v
      }
    }

    return {
      _provide: () => ({ headerLevel }),
      _inject: () => {
        const instance = getCurrentInstance()
        if (instance) {
          const v = (instance.props.level || safeTag(instance.props.as as string)) as string
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
      },
    }
  })
