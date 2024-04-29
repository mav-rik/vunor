import type { Theme } from '@unocss/preset-mini'
import type { Rule } from 'unocss'

import type { TVunorTheme } from '../theme'
import { paletteRules } from './palette'
import { spacingRules } from './spacing'

export const rules: Array<Rule<Theme & TVunorTheme>> = [...spacingRules, ...paletteRules]
