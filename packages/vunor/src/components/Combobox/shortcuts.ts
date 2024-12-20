import { defineShortcuts } from '../../theme/utils/define-sc'

export const comboboxShortcuts = defineShortcuts({
  'combobox-multi-input': 'i8-input relative flex items-center',
  'combobox-multi-items':
    'text-ellipsis overflow-hidden whitespace-nowrap absolute max-w-full pr-$m lh-1em',
  'combobox-embedded-input': 'text-left outline-0 outline-offset-0',
  'combobox-c8-icon': {
    '': 'hover:current-icon-scope-color-500 hover:icon-current cursor-pointer',
    'group-[[aria-expanded=true]]/i8:': '-scale-100',
  },
})
