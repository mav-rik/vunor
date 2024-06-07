import { scFromObject } from '../../theme/utils/shortcut-obj'

export const loadingShortcuts = {
  'loading-indicator': 'cursor-wait',
  'loading-indicator-ring': scFromObject({
    '': 'animate-spin animate-duration-1500',
    '[&>circle]:': 'animate-loading-dashoffset animate-count-infinite animate-duration-2500',
  }),
}
