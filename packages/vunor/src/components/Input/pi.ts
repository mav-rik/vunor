import { useProvideInject } from '../utils/provide-inject'

export const useInputPi = () =>
  useProvideInject('__vunor_input_PI', () => {
    const active = computed(() => !!inputs.value.find(a => a.value))
    const inputs = ref<Ref<boolean>[]>([])
    return {
      _provide: () => ({ active }),
      _inject: (a: Ref<boolean>) => {
        inputs.value.push(a)
        onUnmounted(() => {
          inputs.value = inputs.value.filter(i => i !== a)
        })
      },
    }
  })
