import { TTypography, TTypographyNames } from './types'

export const defaultTypography: Record<TTypographyNames, TTypography> = {
  'display-1': /*   */ font(400, 700, /**/ 4.235, 1.129, -0.022),
  'display-2': /*   */ font(400, 700, /**/ 2.618, 1.272, -0.022),
  'title-a': /*     */ font(400, 700, /**/ 2.058, 1.0, -0.022),
  'title-b': /*     */ font(400, 600, /**/ 1.618, 1.272, -0.02),
  'title-c': /*     */ font(400, 600, /**/ 1.272, 1.272, -0.017),
  'heading': /*     */ font(600, 700, /**/ 1.129, 1.272, -0.014),
  'subheading': /*  */ font(400, 600, /**/ 0.885, 1.272, -0.007),
  'body': /*        */ font(400, 600, /*    */ 1, 1.618, -0.011),
  'callout': /*     */ font(400, 600, /**/ 0.943, 1.272, -0.009),
  'label': /*       */ font(500, 700, /**/ 0.835, 1.272, -0.004),
  'caption': /*     */ font(400, 600, /**/ 0.786, 1.272, -0.007),
  'overline': /*    */ font(400, 600, /**/ 0.786, 1.272, 0.0618),
}

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
