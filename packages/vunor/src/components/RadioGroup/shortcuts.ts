import { scFromObject } from '@vunor/theme/src/utils/shortcut-obj'

export const radioShortcuts = {
  'rb-container': scFromObject({
    '': 'flex flex-col gap-$s text-body',
  }),
  'rb-label': scFromObject({
    '': 'text-label text-grey-400',
  }),
  'rb-root': scFromObject({
    '': 'flex gap-$l',
    '[&.rb-row]:': 'flex-wrap',
    'not-[.rb-row]:': 'flex-col gap-$s',
  }),
  'rb-items': scFromObject({
    '': 'flex items-center',
  }),
  'rb-item': scFromObject({
    '': 'select-none current-bg-scope-color-500 bg-current/0 size-1.25em rounded-full cursor-default current-border-grey-500 border-current/40 border-[0.16em] transition-none backdrop-blur-sm',
    "data-[state=checked]:not-[[data-error='true']]:":
      'current-border-scope-color-500 border-current',
    'data-[state=checked]:': 'bg-current',
    'active:enabled:': 'bg-current/50',
    'aria-[disabled=true]:': 'scope-grey opacity-50 cursor-not-allowed',
    'data-[error=true]:': 'current-border-error-500 current-bg-error-500',
  }),
  'rb-item-indicator': scFromObject({
    '': "flex items-center justify-center w-full h-full rounded-full relative after:content-[''] after:block after:size-[0.5em] after:rounded-[50%] after:bg-white animate-zoom-in animate-duration-100",
  }),
  'rb-item-label': scFromObject({
    '': 'select-none pl-$s text-body leading-none',
    'aria-[disabled=true]:': 'scope-grey opacity-50 cursor-not-allowed',
  }),
}
