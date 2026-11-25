export interface TVunorUnoPresetOpts {
  spacingFactor?: number
  actualFontHeightFactor?: number
  actualFontHeightTopBottomRatio?: number
  cardSpacingFactor?: {
    regular: number
    dense: number
  }
  // Partial: overriding one level is the documented usage, and defu merges
  // defaultTypography underneath, so the other levels need not be restated.
  typography?: Partial<Record<TTypographyNames, TTypography>>
  layers?: {
    reverseDark?: boolean
    reverseLight?: boolean
  }
  fingertip?: {
    xs?: string
    s?: string
    m?: string
    l?: string
    xl?: string
  }
  baseRadius?: string
  /**
   * Opacity of the default border colour, from `0` to `1`: the
   * `--un-border-opacity` set on `:root`, which a `border` with no colour class
   * is drawn with. `ring-current-border` and `shadow-current-border` without
   * `/N` read the same value. Default `0.25`.
   */
  borderOpacity?: number
  /**
   * Page-level element styles: the body, figcaption and h1–h6 typography rules
   * (size, weight, line-height, letter-spacing, plus a level's `font` and `css`
   * from `typography`) and scrollbar styling. Default `true`. Set `false` when
   * the app styles its own page; theme variables, shortcuts and classes are
   * unaffected.
   */
  baseStyles?: boolean
  animation?: {
    durations?: Record<string, string>
    animation?: Record<string, string>
    keyframes?: Record<string, string>
  }
}

export interface TTypography {
  size?: number // em
  weight?: number
  boldWeight?: number
  spacing?: number // em
  height?: number // em
  font?: string
  actualHeightFactor?: number
  actualHeightTopBottomRatio?: number
  css?: Record<string, string>
}

export type TTypographyNames =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subheading'
  | 'body-l'
  | 'body'
  | 'body-s'
  | 'callout'
  | 'label'
  | 'caption'
  | 'overline'

export function k(n: number, base = 1) {
  return base * 1.618 ** n
}
