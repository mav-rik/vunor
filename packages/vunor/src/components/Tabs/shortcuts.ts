import { defineShortcuts } from '../../theme/utils/define-sc'

export const tabShortcuts = defineShortcuts({
  'tabs-indicator':
    'absolute left-0 h-[2px] bottom-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full transition-all duration-200 bg-scope-color-500',
  'tab': 'h-fingertip rounded flex items-center justify-center px-$m gap-$m select-none',
})
