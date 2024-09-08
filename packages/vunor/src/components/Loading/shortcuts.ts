import { defineShortcuts } from '../../theme/utils/define-sc'

export const loadingShortcuts = defineShortcuts({
  'loading-indicator': 'cursor-wait',
  'loading-indicator-ring': {
    '': 'animate-spin animate-duration-1500',
    '[&>circle]:': 'animate-loading-dashoffset animate-count-infinite animate-duration-2500',
  },
  'inner-loading':
    'bg-white/50 dark:bg-black/50 flex items-center justify-center absolute left-0 top-0 right-0 bottom-0 z-5 cursor-wait',
})
