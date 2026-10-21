import { camelize, Comment, defineComponent, shallowRef } from 'vue'

import type { Slot } from 'vue'

/**
 * Define a template once and render it in several places of the same component.
 *
 * Same contract as VueUse's `createReusableTemplate` (attrs passed to the reuse
 * component become camelCased slot props, and a single-node template inherits
 * them as fallthrough attrs). It is kept local so the built Combobox carries no
 * runtime dependency on `@vueuse/core`. Unlike VueUse, template comments do not
 * count as nodes, so a commented single-node template still inherits attrs (and
 * its `$el` is the element) when compiled in dev mode.
 *
 * Call it inside `<script setup>`: each component instance gets its own pair.
 */
export function createReusableTemplate() {
  const render = shallowRef<Slot | undefined>()

  const define = defineComponent({
    setup(_, { slots }) {
      return () => {
        render.value = slots.default
      }
    },
  })

  const reuse = defineComponent({
    setup(_, { attrs, slots }) {
      return () => {
        const bindings: Record<string, unknown> = { $slots: slots }
        for (const [key, value] of Object.entries(attrs)) {
          bindings[camelize(key)] = value
        }
        const vnodes = render.value?.(bindings)
        const nodes = vnodes?.filter(vnode => vnode.type !== Comment)
        return nodes?.length === 1 ? nodes[0] : vnodes
      }
    },
  })

  return [define, reuse] as const
}
