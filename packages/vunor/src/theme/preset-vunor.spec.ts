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

function parseBody(body: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const decl of body.split(';')) {
    const colon = decl.indexOf(':')
    if (colon > 0) {
      out[decl.slice(0, colon).trim()] = decl.slice(colon + 1).trim()
    }
  }
  return out
}

/** Effective declarations for one selector — later declarations win, as in the browser. */
function declarations(utils: TParsedToken, selector: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const util of utils) {
    if (util[1] === selector) {
      Object.assign(out, parseBody(util[2] || ''))
    }
  }
  return out
}

/**
 * Every selector that declares `prop`, in source order. Asserting only the
 * selector you expect to win misses a competing rule on a different selector
 * that out-specifies it — which is exactly how a broken `rb-row` fix passed.
 */
function selectorsSetting(utils: TParsedToken, prop: string): string[] {
  const out: string[] = []
  for (const util of utils) {
    const selector = util[1]
    if (selector && prop in parseBody(util[2] || '') && !out.includes(selector)) {
      out.push(selector)
    }
  }
  return out
}

// Geometry the modifier applies to itself, plus what it says to its label/icon
// children. Both helpers run against the literal-class selector AND the alias
// selector, so the child-facing variables are covered on both paths.
function expectSquare(utils: TParsedToken, selector: string) {
  expect(declarations(utils, selector)).toMatchObject({
    'width': 'var(--v-fingertip)',
    'height': 'var(--v-fingertip)',
    'padding-left': '0',
    'padding-right': '0',
    '--btn-label-display': 'none',
    '--btn-icon-fs': '1.5em',
    '--btn-icon-pull': '0',
  })
}

function expectRound(utils: TParsedToken, selector: string) {
  expect(declarations(utils, selector)).toMatchObject({
    'border-radius': 'var(--v-fingertip-half)',
    'padding-left': 'var(--v-fingertip-half)',
    'padding-right': 'var(--v-fingertip-half)',
    '--btn-icon-pull': '-0.5em',
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

  // What a modifier says to its label/icon children travels as an inherited
  // custom property instead of a `group-[.btn-*]/btn:` descendant rule, so the
  // signal survives both the alias (no literal `.btn-square` for a descendant
  // selector to key on) and a hand-rolled button with no `group/btn`.
  it('reads the modifier variables from the label and icon shortcuts', async () => {
    expect(declarations(await parse('btn-label'), '.btn-label')).toMatchObject({
      // `revert` — an unset variable leaves the element on its UA display
      display: 'var(--btn-label-display,revert)',
    })
    expect(declarations(await parse('btn-icon'), '.btn-icon')).toMatchObject({
      'font-size': 'var(--btn-icon-fs,1.25em)',
    })
    expect(declarations(await parse('btn-icon-left'), '.btn-icon-left')).toMatchObject({
      'margin-left': 'var(--btn-icon-pull,0)',
    })
    expect(declarations(await parse('btn-icon-right'), '.btn-icon-right')).toMatchObject({
      'margin-right': 'var(--btn-icon-pull,0)',
    })
  })

  // An element wearing both modifiers must resolve square. The two bodies carry
  // equal specificity, so without this compound selector the outcome would rest
  // on the order UnoCSS happens to emit them in.
  it('resolves round+square to the square values by specificity', async () => {
    expect(declarations(await parse('btn'), '.btn.btn-round.btn-square')).toMatchObject({
      'padding-left': '0',
      '--btn-icon-pull': '0',
    })
  })
})

describe('i8 wrapper signalling', () => {
  // The i8 markers tell the input, label wrapper, hint row and underline how to
  // pad and whether to show. That signal used to be a `group-[.i8-filled]/i8:`
  // descendant rule keyed on the wrapper's literal class name, so it was lost
  // whenever a consumer aliased the names into one shortcut of their own.
  it('sets the child-facing variables on a consumer alias shortcut', async () => {
    const utils = await parse('x-input', undefined, { 'x-input': 'i8 i8-filled' })
    expect(declarations(utils, '.x-input')).toMatchObject({
      '--i8-pl': '1em',
      '--i8-pr': '1em',
      '--i8-hint-px': '1em',
      '--i8-underline-display': 'none',
    })
  })

  it('reads the variables from the child shortcuts', async () => {
    expect(
      declarations(await parse('i8-input'), '.i8-input:not([data-has-prepend=true])')
    ).toMatchObject({ 'padding-left': 'var(--i8-pl,0)' })
    expect(
      declarations(await parse('i8-input'), '.i8-input:not([data-has-append=true])')
    ).toMatchObject({ 'padding-right': 'var(--i8-pr,0)' })
    expect(declarations(await parse('i8-hint-wrapper'), '.i8-hint-wrapper')).toMatchObject({
      'padding-left': 'var(--i8-hint-px,0)',
    })
    expect(declarations(await parse('i8-underline'), '.i8-underline')).toMatchObject({
      display: 'var(--i8-underline-display,revert)',
    })
  })

  // The box (background, border, radius) deliberately stays on the
  // `[&.i8-*]:` variants and is NOT in the marker bodies: <VuInput> puts the
  // marker on an outer wrapper that has no `.i8` and encloses the hint row, so
  // a marker body carrying the box would paint a box around input AND hint.
  it('keeps the box off a bare marker so the outer wrapper stays unpainted', async () => {
    const utils = await parse('i8')
    expect(declarations(utils, '.i8.i8-filled')['border-radius']).toBeDefined()
    expect(declarations(utils, '.i8-filled')['border-radius']).toBeUndefined()
  })

  // Positional overrides need `segmented` AND `i8-round` on one element, which
  // no single body can express — they stay on the wrapper, where the higher
  // specificity (0,4,0) beats the marker's own (0,1,0) regardless of order.
  it('lets the segmented override win over the plain round padding', async () => {
    const utils = await parse('i8')
    expect(declarations(utils, '.i8.segmented.i8-round:not(:first-child)')).toMatchObject({
      '--i8-pl': '1em',
    })
  })
})

describe('rb-root direction', () => {
  // `rb-row` was read only by `rb-root`'s `[&.rb-row]:` / `not-[.rb-row]:`
  // rules. Under an alias the `:not()` MATCHED — and at (0,2,0) it outranked the
  // alias's own (0,1,0) — so a row group came out as a column: actively wrong,
  // not merely unstyled. Asserting the winning selector alone is not enough
  // here, because the rule that caused the bug lived on a DIFFERENT selector;
  // this pins that no other selector sets flex-direction at all.
  it('resolves an aliased rb-row to a wrapping row', async () => {
    const utils = await parse('x-row', undefined, { 'x-row': 'rb-root rb-row' })
    expect(declarations(utils, '.x-row')).toMatchObject({
      'flex-direction': 'var(--rb-dir,column)',
      '--rb-dir': 'row',
      'flex-wrap': 'wrap',
    })
    expect(selectorsSetting(utils, 'flex-direction')).toEqual(['.x-row'])
  })

  it('leaves a plain rb-root as a column', async () => {
    const utils = await parse('rb-root')
    expect(declarations(utils, '.rb-root')['flex-direction']).toBe('var(--rb-dir,column)')
    expect(declarations(utils, '.rb-root')['--rb-dir']).toBeUndefined()
    expect(selectorsSetting(utils, 'flex-direction')).toEqual(['.rb-root'])
  })
})

describe('card heading typography', () => {
  // `card-{level}` projects the level's prop bag into `--card-heading-*` field
  // by field, so anything it does not name never reaches `text-card-header`.
  // A level's `font` is forwarded; arbitrary `css` cannot be (no fixed keys).
  it('forwards a level font through to text-card-header', async () => {
    const opts = { typography: { h3: { font: 'Display Serif' } } }
    expect(declarations(await parse('card-h3', opts), '.card-h3')).toMatchObject({
      '--card-heading-font': 'Display Serif',
    })
    expect(declarations(await parse('text-card-header', opts), '.text-card-header')).toMatchObject({
      'font-family': 'var(--card-heading-font, inherit)',
    })
  })

  it('falls back to inherit for a level with no font', async () => {
    expect(declarations(await parse('card-h3'), '.card-h3')).toMatchObject({
      '--card-heading-font': 'inherit',
    })
  })
})
