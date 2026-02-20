import { unitBy } from '../utils/unit-by'

import type { TVunorTheme } from '../theme'
import type { Theme } from '@unocss/preset-mini'
import type { Rule } from 'unocss'

export const spacingRules: Array<Rule<Theme & TVunorTheme>> = [
  [
    // special text margin (vertical) that compensates
    // the line height
    /^text-m([bty])?-(.*)$/,
    (match: RegExpMatchArray, { theme }: { theme: Theme & TVunorTheme }) => {
      const dir = match[1] as 'y' | 't' | 'b' | undefined
      const size = match[2]
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
        let s = size
        if (/^[\d.]+$/.test(size)) {
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
    (_match: RegExpMatchArray, { theme: _theme }: { theme: Theme & TVunorTheme }) => ({
      '--card-spacing': 'var(--card-spacing-dense)',
    }),
    { layer: 'utilities' },
  ],
  [
    /^card-(.*)$/,
    (match: RegExpMatchArray, { theme }: { theme: Theme & TVunorTheme }) => {
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
  [
    /^fingertip-(.*)/,
    (match: RegExpMatchArray, { theme }: { theme: Theme & TVunorTheme }) => {
      const name = match[1]
      if (name.startsWith('[') && name.endsWith(']')) {
        return {
          '--v-fingertip': name.slice(1, -1),
          '--v-fingertip-half': unitBy(name.slice(1, -1), 0.5),
        }
      }
      if (['xs', 's', 'm', 'l', 'xl'].includes(name)) {
        return {
          '--v-fingertip': theme.spacing[`fingertip-${name}`],
          '--v-fingertip-half': unitBy(theme.spacing[`fingertip-${name}`], 0.5),
        }
      }
      if (theme.spacing[name]) {
        return {
          '--v-fingertip': theme.spacing[name],
          '--v-fingertip-half': unitBy(theme.spacing[name], 0.5),
        }
      }
      return undefined
    },
  ],
]
