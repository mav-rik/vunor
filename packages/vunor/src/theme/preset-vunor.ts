import type { Theme } from '@unocss/preset-mini'
import { defu } from 'defu'
import type { Preset, PresetFactory, StaticShortcut } from 'unocss'
import { presetWind } from 'unocss'

import type { TVunorPaletteOptions } from './palitra'
import { getPaletteShortcuts } from './palitra'
import { fontsPreflights } from './preflights'
import { rules } from './rules'
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
  animation: {
    durations: {
      'slide-down-and-fade': '.15s',
      'slide-left-and-fade': '.15s',
      'slide-up-and-fade': '.15s',
      'slide-right-and-fade': '.15s',
      'dialog-overlay-in': '.15s',
      'dialog-in': '.15s',
      'dialog-overlay-out': '.15s',
      'dialog-out': '.15s',
      'easy-zoom-in': '.15s',
      'blinking': '1s',
      'progress-bar': '4s',
      'hide': '0.1s',
      'slide-in': '0.15s',
      'swipe-out': '0.15s',
    },
    keyframes: {
      // dialog start
      'dialog-overlay-in': `{from {opacity:0;}to{opacity: 1;}}`,
      'dialog-overlay-out': `{from {opacity: 1;}to{opacity:0;}}`,
      'dialog-in': `{from {opacity: 0;transform: translateX(-50%) translateY(-47%) scale(0.9);}to{opacity:1;transform:translateX(-50%) translateY(-50%) scale(1);}}`,
      'dialog-out': `{from {opacity:1;transform:translateX(-50%) translateY(-50%) scale(1);} to {opacity: 0;transform: translateX(-50%) translateY(-47%) scale(0.9);}}`,
      // dialog end
      'progress-bar': `{
        0% {background-position: -100% 0;}
        50% {background-position: 200% 0;}
        100% {background-position: 200% 0;}
      }`,
      // toasts
      'hide': `{from { opacity: 1 } to { opacity: 0 }}`,
      'slide-in': `{
        from { transform: translateX(var(--toast-out-x)) }
        to { transform: translateX(0) }
      }`,
      'swipe-out': `{
        from { transform: translateX(var(--radix-toast-swipe-end-x)) }
        to { transform: translateX(var(--toast-out-x)) }
      }`,
      //
      'easy-zoom-in': `{from {opacity: 0;transform: scale(0.8);}to{opacity:1;transform: scale(1);}}`,
      // blinking used in Date Input dd.mm.yyyy
      'blinking': `{
        0% { text-decoration: underline; }
        100% { text-decoration: none; }
      }`,
      // loading indicator
      'loading-dashoffset': `{
        from {
          stroke-dashoffset: 0;
        }
        to {
          stroke-dashoffset: -76;
        }
      }`,
      // checkbox appear animation
      'cb-appear': `{
        from {
          clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
        }
        to {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
      }`,
    },
  },
}

export const presetVunor: PresetFactory<
  TVunorTheme,
  TVunorUnoPresetOpts & { palette?: TVunorPaletteOptions }
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
  const theme = themeFactory(opts)
  wind.preflights.push({
    getCSS: () =>
      `__vunor_palette_options {background-image: url("data:image/gif;base64,${Buffer.from(
        JSON.stringify({ ...theme.paletteOpts, surfaces: undefined })
      ).toString('base64')}")}`,
  })
  return {
    ...wind,
    name: 'vunor',
    theme: defu(theme.theme, wind.theme) as TVunorTheme,
    shortcuts: paletteShortcuts,
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
