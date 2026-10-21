export interface TSelectItem {
  icon?: string
  search?: string
  value: string | null | undefined
  label?: string
  disabled?: boolean
}

export type TSelectItems<T extends TSelectItem = TSelectItem> =
  | Array<T | string>
  | Record<string, Array<T | string>>

/** Select model: a string, or an array of strings with `multiple` */
export type TSelectModel<M extends boolean = false> = M extends true ? string[] : string

export interface TSelectBaseProps<T extends TSelectItem, M extends boolean = false> {
  required?: boolean
  disabledValues?: Array<string | null | undefined>
  /** Initial value when uncontrolled (an array with `multiple`). */
  defaultValue?: TSelectModel<M> | null | undefined
  /** Initial open state when `v-model:open` is not used. */
  defaultOpen?: boolean
  /** Allow selecting several values; the model becomes an array. */
  multiple?: M
  /** Compare values by a field or a function (forwarded to Reka `SelectRoot`). */
  by?: string | ((a: unknown, b: unknown) => boolean)
  /** Reading direction (forwarded to Reka `SelectRoot`). */
  dir?: 'ltr' | 'rtl'
  /** Native `autocomplete` of the hidden form select. */
  autocomplete?: string
  /** Form field name: the value is submitted with the enclosing `<form>`. */
  name?: string
  popupClass?: string | Record<string, boolean>
  popupRound?: boolean
  valueClass?: string | Record<string, boolean>
  iconClass?: string | Record<string, boolean>
  class?: string | Record<string, boolean>
  items: TSelectItems<T>
  disabled?: boolean
  placeholder?: string
  popupPosition?: 'item-aligned' | 'popper'
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  sticky?: 'partial' | 'always'
  updatePositionStrategy?: 'always' | 'optimized'
}
