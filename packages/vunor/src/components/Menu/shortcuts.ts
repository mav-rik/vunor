import { scFromObject } from '@vunor/theme/src/utils/shortcut-obj'

export const menuShortcuts = {
  'menu-root': 'flex flex-col overflow-hidden',
  'menu-item': scFromObject({
    '': 'select-none mt-$xxs flex items-center justify-start gap-$m px-$m h-fingertip rounded ui-transparent',
    'data-[highlighted]': 'ui-transparent-hover',
    'data-[active=true]': 'ui-transparent-selected',
    'data-[disabled]': 'pointer-events-none opacity-50',
  }),
}
