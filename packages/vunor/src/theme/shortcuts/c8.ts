import { defineShortcuts } from '../utils/define-sc'
import { whenEnabled } from '../utils/disabled'

// c8 - clickable
//
// The `c8-*-hover` / `c8-*-active` shortcuts are plain paint. Whether they fire
// is decided by each family, and the states split in two:
// - hover, `[data-highlighted]`, `:active` and `[data-active]` sit under
//   `whenEnabled` (utils/disabled.ts), so a disabled element gets no wash when
//   the pointer is over it or presses it;
// - `:focus-visible` and the selected states stay ungated. An element disabled
//   with `aria-disabled` can still take focus, and the hover wash is the only
//   focus indicator c8 ships, so gating it would leave focus invisible. A
//   selected item that is also disabled keeps showing that it is selected.
export const c8 = defineShortcuts({
  // FILLED
  'c8-filled': {
    '': 'current-bg-scope-color-500 rounded-r1 current-text-white current-icon-white icon-current/100 bg-current  text-current',
    'focus-visible:': 'c8-filled-hover',
    [whenEnabled]: {
      'hover:': 'c8-filled-hover',
      'data-[highlighted]:': 'c8-filled-hover',
      'active:': 'c8-filled-active',
      'data-[active]:': 'c8-filled-active',
    },
  },
  // Hover = one step darker in light mode / one step lighter in dark mode
  //   (push the button *away* from the page luminance → more visible)
  // Active = one step beyond hover
  'c8-filled-hover': {
    '': 'current-bg-scope-color-600',
    'dark:': 'current-bg-scope-color-400',
  },
  'c8-filled-active': {
    '': 'current-bg-scope-color-700',
    'dark:': 'current-bg-scope-color-300',
  },

  // FLAT (Transparent)
  'c8-flat': {
    '': 'current-bg-scope-color-500 rounded-r1 current-text-black current-icon-black bg-current/0 text-current/80 icon-current/50',
    'dark:': 'current-text-white current-icon-white',
    'focus-visible:': 'c8-flat-hover',
    [whenEnabled]: {
      'hover:': 'c8-flat-hover',
      'data-[highlighted]:': 'c8-flat-hover',
      'active:': 'c8-flat-active',
      'data-[active]:': 'c8-flat-active',
    },
    'data-[selected=true]:': 'c8-flat-selected',
    'data-[on=true]:': 'c8-flat-selected',
    'aria-[selected=true]:': 'c8-flat-selected',
    'aria-[pressed=true]:': 'c8-flat-selected',
  },
  'c8-flat-hover': 'bg-current/10',
  'c8-flat-active': 'bg-current/15',
  'c8-flat-selected': {
    '': 'c8-flat-hover current-text-scope-color-500 text-current current-icon-scope-color-500 icon-current/100',
    'dark:': 'current-text-scope-color-400 current-icon-scope-color-400',
  },

  // OUTLINED (Bordered)
  'c8-outlined': {
    '': 'c8-flat border-scope-color-500 rounded-r1 border current-text-scope-color-500 current-icon-scope-color-500 icon-current/100',
    'dark:': 'current-text-scope-color-400 current-icon-scope-color-400',
    'focus-visible:': 'c8-outlined-hover',
    [whenEnabled]: {
      'hover:': 'c8-outlined-hover',
      'data-[highlighted]:': 'c8-outlined-hover',
      'active:': 'c8-outlined-active',
      'data-[active]:': 'c8-outlined-active',
    },
  },
  'c8-outlined-hover': 'c8-flat-hover',
  'c8-outlined-active': 'c8-flat-active',

  // CHROME (Page-chrome / outlined neutral)
  // Composes surface-0 for its base paint — the bg, text, icon, and border all
  // match a surface-0 block exactly. The base surface uses scope-light-0 / dark-0
  // for bg and scope-color-100 / 800 for border, which is nearly grey in every
  // scope, so chrome buttons read as neutral even inside scoped subtrees
  // (scope-primary, scope-error, etc.). Use for secondary chrome buttons
  // (Cancel, Select all, None) that should not compete with the primary CTA.
  'c8-chrome': {
    '': 'surface-0 rounded-r1 border',
    'focus-visible:': 'c8-chrome-hover',
    [whenEnabled]: {
      'hover:': 'c8-chrome-hover',
      'data-[highlighted]:': 'c8-chrome-hover',
      'active:': 'c8-chrome-active',
      'data-[active]:': 'c8-chrome-active',
    },
    'data-[selected=true]:': 'c8-chrome-selected',
    'data-[on=true]:': 'c8-chrome-selected',
    'aria-[selected=true]:': 'c8-chrome-selected',
    'aria-[pressed=true]:': 'c8-chrome-selected',
  },
  'c8-chrome-hover': {
    '': 'current-bg-scope-light-1 bg-current',
    'dark:': 'current-bg-scope-dark-1',
  },
  'c8-chrome-active': {
    '': 'current-bg-scope-light-2 bg-current',
    'dark:': 'current-bg-scope-dark-2',
  },
  'c8-chrome-selected': {
    '': 'current-bg-scope-light-1 bg-current current-text-scope-color-500 text-current current-icon-scope-color-500 icon-current/100',
    'dark:': 'current-bg-scope-dark-1 current-text-scope-color-400 current-icon-scope-color-400',
  },

  // LIGHT (Filled/Transparent)
  'c8-light': {
    '': 'current-bg-scope-color-500 rounded-r1 current-text-scope-color-500 current-icon-scope-color-500 bg-current/10 text-current icon-current/80',
    'dark:': 'current-text-scope-color-400 current-icon-scope-color-400',
    'focus-visible:': 'c8-light-hover',
    [whenEnabled]: {
      'hover:': 'c8-light-hover',
      'data-[highlighted]:': 'c8-light-hover',
      'active:': 'c8-light-active',
      'data-[active]:': 'c8-light-active',
    },
    'data-[selected=true]:': 'c8-light-hover',
    'data-[on=true]:': 'c8-light-hover',
    'aria-[selected=true]:': 'c8-light-hover',
    'aria-[pressed=true]:': 'c8-light-hover',
  },
  'c8-light-hover': 'bg-current/20',
  'c8-light-active': 'bg-current/30',
})
