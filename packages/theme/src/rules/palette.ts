/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { color } from '@prostojs/palitra'
import type { Theme } from '@unocss/preset-mini'
import type { Rule } from 'unocss'

import type { TVunorTheme } from '../theme'

function colorToRgbWithOpacity(c: string) {
  const [r, g, b, a] = color(c).rgba()
  return `${r} ${g} ${b}`
}

export const paletteRules: Array<Rule<Theme & TVunorTheme>> = [
  [
    /^scope-(.*)$/,
    (match, { theme }) => {
      const c = match[1]
      const col = theme.colors[c] as string | undefined
      if (col) {
        return {
          '--scope-color': colorToRgbWithOpacity(col),
          '--scope-color-50': colorToRgbWithOpacity(theme.colors[`${c}-50`]) || '',
          '--scope-color-100': colorToRgbWithOpacity(theme.colors[`${c}-100`]) || '',
          '--scope-color-200': colorToRgbWithOpacity(theme.colors[`${c}-200`]) || '',
          '--scope-color-300': colorToRgbWithOpacity(theme.colors[`${c}-300`]) || '',
          '--scope-color-400': colorToRgbWithOpacity(theme.colors[`${c}-400`]) || '',
          '--scope-color-500': colorToRgbWithOpacity(theme.colors[`${c}-500`]) || '',
          '--scope-color-600': colorToRgbWithOpacity(theme.colors[`${c}-600`]) || '',
          '--scope-color-700': colorToRgbWithOpacity(theme.colors[`${c}-700`]) || '',
          '--scope-color-800': colorToRgbWithOpacity(theme.colors[`${c}-800`]) || '',
          '--scope-color-900': colorToRgbWithOpacity(theme.colors[`${c}-900`]) || '',
          '--scope-light-0': colorToRgbWithOpacity(theme.colors[`${c}-light-0`]) || '',
          '--scope-light-1': colorToRgbWithOpacity(theme.colors[`${c}-light-1`]) || '',
          '--scope-light-2': colorToRgbWithOpacity(theme.colors[`${c}-light-2`]) || '',
          '--scope-light-3': colorToRgbWithOpacity(theme.colors[`${c}-light-3`]) || '',
          '--scope-light-4': colorToRgbWithOpacity(theme.colors[`${c}-light-4`]) || '',
          '--scope-dark-0': colorToRgbWithOpacity(theme.colors[`${c}-dark-0`]) || '',
          '--scope-dark-1': colorToRgbWithOpacity(theme.colors[`${c}-dark-1`]) || '',
          '--scope-dark-2': colorToRgbWithOpacity(theme.colors[`${c}-dark-2`]) || '',
          '--scope-dark-3': colorToRgbWithOpacity(theme.colors[`${c}-dark-3`]) || '',
          '--scope-dark-4': colorToRgbWithOpacity(theme.colors[`${c}-dark-4`]) || '',
        }
      }
      return undefined
    },
  ],
  [
    /^(bg|text|fill|stroke|border)-scope-((?:color|dark|light)(?:-\d+)?)(\/\d{1,2})?$/,
    (match, { theme }) => {
      const t = {
        bg: 'background-color',
        text: 'color',
        fill: 'fill',
        stroke: 'stroke',
        border: 'border-color',
      }[match[1]] as unknown as string
      const opacityVar = {
        bg: '--un-bg-opacity',
        text: '--un-text-opacity',
        fill: '--un-text-opacity',
        stroke: '--un-text-opacity',
        border: '--un-border-opacity',
      }[match[1]] as unknown as string
      const v = match[2]
      const o = match[3]
      const opacity = o ? Number(o.slice(1)) / 100 : 1
      const fallback = v.startsWith('color') ? `background-${v.slice(6)}` : `background-${v}`
      const opacityVal = opacity === 1 ? `var(${opacityVar})` : opacity
      return {
        [opacityVar]: opacity,
        [t]: `rgb(var(--scope-${v}, ${theme.colors[fallback]}) / ${opacityVal})`,
      }
    },
  ],
]
