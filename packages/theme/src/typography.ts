/* eslint-disable max-params */
import type { TTypography, TTypographyNames } from './types'
import { round } from './utils'

function font(
  weight: number,
  boldWeight: number,
  size: number,
  height: number,
  spacing: number
): TTypography {
  return {
    weight,
    boldWeight,
    size,
    height,
    spacing,
  }
}

function k(n: number, base = 1) {
  return base * 1.618 ** n
}

export const defaultTypography: Record<TTypographyNames, TTypography> = {
  'h1': /*          */ font(400, 700, k(3.5), /*   */ k(0.5), -0.032),
  'h2': /*          */ font(400, 700, k(2.5), /*   */ k(0.5), -0.027),
  'h3': /*          */ font(400, 700, k(2), /*   */ k(0.5), -0.022),
  'h4': /*          */ font(400, 600, k(1), /*     */ k(0.5), -0.02),
  'h5': /*          */ font(400, 600, k(0.5), /*   */ k(0.5), -0.017),
  'h6': /*          */ font(600, 700, k(0.25), /*  */ k(0.5), -0.014),
  'subheading': /*  */ font(400, 600, k(-0.2), /*  */ k(0.5), -0.007),
  'body-l': /*      */ font(400, 600, k(0.5), /*  */ k(0.75), -0.014),
  'body': /*        */ font(400, 600, k(0), /*    */ k(0.75), -0.011),
  'body-s': /*      */ font(400, 600, k(-0.5), /*    */ k(1), 0),
  'callout': /*     */ font(400, 600, k(-0.25), /* */ k(0.5), -0.009),
  'label': /*       */ font(500, 700, k(-0.25), /* */ k(0.5), -0.004),
  'caption': /*     */ font(400, 600, k(-0.5), /*  */ k(0.5), -0.007),
  'overline': /*    */ font(400, 600, k(-0.5), /*  */ k(0.5), 0.0618),
}

// eslint-disable-next-line max-params
export function buildFontTheme(
  size: number,
  w: number,
  wBold: number,
  lh: number,
  ls: number,
  actualFontHeightFactor = 1,
  actualFontHeightTopBottomRatio = 0.5
) {
  const correctedSize = size * actualFontHeightFactor // actual font height
  const h = lh * size // actual line-height
  const m = (h - correctedSize) / size // the margin from real text border to line-height
  const half = correctedSize / 2 // half of actual font height
  const offt = correctedSize * actualFontHeightTopBottomRatio - half + m / 2 // offset top
  const offb = correctedSize * (1 - actualFontHeightTopBottomRatio) - half + m / 2 // offset bottom
  const mt = round(offt, 4)
  const mb = round(offb, 4)
  return {
    mt,
    mb,
    size,
    correctedSize,
    theme: [
      `${size}em`,
      {
        '--font-bold': wBold,
        '--font-size': `${size}em`,
        '--font-corrected': `${correctedSize}em`,
        '--font-bc': `${-mb}em`,
        '--font-tc': `${-mt}em`,
        'font-weight': w,
        'line-height': `${lh}em`,
        'letter-spacing': `${ls}em`,
        // margins are compensationg font-height + extra font glyphs spacing
        // 'margin-top': `${-mt}em`,
        // 'margin-bottom': `${-mb}em`,
      },
      //   actualFontHeightFactor,
    ] as unknown as [string, Record<string, string>],
  }
}
