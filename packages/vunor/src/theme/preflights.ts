import { getScopeCssVars } from './rules/palette'
import { unitBy } from './utils/unit-by'

import type { TVunorTheme } from './theme'
import type { Preflight } from 'unocss'
import type { Theme } from 'unocss/preset-mini'

/**
 * `:root` theme variables always; page-level element styles only with `baseStyles`.
 * Off, `body` keeps the body level's `--font-*` variables for `text-mt-*` / `font-$bold`.
 */
export function vunorPreflights(baseStyles: boolean): Preflight<TVunorTheme & Theme> {
  return {
    getCSS: ({ theme }) =>
      baseStyles
        ? renderBaseStyles(theme)
        : renderRootVars(theme) + renderFontVarsCss('body', theme.fontSize.body),
  }
}

function renderBaseStyles(theme: TVunorTheme & Theme): string {
  return `${
    renderFontCss('body', theme.fontSize.body) +
    renderFontCss('figcaption', theme.fontSize.caption) +
    renderFontCss('h1', theme.fontSize.h1) +
    renderFontCss('h2', theme.fontSize.h2) +
    renderFontCss('h3', theme.fontSize.h3) +
    renderFontCss('h4', theme.fontSize.h4) +
    renderFontCss('h5', theme.fontSize.h5) +
    renderFontCss('h6', theme.fontSize.h6)
  }
${renderRootVars(theme)}

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
`
}

function renderRootVars(theme: TVunorTheme & Theme): string {
  return `:root {
  --un-border-opacity: 0.25;
  --un-default-border-color: rgb(150 150 150 / var(--un-border-opacity));
  --scope-black: 0 0 0;
  --scope-white: 255 255 255;
  --scope-hl: var(--scope-color-500);
  --v-fingertip: ${theme.spacing['fingertip-m'] || '3em'};
  --v-fingertip-half: ${unitBy(theme.spacing['fingertip-m'] || '3em', 0.5)};
${renderDefaultScope(theme)}}
`
}

type TFont = TVunorTheme['fontSize'][keyof TVunorTheme['fontSize']]

function renderDefaultScope(theme: TVunorTheme & Theme): string {
  const vars = getScopeCssVars('neutral', theme)
  if (!vars) {
    return ''
  }
  return `${Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')}\n`
}

function renderFontCss(selector: string, font: TFont): string {
  return `${selector} { font-size: ${font[0]}; ${Object.entries(font[1])
    .map(e => `${e[0]}: ${e[1]};`)
    .join(' ')} }\n`
}

/** Only a level's `--font-*` variables: a rule that styles nothing. */
function renderFontVarsCss(selector: string, font: TFont): string {
  return `${selector} { ${Object.entries(font[1])
    .filter(([k]) => k.startsWith('--'))
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ')} }\n`
}
