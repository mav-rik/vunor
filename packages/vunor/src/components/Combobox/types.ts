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
}
