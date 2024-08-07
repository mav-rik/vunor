import { defineShortcuts } from '../../theme/utils/define-sc'

export const loadingShortcuts = defineShortcuts({
  'loading-indicator': 'cursor-wait',
  'loading-indicator-ring': {
    '': 'animate-spin animate-duration-1500',
    '[&>circle]:': 'animate-loading-dashoffset animate-count-infinite animate-duration-2500',
  },
})
