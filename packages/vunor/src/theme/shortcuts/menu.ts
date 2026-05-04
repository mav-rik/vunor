import { defineShortcuts } from '../utils/define-sc'

// Public composition primitives for menu-shaped surfaces (e.g. reka-ui
// MenuItem, ListboxItem). <VuMenu>/<VuMenuItem> bundle these for you.
export const menu = defineShortcuts({
  'menu-root': 'flex flex-col overflow-hidden',
  'menu-item': 'justify-start c8-flat gap-$m w-full fw-400',
})
