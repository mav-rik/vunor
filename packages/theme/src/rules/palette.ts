/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type { Theme } from '@unocss/preset-mini'
import type { Rule } from 'unocss'

import type { TVunorTheme } from '../theme'

export const paletteRules: Array<Rule<Theme & TVunorTheme>> = [
  [
    /^scope-(.*)$/,
    (match, { theme }) => {
      const c = match[1]
      const color = theme.colors[c] as string | undefined
      if (color) {
        return {
          '--scope-color': color,
          '--scope-color-50': theme.colors[`${c}-50`] || '',
          '--scope-color-100': theme.colors[`${c}-100`] || '',
          '--scope-color-200': theme.colors[`${c}-200`] || '',
          '--scope-color-300': theme.colors[`${c}-300`] || '',
          '--scope-color-400': theme.colors[`${c}-400`] || '',
          '--scope-color-500': theme.colors[`${c}-500`] || '',
          '--scope-color-600': theme.colors[`${c}-600`] || '',
          '--scope-color-700': theme.colors[`${c}-700`] || '',
          '--scope-color-800': theme.colors[`${c}-800`] || '',
          '--scope-color-900': theme.colors[`${c}-900`] || '',
          '--scope-light-0': theme.colors[`${c}-light-0`] || '',
          '--scope-light-1': theme.colors[`${c}-light-1`] || '',
          '--scope-light-2': theme.colors[`${c}-light-2`] || '',
          '--scope-light-3': theme.colors[`${c}-light-3`] || '',
          '--scope-light-4': theme.colors[`${c}-light-4`] || '',
          '--scope-dark-0': theme.colors[`${c}-dark-0`] || '',
          '--scope-dark-1': theme.colors[`${c}-dark-1`] || '',
          '--scope-dark-2': theme.colors[`${c}-dark-2`] || '',
          '--scope-dark-3': theme.colors[`${c}-dark-3`] || '',
          '--scope-dark-4': theme.colors[`${c}-dark-4`] || '',
        }
      }
      return undefined
    },
  ],
  [
    /^(bg|text|fill|stroke|border)-scope-((?:color|dark|light)(?:-\d+)?)$/,
    (match, { theme }) => {
      const t = {
        bg: 'background-color',
        text: 'color',
        fill: 'fill',
        stroke: 'stroke',
        border: 'border-color',
      }[match[1]] as unknown as string
      const v = match[2]
      const fallback = v.startsWith('color') ? `background-${v.slice(6)}` : `background-${v}`
      return {
        [t]: `var(--scope-${v}, ${theme.colors[fallback]})`,
      }
    },
  ],
]
