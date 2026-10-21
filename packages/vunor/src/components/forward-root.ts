import { camelize, computed, getCurrentInstance, ref, toHandlerKey, warn, watch } from 'vue'

import type { ComputedRef, Ref, WritableComputedRef } from 'vue'

interface TComponentOptions {
  props?: Record<string, unknown> | string[]
  emits?: Record<string, unknown> | string[]
}

function keysOf(value: Record<string, unknown> | string[] | undefined): string[] {
  return Array.isArray(value) ? value : Object.keys(value ?? {})
}

function isBooleanProp(definition: unknown): boolean {
  const type = (definition as { type?: unknown } | null)?.type
  return Array.isArray(type) ? type.includes(Boolean) : type === Boolean
}

/**
 * Forwarding contract for components that wrap another component (usually a Reka root):
 * every prop and emit of the wrapped `root` that the wrapper declares reaches `root`.
 *
 * Returns the bindings to `v-bind` on `root`:
 * - each prop of `root` (except `omit`) whose value on the wrapper is not `undefined`;
 * - a listener for each emit of `root` (except `omit`) that re-emits it from the wrapper
 *   when `emit` is given (the wrapper must declare those emits).
 *
 * A forwarded boolean prop must be declared with a default (`withDefaults`), usually
 * `undefined`: Vue casts an absent boolean without a default to `false`, which would
 * override `root`'s own default (for example `modal: true`). In development a forwarded
 * boolean without a default is reported with a Vue warning.
 *
 * Props and emits the wrapper binds itself (models, layout-controlled `asChild`) go in `omit`.
 */
export function useForwardToRoot(
  root: unknown,
  props: Record<string, unknown>,
  // eslint-disable-next-line typescript/no-explicit-any
  emit?: (event: any, ...args: any[]) => void,
  omit: string[] = []
): ComputedRef<Record<string, unknown>> {
  const skip = new Set(omit)
  const options = root as TComponentOptions
  const rootProps = keysOf(options.props).filter(key => !skip.has(key))
  const ownProps = (getCurrentInstance()?.type as TComponentOptions | undefined)?.props as
    | Record<string, unknown>
    | undefined
  for (const key of rootProps) {
    const own = ownProps?.[key] as object | undefined
    if (own && isBooleanProp(own) && !('default' in own)) {
      warn(
        `vunor: boolean prop "${key}" is forwarded to a wrapped component but has no default; ` +
          'declare it with `default: undefined` so an absent prop is not forwarded as false.'
      )
    }
  }
  const listeners: Record<string, unknown> = {}
  if (emit) {
    for (const event of keysOf(options.emits)) {
      if (!skip.has(event)) {
        listeners[toHandlerKey(camelize(event))] = (...args: unknown[]) => emit(event, ...args)
      }
    }
  }
  return computed(() => {
    const bindings: Record<string, unknown> = { ...listeners }
    for (const key of rootProps) {
      if (props[key] !== undefined) {
        bindings[key] = props[key]
      }
    }
    return bindings
  })
}

/**
 * The value a Reka root starts `X` with when `defaultX` is not set, as its setup computes
 * it (`SliderRoot` `defaultValue` -> `[0]`, `PopoverRoot` `defaultOpen` -> `false`, a
 * `multiple` Select / Combobox `defaultValue` -> `[]`).
 */
function rekaDefault(root: unknown, key: string, props: Record<string, unknown>): unknown {
  const definition = (root as TComponentOptions).props as Record<string, unknown> | undefined
  const option = definition?.[key] as { type?: unknown; default?: unknown } | undefined
  if (!option || typeof option !== 'object') {
    return undefined
  }
  if (key === 'defaultValue' && definition && 'multiple' in definition) {
    // SelectRoot / ComboboxRoot / ListboxRoot: `defaultValue ?? (multiple ? [] : undefined)`
    return props.multiple ? [] : undefined
  }
  if ('default' in option) {
    const types = [option.type].flat()
    return typeof option.default === 'function' && !types.includes(Function)
      ? (option.default as () => unknown)()
      : option.default
  }
  return isBooleanProp(option) ? false : undefined
}

/**
 * The one source of truth for what a wrapper exposes about a root model `X` (slot props,
 * data attributes, toggles), where it reads it outside the root. It mirrors how the Reka
 * root resolves `X` (VueUse `useVModel` in its setup):
 * - a bound model is the state;
 * - `defaultX` is read ONCE, at setup, like Reka does (a later change has no effect);
 * - a root that starts unbound (passive) holds `defaultX ?? <Reka's setup default>` until
 *   the model is first set, and whatever the model last was after that (a cleared model
 *   -> no value);
 * - a root that starts bound falls back to `defaultX ?? <Reka's setup default>` when the
 *   model is cleared.
 * The root itself stays bound to the raw model. Writing sets the model (one write per
 * toggle); the wrapper never writes because the parent changed the model.
 */
export function useModelState<T>(
  model: Ref<T | undefined>,
  root: unknown,
  defaultKey: string,
  props: object
): WritableComputedRef<T> {
  const values = props as Record<string, unknown>
  const rootDefault = rekaDefault(root, defaultKey, values) as T
  const initial = (values[defaultKey] as T | undefined) ?? rootDefault
  // what a passive root holds once its model was set and then cleared
  const cleared = (typeof rootDefault === 'boolean' ? rootDefault : undefined) as T
  const passive = model.value === undefined
  const touched = ref(false)
  watch(model, () => {
    touched.value = true
  })
  return computed<T>({
    get: () => {
      if (model.value !== undefined) {
        return model.value
      }
      return passive && touched.value ? cleared : initial
    },
    set: value => {
      model.value = value
    },
  })
}

const claimedGestures = new WeakSet<Event>()

/**
 * One user gesture toggles a popup ONCE. A click on an append icon also bubbles to the
 * field shell around it, and both may want to toggle; every vunor toggle handler calls
 * this first and only toggles when it returns true:
 * - the first (innermost) handler on the event's path claims it, later ones skip it;
 * - a gesture that lands inside a Reka trigger (marked `data-vu-trigger`) belongs to that
 *   trigger, which toggles by itself: no vunor handler toggles for it.
 * Calls without an event (programmatic `openPopup()`) always toggle.
 */
export function claimToggle(event?: Event): boolean {
  if (!event) {
    return true
  }
  if (claimedGestures.has(event)) {
    return false
  }
  claimedGestures.add(event)
  const target = event.target as Element | null
  return !target?.closest?.('[data-vu-trigger]')
}

/**
 * What to bind on the Reka root for a model: `undefined` (uncontrolled, so the root applies
 * `defaultX`) until the model is first set, then always a value: the state from
 * `useModelState`. A root that was handed a value and then `undefined` would pass
 * `undefined` on to parts that require a value (Reka `Presence` `present`).
 */
export function useRootBinding<T>(
  model: Ref<T | undefined>,
  state: Ref<T>
): ComputedRef<T | undefined> {
  const everSet = ref(model.value !== undefined)
  watch(model, value => {
    if (value !== undefined) {
      everSet.value = true
    }
  })
  return computed(() => (model.value !== undefined || everSet.value ? state.value : undefined))
}
