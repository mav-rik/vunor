import { defineShortcuts } from '../../theme/utils/define-sc'

export const toastShortcuts = defineShortcuts({
  'toasts-viewport':
    '[--viewport-padding:_25px] fixed bottom-0 left-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-h-50vh max-w-[100vw] m-0 list-none z-[2147483647] outline-none',
  'toast-root': {
    '': [
      'bg-current',
      'p-$m',
      'rounded-$m',
      'border',
      'grid',
      "[grid-template-areas:_'title_action'_'description_action']",
      'grid-cols-[auto_max-content]',
      'gap-x-[15px]',
      'items-center',
    ].join(' '),
    'data-[state=open]:': 'animate-slide-in',
    'data-[state=closed]:': 'animate-hide',
    'data-[swipe=move]:': 'translate-x-[var(--radix-toast-swipe-move-x)]',
    'data-[swipe=end]:': 'animate-swipe-out',
    'data-[swipe=cancel]:': 'translate-x-0 transition-[transform_200ms_ease-out]',
    'data-[swipe=left]:': '[--toast-out-x:calc(-100%-var(--viewport-padding))]',
    'data-[swipe=right]:': '[--toast-out-x:calc(100%+var(--viewport-padding))]',
  },
})
