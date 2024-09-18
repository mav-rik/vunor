import { PresetOrFactory, defineConfig } from 'unocss'
import { presetVunor } from './src/theme/preset-vunor'
import { TVunorTheme } from './src/theme/theme'
import presetIcons from '@unocss/preset-icons'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { presetScrollbar } from 'unocss-preset-scrollbar'
import { vunorShortcuts } from './src/theme'
const sc = vunorShortcuts({
  // 'c8-filled': 'current-bg-scope-color',
})

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
      baseRadius: '.5em',
      palette: {
        colors: {
          // primary: '#FFBBAA',
          secondary: '#DF6D04',
        },
        surfaces: {
          //    [bg,     text,    border, dark:bg, dark:text, dark:border]
          test: ['red', 'white', 'blue', 'red', 'white', 'blue'],
        },
      },
    }),
  ],
  shortcuts: [sc],
  preflights: [
    {
      getCSS: () =>
        `html, body { font-family: "Inter var", sans-serif; }
      html * { transition: color, fill, stroke, opacity, left, top, right, bottom, width, height, background-color, border-color 0.15s ease-in-out; }`,
    },
  ],
})
