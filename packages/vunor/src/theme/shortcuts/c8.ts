import { defineShortcuts } from '../utils/define-sc'

// c8 - clickable
export const c8 = defineShortcuts({
  // FILLED
  'c8-filled': {
    '': 'current-bg-scope-color-500 rounded-r1 current-text-white current-icon-white icon-current/100 bg-current  text-current',
    'hover:': 'c8-filled-hover',
    'focus-visible:': 'c8-filled-hover',
    'data-[highlighted]:': 'c8-filled-hover',
    'active:': 'c8-filled-active',
    'data-[active]:': 'c8-filled-active',
  },
  // Hover = one step darker in light mode / one step lighter in dark mode
  //   (push the button *away* from the page luminance → more visible)
  // Active = one step beyond hover
  'c8-filled-hover': {
    'not-([disabled]):': 'current-bg-scope-color-600',
    'dark:not-([disabled]):': 'current-bg-scope-color-400',
  },
  'c8-filled-active': {
    'not-([disabled]):': 'current-bg-scope-color-700',
    'dark:not-([disabled]):': 'current-bg-scope-color-300',
  },

  // FLAT (Transparent)
  'c8-flat': {
    '': 'current-bg-scope-color-500 rounded-r1 current-text-black current-icon-black bg-current/0 text-current/80 icon-current/50',
    'dark:': 'current-text-white current-icon-white',
    'hover:': 'c8-flat-hover',
    'focus-visible:': 'c8-flat-hover',
    'data-[highlighted]:': 'c8-flat-hover',
    'active:': 'c8-flat-active',
    'data-[active]:': 'c8-flat-active',
    'data-[selected=true]:': 'c8-flat-selected',
    'data-[on=true]:': 'c8-flat-selected',
    'aria-[selected=true]:': 'c8-flat-selected',
    'aria-[pressed=true]:': 'c8-flat-selected',
  },
  'c8-flat-hover': {
    'not-([disabled]):': 'bg-current/10',
  },
  'c8-flat-active': {
    'not-([disabled]):': 'bg-current/15',
  },
  'c8-flat-selected': {
    '': 'c8-flat-hover current-text-scope-color-500 text-current current-icon-scope-color-500 icon-current/100',
    'dark:': 'current-text-scope-color-400 current-icon-scope-color-400',
  },

  // OUTLINED (Bordered)
  'c8-outlined': {
    '': 'c8-flat border-scope-color-500 rounded-r1 border current-text-scope-color-500 current-icon-scope-color-500 icon-current/100',
    'dark:': 'current-text-scope-color-400 current-icon-scope-color-400',
    'hover:': 'c8-outlined-hover',
    'focus-visible:': 'c8-outlined-hover',
    'data-[highlighted]:': 'c8-outlined-hover',
    'active:': 'c8-outlined-active',
    'data-[active]:': 'c8-outlined-active',
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
    'hover:': 'c8-chrome-hover',
    'focus-visible:': 'c8-chrome-hover',
    'data-[highlighted]:': 'c8-chrome-hover',
    'active:': 'c8-chrome-active',
    'data-[active]:': 'c8-chrome-active',
    'data-[selected=true]:': 'c8-chrome-selected',
    'data-[on=true]:': 'c8-chrome-selected',
    'aria-[selected=true]:': 'c8-chrome-selected',
    'aria-[pressed=true]:': 'c8-chrome-selected',
  },
  'c8-chrome-hover': {
    'not-([disabled]):': 'current-bg-scope-light-1 bg-current',
    'dark:not-([disabled]):': 'current-bg-scope-dark-1',
  },
  'c8-chrome-active': {
    'not-([disabled]):': 'current-bg-scope-light-2 bg-current',
    'dark:not-([disabled]):': 'current-bg-scope-dark-2',
  },
  'c8-chrome-selected': {
    '': 'current-bg-scope-light-1 bg-current current-text-scope-color-500 text-current current-icon-scope-color-500 icon-current/100',
    'dark:': 'current-bg-scope-dark-1 current-text-scope-color-400 current-icon-scope-color-400',
  },

  // LIGHT (Filled/Transparent)
  'c8-light': {
    '': 'current-bg-scope-color-500 rounded-r1 current-text-scope-color-500 current-icon-scope-color-500 bg-current/10 text-current icon-current/80',
    'dark:': 'current-text-scope-color-400 current-icon-scope-color-400',
    'hover:': 'c8-light-hover',
    'focus-visible:': 'c8-light-hover',
    'data-[highlighted]:': 'c8-light-hover',
    'active:': 'c8-light-active',
    'data-[active]:': 'c8-light-active',
    'data-[selected=true]:': 'c8-light-hover',
    'data-[on=true]:': 'c8-light-hover',
    'aria-[selected=true]:': 'c8-light-hover',
    'aria-[pressed=true]:': 'c8-light-hover',
  },
  'c8-light-hover': {
    'not-([disabled]):': 'bg-current/20',
  },
  'c8-light-active': {
    'not-([disabled]):': 'bg-current/30',
  },
})
