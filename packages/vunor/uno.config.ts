import { defineConfig } from 'unocss'
import { presetVunor } from '@vunor/theme/src/preset-vunor'
import { TVunorTheme } from '@vunor/theme/src/theme'
import { shortcuts } from './src/components/shortcuts'

export default defineConfig({
  presets: [
    presetVunor({
      actualFontHeightFactor: 0.9,
      actualFontHeightTopBottomRatio: 0.51,
    }),
  ],
  shortcuts: [
    ...shortcuts,
    [/^layer-([0-4])$/, ([, l]) => `bg-scope-light-${l} dark:bg-scope-dark-${l}`],
    {
      'surface':
        'bg-scope-color-100 text-scope-color-700 dark:bg-scope-color-800 dark:text-scope-color-100 transition-all duration-500 border border-scope-color-300 dark:border-scope-color-600',
      'surface-alt':
        'bg-scope-color-200 text-scope-color-900 dark:bg-scope-color-700 dark:text-scope-color-100 transition-all duration-500 border border-scope-color-400 dark:border-scope-color-500',
      'surface-inv':
        'dark:bg-scope-color-200 dark:text-scope-color-900 bg-scope-color-700 text-scope-color-100 transition-all duration-500 border border-scope-color-500 dark:border-scope-color-400',
      'surface-inv-alt':
        'dark:bg-scope-color-100 dark:text-scope-color-700 bg-scope-color-800 text-scope-color-100 transition-all duration-500 border border-scope-color-600 dark:border-scope-color-300',
    },
  ],
  layers: {
    preflights: 0,
    shortcuts: 1,
    default: 2,
    utilities: 3,
  },
  // theme: {
  //   fontFamily: {
  //     sans: 'Inter, sans-serif',
  //   },
  // } as unknown as TVunorTheme,
  preflights: [
    {
      getCSS: () => `html, body { font-family: "Inter var", sans-serif; }`,
    },
  ],
})
