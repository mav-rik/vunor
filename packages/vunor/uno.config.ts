import { defineConfig } from 'unocss'
import { presetVunor } from '@vunor/theme/src/preset-vunor'
import { TVunorTheme } from '@vunor/theme/src/theme'

export default defineConfig({
  presets: [
    presetVunor({
      actualFontHeightFactor: 0.9,
      actualFontHeightTopBottomRatio: 0.51,
    }),
  ],
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
