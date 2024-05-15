/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable complexity */
import type { Theme } from '@unocss/preset-mini'

import type { TPaletteOptions } from './palitra'
import { generatePalette } from './palitra'
import type { TTypographyNames, TVunorUnoPresetOpts } from './types'
import { buildFontTheme } from './typography'
import { round } from './utils/round'
import { unitBy } from './utils/unit-by'

export const themeFactory = (
  opts: Required<TVunorUnoPresetOpts> & { palette?: TPaletteOptions }
) => {
  /**
   * Spacing
   */
  const spacing = {
    // canonical
    '$xxs': `${round(1 / opts.spacingFactor ** 3, 3)}em`,
    '$xs': `${round(1 / opts.spacingFactor ** 2, 3)}em`,
    '$s': `${round(1 / opts.spacingFactor, 3)}em`,
    '$m': '1em',
    '$l': `${round(opts.spacingFactor, 3)}em`,
    '$xl': `${round(opts.spacingFactor ** 2, 3)}em`,
    '$xxl': `${round(opts.spacingFactor ** 3, 3)}em`,
    'fingertip': opts.fingertip,
    'half-fingertip': unitBy(opts.fingertip, 0.5),
    'quart-fingertip': unitBy(opts.fingertip, 0.25),
    // font-based
    '$font-tc': 'var(--font-bc)',
    '$font-bc': 'var(--font-tc)',
    '$font-size': 'var(--font-size)',
    '$font-corrected': 'var(--font-corrected)',
    // cards
    '$card-spacing': 'var(--card-spacing)',
    '$card-spacing-dense': 'var(--card-spacing-dense)',
    '$card-heading-size': 'var(--card-heading-size)',
    '$card-heading-corrected': 'var(--card-heading-corrected)',
  } as Record<string, string>

  const lineHeight = {
    'fingertip': opts.fingertip,
    'half-fingertip': unitBy(opts.fingertip, 0.5),
    'quart-fingertip': unitBy(opts.fingertip, 0.25),
  }

  /**
   * Typography
   */
  const fontWeight = {
    $bold: 'var(--font-bold)',
  } as Record<string, string>

  const fontSize: Record<string, [string, Record<string, string>]> = {
    'card-header': [
      'var(--card-heading-size)',
      {
        '--font-bold': 'var(--card-heading-bold)',
        '--font-size': 'var(--card-heading-size)',
        '--font-corrected': 'var(--card-heading-corrected)',
        '--font-bc': 'var(--card-heading-bc)',
        '--font-tc': 'var(--card-heading-tc)',
        'font-weight': 'var(--card-heading-weight)',
        'line-height': 'var(--card-heading-lh)',
        'letter-spacing': 'var(--card-heading-ls)',
      },
    ],
  }
  for (const [name, val] of Object.entries(opts.typography)) {
    if (val?.size) {
      const ft = buildFontTheme(
        val.size || 1,
        val.weight || 400,
        val.boldWeight || 700,
        val.height || 1,
        val.spacing || 0,
        val.actualHeightFactor || opts.actualFontHeightFactor,
        val.actualHeightTopBottomRatio || opts.actualFontHeightTopBottomRatio
      )
      fontSize[name] = ft.theme
      spacing[name] = `${ft.size}em`
    }
  }

  const palette = generatePalette(opts.palette)
  /**
   * Putting all together
   */
  return {
    colors: palette.colors,
    surfaces: palette.surfaces,
    borderColor: 'red',
    reverseLightLayers: opts.layers.reverseLight,
    reverseDarkLayers: opts.layers.reverseDark,
    lineHeight,
    spacing,
    fontWeight,
    actualFontHeightFactor: opts.actualFontHeightFactor,
    cardSpacingFactor: opts.cardSpacingFactor,
    fontSize: fontSize as Record<string, [TTypographyNames, Record<string, string>]>,
    width: spacing,
    height: spacing,
    maxWidth: spacing,
    maxHeight: spacing,
    minWidth: spacing,
    minHeight: spacing,
    borderRadius: spacing,
    animation: {
      durations: {
        'slide-down-and-fade': '100ms',
        'slide-left-and-fade': '100ms',
        'slide-up-and-fade': '100ms',
        'slide-right-and-fade': '100ms',
        'zoom-fade-in': '100ms',
      },
      keyframes: {
        'slide-down-and-fade': `{
          from { opacity: 0; transform: translateY(-6px) }
          to { opacity: 1; transform: translateY(0) }
        }`,
        'slide-left-and-fade': `{
          from { opacity: 0; transform: translateX(6px) }
          to { opacity: 1; transform: translateX(0) }
        }`,
        'slide-up-and-fade': `{
          from { opacity: 0; transform: translateY(6px) }
          to { opacity: 1; transform: translateY(0) }
        }`,
        'slide-right-and-fade': `{
          from { opacity: 0; transform: translateX(-6px) }
          to { opacity: 1; transform: translateX(0) }
        }`,
        'zoom-fade-in': `{
          from { opacity: 0; transform: scale(1.02) }
          to { opacity: 1; transform: scale(1) }
        }`,
      },
    },

    // animation: {
    //   slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
    //   slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
    //   slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
    //   slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
    // },
  }
}

export type TVunorTheme = ReturnType<typeof themeFactory> & Theme
