import { scFromObject } from '@vunor/theme/src/utils/shortcut-obj'

export const buttonShortcuts = {
  'btn': scFromObject({
    '': 'h-fingertip flex items-center justify-center px-$m gap-$xs select-none fw-bold tracking-wide',
    '[&.btn-round]:': 'px-half-fingertip rounded-half-fingertip',
    '[&.btn-square]:': 'size-fingertip px-0',
    '[&.btn-round.btn-square]:': 'px-0',
  }),
  'btn-square': scFromObject({
    '': '',
  }),
  'btn-label': scFromObject({
    '': 'lh-1em truncate',
    'group-[.btn-square]:': 'hidden',
  }),
  'btn-icon': scFromObject({
    '': 'size-1em font-size-1.25em',
    'group-[.btn-round]:[&.btn-icon-left]:': 'ml-[-0.5em]',
    'group-[.btn-round]:[&.btn-icon-right]:': 'mr-[-0.5em]',
    'group-[.btn-square]:': 'font-size-1.5em m-0!',
    'group-[.btn-round.btn-square]:': 'm-0!',
  }),
}
