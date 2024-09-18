/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import { useProvideInject } from 'vunor/utils'

const safeTag = (t?: string) => (t && /^h[1-6]$/.test(t) ? t : '')

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
          const v2 = (instance.props.level || safeTag(instance.props.as as string)) as string
          if (v2) {
            updateCardLevel(v2)
          } else {
            onMounted(() => {
              const v = (instance.props.level || safeTag(instance.props.as as string)) as string
              const tag = instance.vnode.el?.tagName.toLowerCase()
              updateCardLevel(v || safeTag(tag) ? tag : '')
            })
          }
          watch(
            () => [instance.props.level, instance.props.as],
            () => {
              updateCardLevel((instance.props.level || instance.props.as) as string)
            }
          )
        }
      },
    }
  })
