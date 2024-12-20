/* eslint-disable sonarjs/no-duplicate-string */
import { defineShortcuts } from '../utils/define-sc'

// c8 - clickable
export const c8 = defineShortcuts({
  // FILLED
  'c8-filled': {
    '': 'current-bg-scope-color-500 rounded-base current-text-white current-icon-white icon-current/100 bg-current  text-current',
    'hover:': 'c8-filled-hover',
    'focus-visible:': 'c8-filled-hover',
    'data-[highlighted]:': 'c8-filled-hover',
    'active:': 'c8-filled-active',
    'data-[active]:': 'c8-filled-active',
  },
  'c8-filled-hover': {
    'not-([disabled]):': 'current-bg-scope-color-400',
    'dark:not-([disabled]):': 'current-bg-scope-color-600',
  },
  'c8-filled-active': {
    'not-([disabled]):': 'current-bg-scope-color-600',
    'dark:not-([disabled]):': 'current-bg-scope-color-400',
  },

  // FLAT (Transparent)
  'c8-flat': {
    '': 'current-bg-scope-color-500 rounded-base current-text-black current-icon-black bg-current/0 text-current/80 icon-current/50',
    'dark:': 'current-text-white current-icon-white',
    'hover:': 'c8-flat-hover',
    'focus-visible:': 'c8-flat-hover',
    'data-[highlighted]:': 'c8-flat-hover',
    // 'active:': 'c8-flat-active',
    // 'data-[active]:': 'c8-flat-active', // messes up with tabs
    'data-[selected=true]:': 'c8-flat-selected',
    'aria-[selected=true]:': 'c8-flat-selected',
    'aria-[pressed=true]:': 'c8-flat-selected',
  },
  'c8-flat-hover': {
    'not-([disabled]):': 'bg-current/05',
  },
  // 'c8-flat-active': {
  //   'not-([disabled]):': 'bg-current/10', // messes up with tabs
  // },
  'c8-flat-selected': {
    '': 'c8-flat-hover current-text-scope-color-500 text-current current-icon-scope-color-500 icon-current/100',
    'dark:': 'current-text-scope-color-400 current-icon-scope-color-400',
  },

  // OUTLINED (Bordered)
  'c8-outlined': {
    '': 'c8-flat border-scope-color-500 rounded-base border current-text-scope-color-500 current-icon-scope-color-500 icon-current/100',
    'dark:': 'current-text-scope-color-400 current-icon-scope-color-400',
    'hover:': 'c8-outlined-hover',
    'focus-visible:': 'c8-outlined-hover',
    'data-[highlighted]:': 'c8-outlined-hover',
    'active:': 'c8-outlined-active',
    'data-[active]:': 'c8-outlined-active',
  },
  'c8-outlined-hover': 'c8-flat-hover',
  'c8-outlined-active': 'c8-flat-active',

  // LIGHT (Filled/Transparent)
  'c8-light': {
    '': 'current-bg-scope-color-500 rounded-base current-text-scope-color-500 current-icon-scope-color-500 bg-current/10 text-current icon-current/80',
    'dark:': 'current-text-scope-color-400 current-icon-scope-color-400',
    'hover:': 'c8-light-hover',
    'focus-visible:': 'c8-light-hover',
    'data-[highlighted]:': 'c8-light-hover',
    'active:': 'c8-light-active',
    'data-[active]:': 'c8-light-active',
    'data-[selected=true]:': 'c8-light-hover',
    'aria-[selected=true]:': 'c8-light-hover',
    'aria-[pressed=true]:': 'c8-light-hover',
  },
  'c8-light-hover': {
    'not-([disabled]):': 'bg-current/15',
  },
  'c8-light-active': {
    'not-([disabled]):': 'bg-current/20',
  },
})
