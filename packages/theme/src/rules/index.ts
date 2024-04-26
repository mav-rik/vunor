import { Theme } from '@unocss/preset-mini'
import { Rule } from 'unocss'
import { TVunorTheme } from '../theme'
import { spacingRules } from './spacing'

export const rules: Rule<Theme & TVunorTheme>[] = [...spacingRules]
