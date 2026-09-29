import { defineShortcuts } from '../utils/define-sc'
import { whenDisabled } from '../utils/disabled'

// Public surface primitive — popover/menu/listbox content chrome. Symmetric
// partner of dialog-card. Consumers add min-w-/max-w- per use.
// shadow-popup is shipped here too so popup-card has its companion utility.
export const popupCard = defineShortcuts({
  'shadow-popup': 'shadow-[0_0_10px_rgba(0,0,0,0.1),0_4px_20px_rgba(0,0,0,0.15)]',
  'popup-card': {
    '':
      'surface-0 bg-current rounded-r2 overflow-hidden shadow-popup z-[100] ' +
      'border current-border-grey-400 border-current/20',
  },
})

// Canonical "visually disabled" treatment. Auto-fires on the shared disabled
// definition (utils/disabled.ts) that also switches off the c8 hover/press washes.
// Compose on non-btn clickables, links, and list rows. <VuButton> already
// paints opacity-80 via `btn`.
export const disabledSoft = defineShortcuts({
  'disabled-soft': {
    [whenDisabled]: 'opacity-40 cursor-not-allowed',
  },
})
