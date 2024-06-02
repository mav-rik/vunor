/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type { ComputedRef } from 'vue'

import type { TInputAttrs, TInputProps, TInputShellProps } from './types'

export function useHtmlInputAttrs(): ComputedRef<TInputAttrs> | undefined {
  const instance = getCurrentInstance()
  if (instance) {
    const props = instance.props as unknown as TInputShellProps
    return computed(() => ({
      'placeholder': props.placeholder,
      'type': props.type ?? 'text',
      'rows': props.rows,
      'required': props.required,
      'disabled': props.disabled,
      'readonly': props.readonly,
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
      placeholder: props.placeholder,
      design: props.design,
      readonly: props.readonly,
      disabled: props.disabled,
      iconPrepend: props.iconPrepend,
      iconAppend: props.iconAppend,
      groupItem: props.groupItem,
      type: props.type,
      rows: props.rows,
      autoGrow: props.autoGrow,
      maxlength: props.maxlength,
      required: props.required,
      active: props.active,
      loading: props.loading,
      onAppendClick: props.onAppendClick,
      onPrependClick: props.onPrependClick,
      iconBefore: props.iconBefore,
      iconAfter: props.iconAfter,
      error: props.error,
      hint: props.hint,
      onBeforeClick: props.onBeforeClick,
      onAfterClick: props.onAfterClick,
      onClick: props.onClick,
    }))
  }
}
export function useInputShellProps(): ComputedRef<TInputShellProps> | undefined {
  const instance = getCurrentInstance()
  if (instance) {
    const props = instance.props as unknown as TInputProps
    return computed(() => ({
      label: props.label,
      placeholder: props.placeholder,
      readonly: props.readonly,
      design: props.design,
      disabled: props.disabled,
      loading: props.loading,
      iconPrepend: props.iconPrepend,
      iconAppend: props.iconAppend,
      groupItem: props.groupItem,
      type: props.type,
      rows: props.rows,
      autoGrow: props.autoGrow,
      maxlength: props.maxlength,
      required: props.required,
      active: props.active,
      onAppendClick: props.onAppendClick,
      onPrependClick: props.onPrependClick,
    }))
  }
  return undefined
}

export function useInputDataAttrs() {
  const instance = getCurrentInstance() as unknown as
    | {
        props: TInputProps
        setupState?: { modelValue: string | number | undefined }
      }
    | undefined
  return computed(() => ({
    'data-has-label': instance?.props.label ? '' : undefined,
    'data-has-placeholder': instance?.props.placeholder ? '' : undefined,
    'data-has-value':
      instance?.setupState?.modelValue || instance?.setupState?.modelValue === 0 ? '' : undefined,
    'data-type': instance?.props.type ?? 'text',
    'aria-disabled': instance?.props.disabled ? true : undefined,
  }))
}
