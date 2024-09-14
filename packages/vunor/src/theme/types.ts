export interface TVunorUnoPresetOpts {
  spacingFactor?: number
  actualFontHeightFactor?: number
  actualFontHeightTopBottomRatio?: number
  cardSpacingFactor?: {
    regular: number
    dense: number
  }
  typography?: {
    [name in TTypographyNames]: TTypography | undefined
  }
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
