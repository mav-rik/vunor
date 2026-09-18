import { defineShortcuts } from '../utils/define-sc'

// Each modifier's geometry is declared once and applied from two directions:
// the `[&.x]:` variants inside `btn` (they compile to `.btn.btn-x`, which needs
// both names as literal classes on the element — the component path), and the
// modifier's own shortcut body (which survives a consumer aliasing both names
// into one shortcut of their own, e.g. `my-icon-btn: 'btn btn-square'`, where
// no literal `.btn-square` exists for the variant to match). UnoCSS merges the
// two identical bodies into a single selector list, so this costs no extra CSS.
const btnSquare = 'size-fingertip px-0'
const btnRound = 'px-fingertip-half rounded-fingertip-half'

// Public layout primitives for hand-rolled clickables. Pair with c8-* for
// color/state and a scope-* for theming. <VuButton> bundles these for you.
export const btn = defineShortcuts({
  'btn': {
    '': 'h-fingertip flex items-center justify-center px-$m gap-$xs select-none fw-bold tracking-wide relative',
    '[&.btn-round]:': btnRound,
    '[&.btn-square]:': btnSquare,
    '[&.btn-round.btn-square]:': 'px-0',
    'disabled:': 'opacity-80 cursor-not-allowed',
    '[&>span]:data-[loading]:': 'opacity-0 pointer-events-none',
    '[&>div:not(.loading-indicator-wrapper)]:data-[loading]:': 'opacity-0 pointer-events-none',
    '[&>.loading-indicator-wrapper]:':
      'absolute left-0 top-0 right-0 bottom-0 flex items-center justify-center cursor-wait',
  },
  'btn-round': {
    '': btnRound,
  },
  'btn-square': {
    '': btnSquare,
  },
  'btn-label': {
    '': 'lh-1em ellipsis whitespace-nowrap overflow-x-clip overflow-y-visible',
    'group-[.btn-square]/btn:': 'hidden',
  },
  'btn-icon': {
    '': 'size-1em font-size-1.25em',
    'group-[.btn-round]/btn:[&.btn-icon-left]:': 'ml-[-0.5em]',
    'group-[.btn-round]/btn:[&.btn-icon-right]:': 'mr-[-0.5em]',
    'group-[.btn-square]/btn:': 'font-size-1.5em m-0!',
    'group-[.btn-round.btn-square]/btn:': 'm-0!',
  },
})
