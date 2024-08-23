/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { TPalitraColor, TPalitraOptions, TScaleOptionsInput } from '@prostojs/palitra'
import { color, palitra } from '@prostojs/palitra'
import defu from 'defu'
import type { UserShortcuts } from 'unocss'

import type { TVunorTheme } from './theme'
import { toUnoShortcut } from './utils/shortcut-obj'

export interface TVunorPaletteColor {
  /**
   * css color
   */
  color?: string

  /**
   * when true, creates a color with no suffix that matches the input color
   */
  preserveInputColor?: boolean

  /**
   * Saturation on dark/light ends
   */
  saturate?: { dark?: number; light?: number }

  /**
   * Vividness on dark/light ends
   */
  vivid?: { dark?: number; light?: number }
}

export interface TVunorPaletteOptions {
  colors?: {
    primary?: TVunorPaletteColor | string
    secondary?: TVunorPaletteColor | string
    grey?: TVunorPaletteColor | string
    neutral?: TVunorPaletteColor | string // neutral
    good?: TVunorPaletteColor | string // positive
    warn?: TVunorPaletteColor | string // warning
    error?: TVunorPaletteColor | string // negative
  }

  /**
   * The lightest value of palette
   *
   * @default 0.97
   */
  lightest?: number

  /**
   * The darkest value of palette
   *
   * @default 0.24
   */
  darkest?: number

  /**
   * layer-[0] to layer-[4] brightness depth
   *
   * @default 0.08
   */
  layersDepth?: number

  /**
   * Advanced main palette configuration
   */
  mainPalette?: TVunorMainPaletteAdvanced

  /**
   * Advanced layer palette configuration
   */
  layerPalette?: TVunorLayerPaletteAdvanced

  /**
   * Surfaces configuration
   */
  surfaces?: Record<string, TVunorSurfaceConfig>
}

/**
 * Surface configuration
 *
 * [bg, text, border, dark:bg, dark:text, dark:border]
 */
export type TVunorSurfaceConfig = [string, string, string, string, string, string]

export interface TVunorMainPaletteAdvanced {
  /**
   * when true, creates a color with no suffix that matches the input color
   *
   * @default false
   */
  preserveInputColor?: boolean

  /**
   * Luminance options
   */
  luminance?: {
    /**
     * From dark
     *
     * @default darkest + layersDepth + 0.02
     */
    dark?: number

    /**
     * To light
     *
     * @default lightest
     */
    light?: number

    /**
     * Use middle color
     *
     * Forces middle color (500) brightness from `middle` prop
     *
     * @default true
     */
    useMiddle?: boolean

    /**
     * @default 0.62
     */
    middle?: number
  }

  /**
   * Saturation on dark/light ends
   */
  saturate?: {
    /**
     * @default -0.25
     */
    dark?: number
    /**
     * @default -0.25
     */
    light?: number
  }

  /**
   * Vividness on dark/light ends
   */
  vivid?: {
    /**
     * @default 0.1
     */
    dark?: number
    /**
     * @default 0.2
     */
    light?: number
  }
}
export interface TVunorLayerPaletteAdvanced {
  /**
   * desaturate main palette before rendering layers
   *
   * when 1 - no desaturation
   *
   * when 0.5 - two times less saturation
   *
   * @default 0.2
   */
  desaturate?: number

  /**
   * Luminance options
   */
  luminance?: {
    /**
     * From dark
     *
     * @default darkest
     */
    dark?: number

    /**
     * To light
     *
     * @default darkest + layersDepth
     */
    light?: number
  }

  /**
   * Saturation on dark/light ends
   */
  saturate?: {
    /**
     * @default -0.2
     */
    dark?: number
    /**
     * @default -0.2
     */
    light?: number
  }

  /**
   * Vividness on dark/light ends
   */
  vivid?: {
    /**
     * @default 0
     */
    dark?: number
    /**
     * @default 0
     */
    light?: number
  }
}

const defaultOpts: Required<TVunorPaletteOptions & { colors: TVunorPaletteColor }> = {
  colors: {
    primary: { color: '#004eaf', preserveInputColor: true, saturate: { dark: -0.2, light: -0.2 } },
    grey: { color: '#858892', saturate: { dark: 0, light: 0 } },
    secondary: { color: '#edd812', vivid: { dark: 0.4, light: 0.4 } },
    neutral: { color: '#5da0c5', vivid: { dark: 0.1, light: 0.1 } },
    good: { color: '#7bc76a', vivid: { dark: 0.2, light: 0.5 } },
    warn: { color: '#ef9421', vivid: { dark: 0.2, light: 0.3 } },
    error: { color: '#bf5a5f' },
  },
  lightest: 0.97,
  darkest: 0.24,
  layersDepth: 0.08,
  mainPalette: {
    preserveInputColor: false,
    luminance: {
      useMiddle: true,
      middle: 0.62,
    },
    saturate: { dark: -0.25, light: -0.25 },
    vivid: { dark: 0.1, light: 0.2 },
  },
  layerPalette: {
    desaturate: 0.2,
    saturate: { dark: -0.2, light: -0.2 },
    vivid: { dark: 0, light: 0 },
  },
  surfaces: {
    //    |   bg        |    text          |   border         | dark:bg      |  dark:text       | dark:border      |
    '0': [
      'scope-light-0',
      'scope-dark-1',
      'scope-color-100',
      'scope-dark-0',
      'scope-light-1',
      'scope-color-800',
    ],
    '1': [
      'scope-light-1',
      'scope-dark-1',
      'scope-color-100',
      'scope-dark-1',
      'scope-light-1',
      'scope-color-800',
    ],
    '2': [
      'scope-light-2',
      'scope-dark-1',
      'scope-color-100',
      'scope-dark-2',
      'scope-light-1',
      'scope-color-800',
    ],
    '3': [
      'scope-light-3',
      'scope-dark-1',
      'scope-color-100',
      'scope-dark-3',
      'scope-light-1',
      'scope-color-800',
    ],
    '4': [
      'scope-light-4',
      'scope-dark-1',
      'scope-color-100',
      'scope-dark-4',
      'scope-light-1',
      'scope-color-800',
    ],
    '50': [
      'scope-color-50',
      'scope-color-700',
      'scope-color-200',
      'scope-color-900',
      'scope-color-200',
      'scope-color-500',
    ],
    '100': [
      'scope-color-100',
      'scope-color-800',
      'scope-color-200',
      'scope-color-800',
      'scope-color-200',
      'scope-color-500',
    ],
    '200': [
      'scope-color-200',
      'scope-color-800',
      'scope-color-400',
      'scope-color-700',
      'scope-color-100',
      'scope-color-400',
    ],
    '300': [
      'scope-color-300',
      'scope-color-900',
      'scope-color-500',
      'scope-color-600',
      'scope-color-100',
      'scope-color-300',
    ],
    '400': [
      'scope-color-400',
      'scope-color-50',
      'scope-color-200',
      'scope-color-500',
      'scope-color-50',
      'scope-color-200',
    ],
    '500': [
      'scope-color-500',
      'scope-color-50',
      'scope-color-200',
      'scope-color-400',
      'scope-color-50',
      'scope-color-100',
    ],
    '600': [
      'scope-color-600',
      'scope-color-100',
      'scope-color-300',
      'scope-color-300',
      'scope-color-900',
      'scope-color-700',
    ],
    '700': [
      'scope-color-700',
      'scope-color-100',
      'scope-color-300',
      'scope-color-200',
      'scope-color-800',
      'scope-color-600',
    ],
    '800': [
      'scope-color-800',
      'scope-color-200',
      'scope-color-400',
      'scope-color-100',
      'scope-color-800',
      'scope-color-500',
    ],
    '900': [
      'scope-color-900',
      'scope-color-200',
      'scope-color-400',
      'scope-color-50',
      'scope-color-700',
      'scope-color-500',
    ],
  },
}

export function generatePalette(_opts?: TVunorPaletteOptions) {
  // transform _opts.colors to TPaletteColor (in case if it is strings)
  const _colors = defaultOpts?.colors || ({} as Record<string, TVunorPaletteColor>)
  for (const key of Object.keys(_colors)) {
    const col = defaultOpts?.colors[key as 'primary']
    if (typeof col === 'string') {
      _colors[key as 'primary'] = { color: col }
    }
  }
  const opts = defu(_opts, { ...defaultOpts, colors: _colors }) as typeof defaultOpts

  // dark bg
  const bgOptions: TScaleOptionsInput & TPalitraOptions = {
    count: 5,
    preserveInputColor: false,
    luminance: {
      dark: opts.layerPalette.luminance?.dark ?? opts.darkest,
      light: opts.layerPalette.luminance?.light ?? opts.darkest + opts.layersDepth,
      useMiddle: false,
    },
    saturate: opts.layerPalette.saturate,
    vivid: opts.layerPalette.vivid,
    suffixes: ['dark-0', 'dark-1', 'dark-2', 'dark-3', 'dark-4'],
  }
  const darks = palitra(
    multiplySaturation(opts.colors, opts.layerPalette.desaturate),
    bgOptions
  ).toStrings()

  // light bg
  bgOptions.suffixes = ['light-0', 'light-1', 'light-2', 'light-3', 'light-4'].reverse()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const depth = bgOptions.luminance!.light! - bgOptions.luminance!.dark!
  bgOptions.luminance = { dark: 1 - depth, light: 1, useMiddle: false }
  const lights = palitra(
    multiplySaturation(opts.colors, opts.layerPalette.desaturate),
    bgOptions
  ).toStrings()

  // the rest of the palette
  const colors = palitra(
    {
      primary: opts.colors.primary as TPalitraColor,
      grey: opts.colors.grey as TPalitraColor,
      secondary: opts.colors.secondary as TPalitraColor,
      neutral: opts.colors.neutral as TPalitraColor,
      good: opts.colors.good as TPalitraColor,
      warn: opts.colors.warn as TPalitraColor,
      error: opts.colors.error as TPalitraColor,
    },
    {
      count: 10,
      preserveInputColor: opts.mainPalette.preserveInputColor,
      luminance: {
        dark: opts.mainPalette.luminance?.dark ?? opts.darkest + opts.layersDepth + 0.02,
        light: opts.mainPalette.luminance?.light ?? opts.lightest,
        useMiddle: opts.mainPalette.luminance?.useMiddle,
        middle: opts.mainPalette.luminance?.middle,
      },
      saturate: opts.mainPalette.saturate,
      vivid: opts.mainPalette.vivid,
    }
  ).toStrings()
  return {
    colors: {
      ...darks,
      ...lights,
      ...colors,
    },
    surfaces: opts.surfaces,
  }
}

function multiplySaturation<T extends object>(colors: T, m = 0.5): Record<keyof T, string> {
  const newObj = {} as Record<string, string>
  for (const [key, val] of Object.entries(colors)) {
    const col = typeof val === 'string' ? val : (val as unknown as TVunorPaletteColor).color
    if (col) {
      const [h, s, l] = color(col).hsl()
      newObj[key] = color(h, s * m, l, 'hsl').hex()
    }
  }
  return newObj as Record<keyof T, string>
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
        return toUnoShortcut({
          '': `current-bg-scope-light-${l} current-text-scope-dark-2 current-icon-scope-dark-2 bg-current text-current`,
          'dark:': `current-bg-scope-dark-${d} current-text-scope-light-2 current-icon-scope-light-2`,
          '[&.dark]:': `current-bg-scope-dark-${d} current-text-scope-light-2 current-icon-scope-light-2`,
        })
      },
    ],
    [
      /^surface-(.+)$/,
      ([, s], { theme }) =>
        theme.surfaces[s]
          ? toUnoShortcut({
              '': `current-bg-${theme.surfaces[s][0]} current-text-${theme.surfaces[s][1]} current-icon-${theme.surfaces[s][1]} current-border-${theme.surfaces[s][2]} bg-current text-current border-current icon-current`,
              'dark:': `current-bg-${theme.surfaces[s][3]} current-text-${theme.surfaces[s][4]} current-icon-${theme.surfaces[s][4]} current-border-${theme.surfaces[s][5]} shadow-black/30`,
              '[&.dark]:': `current-bg-${theme.surfaces[s][3]} current-text-${theme.surfaces[s][4]} current-icon-${theme.surfaces[s][4]} current-border-${theme.surfaces[s][5]} shadow-black/30`,
            })
          : '',
    ],
    {
      surface: 'surface-100',
    },
  ]
}
