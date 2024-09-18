import { toastShortcuts } from './AppToasts/shortcuts'
import { buttonShortcuts } from './Button/shortcuts'
import { calendarShortcuts } from './Calendar/shortcuts'
import { cardShortcuts } from './Card/shortcuts'
import { checkboxShortcuts } from './Checkbox/shortcuts'
import { comboboxShortcuts } from './Combobox/shortcuts'
import { dialogShortcuts } from './Dialog/shortcuts'
import { loadingShortcuts } from './Loading/shortcuts'
import { menuShortcuts } from './Menu/shortcuts'
import { progressShortcuts } from './ProgressBar/shortcuts'
import { radioShortcuts } from './RadioGroup/shortcuts'
import { selectShortcuts } from './Select/shortcuts'
import { sliderShortcuts } from './Slider/shortcuts'
import { tabShortcuts } from './Tabs/shortcuts'

export const shortcuts = [
  cardShortcuts,
  menuShortcuts,
  buttonShortcuts,
  checkboxShortcuts,
  radioShortcuts,
  selectShortcuts,
  comboboxShortcuts,
  sliderShortcuts,
  loadingShortcuts,
  tabShortcuts,
  dialogShortcuts,
  calendarShortcuts,
  progressShortcuts,
  toastShortcuts,
  {
    'shadow-popup': 'shadow-[0_0_10px_rgba(0,0,0,0.1),0_4px_20px_rgba(0,0,0,0.15)]',
  },
]
