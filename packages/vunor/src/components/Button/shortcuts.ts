import { scFromObject } from '../../theme/utils/shortcut-obj'

export const buttonShortcuts = {
  'btn': scFromObject({
    '': 'h-fingertip flex items-center justify-center px-$m gap-$xs select-none fw-bold tracking-wide relative',
    '[&.btn-round]:': 'px-half-fingertip rounded-half-fingertip',
    '[&.btn-square]:': 'size-fingertip px-0',
    '[&.btn-round.btn-square]:': 'px-0',
    'disabled:': 'opacity-80 cursor-not-allowed',
    '[&>span]:data-[loading]:': 'opacity-0 pointer-events-none',
    '[&>div:not(.loading-indicator-wrapper)]:data-[loading]:': 'opacity-0 pointer-events-none',
    '[&>.loading-indicator-wrapper]:':
      'absolute left-0 top-0 right-0 bottom-0 flex items-center justify-center cursor-wait',
  }),
  'btn-square': scFromObject({
    '': '',
  }),
  'btn-label': scFromObject({
    '': 'lh-1em ellipsis whitespace-nowrap overflow-x-clip overflow-y-visible',
    'group-[.btn-square]/btn:': 'hidden',
  }),
  'btn-icon': scFromObject({
    '': 'size-1em font-size-1.25em',
    'group-[.btn-round]/btn:[&.btn-icon-left]:': 'ml-[-0.5em]',
    'group-[.btn-round]/btn:[&.btn-icon-right]:': 'mr-[-0.5em]',
    'group-[.btn-square]/btn:': 'font-size-1.5em m-0!',
    'group-[.btn-round.btn-square]/btn:': 'm-0!',
  }),
}
