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
        '': 'scope[bg]-color-500 scope[text]-white scope[icon]-white icon-opacity-100 bg-scope-bg  text-scope-text',
        'hover:': 'ui-filled-hover',
        'active:': 'ui-filled-active',
      }),
      'ui-filled-hover': scFromObject({
        '': 'scope[bg]-color-400',
        'dark:': 'scope[bg]-color-600',
      }),
      'ui-filled-active': scFromObject({
        '': 'scope[bg]-color-600',
        'dark:': 'scope[bg]-color-400',
      }),
      //
      'ui-transparent': scFromObject({
        '': 'scope[bg]-color-500 scope[text]-black scope[icon]-black bg-scope-bg/0 text-scope-text/80 icon-opacity-50',
        'dark:': 'scope[text]-white scope[icon]-white',
        'hover:': 'ui-transparent-hover',
        'active:': 'ui-transparent-active',
        'aria-[selected=true]:': 'ui-transparent-selected',
      }),
      'ui-transparent-hover': scFromObject({
        '': 'bg-scope-bg/05',
      }),
      'ui-transparent-active': scFromObject({
        '': 'bg-scope-bg/10',
      }),
      'ui-transparent-selected': scFromObject({
        '': 'ui-transparent-hover scope[text]-color-500 text-scope-text scope[icon]-color-500 icon-opacity-100',
        'dark:': 'scope[text]-color-400 scope[icon]-color-400',
      }),
      //
      'ui-bordered': scFromObject({
        '': 'ui-transparent border-scope-color-500 border scope[text]-color-500 scope[icon]-color-500 icon-opacity-100',
        'dark:': 'scope[text]-color-400 scope[icon]-color-400',
        'hover:': 'ui-bordered-hover',
        'active:': 'ui-bordered-active',
      }),
      'ui-bordered-hover': 'ui-transparent-hover',
      'ui-bordered-active': 'ui-transparent-active',
      //
      'ui-light': scFromObject({
        '': 'scope[bg]-color-500 scope[text]-color-500 scope[icon]-color-500 bg-scope-bg/10 text-scope-text icon-opacity-80',
        'dark:': 'scope[text]-color-400 scope[icon]-color-400',
        'hover:': 'ui-light-hover',
        'active:': 'ui-light-active',
      }),
      'ui-light-hover': scFromObject({
        '': 'bg-scope-bg/15',
      }),
      'ui-light-active': scFromObject({
        '': 'bg-scope-bg/20',
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
