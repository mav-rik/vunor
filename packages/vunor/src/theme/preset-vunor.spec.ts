import { createGenerator } from 'unocss'
import { describe, expect, it } from 'vitest'

import { vunorShortcuts } from '../theme'
import { presetVunor } from './preset-vunor'

import type { TVunorTheme } from './theme'
import type { TVunorUnoPresetOpts } from './types'
import type { StringifiedUtil } from 'unocss'

// Drives a real UnoCSS generator wired like uno.config.ts and asserts on the
// compiled output: every bug guarded below looked correct in the theme and
// shortcut objects and only went wrong once UnoCSS had compiled them.

type TParsedToken = Array<StringifiedUtil<TVunorTheme>>

/** Compiles a single class name (shortcuts and variants resolved). */
async function parse(
  token: string,
  opts?: TVunorUnoPresetOpts,
  custom?: Record<string, string>
): Promise<TParsedToken> {
  const uno = await createGenerator({
    presets: [presetVunor(opts)],
    shortcuts: [vunorShortcuts(custom)],
  })
  const utils = await uno.parseToken(token)
  if (!utils) {
    throw new Error(`"${token}" compiled to nothing`)
  }
  return utils
}

/** Effective declarations for one selector — later declarations win, as in the browser. */
function declarations(utils: TParsedToken, selector: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const util of utils) {
    if (util[1] !== selector) {
      continue
    }
    for (const decl of (util[2] || '').split(';')) {
      const colon = decl.indexOf(':')
      if (colon > 0) {
        out[decl.slice(0, colon).trim()] = decl.slice(colon + 1).trim()
      }
    }
  }
  return out
}

function expectSquare(utils: TParsedToken, selector: string) {
  expect(declarations(utils, selector)).toMatchObject({
    'width': 'var(--v-fingertip)',
    'height': 'var(--v-fingertip)',
    'padding-left': '0',
    'padding-right': '0',
  })
}

function expectRound(utils: TParsedToken, selector: string) {
  expect(declarations(utils, selector)).toMatchObject({
    'border-radius': 'var(--v-fingertip-half)',
    'padding-left': 'var(--v-fingertip-half)',
    'padding-right': 'var(--v-fingertip-half)',
  })
}

describe('presetVunor typography', () => {
  // `font` and `css` carry no geometry, so nothing in the numeric pipeline
  // forces them into the output — only buildFontTheme's tuple does.
  it('emits font-family and custom css declarations for a typography level', async () => {
    const utils = await parse('text-h1', {
      typography: {
        // defu deep-merges with defaultTypography, so h1 keeps its numeric fields
        h1: {
          font: 'Brand Sans, serif',
          css: { 'text-transform': 'uppercase', 'font-style': 'italic' },
        },
      },
    })
    expect(declarations(utils, '.text-h1')).toMatchObject({
      'font-family': 'Brand Sans, serif',
      'text-transform': 'uppercase',
      'font-style': 'italic',
      // the extra fields must not displace the computed geometry
      'letter-spacing': '-0.025em',
    })
  })

  it('lets an explicit css font-family override the font shorthand', async () => {
    const utils = await parse('text-h2', {
      typography: {
        h2: { font: 'Brand Sans', css: { 'font-family': 'Override Serif' } },
      },
    })
    expect(declarations(utils, '.text-h2')['font-family']).toBe('Override Serif')
  })
})

describe('btn modifier geometry', () => {
  // The component path: both names as literal classes on one element, which is
  // what the `[&.btn-*]:` variants inside `btn` compile to.
  it('applies modifier geometry to the combined .btn.btn-* selectors', async () => {
    const utils = await parse('btn')
    expectSquare(utils, '.btn.btn-square')
    expectRound(utils, '.btn.btn-round')
    // plain .btn keeps its own horizontal padding
    expect(declarations(utils, '.btn')['padding-left']).toBe('1em')
  })

  // A consumer aliasing both names into one shortcut compiles to a single
  // `.x-*-btn` selector, so the `[&.btn-*]:` variants never match it. Without
  // a body of its own the modifier is dropped as an unmatched utility and the
  // alias silently renders as a plain `btn`.
  it('applies square geometry to a consumer alias shortcut', async () => {
    const utils = await parse('x-square-btn', undefined, { 'x-square-btn': 'btn btn-square' })
    expectSquare(utils, '.x-square-btn')
  })

  it('applies round geometry to a consumer alias shortcut', async () => {
    const utils = await parse('x-round-btn', undefined, { 'x-round-btn': 'btn btn-round' })
    expectRound(utils, '.x-round-btn')
  })
})
