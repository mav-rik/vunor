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
      'select-content': scFromObject({
        '': 'min-w-[160px] surface-0 bg-current/70 backdrop-blur-md rounded-body overflow-hidden shadow-xl z-[100] border-3px current-border-grey-400 border-current/20',
        // 'data-[side=top]:': 'animate-slideDownAndFade',
        // 'data-[side=right]:': 'animate-slideLeftAndFade',
        // 'data-[side=bottom]:': 'animate-slideUpAndFade',
        // 'data-[side=left]:': 'animate-slideRightAndFade',
      }),
      'select-scroll-btn': 'flex items-center justify-center h-fingertip cursor-default',
      'select-grp-label': scFromObject({
        '': 'px-$m h-fingertip flex items-center ',
        '[&>span]:': 'text-label text-grey-400',
      }),
      'select-item': scFromObject({
        '': 'text-body leading-none flex items-center h-fingertip relative select-none relative',
        'data-[disabled]:': 'opacity-40 pointer-events-none',
        'data-[highlighted]:': 'outline-none bg-scope-color-500/15',
        '[&>span]:': 'pl-$l pr-$m',
        '[&>span]:data-[state=checked]:': 'text-scope-color-500 fw-700!',
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
