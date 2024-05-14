import { scFromObject } from '@vunor/theme/src/utils/shortcut-obj'

export const checkboxShortcuts = {
  'checkbox-root': scFromObject({
    '': 'text-body select-none flex gap-$m cursor-default current-bg-scope-color-500 current-border-scope-color-500',
    'data-[error=true]:': 'current-border-error-500',
    'aria-[disabled=true]:': 'scope-grey opacity-50 cursor-not-allowed',
  }),
  'checkbox': scFromObject({
    '': 'cursor-default shrink-0 select-none rounded-[0.28em] transition-all transition-duration-100 flex size-1.5em appearance-none items-center justify-center bg-current/0 backdrop-blur-sm border-current border-[0.16em] current-icon-white',
    'group-active:enabled:':
      'current-bg-scope-color-500 bg-current/20 current-icon-scope-color-500',
    // 'group-hover:enabled:': 'border-current',
    'disabled:': 'cursor-not-allowed border-1px backdrop-blur-sm',
    'group-data-[error=true]:enabled:': 'current-border-error-500 border-current',
    'data-[state=unchecked]': 'current-border-grey-500 border-current/40',
  }),
  'checkbox-indicator': scFromObject({
    '': 'bg-current icon-current h-full w-full flex items-center justify-center',
  }),
  'checkbox-icon': scFromObject({
    '': 'size-0.9em',
  }),
  'checkbox-label': scFromObject({
    '': 'select-none text-body lh-1.5em',
  }),
}
