import { scFromObject } from '../../theme/utils/shortcut-obj'

export const selectShortcuts = {
  'select-content': scFromObject({
    '': 'min-w-[60px] rounded-base surface-0 bg-current/70 backdrop-blur-xl overflow-hidden shadow-xl z-[100] current-border-grey-400 border-current/20 ',
    'data-[design=round]:': 'rounded-half-fingertip',
    '[&>div[data-radix-combobox-viewport]]:':
      'max-h-[var(--radix-popper-available-height)] [scrollbar-width:auto]',
    '[&>div[data-radix-combobox-viewport]::-webkit-scrollbar]:': 'block',
    // 'data-[side=top]:': 'animate-slide-down-and-fade',
    // 'data-[side=right]:': 'animate-slide-left-and-fade',
    // 'data-[side=bottom]:': 'animate-slide-up-and-fade',
    // 'data-[side=left]:': 'animate-slide-right-and-fade',
  }),
  'select-scroll-btn': 'flex items-center justify-center h-fingertip cursor-default',
  'select-grp-label': scFromObject({
    '': 'px-$m h-fingertip flex items-center ',
    'group-data-[design=round]:': 'px-half-fingertip',
    '[&>span]:': 'text-label text-grey-400',
  }),
  'select-item': scFromObject({
    '': 'text-body leading-none flex items-center h-fingertip relative select-none relative',
    'data-[disabled]:': 'opacity-40 pointer-events-none',
    'data-[highlighted]:': 'outline-none bg-scope-color-500/15',
    '[&>span]:': 'px-$m',
    'group-data-[design=round]:[&>span]:': 'px-half-fingertip',
    '[&>span]:data-[state=checked]:': 'text-scope-color-500 fw-700!',
  }),
  'select-separator': 'h-[1px] bg-grey-500/10 mx-$s',
}
