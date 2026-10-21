import { i8Rules } from './i8-rules'
import { paletteRules } from './palette'
import { spacingRules } from './spacing'

import type { TVunorTheme } from '../theme'
import type { Rule } from 'unocss'
import type { Theme } from 'unocss/preset-mini'

export const rules: Array<Rule<Theme & TVunorTheme>> = [
  ...spacingRules,
  ...paletteRules,
  ...i8Rules,
]
