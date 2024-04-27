import { TVunorTheme } from './theme'
import { Preflight } from 'unocss'
import type { Theme } from '@unocss/preset-mini'

export const fontsPreflights: Preflight<TVunorTheme & Theme> = {
  getCSS: ({ theme }) =>
    renderFontCss('body', theme.fontSize.body) +
    renderFontCss('label', theme.fontSize.label) +
    renderFontCss('figcaption', theme.fontSize.caption) +
    renderFontCss('h1', theme.fontSize['h1']) +
    renderFontCss('h2', theme.fontSize['h2']) +
    renderFontCss('h3', theme.fontSize['h3']) +
    renderFontCss('h4', theme.fontSize['h4']) +
    renderFontCss('h5', theme.fontSize['h5']) +
    renderFontCss('h6', theme.fontSize['h6']),
}

function renderFontCss(
  selector: string,
  font: TVunorTheme['fontSize'][keyof TVunorTheme['fontSize']]
): string {
  return `${selector} { font-size: ${font[0]}; ${Object.entries(font[1])
    .map(e => `${e[0]}: ${e[1]};`)
    .join(' ')} }\n`
}
