import { defineShortcuts } from '../../theme/utils/define-sc'

export const calendarShortcuts = defineShortcuts({
  'calendar-root': 'inline-block',
  'calendar-header': 'flex items-center justify-between mb-$s fw-$bold',

  'calendar-grid-row': 'grid grid-cols-7 text-body-s',

  'calendar-month-grid': 'flex flex-col gap-$m sm:flex-row flex-wrap sm:gap-$m',

  'calendar-cell': {
    '': 'c8-flat relative flex items-center justify-center lh-1em rounded whitespace-nowrap font-normal size-3em outline-none',
    'focus-visible:': 'shadow-[0_0_0_2px] shadow-black',
    'data-[disabled]:': 'opacity-30',
    // 'data-[highlighted]:': 'bg-red!', // what is highlighted state?
    'data-[unavailable]:': 'pointer-events-none opacity-50 line-through',
    'before:': 'absolute bottom-[0.6em] w-[1.5em] h-[2px] bg-scope-color-500/75 block',
    '[&[data-today]::before]:': "content-['']",
    '[&[data-today][data-selected]::before]:': 'bg-white',
    'hover:': {
      '': 'bg-scope-color-200',
      'dark:': 'bg-scope-color-700',
    },
    'data-[selected]:': 'c8-filled!',
  },

  // date-picker
  'date-picker-root': 'inline-block layer-0 shadow-popup animate-easy-zoom-in',
  'date-picker-literal': 'opacity-75 cursor-text',
  'date-picker-input': {
    '': 'cursor-text rounded-md p-0.5 text-current',
    'focus:': 'outline-none current-text-hl underline animate-blinking animate-count-infinite',
    'data-[placeholder]:': {
      '': 'text-current/40',
      'focus:': 'text-current/100 animate-blinking animate-count-infinite',
    },
  },
})
