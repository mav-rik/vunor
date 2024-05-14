/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { TPalitraOptions, TScaleOptionsInput } from '@prostojs/palitra'
import { color, palitra } from '@prostojs/palitra'
import defu from 'defu'
import type { Shortcut, UserShortcuts } from 'unocss'

import type { TVunorTheme } from './theme'
import { scFromObject } from './utils/shortcut-obj'

const layerDepth = 0.08

export function generatePalette(_opts?: TPaletteOptions) {
  const opts = defu(_opts, defaultOpts) as typeof defaultOpts

  // dark bg
  const bgOptions: TScaleOptionsInput & TPalitraOptions = {
    count: 5,
    preserveInputColor: false,
    luminance: { dark: opts.darkest, light: opts.darkest + layerDepth, useMiddle: false },
    saturate: { dark: 0, light: 0 },
    vivid: { dark: 0, light: 0 },
    suffixes: ['dark-0', 'dark-1', 'dark-2', 'dark-3', 'dark-4'],
  }
  const darks = palitra(desaturate(opts.colors), bgOptions).toStrings()

  // light bg
  bgOptions.suffixes = ['light-0', 'light-1', 'light-2', 'light-3', 'light-4'].reverse()
  bgOptions.luminance = { dark: 1 - layerDepth, light: 1, useMiddle: false }
  const lights = palitra(desaturate(opts.colors), bgOptions).toStrings()

  // the rest of the palette
  const colors = palitra(
    {
      primary: {
        color: opts.colors.primary,
        preserveInputColor: true,
        saturate: { dark: 0.25, light: 0.25 },
      },
      grey: { color: opts.colors.grey, saturate: { dark: 0, light: 0 } },
      secondary: { color: opts.colors.secondary, vivid: { dark: 0.4, light: 0.4 } },
      neutral: { color: opts.colors.neutral, vivid: { dark: 0.1, light: 0.1 } },
      good: { color: opts.colors.good, vivid: { dark: 0.2, light: 0.5 } },
      warn: { color: opts.colors.warn, vivid: { dark: 0.2, light: 0.3 } },
      error: { color: opts.colors.error },
    },
    {
      count: 10,
      preserveInputColor: false,
      luminance: {
        dark: opts.darkest + layerDepth + 0.02,
        light: opts.lightest,
        useMiddle: true,
        middle: 0.62,
      },
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
      '0': ['light-0', 'dark-1', 'color-100', 'dark-0', 'light-1', 'color-800'],
      '1': ['light-1', 'dark-1', 'color-100', 'dark-1', 'light-1', 'color-800'],
      '2': ['light-2', 'dark-1', 'color-100', 'dark-2', 'light-1', 'color-800'],
      '3': ['light-3', 'dark-1', 'color-100', 'dark-3', 'light-1', 'color-800'],
      '4': ['light-4', 'dark-1', 'color-100', 'dark-4', 'light-1', 'color-800'],
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
    primary: '#004eaf',
    grey: '#858892',
    secondary: '#edd812',
    neutral: '#5da0c5',
    good: '#7bc76a',
    warn: '#ef9421',
    error: '#bf5a5f',
  },
  darkest: 0.24,
  lightest: 0.97,
}

export interface TPaletteOptions {
  colors?: {
    primary?: string
    secondary?: string
    grey: string
    neutral?: string // neutral
    good?: string // positive
    warn?: string // warning
    error?: string // negative
  }
  lightest?: number
  darkest?: number
}

export function getPaletteShortcuts(): UserShortcuts<TVunorTheme> {
  return [
    [
      /^layer-([0-4])$/,
      ([, a], { theme }) => {
        let d = Number(a)
        let l = Number(a)
        if (theme.reverseDarkLayers) {
          d = 4 - Number(a)
        }
        if (theme.reverseLightLayers) {
          l = 4 - Number(a)
        }
        return scFromObject({
          '': `current-bg-scope-light-${l} current-text-scope-dark-2 current-icon-scope-dark-2 bg-current text-current`,
          'dark:': `current-bg-scope-dark-${d} current-text-scope-light-2 current-icon-scope-light-2`,
          '[&.dark]:': `current-bg-scope-dark-${d} current-text-scope-light-2 current-icon-scope-light-2`,
        })
      },
    ],
    [
      /^surface-(\d+)$/,
      ([, s], { theme }) =>
        theme.surfaces[s]
          ? scFromObject({
              '': `current-bg-scope-${theme.surfaces[s][0]} current-text-scope-${theme.surfaces[s][1]} current-icon-scope-${theme.surfaces[s][1]} current-border-scope-${theme.surfaces[s][2]} bg-current text-current border-current icon-current`,
              'dark:': `current-bg-scope-${theme.surfaces[s][3]} current-text-scope-${theme.surfaces[s][4]} current-icon-scope-${theme.surfaces[s][4]} current-border-scope-${theme.surfaces[s][5]} shadow-black/30`,
              '[&.dark]:': `current-bg-scope-${theme.surfaces[s][3]} current-text-scope-${theme.surfaces[s][4]} current-icon-scope-${theme.surfaces[s][4]} current-border-scope-${theme.surfaces[s][5]} shadow-black/30`,
            })
          : '',
    ],
    {
      surface: 'surface-100',
    },
  ]
}
