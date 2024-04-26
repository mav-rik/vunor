import { TVunorUnoPresetOpts } from './types'
import { round } from './utils'

// for border-color
// :root {
//   --un-default-border-color: #e5e7eb;
// }

export const themeFactory = (opts: Required<TVunorUnoPresetOpts>) => {
  const spacing = {
    $xxs: `${round(1 / opts.spacingFactor ** 3, 3)}em`,
    $xs: `${round(1 / opts.spacingFactor ** 2, 3)}em`,
    $s: `${round(1 / opts.spacingFactor, 3)}em`,
    $m: '1em',
    $l: `${round(opts.spacingFactor, 3)}em`,
    $xl: `${round(opts.spacingFactor ** 2, 3)}em`,
    $xxl: `${round(opts.spacingFactor ** 3, 3)}em`,
  } as Record<string, string>
  const fontSize: Record<string, [string, Record<string, string>, number]> = {}
  for (const [name, val] of Object.entries(opts.typography)) {
    if (val && val.size) {
      fontSize[name] = setFont(
        val.size,
        val.weight || 400,
        val.height || 1,
        val.spacing || 0,
        val.actualHeightFactor || opts.actualFontHeightFactor,
        val.actualHeightTopBottomRatio || opts.actualFontHeightTopBottomRatio
      )
      fontSize[name + '-bold'] = setFont(
        val.size,
        val.boldWeight || 800,
        val.height || 1,
        val.spacing || 0,
        val.actualHeightFactor || opts.actualFontHeightFactor,
        val.actualHeightTopBottomRatio || opts.actualFontHeightTopBottomRatio
      )
      spacing[name] = val.size * (val.actualHeightFactor || opts.actualFontHeightFactor) + 'em'
    }
  }
  return {
    colors: { borderColor: 'blue' },
    borderColor: 'red',
    spacing,
    actualFontHeightFactor: opts.actualFontHeightFactor,
    fontSize,
    width: spacing,
    height: spacing,
    maxWidth: spacing,
    maxHeight: spacing,
    minWidth: spacing,
    minHeight: spacing,
  }
}

export type TVunorTheme = ReturnType<typeof themeFactory>

// eslint-disable-next-line max-params
function setFont(
  size: number,
  w: number,
  lh: number,
  ls: number,
  actualFontHeightFactor = 1,
  actualFontHeightTopBottomRatio = 0.5
) {
  const cSize = size * actualFontHeightFactor
  // const m = round((size * lh - cSize) / 2 / size, 4)
  const h = lh * size
  const m = (h - cSize) / size
  const mt = round(m * actualFontHeightTopBottomRatio, 4)
  const mb = round(m * (1 - actualFontHeightTopBottomRatio), 4)
  return [
    `${size}em`,
    {
      '--font-m-compensation': `${m}em`,
      'font-weight': w,
      'line-height': `${lh}em`,
      'letter-spacing': `${ls}em`,
      'margin-top': `${-mt}em`,
      'margin-bottom': `${-mb}em`,
    },
    actualFontHeightFactor,
  ] as unknown as [string, Record<string, string>, number]
}
