import { scFromObject } from '../../theme/utils/shortcut-obj'

export const menuShortcuts = {
  'menu-root': 'flex flex-col overflow-hidden',
  'menu-item': scFromObject({
    '': 'relative btn btn-round c8-flat justify-start gap-$m',
    'data-[highlighted]': 'c8-flat-hover',
    'data-[active=true]': 'c8-flat-selected',
    'data-[disabled]': 'pointer-events-none opacity-50',
  }),
}
