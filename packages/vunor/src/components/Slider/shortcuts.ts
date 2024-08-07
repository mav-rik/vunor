import { defineShortcuts } from '../../theme/utils/define-sc'

export const sliderShortcuts = defineShortcuts({
  'slider': {
    '': 'relative flex items-center select-none touch-none min-w-2em min-h-2em',
  },
  'slider-track': {
    '': 'bg-grey-500/20 relative grow rounded-full h-[0.25em]',
  },
  'slider-range': {
    '': 'absolute bg-scope-color-500 rounded-full h-full',
  },
  'slider-thumb': {
    '': 'block w-[1.5em] h-[1.5em] bg-scope-color-500 rounded-full border-scope-light-0 border-[3px] outline-scope-color-500/10 outline-0px outline-solid',
    'dark:': 'border-scope-dark-0',
    'not-[[disabled]]:': {
      '': 'cursor-grab',
      'hover:': 'shadow-md',
      'active:': 'cursor-grabbing',
      'focus:': 'outline-[0.5em]',
    },
  },
})
