import { defineShortcuts } from '../../theme/utils/define-sc'

export const selectShortcuts = defineShortcuts({
  'select-content': {
    '': 'min-w-[60px] rounded-base surface-0 bg-current overflow-hidden shadow-popup z-[100] current-border-grey-400 border-current/20 ',
    'data-[design=round]:': 'rounded-fingertip-half',
    '[&>div[data-radix-combobox-viewport]]:':
      'max-h-[var(--radix-popper-available-height)] [scrollbar-width:auto]',
    '[&>div[data-radix-combobox-viewport]::-webkit-scrollbar]:': 'block',
    // 'data-[side=top]:': 'animate-slide-down-and-fade',
    // 'data-[side=right]:': 'animate-slide-left-and-fade',
    // 'data-[side=bottom]:': 'animate-slide-up-and-fade',
    // 'data-[side=left]:': 'animate-slide-right-and-fade',
  },
  'select-scroll-btn': 'flex items-center justify-center h-fingertip cursor-default',
  'select-grp-label': {
    '': 'px-$m h-fingertip flex items-center ',
    'group-data-[design=round]:': 'px-fingertip-half',
    '[&>span]:': 'text-label text-grey-400',
  },
  'select-item': {
    '': 'text-body leading-none flex items-center min-h-fingertip relative select-none relative',
    'data-[disabled]:': 'opacity-40 pointer-events-none',
    'data-[highlighted]:': 'outline-none bg-scope-color-500/15',
    '[&>span]:': 'px-$m',
    'group-data-[design=round]:[&>span]:': 'px-fingertip-half',
    '[&>span]:data-[state=checked]:': 'text-scope-color-500 fw-700!',
  },
  'select-separator': 'h-[1px] bg-grey-500/10 mx-$s',
})
