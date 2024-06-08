import { inject, provide } from 'vue'

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable arrow-body-style */
export const useProvideInject = <PA extends any[], IA extends any[], PR, INJ>(
  key: string,
  init: () => TProvideInjectBody<PA, IA, PR, INJ>
) => {
  return {
    provide: (...args: PA) => {
      const { _provide, _inject } = init()
      const tr = _provide(...args)
      provide<() => INJ>(key, _inject)
      return tr
    },
    inject: (...args: IA) => {
      const _inject = inject<(...args: IA) => INJ>(key)
      if (_inject) {
        return _inject(...args)
      }
    },
  }
}

export interface TProvideInjectBody<PA extends any[], IA extends any[], PR, INJ> {
  _provide: (...args: PA) => PR
  _inject: (...args: IA) => INJ
}

useProvideInject('key', () => {
  const a = 'a'
  const b = 2
  return {
    _provide() {
      return { a, b }
    },
    _inject: () => a,
  }
})
