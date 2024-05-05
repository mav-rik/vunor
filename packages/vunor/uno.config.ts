import { PresetOrFactory, defineConfig } from 'unocss'
import { presetVunor } from '@vunor/theme/src/preset-vunor'
import { TVunorTheme } from '@vunor/theme/src/theme'
import { scFromObject } from '@vunor/theme/src/utils/shortcut-obj'
import { shortcuts } from './src/components/shortcuts'
import presetIcons from '@unocss/preset-icons'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { presetScrollbar } from 'unocss-preset-scrollbar'

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
      'ui-filled': scFromObject({
        '': 'current-bg-scope-color-500 current-text-white current-icon-white icon-current/100 bg-current  text-current',
        'hover:': 'ui-filled-hover',
        'active:': 'ui-filled-active',
      }),
      'ui-filled-hover': scFromObject({
        '': 'current-bg-scope-color-400',
        'dark:': 'current-bg-scope-color-600',
      }),
      'ui-filled-active': scFromObject({
        '': 'current-bg-scope-color-600',
        'dark:': 'current-bg-scope-color-400',
      }),
      //
      'ui-transparent': scFromObject({
        '': 'current-bg-scope-color-500 current-text-black current-icon-black bg-current/0 text-current/80 icon-current/50',
        'dark:': 'current-text-white current-icon-white',
        'hover:': 'ui-transparent-hover',
        'active:': 'ui-transparent-active',
        'aria-[selected=true]:': 'ui-transparent-selected',
      }),
      'ui-transparent-hover': scFromObject({
        '': 'bg-current/05',
      }),
      'ui-transparent-active': scFromObject({
        '': 'bg-current/10',
      }),
      'ui-transparent-selected': scFromObject({
        '': 'ui-transparent-hover current-text-scope-color-500 text-current current-icon-scope-color-500 icon-current/100',
        'dark:': 'current-text-scope-color-400 current-icon-scope-color-400',
      }),
      //
      'ui-bordered': scFromObject({
        '': 'ui-transparent border-scope-color-500 border current-text-scope-color-500 current-icon-scope-color-500 icon-current/100',
        'dark:': 'current-text-scope-color-400 current-icon-scope-color-400',
        'hover:': 'ui-bordered-hover',
        'active:': 'ui-bordered-active',
      }),
      'ui-bordered-hover': 'ui-transparent-hover',
      'ui-bordered-active': 'ui-transparent-active',
      //
      'ui-light': scFromObject({
        '': 'current-bg-scope-color-500 current-text-scope-color-500 current-icon-scope-color-500 bg-current/10 text-current icon-current/80',
        'dark:': 'current-text-scope-color-400 current-icon-scope-color-400',
        'hover:': 'ui-light-hover',
        'active:': 'ui-light-active',
      }),
      'ui-light-hover': scFromObject({
        '': 'bg-current/15',
      }),
      'ui-light-active': scFromObject({
        '': 'bg-current/20',
      }),
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
