import { defineShortcuts } from '../../theme/utils/define-sc'

export const checkboxShortcuts = defineShortcuts({
  'checkbox-root': {
    '': 'text-body select-none flex gap-$m cursor-default current-bg-scope-color-500 current-border-scope-color-500',
    'data-[error=true]:': 'current-border-error-500',
    'aria-[disabled=true]:': 'scope-grey opacity-50 cursor-not-allowed',
  },
  'checkbox': {
    '': 'cursor-default shrink-0 select-none rounded-[0.28em] transition-all transition-duration-100 flex size-1.5em appearance-none items-center justify-center bg-current/0 border-current border-[0.16em] current-icon-white',
    'group-active/cb:enabled:':
      'current-bg-scope-color-500 bg-current/20 current-icon-scope-color-500',
    // 'group-hover/cb:enabled:': 'border-current',
    'disabled:': 'cursor-not-allowed border-1px',
    'group-[[data-error=true]]/cb:enabled:': 'current-border-error-500 border-current',
    'data-[state=unchecked]': 'current-border-grey-500 border-current/40',
  },
  'checkbox-indicator': {
    '': 'bg-current icon-current h-full w-full flex items-center justify-center',
  },
  'checkbox-icon': {
    '': 'size-0.9em animate-cb-appear animate-duration-200 animate-ease',
  },
  'checkbox-label': {
    '': 'select-none text-body lh-1.5em',
  },
})
