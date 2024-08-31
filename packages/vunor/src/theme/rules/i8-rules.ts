/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type { Theme } from '@unocss/preset-mini'
import type { Rule } from 'unocss'

import type { TVunorTheme } from '../theme'
import { colorToRgbWithOpacity } from './palette'

export const i8Rules: Array<Rule<Theme & TVunorTheme>> = [
  [
    /^i8-(border|outline|bg)-(.+)$/,
    (match, { theme }) => {
      const target = match[1]
      const value = match[2]
      if (value === 'none') {
        return {
          [`--i8-${target}-width`]: '0',
        }
      }
      if (value === 'transparent') {
        return {
          [`--i8-${target}-color`]: '0',
        }
      }
      const col = theme.colors[value] as { DEFAULT?: string } | undefined
      if (col) {
        return {
          [`--i8-${target}-color`]: colorToRgbWithOpacity(String(col.DEFAULT || col)),
        }
      }
      const width = theme.spacing[value]
      if (width) {
        return {
          [`--i8-${target}-width`]: width,
        }
      }
      if (value.endsWith('px') || value.endsWith('em') || value.endsWith('rem')) {
        return {
          [`--i8-${target}-width`]: value,
        }
      }
      if (value.startsWith('[') && value.endsWith(']')) {
        const v = value.slice(1, -1)
        if (v.endsWith('px') || v.endsWith('em') || v.endsWith('rem')) {
          return {
            [`--i8-${target}-width`]: v,
          }
        }
        return {
          [`--i8-${target}-color`]: v,
        }
      }
      return undefined
    },
  ],
  [
    /^i8-(border|outline|bg)-opacity-(\d{1,3})$/,
    (match, { theme }) => {
      const target = match[1]
      const value = match[2]
      return {
        [`--i8-${target}-opacity`]: Number(value) / 100,
      }
    },
  ],
  [
    /^i8-apply-(border|outline|bg)$/,
    (match, { theme }) => {
      const target = match[1] as 'border' | 'outline' | 'bg'
      const prop = {
        border: 'border-color',
        outline: 'outline-color',
        bg: 'background-color',
      }[target]
      const variable = {
        border: '--i8-border-color, var(--current-border)',
        outline: '--i8-outline-color, var(--current-outline)',
        bg: '--i8-bg-color, var(--current-bg)',
      }[target]
      const op = {
        border: `--i8-border-opacity, 0.2`,
        outline: `--i8-outline-opacity, 0.5`,
        bg: '--i8-bg-opacity, 1',
      }[target]

      return target === 'bg'
        ? {
            [prop]: `rgb(var(${variable}) / var(${op}))`,
          }
        : {
            [prop]: `rgb(var(${variable}) / var(${op}))`,
            [`${target}-width`]: `var(--i8-${target}-width, ${target === 'border' ? 1 : 2}px)`,
          }
    },
  ],
]
