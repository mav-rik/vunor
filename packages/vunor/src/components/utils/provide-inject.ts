import type { ComponentInternalInstance } from 'vue'

export const useProvideInject = <PR, INJ>(key: string, init: () => TProvideInjectBody<PR, INJ>) => {
  return {
    provide: () => {
      const { _provide, _inject } = init()
      const tr = _provide()
      provide<() => INJ>(key, _inject)
      return tr
    },
    inject: () => {
      const _inject = inject<() => INJ>(key)
      if (_inject) {
        return _inject()
      }
    },
  }
}

export interface TProvideInjectBody<PR, INJ> {
  _provide: () => PR
  _inject: () => INJ
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
