import { Theme } from '@unocss/preset-mini'
import { Rule } from 'unocss'
import { TVunorTheme } from '../theme'
import { round } from '../utils'

export const spacingRules: Rule<Theme & TVunorTheme>[] = [
  [
    /^p(y)?-card-(rounded-)?(.*)$/,
    (match, { theme }) => {
      const c = match[3] as keyof TVunorTheme['fontSize']
      const rounded = !!match[2]
      const y = !!match[1]
      if (theme.fontSize[c] && typeof theme.fontSize[c][0] === 'string') {
        const { padding, compensated } = calcFontCompensatedPaddingY(
          theme.fontSize[c],
          theme.actualFontHeightFactor
        )
        return {
          'padding': `${padding} ${padding} ${y ? '' : padding}`,
          'border-radius': rounded ? padding : '',
        }
      }
      return undefined
    },
  ],
  [
    /^rounded-(.*)$/,
    (match, { theme }) => {
      const c = match[1] as keyof TVunorTheme['fontSize']
      if (theme.fontSize[c] && typeof theme.fontSize[c][0] === 'string') {
        return { 'border-radius': theme.fontSize[c][0] as string }
      }
      return undefined
    },
  ],
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
            : `calc(${theme.spacing[size]} - var(--font-m-compensation))`
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
            : `calc(${s} - var(--font-m-compensation))`
        }
        return result
      }
      return undefined
    },
    { layer: 'utilities' },
  ],
]

function calcFontCompensatedPaddingY(
  font: TVunorTheme['fontSize'][keyof TVunorTheme['fontSize']],
  actualFontHeightFactor: number
): { padding: string; compensated: string } {
  // calculating card paddings
  // with correction by factor of header line-height and fontHeightCorrection
  const lhString = (font[1] as { 'line-height': string } | undefined)?.['line-height'] || '1em'
  const fontSizeString = font[0] as string
  const lhUnit = /(px|em|rem|%)$/.exec(lhString)?.[1] || ''
  const fontSizeUnit = /(px|em|rem)$/.exec(fontSizeString)?.[1] || ''

  const lh = Number.parseFloat(lhString)
  const fontSize = Number.parseFloat(fontSizeString)
  const k = Number(font[2] || actualFontHeightFactor || 1)
  const padding = fontSize * k + fontSizeUnit

  if (!Number.isNaN(lh) && !Number.isNaN(fontSize) && fontSizeUnit && lhUnit) {
    let compensated = fontSize * 0.9 + fontSizeUnit
    if (['px', 'rem'].includes(lhUnit)) {
      if (lhUnit === fontSizeUnit) {
        compensated = `${round(1.5 * fontSize - 0.5 * lh - (1 - k) * fontSize, 3)}${fontSizeUnit}`
      }
    } else {
      const lh2 = lhUnit === 'em' ? fontSize * lh : (fontSize * lh) / 100
      compensated = `${round(1.5 * fontSize - 0.5 * lh2 - (1 - k) * fontSize, 3)}${fontSizeUnit}`
    }
    return { padding, compensated }
  }
  return { padding, compensated: padding }
}
