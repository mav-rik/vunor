import { scFromObject } from '@vunor/theme/src/utils/shortcut-obj'

import { buttonShortcuts } from './Button/shortcuts'
import { cardShortcuts } from './Card/shortcuts'
import { checkboxShortcuts } from './Checkbox/shortcuts'
import { comboboxShortcuts } from './Combobox/shortcuts'
import { menuShortcuts } from './Menu/shortcuts'
import { radioShortcuts } from './RadioGroup/shortcuts'
import { selectShortcuts } from './Select/shortcuts'
import { sliderShortcuts } from './Slider/shortcuts'

export const shortcuts = [
  cardShortcuts,
  menuShortcuts,
  buttonShortcuts,
  checkboxShortcuts,
  radioShortcuts,
  selectShortcuts,
  comboboxShortcuts,
  sliderShortcuts,
  {
    segmented: scFromObject({
      'first-of-type:': 'rounded-r-0!',
      'last-of-type:': 'rounded-lt-0! rounded-lb-0!',
      'not-last-of-type:not-first-of-type:': 'rounded-0!',
      'not-first-of-type:': 'border-l-0! border-l-grey-500/20',
      'data-[active=true]:': 'z-2',
    }),
  },
]
