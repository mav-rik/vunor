/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { color } from '@prostojs/palitra'
import type { Theme } from '@unocss/preset-mini'
import type { Rule } from 'unocss'

import type { TVunorTheme } from '../theme'

export function colorToRgbWithOpacity(c: string) {
  const [r, g, b, a] = color(c).rgba()
  return `${r} ${g} ${b}`
}

type TCssColorTarget = 'bg' | 'text' | 'fill' | 'stroke' | 'icon' | 'border' | 'shadow' | 'ring'
function getOpacityVar(key: TCssColorTarget) {
  return {
    bg: '--un-bg-opacity',
    text: '--un-text-opacity',
    fill: '--un-text-opacity',
    stroke: '--un-text-opacity',
    icon: '--un-icon-opacity',
    border: '--un-border-opacity',
    outline: '--un-outline-opacity',
    caret: '--un-caret-opacity',
    shadow: '--un-shadow-opacity',
    ring: '--un-ring-opacity',
  }[key]
}

function getCssTarget(key: TCssColorTarget) {
  return {
    bg: 'background-color',
    text: 'color',
    fill: 'fill',
    stroke: 'stroke',
    icon: 'color',
    border: 'border-color',
    outline: 'outline-color',
    caret: 'caret-color',
    shadow: '--un-shadow-color',
    ring: '--un-ring-color',
  }[key]
}

export const paletteRules: Array<Rule<Theme & TVunorTheme>> = [
  [
    /^current-(text|bg|icon|border|outline|caret|hl)-(.+)$/,
    (match, { theme }) => {
      const t = match[1] as 'text' | 'bg' | 'icon'
      const c = match[2]
      if (c.startsWith('scope-')) {
        return {
          [`--current-${t}`]: `var(--${c})`,
        }
      }
      if (c === 'hl') {
        return {
          [`--current-${t}`]: `var(--current-hl)`,
        }
      }
      const col = (theme.colors[c] as string | { DEFAULT?: string } | undefined) || c
      if (col) {
        return {
          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          [`--current-${t}`]: colorToRgbWithOpacity(col.DEFAULT || col),
        }
      }
      return undefined
    },
  ],
  [
    /^(text|bg|icon|border|outline|caret|fill|shadow|ring)-current(-text|-bg|-icon|-border|-outline|-caret|-hl)?(\/\d{1,3})?$/,
    (match, { theme }) => {
      const target = match[1] as TCssColorTarget
      const source = match[2] || `-${target}`
      const opacityVar = getOpacityVar(target)
      const cssVar = getCssTarget(target)
      const o = match[3]
      const opacity = o ? Number(o.slice(1)) / 100 : 1
      const opacityVal = opacity === 1 ? `var(${opacityVar})` : opacity
      if (target === 'icon') {
        return {
          [opacityVar]: opacity,
          '--current-icon': source === '-hl' ? `var(--current${source})` : undefined,
        }
      }
      if (['shadow', 'ring'].includes(target) && source === '-border') {
        return {
          [opacityVar]: opacity === 1 ? `var(--un-border-opacity)` : opacity,
          [`--un-${target}-color`]: `rgb(var(--current-border) / ${opacityVal})`,
        }
      }
      return {
        [opacityVar]: opacity,
        [cssVar]: `rgb(var(--current${source}) / ${opacityVal})`,
      }
    },
  ],
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
          '--current-hl': colorToRgbWithOpacity(theme.colors[`${c}-500`]) || '',
        }
      }
      return undefined
    },
  ],
  [
    /^(bg|text|fill|stroke|border|outline|icon|caret)-scope-((?:color|dark|light|text|bg|white|black|icon)(?:-\d+)?)(\/\d{1,3})?$/,
    (match, { theme }) => {
      const cssVar = getCssTarget(match[1] as TCssColorTarget)
      const opacityVar = getOpacityVar(match[1] as TCssColorTarget)
      const source = match[2]
      const o = match[3]
      const opacity = o ? Number(o.slice(1)) / 100 : 1
      const fallback = source.startsWith('color') ? `grey-${source.slice(6)}` : `grey-${source}`
      const opacityVal = opacity === 1 ? `var(${opacityVar})` : opacity
      return {
        [opacityVar]: opacity,
        [cssVar]: `rgb(var(--scope-${source}, ${theme.colors[fallback] || ''}) / ${opacityVal})`,
      }
    },
  ],
  [
    /^icon-opacity-(\d{1,3})$/,
    (match, { theme }) => {
      const o = match[1]
      return {
        '--un-icon-opacity': Number(o) / 100,
      }
    },
  ],
  [
    /^icon-color$/,
    () => ({
      color: `rgb(var(--current-icon) / var(--un-icon-opacity, 1))`,
    }),
  ],
  [
    /^icon-size-(.*)$/,
    (match, { theme }) => {
      const name = match[1]
      if (name.startsWith('[') && name.endsWith(']')) {
        return {
          '--icon-size': name.slice(1, -1),
        }
      }
      if (theme.spacing[name]) {
        return {
          '--icon-size': theme.spacing[name],
        }
      }
      return undefined
    },
  ],
  [
    /^icon-size$/,
    () => ({
      width: `var(--icon-size, 1em)`,
      height: `var(--icon-size, 1em)`,
    }),
  ],
]
