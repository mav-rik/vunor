export interface TVunorUnoPresetOpts {
  spacingFactor?: number
  actualFontHeightFactor?: number
  actualFontHeightTopBottomRatio?: number
  typography?: Record<TTypographyNames, TTypography | undefined>
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
  | 'display-1'
  | 'display-2'
  | 'title-a'
  | 'title-b'
  | 'title-c'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'callout'
  | 'label'
  | 'caption'
  | 'overline'
