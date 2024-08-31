/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type { ComputedRef } from 'vue'
import { computed, getCurrentInstance } from 'vue'

import type { TInputAttrs, TInputBaseProps, TInputProps } from './types'

export function useHtmlInputAttrs(): ComputedRef<TInputAttrs> | undefined {
  const instance = getCurrentInstance()
  if (instance) {
    const props = instance.props as unknown as TInputBaseProps
    return computed(() => ({
      'placeholder': props.placeholder,
      'type': props.type ?? 'text',
      'rows': props.rows,
      'required': props.required,
      'disabled': props.disabled,
      'readonly': props.readonly,
      'maxlength': props.maxlength,
      'autocomplete': props.autocomplete,
      'data-has-prepend': !!instance.slots.prepend || !!instance.props.iconPrepend,
      'data-has-append':
        !!instance.slots.append || !!instance.props.iconAppend || !!instance.props.loading,
      'data-has-label': !!props.label,
    }))
  }
}

export function useInputProps(): ComputedRef<TInputProps> | undefined {
  const instance = getCurrentInstance()
  if (instance) {
    const props = instance.props as unknown as TInputProps
    return computed(() => ({
      label: props.label,
      stackLabel: props.stackLabel,
      placeholder: props.placeholder,
      design: props.design,
      readonly: props.readonly,
      disabled: props.disabled,
      iconPrepend: props.iconPrepend,
      iconAppend: props.iconAppend,
      groupItem: props.groupItem,
      type: props.type,
      rows: props.type === 'textarea' ? props.rows : undefined,
      autoGrow: props.autoGrow,
      maxlength: props.maxlength,
      required: props.required,
      active: props.active,
      loading: props.loading,
      onAppendClick: props.onAppendClick,
      onPrependClick: props.onPrependClick,
      onBlur: props.onBlur,
      onFocus: props.onFocus,
      iconBefore: props.iconBefore,
      iconAfter: props.iconAfter,
      error: props.error,
      hint: props.hint,
      autocomplete: props.autocomplete,
      onBeforeClick: props.onBeforeClick,
      onAfterClick: props.onAfterClick,
      onClick: props.onClick,
    }))
  }
}
export function useInputBaseProps(): ComputedRef<TInputBaseProps> | undefined {
  const instance = getCurrentInstance()
  if (instance) {
    const props = instance.props as unknown as TInputProps
    return computed(() => ({
      label: props.stackLabel ? undefined : props.label,
      placeholder: props.placeholder,
      readonly: props.readonly,
      design: props.design,
      disabled: props.disabled,
      loading: props.loading,
      iconPrepend: props.iconPrepend,
      iconAppend: props.iconAppend,
      groupItem: props.groupItem,
      type: props.type,
      rows: props.type === 'textarea' ? props.rows : undefined,
      autoGrow: props.autoGrow,
      maxlength: props.maxlength,
      required: props.required,
      active: props.active,
      noUnderline: props.noUnderline,
      autocomplete: props.autocomplete,
      onAppendClick: props.onAppendClick,
      onPrependClick: props.onPrependClick,
      onBlur: props.onBlur,
      onFocus: props.onFocus,
    }))
  }
  return undefined
}

export function useInputDataAttrs() {
  const instance = getCurrentInstance() as unknown as
    | {
        props: TInputProps
      }
    | undefined
  return computed(() => ({
    'data-has-label': instance?.props.label ? '' : undefined,
    'data-has-placeholder': instance?.props.placeholder ? '' : undefined,
    'data-type': instance?.props.type ?? 'text',
    'aria-disabled': instance?.props.disabled ? true : undefined,
  }))
}
