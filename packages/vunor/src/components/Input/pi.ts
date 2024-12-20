import type { Ref } from 'vue'
import { computed, onUnmounted, ref } from 'vue'
import { useProvideInject } from 'vunor/utils'

export const useInputPi = () =>
  useProvideInject('__vunor_input_PI', () => {
    const focused = computed(() => !!inputs.value.some(a => a.value))
    const inputs = ref<Array<Ref<boolean>>>([])
    return {
      _provide: () => ({ focused }),
      _inject: (a: Ref<boolean>) => {
        inputs.value.push(a)
        onUnmounted(() => {
          inputs.value = inputs.value.filter(i => i !== a)
        })
      },
    }
  })
