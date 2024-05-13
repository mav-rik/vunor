import { scFromObject } from '../utils/shortcut-obj'

export const i8 = {
  'i8': scFromObject({
    '': 'h-fingertip min-w-3em flex items-center select-none relative current-icon-grey-500 icon-current/75 overflow-hidden current-border-grey-500 border-current/20',
    'data-[type=textarea]': 'min-h-fingertip h-auto items-start',
    'data-[active=true]:': 'current-icon-scope-color-500 icon-current/100',
    // 'dark:': '',
    '[&.i8-flat]:': {
      '': 'border-b',
    },
    '[&.i8-filled]:': {
      '': 'backdrop-blur-md current-bg-grey-300 bg-current/10 border border-current/0',
      'data-[active=true]:':
        'current-bg-scope-light-1 bg-current/100 current-outline-scope-color-500 outline-current/50 outline-2px outline',
      'dark:': {
        '': 'current-bg-grey-600',
        'data-[active=true]:': 'current-bg-scope-dark-1',
      },
    },
    '[&.i8-round]:': 'rounded-half-fingertip border border-current/0',
    // error
    'group-data-[error=true]:': {
      '': 'current-border-error-500 border-current',
    },
  }),

  'i8-underline': scFromObject({
    'group-[.i8-filled]:': 'hidden',
    '': 'absolute left-50% top-0 right-50% bottom-[-1px] border-b-2px pointer-events-none transition-all transition-duration-300 will-change-left will-change-right current-border-scope-color-500 border-current',
    'group-data-[active=true]:': 'left-0 right-0',
  }),

  'i8-group-item': scFromObject({
    '[&.i8-filled]:': {
      'first:': 'rounded-r-0',
      'last:': 'rounded-lt-0 rounded-lb-0',
      'not-last:not-first:': 'rounded-0',
      'not-first:': 'border-l',
      'data-[active=true]:': 'z-2',
    },
    '[&.i8-flat]:': {
      'not-first:': 'ml-$xs',
    },
  }),

  'i8-input-wrapper': scFromObject({
    '': 'relative w-full h-full',
  }),

  'i8-input': scFromObject({
    '': 'w-full outline-none h-full bg-transparent',
    'group-[.i8-flat]:data-[has-prepend=true]': 'pl-$s',
    'group-[.i8-flat]:data-[has-append=true]': 'pr-$s',
    'group-[.i8-filled]:': 'px-$s',
    'selection:': 'bg-scope-color-500 text-white',
    "group-[.i8-round]:[&[data-has-prepend='false']]:": 'pl-half-fingertip',
    "group-[.i8-round]:[&[data-has-append='false']]:": 'pr-half-fingertip',
    'group-data-[has-label=true]:': 'pt-$m',
    // groupped inputs paddings
    'group-[.i8-group-item:not(.i8-flat):not(:first-child)]:': 'pl-$s',
    'group-[.i8-group-item:not(.i8-flat):not(:last-child)]:': 'pr-$s',
  }),

  'i8-textarea': scFromObject({
    '': 'w-full outline-none h-full bg-transparent text-body', // !
    'group-[.i8-flat]:data-[has-prepend=true]': 'pl-$s',
    'group-[.i8-flat]:data-[has-append=true]': 'pr-$s',
    'group-[.i8-filled]:': 'px-$s',
    'selection:': 'bg-scope-color-500 text-white',
    "group-[.i8-round]:[&[data-has-prepend='false']]:": 'pl-half-fingertip',
    "group-[.i8-round]:[&[data-has-append='false']]:": 'pr-half-fingertip',
    // groupped inputs paddings
    'group-[.i8-group-item:not(.i8-flat):not(:first-child)]:': 'pl-$s',
    'group-[.i8-group-item:not(.i8-flat):not(:last-child)]:': 'pr-$s',
  }),

  'i8-ta-wrapper': scFromObject({
    '': 'w-full pt-0.75em',
    'group-data-[has-label=true]:': 'mt-$s',
  }),

  'i8-label': scFromObject({
    '': 'absolute top-0 h-fingertip text-body text-grey-400 lh-fingertip transition-all transition-duration-300 truncate text-ellipsis overflow-hidden max-w-70%',
    'group-data-[active=true]:': 'h-[2em] lh-2em text-label font-size-[0.8em] text-scope-color-500',
    'group-data-[has-placeholder=true]:': 'h-[2em] lh-2em text-label font-size-[0.8em]',
    'group-data-[has-value=true]:': 'h-[2em] lh-2em text-label font-size-[0.8em]',
    // 'data-[required=true]:after:': "content-['*'] text-error-500",
  }),

  'i8-label-wrapper': scFromObject({
    '': 'pointer-events-none absolute left-0 right-0 bottom-0 top-0',
    // paddings
    'group-[.i8-flat]:data-[has-prepend=true]': 'pl-$s',
    'group-[.i8-flat]:data-[has-append=true]': 'pr-$s',
    'group-[.i8-filled]:': 'px-$s',
    "group-[.i8-round]:[&[data-has-prepend='false']]:": 'pl-half-fingertip',
    "group-[.i8-round]:[&[data-has-append='false']]:": 'pr-half-fingertip',
    // groupped inputs paddings
    'group-[.i8-group-item:not(.i8-flat):not(:first-child)]:': 'pl-$s',
    'group-[.i8-group-item:not(.i8-flat):not(:last-child)]:': 'pr-$s',
  }),

  'i8-hint': scFromObject({
    '': 'text-caption pt-$xs text-grey-400 flex-1',
  }),

  'i8-counter': scFromObject({
    '': 'text-caption pt-$xs text-grey-400',
  }),

  'i8-hint-wrapper': scFromObject({
    '': 'px-$s relative flex justify-between',
    'group-[.i8-round]:': 'px-half-fingertip relative',
    'group-[.i8-flat]:': 'px-0',
  }),

  'i8-prepend': scFromObject({
    '': 'my-1em',
    'group-[.i8-filled]:': 'pl-$s',
    'group-[.i8-round]:': 'pl-$m',
    // groupped inputs paddings
    'group-[.i8-group-item:not(.i8-flat):not(:first-child)]:': 'pl-$s',
  }),

  'i8-append': scFromObject({
    '': 'my-1em',
    'group-[.i8-filled]:': 'pr-$s',
    'group-[.i8-round]:': 'pr-$m',
    // groupped inputs paddings
    'group-[.i8-group-item:not(.i8-flat):not(:last-child)]:': 'pr-$s',
  }),

  'i8-before': scFromObject({
    '': 'h-fingertip flex items-center pr-$s current-icon-grey-500 icon-current/75',
    'group-data-[group-active=true]': 'current-icon-scope-color-500 icon-current/100',
  }),
  'i8-after': scFromObject({
    '': 'h-fingertip flex items-center pl-$s current-icon-grey-500 icon-current/75',
    'group-data-[group-active=true]': 'current-icon-scope-color-500 icon-current/100',
  }),
}