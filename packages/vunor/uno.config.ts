import { PresetOrFactory, defineConfig } from 'unocss'
import { presetVunor } from '@vunor/theme/src/preset-vunor'
import { TVunorTheme } from '@vunor/theme/src/theme'
import { shortcuts } from './src/components/shortcuts'
import presetIcons from '@unocss/preset-icons'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { presetScrollbar } from 'unocss-preset-scrollbar'
import { h } from 'vue'

export default defineConfig({
  presets: [
    presetIcons({
      collections: {
        '': FileSystemIconLoader('./svg', svg =>
          svg.startsWith('<!-- colored -->')
            ? svg
            : svg
                .replace(/#fff/, 'currentColor')
                .replace(/#000/, 'currentColor')
                .replace(/white/, 'currentColor')
                .replace(/black/, 'currentColor')
        ),
      },
    }) as PresetOrFactory<TVunorTheme>,
    presetScrollbar({}) as PresetOrFactory<TVunorTheme>,
    presetVunor({
      actualFontHeightFactor: 0.76, // 0.76,
      actualFontHeightTopBottomRatio: 0.5, //0.495,
      layers: {
        reverseLight: false,
        reverseDark: false,
      },
    }),
  ],
  shortcuts: [
    ...shortcuts,
    {
      'bg-hl': 'bg-scope-color-500/05 [&.filled]:bg-scope-color-600',
      'bg-pressed':
        '[&:not(.filled)]:bg-scope-color-800/10 [&:not(.filled)]:dark:bg-scope-color-200/10 [&.filled]:bg-scope-color-800',
      'filled': 'bg-scope-color-500 text-white',
      'text-hl': 'text-scope-color-500 dark:text-scope-color-300 ',
      'text-icon':
        '[&:not(.filled)]:text-scope-dark-2/40 [&:not(.filled)]:dark:text-scope-light-2/40 [&.filled]:text-white',
      'border-hl': 'border-scope-color-500 dark:border-scope-color-300',
    },
  ],
  // theme: {
  //   fontFamily: {
  //     sans: 'Inter, sans-serif',
  //   },
  // } as unknown as TVunorTheme,
  preflights: [
    {
      getCSS: () =>
        `html, body { font-family: "Inter var", sans-serif; }
      html * { transition: color, fill, stroke, opacity, left, top, right, bottom, width, height, background-color, border-color 0.15s ease-in-out; }`,
    },
  ],
})
