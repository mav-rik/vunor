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
  actualFontHeightFactor: 0.84,
  actualFontHeightTopBottomRatio: 0.44,
  typography: defaultTypography,
}

export const presetVunor: PresetFactory<Theme & TVunorTheme, TVunorUnoPresetOpts> = (
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
    theme: defu(themeFactory(opts), wind.theme) as Theme & TVunorTheme,
  }
}

function getFixedWind() {
  const wind = presetWind() as unknown as Preset<Theme & TVunorTheme>
  wind.rules?.forEach(r => {
    if (r[0] instanceof RegExp) {
      if (r[0].source.startsWith('^m-')) {
        r[2] = r[2] || {}
        r[2].layer = 'utilities'
      }
    }
  })
  return wind
}
