/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable complexity */
import type { Theme } from '@unocss/preset-mini'

import type { TVunorPaletteOptions } from './palitra'
import { generatePalette } from './palitra'
import type { TTypographyNames, TVunorUnoPresetOpts } from './types'
import { buildFontTheme } from './typography'
import { round } from './utils/round'

export const themeFactory = (
  opts: Required<TVunorUnoPresetOpts> & { palette?: TVunorPaletteOptions }
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
    'fingertip': 'var(--v-fingertip)',
    'fingertip-half': 'var(--v-fingertip-half)',
    'fingertip-xs': opts.fingertip.xs,
    'fingertip-s': opts.fingertip.s,
    'fingertip-m': opts.fingertip.m,
    'fingertip-l': opts.fingertip.l,
    'fingertip-xl': opts.fingertip.xl,
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
    // radius
    'base-radius': opts.baseRadius,
  } as Record<string, string>

  const lineHeight = {
    'fingertip': 'var(--v-fingertip)',
    'fingertip-half': 'var(--v-fingertip-half)',
    'fingertip-xs': opts.fingertip.xs,
    'fingertip-s': opts.fingertip.s,
    'fingertip-m': opts.fingertip.m,
    'fingertip-l': opts.fingertip.l,
    'fingertip-xl': opts.fingertip.xl,
  }

  const borderRadius = {
    ...spacing,
    base: opts.baseRadius,
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
    paletteOpts: palette.opts,
    theme: {
      colors: palette.colors,
      surfaces: palette.surfaces,
      // borderColor: ,
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
      borderRadius,
      animation: opts.animation,
    },
  }
}

export type TVunorTheme = ReturnType<typeof themeFactory>['theme'] & Theme
