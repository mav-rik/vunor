import { defineShortcuts } from '../../theme/utils/define-sc'

export const dialogShortcuts = defineShortcuts({
  'dialog-overlay': 'bg-black/55 fixed inset-0 z-30 animate-dialog-overlay-in',
  'dialog-card':
    'fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] focus:outline-none z-[100] shadow-lg overflow-hidden flex flex-col animate-dialog-in',
  'dialog-header': 'flex-shrink-0 border-b pb-$m px-$card-spacing pt-$card-spacing',
  'dialog-title': 'text-mb-0',
  'dialog-close':
    'absolute right-$card-spacing top-$card-spacing hover:bg-grey-500/10 rounded p-$xxs',
  'dialog-footer': 'flex-shrink-0 flex gap-$s justify-end border-t px-$card-spacing py-$m',
})
