export type TSelectItem = {
  icon?: string
  search?: string
  value: string | null | undefined
  label?: string
  disabled?: boolean
}

export type TSelectItems<T extends TSelectItem = TSelectItem> =
  | (T | string)[]
  | Record<string, (T | string)[]>

export interface TSelectBaseProps<T extends TSelectItem> {
  disabledValues?: (string | null | undefined)[]
  defaultValue?: string | null | undefined
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
