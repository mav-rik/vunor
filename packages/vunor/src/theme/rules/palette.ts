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

// Slots tracked in --current-{slot} CSS vars. Ordered longest-first so regex
// alternation picks the most specific match (e.g. text-muted before text).
// Both rules below derive their accepted token set from this list — adding a
// new slot only needs an edit here.
const CURRENT_SLOTS = [
  'text-muted',
  'icon-muted',
  'text-hover',
  'bg-hover',
  'border-hover',
  'text',
  'bg',
  'icon',
  'border',
  'outline',
  'caret',
  'hl',
] as const
type TCurrentSlot = (typeof CURRENT_SLOTS)[number]
const slotAlt = CURRENT_SLOTS.join('|')
// Rule 2 also accepts `-muted`/`-hover` shorthands that resolve against the
// paint target (e.g. `text-current-muted` → -text-muted).
const sourceAlt = [...CURRENT_SLOTS, 'muted', 'hover'].map(s => `-${s}`).join('|')
const currentSlotRe = new RegExp(`^current-(${slotAlt})-(.+)$`)
const currentPaintRe = new RegExp(
  `^(text|bg|icon|border|outline|caret|fill|shadow|ring)-current(${sourceAlt})?(\\/\\d{1,3})?$`
)

export function getScopeCssVars(
  c: string,
  theme: Theme & TVunorTheme
): Record<string, string> | undefined {
  const col = theme.colors[c] as string | undefined
  if (!col) {
    return undefined
  }
  const vars: Record<string, string> = { '--scope-color': colorToRgbWithOpacity(col) }
  for (const shade of SCOPE_SHADES) {
    vars[`--scope-color-${shade}`] = colorToRgbWithOpacity(theme.colors[`${c}-${shade}`]) || ''
  }
  for (const layer of SCOPE_LAYERS) {
    vars[`--scope-light-${layer}`] =
      colorToRgbWithOpacity(theme.colors[`${c}-light-${layer}`]) || ''
    vars[`--scope-dark-${layer}`] = colorToRgbWithOpacity(theme.colors[`${c}-dark-${layer}`]) || ''
  }
  vars['--current-hl'] = colorToRgbWithOpacity(theme.colors[`${c}-500`]) || ''
  // Tone-axis fallbacks: layer-X / surface-X override these per-layer; values
  // here are the "no scope chosen" baseline used by preflight neutral.
  const greyMuted = colorToRgbWithOpacity(theme.colors[`grey-500`]) || ''
  vars['--current-text-muted'] = greyMuted
  vars['--current-icon-muted'] = greyMuted
  vars['--current-text-hover'] = colorToRgbWithOpacity(theme.colors[`${c}-dark-0`]) || ''
  vars['--current-bg-hover'] = colorToRgbWithOpacity(theme.colors[`${c}-light-1`]) || ''
  vars['--current-border-hover'] = colorToRgbWithOpacity(theme.colors[`${c}-light-3`]) || ''
  return vars
}

export const paletteRules: Array<Rule<Theme & TVunorTheme>> = [
  [
    currentSlotRe,
    (match: RegExpMatchArray, { theme }: { theme: Theme & TVunorTheme }) => {
      const t = match[1] as TCurrentSlot
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
      const themeCol = theme.colors[c] as string | { DEFAULT?: string } | undefined
      const colStr = typeof themeCol === 'string' ? themeCol : themeCol?.DEFAULT
      if (!colStr) {
        return undefined
      }
      try {
        return {
          [`--current-${t}`]: colorToRgbWithOpacity(colStr),
        }
      } catch {
        return undefined
      }
    },
  ],
  [
    currentPaintRe,
    (match: RegExpMatchArray, { theme: _theme }: { theme: Theme & TVunorTheme }) => {
      const target = match[1] as TCssColorTarget
      let source = match[2] || `-${target}`
      // `-muted` / `-hover` (no second segment) → resolve against own target
      if (source === '-muted' || source === '-hover') {
        source = `-${target}${source}`
      }
      const opacityVar = getOpacityVar(target)
      const cssVar = getCssTarget(target)
      const o = match[3]
      const opacity = o ? Number(o.slice(1)) / 100 : 1
      const opacityVal = opacity === 1 ? `var(${opacityVar})` : opacity
      if (target === 'icon') {
        // icons are painted via --current-icon — for -hl/-muted/-hover slots,
        // re-point --current-icon at the requested slot so `icon-current/N`
        // (the actual paint utility) reads from it.
        const indirect = ['-hl', '-icon-muted', '-icon-hover'].includes(source)
        return {
          [opacityVar]: opacity,
          '--current-icon': indirect ? `var(--current${source})` : undefined,
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
