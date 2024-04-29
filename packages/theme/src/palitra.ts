/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { TPalitraOptions, TScaleOptionsInput } from '@prostojs/palitra'
import { color, palitra } from '@prostojs/palitra'
import defu from 'defu'
import type { Shortcut, UserShortcuts } from 'unocss'

import type { TVunorTheme } from './theme'

export function generatePalette(_opts?: TPaletteOptions) {
  const opts = defu(_opts, defaultOpts) as typeof defaultOpts

  // dark bg
  const bgOptions: TScaleOptionsInput & TPalitraOptions = {
    count: 5,
    preserveInputColor: false,
    luminance: { dark: opts.darkest, light: opts.darkest + 0.08, useMiddle: false },
    saturate: { dark: 0, light: 0 },
    vivid: { dark: 0, light: 0 },
    suffixes: ['dark-0', 'dark-1', 'dark-2', 'dark-3', 'dark-4'],
  }
  if (opts.layers.reverseDark) {
    bgOptions.suffixes?.reverse()
  }
  const darks = palitra(desaturate(opts.colors), bgOptions).toStrings()

  // light bg
  bgOptions.suffixes = ['light-0', 'light-1', 'light-2', 'light-3', 'light-4']
  if (opts.layers.reverseLight) {
    bgOptions.suffixes.reverse()
  }
  bgOptions.luminance = { dark: 0.9, light: 1, useMiddle: false }
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
      luminance: { dark: opts.darkest + 0.12, light: opts.lightest, useMiddle: false },
      saturate: { dark: 0.1, light: 0.1 },
      vivid: { dark: 0.1, light: 0.2 },
    }
  ).toStrings()
  return {
    colors: {
      ...darks,
      ...lights,
      ...colors,
    },
    surfaces: {
      //    |   bg   |    text    |   border   | dark:bg |  dark:text | dark:border |
      '0': ['light-0', 'color-800', 'color-100', 'dark-0', 'color-100', 'color-800'],
      '1': ['light-1', 'color-800', 'color-100', 'dark-1', 'color-100', 'color-800'],
      '2': ['light-2', 'color-800', 'color-100', 'dark-2', 'color-100', 'color-800'],
      '3': ['light-3', 'color-800', 'color-100', 'dark-3', 'color-100', 'color-800'],
      '4': ['light-4', 'color-800', 'color-100', 'dark-4', 'color-100', 'color-800'],
      '50': ['color-50', 'color-700', 'color-200', 'color-900', 'color-200', 'color-500'],
      '100': ['color-100', 'color-800', 'color-200', 'color-800', 'color-200', 'color-500'],
      '200': ['color-200', 'color-800', 'color-400', 'color-700', 'color-100', 'color-400'],
      '300': ['color-300', 'color-900', 'color-500', 'color-600', 'color-100', 'color-300'],
      '400': ['color-400', 'color-50', 'color-200', 'color-500', 'color-50', 'color-200'],
      '500': ['color-500', 'color-50', 'color-200', 'color-400', 'color-50', 'color-100'],
      '600': ['color-600', 'color-100', 'color-300', 'color-300', 'color-900', 'color-700'],
      '700': ['color-700', 'color-100', 'color-300', 'color-200', 'color-800', 'color-600'],
      '800': ['color-800', 'color-200', 'color-400', 'color-100', 'color-800', 'color-500'],
      '900': ['color-900', 'color-200', 'color-400', 'color-50', 'color-700', 'color-500'],
    } as Record<string, [string, string, string, string, string, string]>,
  }
}

function desaturate<T extends object>(colors: T, m = 2): T {
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
    info: '#5da0c5',
    good: '#7bc76a',
    warn: '#ef9421',
    error: '#bf5a5f',
  },
  darkest: 0.24,
  lightest: 0.97,
  layers: {
    reverseDark: false,
    reverseLight: true,
  },
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
  layers?: {
    reverseDark?: boolean
    reverseLight?: boolean
  }
}

export function getPaletteShortcuts(): UserShortcuts<TVunorTheme> {
  return [
    [
      /^layer-([0-4])$/,
      ([, l]) =>
        `bg-scope-light-${l} dark:bg-scope-dark-${l} [&.dark]:bg-scope-dark-${l} text-scope-dark-2 dark:text-scope-light-2 [&.dark]:text-scope-light-2 dark:shadow-black/30 border-scope-color-100 dark:border-scope-color-900`,
    ],
    [
      /^surface-(\d+)$/,
      ([, s], { theme }) =>
        theme.surfaces[s]
          ? `bg-scope-${theme.surfaces[s][0]} text-scope-${theme.surfaces[s][1]} border-scope-${theme.surfaces[s][2]} dark:bg-scope-${theme.surfaces[s][3]} dark:text-scope-${theme.surfaces[s][4]} dark:border-scope-${theme.surfaces[s][5]} dark:shadow-black/30`
          : '',
    ],
    {
      surface: 'surface-100',
    },
  ]
}
