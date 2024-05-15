import { scFromObject } from '@vunor/theme/src/utils/shortcut-obj'

export const selectShortcuts = {
  'select-content': scFromObject({
    '': 'min-w-[60px] surface-0 bg-current/70 backdrop-blur-md overflow-hidden shadow-xl z-[100] current-border-grey-400 border-current/20 ',
    'data-[design=round]:': 'rounded-half-fingertip',
    // 'data-[side=top]:': 'animate-slide-down-and-fade',
    // 'data-[side=right]:': 'animate-slide-left-and-fade',
    // 'data-[side=bottom]:': 'animate-slide-up-and-fade',
    // 'data-[side=left]:': 'animate-slide-right-and-fade',
  }),
  'select-scroll-btn': 'flex items-center justify-center h-fingertip cursor-default',
  'select-grp-label': scFromObject({
    '': 'px-$s h-fingertip flex items-center ',
    'group-data-[design=round]:': 'px-half-fingertip',
    '[&>span]:': 'text-label text-grey-400',
  }),
  'select-item': scFromObject({
    '': 'text-body leading-none flex items-center h-fingertip relative select-none relative',
    'data-[disabled]:': 'opacity-40 pointer-events-none',
    'data-[highlighted]:': 'outline-none bg-scope-color-500/15',
    '[&>span]:': 'px-$s',
    'group-data-[design=round]:[&>span]:': 'px-half-fingertip',
    '[&>span]:data-[state=checked]:': 'text-scope-color-500 fw-700!',
  }),
}
