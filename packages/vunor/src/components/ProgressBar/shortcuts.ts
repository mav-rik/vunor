import { defineShortcuts } from '../../theme/utils/define-sc'

export const progressShortcuts = defineShortcuts({
  'progress-track': {
    '': 'relative overflow-hidden bg-grey-500/20 rounded',
    'data-[loading]:after:': [
      'absolute',
      'left-0',
      'top-0',
      'bottom-0',
      'right-0',
      'bg-[linear-gradient(98deg,_#ffffff00,_#ffffff55,_#ffffff00)]',
      "content-['']",
      '[background-size:30%_100%]',
      'bg-no-repeat',
      'animate-progress-bar',
      'animate-count-infinite',
      '[mix-blend-mode:overlay]',
    ].join(' '),
  },
  'progress-bar': {
    '': 'bg-scope-color-400 rounded w-full h-full transition-transform duration-[660ms]',
    'dark:': 'bg-scope-color-600',
  },
})
