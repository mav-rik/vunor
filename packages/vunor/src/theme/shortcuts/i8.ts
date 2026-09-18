import { defineShortcuts } from '../utils/define-sc'

// `$m` and `fingertip-half` as literals: an arbitrary-property value is not run
// through the theme, so these mirror `theme.spacing` (`$m` is a fixed `1em`,
// `fingertip-half` is the `--v-fingertip-half` custom property).
const M = '1em'
const FINGERTIP_HALF = 'var(--v-fingertip-half)'

// Wrapper -> child signalling. The children (`i8-input`, `i8-textarea`,
// `i8-label-wrapper`, `i8-hint-wrapper`, `i8-underline`) used to key off the
// wrapper's class name (`group-[.i8-filled]/i8:`). Aliasing erases that class —
// `defineShortcuts({ 'my-input': 'i8 i8-filled' })` compiles to a single
// `.my-input` selector — and no shortcut body can fix a selector that names the
// ancestor. Inherited custom properties cross the same DOM boundary without
// caring what the wrapper is called, so each child now reads one with a fallback
// under its own `data-has-prepend` / `data-has-append` condition (those sit on
// the child element and were never affected by aliasing).
//
// The signal lives ONLY on the marker's own rule below. Repeating it inside the
// `.i8.i8-*` compound would be unreachable: that compound matches exactly when
// the bare marker does, and the one thing that overrides it — the segmented
// positional override, 0,4,0 — outranks both.
//
// `i8-filled` must stay declared before `i8-round`: an element carrying both —
// that is every `design="round"` input — has two equal-specificity `.i8-*`
// rules, so only order settles which padding wins. There is no compound to pin
// it the way `btn` does, because the element wearing both markers is <VuInput>'s
// outer wrapper, which has no `.i8`. The 24px round assertions in
// e2e/i8-geometry.spec.ts are what guard it.
const pad = (v: string) => `[--i8-pl:${v}] [--i8-pr:${v}] [--i8-hint-px:${v}]`
const filledSignal = `${pad(M)} [--i8-underline-display:none]`
const roundSignal = pad(FINGERTIP_HALF)

// The box (background / border / radius / focus outline) stays on the `.i8.i8-*`
// compound and is deliberately NOT part of the modifier's own body: <VuInput>
// puts the same marker classes on its outer wrapper, which has no `.i8` and
// encloses the hint row, so a bare `.i8-filled { background … border … }` paints
// a second box around input + hint. The look is therefore literal-class-only;
// only the signalling is alias-safe.
const i8Filled = {
  '': 'i8-apply-bg current-outline-hl i8-apply-border rounded-r1',
  'data-[active=true]:': 'current-border-hl outline i8-apply-outline',
  'focus-within:': 'current-border-hl outline i8-apply-outline',
}

const i8Round = {
  '': 'i8-apply-bg current-outline-hl rounded-fingertip-half i8-apply-border',
  'data-[active=true]:': 'current-border-hl outline i8-apply-outline',
  'focus-within:': 'current-border-hl outline i8-apply-outline',
}

export const i8 = defineShortcuts({
  'i8': {
    '': 'h-fingertip min-w-3em flex items-center select-none relative icon-current content-box disabled-soft',
    'data-[type=textarea]:': 'min-h-fingertip h-auto items-start',
    'data-[active=true]:': 'icon-current-hl',
    'focus-within:': 'icon-current-hl',
    // 'dark:': '',
    '[&.i8-flat]:': {
      '': 'border-b-width-[var(--i8-border-width,1px)]',
    },
    '[&.i8-filled]:': i8Filled,
    '[&.i8-round]:': i8Round,
    // Positional overrides for segmented groups. Literal-class-only: they need
    // two marker classes on one element, so an alias cannot carry them. They set
    // the same variables as `i8-round` at a higher specificity
    // (`.i8.segmented.i8-round:not(:first-child)` is 0,4,0 vs `.i8-round`'s
    // 0,1,0), which is what collapses the old per-child override rules.
    '[&.segmented.i8-round:not(:first-child)]:': `[--i8-pl:${M}]`,
    '[&.segmented.i8-round:not(:last-child)]:': `[--i8-pr:${M}]`,
    // error
    'group-[[data-error=true]]/i8:': {
      '': 'current-border-error-500 current-outline-error-500 border-opacity-100 border-current',
    },
  },

  // Alias-safe halves of the markers. `i8-flat` has no entry: its only
  // declaration is the bottom border, which cannot leave the `.i8.i8-flat`
  // compound for the same reason as the filled/round box above.
  'i8-filled': filledSignal,
  'i8-round': roundSignal,
  // `bg-transparent!` is important, so the bare marker can never disagree with a
  // `.i8.i8-transparent` compound — one rule is enough.
  'i8-transparent': 'bg-transparent!',

  // Standalone leaf-class for unwrapped <input>s. Bundles border + bg +
  // outline + focus highlight + placeholder color so consumers can write
  // `i8-bare h-fingertip-m px-$m` instead of re-deriving the recipe.
  // Padding/height/radius stay external because they vary by callsite.
  'i8-bare': {
    '':
      'i8-apply-bg i8-apply-border current-outline-hl rounded-r1 outline-none ' +
      'text-current placeholder:text-current/50 disabled-soft',
    'hover:': 'border-current-hover',
    'focus:': 'current-border-hl outline i8-apply-outline',
    'data-[error=true]:': 'current-border-error-500 current-outline-error-500 border-current',
  },

  'i8-loading': {
    '': 'text-current-icon pl-$m',
    'last:': 'pr-$m',
  },

  'i8-icon-wrap': 'size-fingertip flex items-center justify-center',

  'i8-underline': {
    '': 'absolute left-50% h-2px right-50% bottom-[-1px] pointer-events-none transition-all transition-duration-300 will-change-left will-change-right bg-current-hl display-[var(--i8-underline-display,revert)]',
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
    // literal-class-only: needs both `segmented` and `i8-flat` on one element
    '[&.i8-flat]:': {
      'not-first-of-type:': 'ml-$xs',
    },
  },

  'i8-input-wrapper': {
    '': 'relative w-full h-full',
  },

  'i8-input': {
    '': 'w-full outline-none h-full bg-transparent',
    '[&:not([data-has-prepend=true])]:': 'pl-[var(--i8-pl,0)]',
    '[&:not([data-has-append=true])]:': 'pr-[var(--i8-pr,0)]',
    'selection:': 'bg-scope-color-500 text-white',
    'group-[[data-has-label]]/i8:': 'pt-$m',
  },

  'i8-textarea': {
    '': 'w-full outline-none h-full bg-transparent text-body', // !
    '[&:not([data-has-prepend=true])]:': 'pl-[var(--i8-pl,0)]',
    '[&:not([data-has-append=true])]:': 'pr-[var(--i8-pr,0)]',
    'selection:': 'bg-scope-color-500 text-white',
  },

  'i8-ta-wrapper': {
    '': 'w-full pt-0.75em',
    'group-[[data-has-label]]/i8:': 'mt-$m',
  },

  'i8-label': {
    '': 'absolute top-0 h-fingertip text-body text-grey-400 lh-fingertip transition-all transition-duration-300 truncate text-ellipsis overflow-hidden max-w-70%',
    'group-[:focus-within]/i8:': 'h-[2em] lh-2em text-label font-size-[0.7em] text-current-hl',
    'group-[[data-active=true]]/i8:': 'h-[2em] lh-2em text-label font-size-[0.7em] text-current-hl',
    'group-[[data-has-placeholder]]/i8:': 'h-[2em] lh-2em text-label font-size-[0.7em]',
    'group-[[data-has-value]]/i8:': 'h-[2em] lh-2em text-label font-size-[0.7em]',
  },

  'i8-label-wrapper': {
    '': 'pointer-events-none absolute left-0 right-0 bottom-0 top-0',
    // paddings
    '[&:not([data-has-prepend=true])]:': 'pl-[var(--i8-pl,0)]',
    '[&:not([data-has-append=true])]:': 'pr-[var(--i8-pr,0)]',
  },

  'i8-hint': {
    '': 'text-caption pt-$xs text-grey-400 flex-1',
  },

  'i8-counter': {
    '': 'text-caption pt-$xs text-grey-400',
  },

  'i8-hint-wrapper': {
    // a separate variable from `--i8-pl`/`--i8-pr`: the segmented positional
    // overrides sit on the `.i8` box and must not reach the hint row
    '': 'relative flex justify-between px-[var(--i8-hint-px,0)]',
  },

  'i8-hint-wrapper-stack': {
    '': 'relative flex justify-between',
  },

  'i8-stack-label': {
    '': 'relative pb-$xxs',
  },

  'i8-prepend': {
    '': 'flex items-center',
    'group-[[data-type=textarea]]/i8:': 'my-$m',
  },

  'i8-append': {
    '': 'flex items-center',
    'group-[[data-type=textarea]]/i8:': 'my-$m',
  },

  'i8-before': {
    '': 'h-fingertip flex items-center icon-current',
    'group-[[data-group-active=true]]/i8:': 'icon-current-hl',
  },
  'i8-after': {
    '': 'h-fingertip flex items-center icon-current',
    'group-[[data-group-active=true]]/i8:': 'icon-current-hl',
  },

  'i8-icon-clickable': {
    '[&>.i8-icon-wrap]:': 'cursor-pointer',
    '[&>.i8-icon-wrap:hover]:': 'current-icon-hl icon-current',
  },
})
