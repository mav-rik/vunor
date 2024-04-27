import { Theme } from '@unocss/preset-mini'
import { Rule } from 'unocss'
import { TVunorTheme } from '../theme'
import { round } from '../utils'

export const spacingRules: Rule<Theme & TVunorTheme>[] = [
  [
    // special text margin (vertical) that compensates
    // the line height
    /^text-m(y|t|b)?-(.*)$/,
    (match, { theme }) => {
      const dir = match[1] as 'y' | 't' | 'b'
      const size = match[2] as keyof TVunorTheme['spacing']
      const d = dir
        ? { y: ['top', 'bottom'], t: ['top'], b: ['bottom'] }[dir]
        : ['top', 'bottom', 'left', 'right']
      const result: Record<string, string> = {}
      if (theme.spacing[size]) {
        for (const prop of d) {
          result[`margin-${prop}`] = ['left', 'right'].includes(prop)
            ? theme.spacing[size]
            : `calc(${theme.spacing[size]} + var(--font-${prop === 'top' ? 'tc' : 'bc'}))`
        }
        return result
      } else if (/^\d+(em|rem|px)?$/.test(size)) {
        let s = size as string
        if (/^[0-9\.]+$/.test(size)) {
          s = `${Number(size) * 0.25}rem`
        }
        for (const prop of d) {
          result[`margin-${prop}`] = ['left', 'right'].includes(prop)
            ? s
            : `calc(${s} + var(--font-${prop === 'top' ? 'tc' : 'bc'}))`
        }
        return result
      }
      return undefined
    },
    { layer: 'utilities' },
  ],
  [
    /^card-dense$/,
    (match, { theme }) => {
      return {
        '--card-spacing': 'var(--card-spacing-dense)',
      }
    },
    { layer: 'utilities' },
  ],
  [
    /^card-(.*)$/,
    (match, { theme }) => {
      const name = match[1]
      if (theme.fontSize[name]) {
        const props = theme.fontSize[name][1]
        return {
          '--card-spacing': `${unitBy(props['--font-corrected'], theme.cardSpacingFactor.regular)}`,
          '--card-spacing-dense': `${unitBy(
            props['--font-corrected'],
            theme.cardSpacingFactor.dense
          )}`,
          '--card-heading-size': props['--font-size'],
          '--card-heading-bold': props['--font-bold'],
          '--card-heading-corrected': props['--font-corrected'],
          '--card-heading-weight': props['font-weight'],
          '--card-heading-lh': props['line-height'],
          '--card-heading-ls': props['letter-spacing'],
          '--card-heading-bc': props['--font-bc'],
          '--card-heading-tc': props['--font-tc'],
          'padding': 'var(--card-spacing)',
        }
      }
      return undefined
    },
  ],
]

function unitBy(input: string, factor: number): string {
  const v = Number.parseFloat(input)
  const units = /(px|em|rem|%)$/.exec(input)?.[1] || ''
  return `${v * factor}${units}`
}
