export interface TComboboxItem {
  icon?: string
  search?: string
  value: string | null | undefined
  label?: string
  disabled?: boolean
}

export type TComboboxItems<T extends TComboboxItem = TComboboxItem> =
  | Array<T | string>
  | Record<string, Array<T | string>>

export interface TComboboxProps<T extends TComboboxItem> {
  disabledValues?: Array<string | null | undefined>
  defaultValue?: string | null | undefined
  popupClass?: string | Record<string, boolean>
  popupRound?: boolean
  valueClass?: string | Record<string, boolean>
  iconClass?: string | Record<string, boolean>
  class?: string | Record<string, boolean>
  items: TComboboxItems<T>
  disabled?: boolean
  placeholder?: string
  popupPosition?: 'inline' | 'popper'
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  sticky?: 'partial' | 'always'
  updatePositionStrategy?: 'always' | 'optimized'
  bodyLock?: boolean
  multiple?: boolean
  checkboxItems?: boolean
  dropdownIcon?: string
  /* Forwarded to Reka `ComboboxRoot` */
  /** Initial open state when `v-model:open` is not used. */
  defaultOpen?: boolean
  resetSearchTermOnBlur?: boolean
  resetSearchTermOnSelect?: boolean
  openOnFocus?: boolean
  openOnClick?: boolean
  ignoreFilter?: boolean
  resetModelValueOnClear?: boolean
  highlightOnHover?: boolean
  by?: string | ((a: unknown, b: unknown) => boolean)
  dir?: 'ltr' | 'rtl'
  /** Form field name: the value is submitted with the enclosing `<form>`. */
  name?: string
}
