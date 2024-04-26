import { defineConfig } from 'unocss'
import { presetVunor } from '@vunor/theme/src/preset-vunor'

export default defineConfig({
  presets: [
    presetVunor({
      actualFontHeightFactor: 0.84,
      actualFontHeightTopBottomRatio: 0.44,
    }),
  ],
  preflights: [
    {
      getCSS: () => `html, body { font-family: "Inter", sans-serif; }`,
    },
  ],
})
