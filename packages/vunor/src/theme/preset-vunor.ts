import type { Theme } from '@unocss/preset-mini'
import { defu } from 'defu'
import type { Preset, PresetFactory, StaticShortcut } from 'unocss'
import { presetWind } from 'unocss'

import type { TPaletteOptions } from './palitra'
import { getPaletteShortcuts } from './palitra'
import { fontsPreflights } from './preflights'
import { rules } from './rules'
import { c8 } from './shortcuts/c8'
import { i8 } from './shortcuts/i8'
import type { TVunorTheme } from './theme'
import { themeFactory } from './theme'
import type { TVunorUnoPresetOpts } from './types'
import { defaultTypography } from './typography'
import { round } from './utils/round'

function k(n: number, base = 1) {
  return base * Math.sqrt(1.618) ** n
}

const defaultOptions: Required<TVunorUnoPresetOpts> = {
  spacingFactor: 1.618,
  actualFontHeightFactor: 1,
  actualFontHeightTopBottomRatio: 0.52,
  cardSpacingFactor: {
    regular: 1,
    dense: 0.6,
  },
  typography: defaultTypography,
  layers: {
    reverseDark: false,
    reverseLight: false,
  },
  fingertip: {
    xs: `${round(k(-2, 3), 3)}em`,
    s: `${round(k(-1, 3), 3)}em`,
    m: '3em',
    l: `3.5em`,
    xl: `4em`,
  },
  baseRadius: `${round(1 / 1.618, 3)}em`,
}

export const presetVunor: PresetFactory<
  TVunorTheme,
  TVunorUnoPresetOpts & { palette?: TPaletteOptions }
> = (_opts?: TVunorUnoPresetOpts): Preset<Theme & TVunorTheme> => {
  const opts: Required<TVunorUnoPresetOpts> = defu(_opts, defaultOptions)
  const wind = getFixedWind()
  if (!wind.preflights) {
    wind.preflights = []
  }
  wind.preflights.push(fontsPreflights)
  if (!wind.rules) {
    wind.rules = []
  }
  wind.rules.push(...rules)
  const paletteShortcuts = getPaletteShortcuts() as StaticShortcut[]
  return {
    ...wind,
    name: 'vunor',
    theme: defu(themeFactory(opts), wind.theme) as TVunorTheme,
    shortcuts: [...paletteShortcuts, c8, i8],
    layers: {
      preflights: 0,
      shortcuts: 1,
      default: 2,
      utilities: 3,
    },
  }
}

function getFixedWind() {
  const wind = presetWind() as unknown as Preset<TVunorTheme>
  wind.rules?.forEach(r => {
    if (
      r[0] instanceof RegExp &&
      (r[0].source.startsWith('^m-') ||
        r[0].source.startsWith('^ma?') ||
        r[0].source.startsWith('^p-?') ||
        r[0].source.startsWith('^pa?'))
    ) {
      r[2] = r[2] || {}
      r[2].layer = 'utilities'
    }
  })
  return wind
}
