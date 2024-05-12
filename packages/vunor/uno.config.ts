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
      'checkbox-root': scFromObject({
        '': 'flex gap-$m items-center cursor-pointer current-bg-scope-color-500 current-border-scope-color-500',
        'data-[error=true]:': 'current-border-error-500',
        'aria-[disabled=true]:': 'scope-grey opacity-50 cursor-not-allowed',
      }),
      'checkbox': scFromObject({
        '': 'select-none flex size-half-fingertip appearance-none items-center justify-center bg-current/0 border current-icon-white',
        'group-active:enabled:':
          'current-bg-scope-color-500 bg-current/50 current-icon-scope-color-500',
        'group-hover:enabled:': 'border-current',
        'disabled:': 'cursor-not-allowed',
        'group-data-[error=true]:enabled:': 'border-current',
      }),
      'checkbox-indicator': scFromObject({
        '': 'bg-current icon-current h-full w-full flex items-center justify-center',
      }),
      'checkbox-icon': scFromObject({
        '': 'size-0.8em',
      }),
      'checkbox-label': scFromObject({
        '': 'select-none text-label lh-1em',
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
