import type { TPalitraOptions, TScaleOptionsInput } from '@prostojs/palitra'
import { color, palitra } from '@prostojs/palitra'
import defu from 'defu'

export function generatePalette(_opts?: TPaletteOptions) {
  const opts = defu(_opts, defaultOpts) as typeof defaultOpts

  // dark bg
  const bgOptions: TScaleOptionsInput & TPalitraOptions = {
    count: 5,
    preserveInputColor: false,
    luminance: { dark: opts.darkest, light: opts.darkest + 0.1, useMiddle: false },
    saturate: { dark: -0.1, light: -0.1 },
    vivid: { dark: 0, light: 0 },
    suffixes: ['dark-0', 'dark-1', 'dark-2', 'dark-3', 'dark-4'],
  }
  const darks = palitra(desaturate(opts.colors), bgOptions).toStrings()

  // light bg
  bgOptions.suffixes = ['light-0', 'light-1', 'light-2', 'light-3', 'light-4'].reverse()
  bgOptions.luminance = { dark: 0.9, light: 1, useMiddle: false }
  bgOptions.saturate = { dark: -0.1, light: -0.1 }
  const lights = palitra(desaturate(opts.colors), bgOptions).toStrings()

  // the rest of the palette
  const colors = palitra(
    {
      brand: {
        color: opts.colors.brand,
        preserveInputColor: true,
        saturate: { dark: 0.25, light: 0.25 },
      },
      background: { color: opts.colors.background, saturate: { dark: 0, light: 0 } },
      accent: { color: opts.colors.accent, vivid: { dark: 0.4, light: 0.4 } },
      info: { color: opts.colors.info, vivid: { dark: 0.1, light: 0.1 } },
      good: { color: opts.colors.good, vivid: { dark: 0.2, light: 0.5 } },
      warn: { color: opts.colors.warn, vivid: { dark: 0.2, light: 0.3 } },
      error: { color: opts.colors.error },
    },
    {
      count: 10,
      preserveInputColor: false,
      luminance: { dark: opts.darkest + 0.08, light: opts.lightest, useMiddle: false },
      saturate: { dark: 0.1, light: 0.1 },
      vivid: { dark: 0.1, light: 0.2 },
    }
  ).toStrings()
  return {
    ...darks,
    ...lights,
    ...colors,
  }
}

function desaturate<T extends object>(colors: T, m = 3): T {
  const newObj = {} as Record<string, string>
  for (const [key, val] of Object.entries(colors)) {
    const [h, s, l] = color(val as string).hsl()
    newObj[key] = color(h, s / m, l, 'hsl').hex()
  }
  return newObj as T
}

const defaultOpts: Required<
  TPaletteOptions & { colors: Required<Required<TPaletteOptions>['colors']> }
> = {
  colors: {
    brand: '#004eaf',
    background: '#888888',
    accent: '#edd812',
    info: '#439fd3',
    good: '#7bc76a',
    warn: '#ef9421',
    error: '#bf5a5f',
  },
  darkest: 0.18,
  lightest: 0.97,
}

export interface TPaletteOptions {
  colors?: {
    brand?: string
    background: string
    accent?: string
    info?: string // neutral
    good?: string // positive
    warn?: string // warning
    error?: string // negative
  }
  lightest?: number
  darkest?: number
}
