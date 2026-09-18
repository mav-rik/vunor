import { defineShortcuts } from '../../theme/utils/define-sc'

export const radioShortcuts = defineShortcuts({
  'rb-container': {
    '': 'flex flex-col gap-$s text-body',
  },
  'rb-label': {
    '': 'text-label text-grey-400',
  },
  // Direction travels as a variable rather than as `[&.rb-row]:` / `not-[.rb-row]:`
  // rules keyed on the literal class. Those compiled to `.rb-root:not(.rb-row)`,
  // which an alias (`my-row: 'rb-root rb-row'`) could not escape: the alias
  // carries no `rb-row` class, so the `:not()` matched it and won on specificity
  // (0,2,0 over 0,1,0) — the row group came out as a column.
  'rb-root': {
    '': 'flex [flex-direction:var(--rb-dir,column)] gap-x-$l gap-y-$m',
  },
  'rb-row': {
    '': '[--rb-dir:row] flex-wrap',
  },
  'rb-item-wrapper': {
    '': 'flex',
  },
  'rb-item': {
    '': 'disabled-soft select-none shrink-0 current-bg-scope-color-500 bg-current/0 size-1.25em rounded-full cursor-default current-border-grey-500 border-current/40 border-[0.16em] transition-none',
    "data-[state=checked]:not-[[data-error='true']]:":
      'current-border-scope-color-500 border-current',
    'data-[state=checked]:': 'bg-current',
    'active:enabled:': 'bg-current/20',
    'aria-[disabled=true]:': 'scope-grey',
    'data-[error=true]:': 'current-border-error-500 current-bg-error-500',
  },
  'rb-item-indicator': {
    '': "flex items-center justify-center w-full h-full rounded-full relative after:content-[''] after:block after:size-[0.5em] after:rounded-[50%] after:bg-white animate-zoom-in animate-duration-100",
  },
  'rb-item-label': {
    '': 'disabled-soft select-none px-$s text-body leading-none lh-1.25em',
    'aria-[disabled=true]:': 'scope-grey',
  },
})
