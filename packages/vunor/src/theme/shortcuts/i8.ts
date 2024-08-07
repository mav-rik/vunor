import { defineShortcuts } from '../utils/define-sc'

export const i8 = defineShortcuts({
  'i8': {
    '': 'h-fingertip min-w-3em flex items-center select-none relative current-icon-grey-500 icon-current content-box current-border-grey-500 border-current/20',
    'data-[type=textarea]': 'min-h-fingertip h-auto items-start',
    'data-[active=true]:': 'icon-current-hl current-bg-white',
    // 'dark:': '',
    '[&.i8-flat]:': {
      '': 'border-b',
    },
    '[&.i8-filled]:': {
      '': ' current-bg-scope-light-0 bg-current border border-current/20 rounded-base',
      'data-[active=true]:':
        'current-bg-scope-light-0 bg-current current-outline-hl outline-current/50 outline-2px outline',
      'dark:': {
        '': 'current-bg-scope-dark-2',
        'data-[active=true]:': 'current-bg-scope-dark-0',
      },
    },
    '[&.i8-no-border]:': 'border-0! outline-none! rounded-0!',
    '[&.i8-transparent]:': 'bg-transparent!',
    '[&.i8-round]:': 'rounded-fingertip-half border border-current/20',
    'aria-[disabled=true]:': 'opacity-50 cursor-not-allowed',
    // error
    'group-[[data-error=true]]/i8:': {
      '': 'current-border-error-500 border-current',
    },
  },

  'i8-underline': {
    'group-[.i8-filled]/i8:': 'hidden',
    '': 'absolute left-50% h-2px right-50% bottom-[-1px] pointer-events-none transition-all transition-duration-300 will-change-left will-change-right bg-current-hl',
    'group-[[data-active=true]]/i8:': 'left-0 right-0',
  },

  'segmented': {
    '': {
      'first-of-type:': 'rounded-r-0!',
      'last-of-type:': 'rounded-lt-0! rounded-lb-0!',
      'not-last-of-type:not-first-of-type:': 'rounded-0!',
      'not-first-of-type:': 'border-l-0! border-l-grey-500/20',
      'data-[active=true]:': 'z-2',
    },
    '[&.i8-flat]:': {
      'not-first-of-type:': 'ml-$xs',
    },
  },

  'i8-input-wrapper': {
    '': 'relative w-full h-full',
  },

  'i8-input': {
    '': 'w-full outline-none h-full bg-transparent',
    'group-[.i8-flat]/i8:data-[has-prepend=true]': 'pl-$s',
    'group-[.i8-flat]/i8:data-[has-append=true]': 'pr-$s',
    'group-[.i8-filled]/i8:': 'px-$m',
    'selection:': 'bg-scope-color-500 text-white',
    "group-[.i8-round]/i8:[&[data-has-prepend='false']]:": 'pl-fingertip-half',
    "group-[.i8-round]/i8:[&[data-has-append='false']]:": 'pr-fingertip-half',
    'group-[[data-has-label]]/i8:': 'pt-$m',
    // groupped inputs paddings
    'group-[.segmented:not(.i8-flat):not(:first-child)]/i8:': 'pl-$m',
    'group-[.segmented:not(.i8-flat):not(:last-child)]/i8:': 'pr-$m',
  },

  'i8-textarea': {
    '': 'w-full outline-none h-full bg-transparent text-body', // !
    'group-[.i8-flat]/i8:data-[has-prepend=true]': 'pl-$s',
    'group-[.i8-flat]/i8:data-[has-append=true]': 'pr-$s',
    'group-[.i8-filled]/i8:': 'px-$m',
    'selection:': 'bg-scope-color-500 text-white',
    "group-[.i8-round]/i8:[&[data-has-prepend='false']]:": 'pl-fingertip-half',
    "group-[.i8-round]/i8:[&[data-has-append='false']]:": 'pr-fingertip-half',
    // groupped inputs paddings
    'group-[.segmented:not(.i8-flat):not(:first-child)]/i8:': 'pl-$m',
    'group-[.segmented:not(.i8-flat):not(:last-child)]/i8:': 'pr-$m',
  },

  'i8-ta-wrapper': {
    '': 'w-full pt-0.75em',
    'group-[[data-has-label]]/i8:': 'mt-$m',
  },

  'i8-label': {
    '': 'absolute top-0 h-fingertip text-body text-grey-400 lh-fingertip transition-all transition-duration-300 truncate text-ellipsis overflow-hidden max-w-70%',
    'group-[[data-active=true]]/i8:': 'h-[2em] lh-2em text-label font-size-[0.7em] text-current-hl',
    'group-[[data-has-placeholder]]/i8:': 'h-[2em] lh-2em text-label font-size-[0.7em]',
    'group-[[data-has-value]]/i8:': 'h-[2em] lh-2em text-label font-size-[0.7em]',
    // 'data-[required=true]:after:': "content-['*'] text-error-500",
  },

  'i8-label-wrapper': {
    '': 'pointer-events-none absolute left-0 right-0 bottom-0 top-0',
    // paddings
    'group-[.i8-flat]/i8:data-[has-prepend=true]': 'pl-$s',
    'group-[.i8-flat]/i8:data-[has-append=true]': 'pr-$s',
    'group-[.i8-filled]/i8:': 'px-$m',
    "group-[.i8-round]/i8:[&[data-has-prepend='false']]:": 'pl-fingertip-half',
    "group-[.i8-round]/i8:[&[data-has-append='false']]:": 'pr-fingertip-half',
    // groupped inputs paddings
    'group-[.segmented:not(.i8-flat):not(:first-child)]/i8:': 'pl-$m',
    'group-[.segmented:not(.i8-flat):not(:last-child)]/i8:': 'pr-$m',
  },

  'i8-hint': {
    '': 'text-caption pt-$xs text-grey-400 flex-1',
  },

  'i8-counter': {
    '': 'text-caption pt-$xs text-grey-400',
  },

  'i8-hint-wrapper': {
    '': 'relative flex justify-between',
    'group-[.i8-round]/i8:': 'px-fingertip-half',
    'group-[.i8-filled]/i8:': 'px-$m',
  },

  'i8-hint-wrapper-stack': {
    '': 'relative flex justify-between',
  },

  'i8-stack-label': {
    '': 'relative pb-$xxs',
  },

  'i8-prepend': {
    '': 'my-1em',
    'group-[.i8-filled]/i8:': 'pl-$m',
    'group-[.i8-round]/i8:': 'pl-$m',
    // groupped inputs paddings
    'group-[.segmented:not(.i8-flat):not(:first-child)]/i8:': 'pl-$m',
  },

  'i8-append': {
    '': 'my-1em flex gap-$s items-center',
    'group-[.i8-filled]/i8:': 'pr-$m',
    'group-[.i8-round]/i8:': 'pr-$m',
    // groupped inputs paddings
    'group-[.segmented:not(.i8-flat):not(:last-child)]/i8:': 'pr-$m',
  },

  'i8-before': {
    '': 'h-fingertip flex items-center pr-$m current-icon-grey-500 icon-current',
    'group-[[data-group-active=true]]/i8:': 'icon-current-hl',
  },
  'i8-after': {
    '': 'h-fingertip flex items-center pl-$m current-icon-grey-500 icon-current',
    'group-[[data-group-active=true]]/i8:': 'icon-current-hl',
  },

  'i8-icon-clickable': {
    '[&>.icon-color]:': 'cursor-pointer',
    '[&>.icon-color:hover]:': 'current-icon-scope-color-500 icon-current',
  },
})
