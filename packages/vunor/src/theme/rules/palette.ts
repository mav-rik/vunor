import { color } from '@prostojs/palitra'

import type { TVunorTheme } from '../theme'
import type { Theme } from '@unocss/preset-mini'
import type { Rule } from 'unocss'

export function colorToRgbWithOpacity(c: string) {
  const [r, g, b, _a] = color(c).rgba()
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

const SCOPE_SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
const SCOPE_LAYERS = ['0', '1', '2', '3', '4']

export function getScopeCssVars(
  c: string,
  theme: Theme & TVunorTheme
): Record<string, string> | undefined {
  const col = theme.colors[c] as string | undefined
  if (!col) {return undefined}
  const vars: Record<string, string> = { '--scope-color': colorToRgbWithOpacity(col) }
  for (const shade of SCOPE_SHADES) {
    vars[`--scope-color-${shade}`] = colorToRgbWithOpacity(theme.colors[`${c}-${shade}`]) || ''
  }
  for (const layer of SCOPE_LAYERS) {
    vars[`--scope-light-${layer}`] = colorToRgbWithOpacity(theme.colors[`${c}-light-${layer}`]) || ''
    vars[`--scope-dark-${layer}`] = colorToRgbWithOpacity(theme.colors[`${c}-dark-${layer}`]) || ''
  }
  vars['--current-hl'] = colorToRgbWithOpacity(theme.colors[`${c}-500`]) || ''
  return vars
}

export const paletteRules: Array<Rule<Theme & TVunorTheme>> = [
  [
    /^current-(text|bg|icon|border|outline|caret|hl)-(.+)$/,
    (match: RegExpMatchArray, { theme }: { theme: Theme & TVunorTheme }) => {
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
          [`--current-${t}`]: colorToRgbWithOpacity(col.DEFAULT || col),
        }
      }
      return undefined
    },
  ],
  [
    /^(text|bg|icon|border|outline|caret|fill|shadow|ring)-current(-text|-bg|-icon|-border|-outline|-caret|-hl)?(\/\d{1,3})?$/,
    (match: RegExpMatchArray, { theme: _theme }: { theme: Theme & TVunorTheme }) => {
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
    (match: RegExpMatchArray, { theme }: { theme: Theme & TVunorTheme }) =>
      getScopeCssVars(match[1], theme),
  ],
  [
    /^(bg|text|fill|stroke|border|outline|icon|caret)-scope-((?:color|dark|light|text|bg|white|black|icon)(?:-\d+)?)(\/\d{1,3})?$/,
    (match: RegExpMatchArray, { theme }: { theme: Theme & TVunorTheme }) => {
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
    (match: RegExpMatchArray, { theme: _theme }: { theme: Theme & TVunorTheme }) => {
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
    (match: RegExpMatchArray, { theme }: { theme: Theme & TVunorTheme }) => {
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
