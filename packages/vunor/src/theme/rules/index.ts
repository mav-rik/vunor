import type { Theme } from '@unocss/preset-mini'
import type { Rule } from 'unocss'

import type { TVunorTheme } from '../theme'
import { i8Rules } from './i8-rules'
import { paletteRules } from './palette'
import { spacingRules } from './spacing'

export const rules: Array<Rule<Theme & TVunorTheme>> = [
  ...spacingRules,
  ...paletteRules,
  ...i8Rules,
]
