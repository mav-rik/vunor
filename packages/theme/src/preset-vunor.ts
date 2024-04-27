import type { PresetFactory, Preset } from 'unocss'
import { presetWind } from 'unocss'
import type { Theme } from '@unocss/preset-mini'
import { TVunorTheme, themeFactory } from './theme'
import { defu } from 'defu'
import { TVunorUnoPresetOpts } from './types'
import { fontsPreflights } from './preflights'
import { rules } from './rules'
import { defaultTypography } from './typography'

const defaultOptions: Required<TVunorUnoPresetOpts> = {
  spacingFactor: 1.618,
  actualFontHeightFactor: 1,
  actualFontHeightTopBottomRatio: 0.52,
  cardSpacingFactor: {
    regular: 1,
    dense: 0.6,
  },
  typography: defaultTypography,
}

export const presetVunor: PresetFactory<TVunorTheme, TVunorUnoPresetOpts> = (
  _opts?: TVunorUnoPresetOpts
): Preset<Theme & TVunorTheme> => {
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
  return {
    ...wind,
    name: 'vunor',
    theme: defu(themeFactory(opts), wind.theme) as TVunorTheme,
  }
}

function getFixedWind() {
  const wind = presetWind() as unknown as Preset<TVunorTheme>
  wind.rules?.forEach(r => {
    if (r[0] instanceof RegExp) {
      if (
        r[0].source.startsWith('^m-') ||
        r[0].source.startsWith('^ma?') ||
        r[0].source.startsWith('^p-?') ||
        r[0].source.startsWith('^pa?')
      ) {
        r[2] = r[2] || {}
        r[2].layer = 'utilities'
      }
    }
  })
  return wind
}
