/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TInputAttrs {
  'placeholder'?: string
  'type'?: string
  'rows'?: number
  'required'?: boolean
  'maxlength'?: number
  'data-has-prepend': boolean
  'data-has-append': boolean
  'data-has-label': boolean
  'disabled'?: boolean
  'readonly'?: boolean
  'autocomplete'?: string
}

export interface TInputShellProps
  extends Omit<TInputAttrs, 'data-has-prepend' | 'data-has-append' | 'data-has-label'> {
  label?: string
  design?: 'flat' | 'filled' | 'round'
  iconPrepend?: string
  iconAppend?: string
  groupItem?: boolean
  autoGrow?: boolean
  active?: boolean
  loading?: boolean
  onAppendClick?: (event: MouseEvent) => any
  onPrependClick?: (event: MouseEvent) => any
  onBlur?: (event: FocusEvent) => any
  onFocus?: (event: FocusEvent) => any
}

export interface TInputProps extends TInputShellProps {
  iconBefore?: string
  iconAfter?: string
  error?: string | boolean
  hint?: string
  groupTemplate?: string
  stackLabel?: boolean
  onBeforeClick?: (event: MouseEvent) => any
  onAfterClick?: (event: MouseEvent) => any
  onClick?: (event: MouseEvent) => any
  onBlur?: (event: FocusEvent) => any
  onFocus?: (event: FocusEvent) => any
}

export interface TInputShellEmits {
  (e: 'prependClick' | 'appendClick', event: MouseEvent): void
  (e: 'blur' | 'focus', event: FocusEvent): void
}

export interface TInputEmits extends TInputShellEmits {
  (e: 'beforeClick' | 'afterClick' | 'click', event: MouseEvent): void
}
