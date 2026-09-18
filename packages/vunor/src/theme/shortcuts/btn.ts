import { defineShortcuts } from '../utils/define-sc'

// Each modifier's geometry is declared once and applied from two directions:
// the `[&.x]:` variants inside `btn` (they compile to `.btn.btn-x`, which needs
// both names as literal classes on the element — the component path), and the
// modifier's own shortcut body (which survives a consumer aliasing both names
// into one shortcut of their own, e.g. `my-icon-btn: 'btn btn-square'`, where
// no literal `.btn-square` exists for the variant to match). UnoCSS merges the
// two identical bodies into a single selector list, so this costs no extra CSS.
//
// Whatever a modifier has to say to the label/icon *children* travels as an
// inherited custom property rather than a `group-[.btn-*]/btn:` descendant
// rule. A custom property crosses the DOM boundary without caring what the
// ancestor is called, so it keeps working both when the names are aliased away
// and when the button was hand-rolled without `group/btn`:
//
// The variables are listed in skills/vunor/references/shortcuts.md.
//
// `revert` (not `inline`/`block`) is the label fallback so an unset variable
// leaves the element on its UA display instead of pinning one.
const btnRound = 'px-fingertip-half rounded-fingertip-half [--btn-icon-pull:-0.5em]'
// `btnSquare` must come after `btnRound`: on an element wearing both, the two
// modifier bodies are equal specificity, so only order settles the ALIAS path.
// The literal-class path is settled independently by the `.btn-round.btn-square`
// compound below, which outranks both.
const btnSquare =
  'size-fingertip px-0 [--btn-label-display:none] [--btn-icon-fs:1.5em] [--btn-icon-pull:0]'

// Public layout primitives for hand-rolled clickables. Pair with c8-* for
// color/state and a scope-* for theming. <VuButton> bundles these for you.
export const btn = defineShortcuts({
  'btn': {
    '': 'h-fingertip flex items-center justify-center px-$m gap-$xs select-none fw-bold tracking-wide relative',
    '[&.btn-round]:': btnRound,
    '[&.btn-square]:': btnSquare,
    '[&.btn-round.btn-square]:': 'px-0 [--btn-icon-pull:0]',
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
    '': 'lh-1em ellipsis whitespace-nowrap overflow-x-clip overflow-y-visible display-[var(--btn-label-display,revert)]',
  },
  'btn-icon': {
    '': 'size-1em font-size-[var(--btn-icon-fs,1.25em)]',
  },
  'btn-icon-left': {
    '': 'ml-[var(--btn-icon-pull,0)]',
  },
  'btn-icon-right': {
    '': 'mr-[var(--btn-icon-pull,0)]',
  },
})
