import { defineConfig } from 'unocss'
import { presetVunor } from '@vunor/theme/src/preset-vunor'
import { TVunorTheme } from '@vunor/theme/src/theme'
import { shortcuts } from './src/components/shortcuts'

export default defineConfig({
  presets: [
    presetVunor({
      actualFontHeightFactor: 0.8,
      actualFontHeightTopBottomRatio: 0.495,
      palette: {
        layers: {
          // reverseLight: false,
          reverseDark: true,
        },
      },
    }),
  ],
  shortcuts: [...shortcuts],
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
