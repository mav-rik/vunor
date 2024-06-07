import type { Theme } from '@unocss/preset-mini'
import type { Preflight } from 'unocss'

import type { TVunorTheme } from './theme'

export const fontsPreflights: Preflight<TVunorTheme & Theme> = {
  getCSS: ({ theme }) =>
    `${
      renderFontCss('body', theme.fontSize.body) +
      // renderFontCss('label', theme.fontSize.label) +
      renderFontCss('figcaption', theme.fontSize.caption) +
      renderFontCss('h1', theme.fontSize.h1) +
      renderFontCss('h2', theme.fontSize.h2) +
      renderFontCss('h3', theme.fontSize.h3) +
      renderFontCss('h4', theme.fontSize.h4) +
      renderFontCss('h5', theme.fontSize.h5) +
      renderFontCss('h6', theme.fontSize.h6)
    }
:root {
   --un-default-border-color: rgba(0,0,0,10%);
   --scope-black: 0 0 0;
   --scope-white: 255 255 255;
}

html.dark, .dark {
   --un-default-border-color: rgba(255,255,255,10%);
}

::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.05);
    border-radius: 5px;
}

::-webkit-scrollbar-thumb {
    background-color: rgba(0,0,0,0.2);
    border-radius: 5px;
    border: 2px solid transparent;
    background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0,0,0,0.3);
}


.dark ::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.05);
}

.dark ::-webkit-scrollbar-thumb {
    background-color: rgba(255,255,255,0.2);
}

.dark ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255,255,255,0.3);
}
`,
}

function renderFontCss(
  selector: string,
  font: TVunorTheme['fontSize'][keyof TVunorTheme['fontSize']]
): string {
  return `${selector} { font-size: ${font[0]}; ${Object.entries(font[1])
    .map(e => `${e[0]}: ${e[1]};`)
    .join(' ')} }\n`
}
