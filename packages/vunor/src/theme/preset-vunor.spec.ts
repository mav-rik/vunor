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

// One definition of "disabled" (src/theme/utils/disabled.ts) behind both the
// gate on interaction states and the disabled paint. Spelled out here rather
// than imported, so the tests pin the compiled selector.
const DISABLED = ':disabled,[disabled],[aria-disabled=true],[data-disabled]'
const WHEN_ENABLED = `:not(${DISABLED})`
const WHEN_DISABLED = `:is(${DISABLED})`
const WHEN_DISABLED_DEFAULT = `:where(${DISABLED})`
const C8_VARIANTS = ['c8-filled', 'c8-flat', 'c8-outlined', 'c8-light', 'c8-chrome']

describe('disabled gate', () => {
  // The c8 gate used to be `not-([disabled]):`, which compiles to
  // `:not(disabled)` — a type selector that matches every element — so no
  // disabled element was ever excluded.
  const INTERACTION = /:hover|:active|\[data-highlighted\]|\[data-active\]/

  /** Selectors the token compiles to that pass `keep`. */
  async function selectors(token: string, keep: (selector: string) => boolean) {
    const utils = await parse(token)
    return utils.map(util => util[1] ?? '').filter(selector => keep(selector))
  }

  async function expectInteractionGated(token: string, minRules: number) {
    const interaction = await selectors(token, s => INTERACTION.test(s))
    expect(interaction.length).toBeGreaterThanOrEqual(minRules)
    for (const selector of interaction) {
      expect(selector).toContain(WHEN_ENABLED)
    }
  }

  // hover, [data-highlighted], :active, [data-active]
  it.each(C8_VARIANTS)('%s gates every hover and press rule on not-disabled', async token => {
    await expectInteractionGated(token, 4)
  })

  // An aria-disabled element stays focusable and the wash is c8's only focus
  // indicator, so :focus-visible must keep painting it.
  it.each(C8_VARIANTS)('%s leaves :focus-visible ungated', async token => {
    const focus = await selectors(token, s => s.includes(':focus-visible'))
    expect(focus.length).toBeGreaterThan(0)
    for (const selector of focus) {
      expect(selector).not.toContain(WHEN_ENABLED)
    }
  })

  it('keeps the selected state painted on a disabled element', async () => {
    const selected = await selectors('c8-flat', s => s.includes('[aria-selected=true]'))
    expect(selected.length).toBeGreaterThan(0)
    for (const selector of selected) {
      expect(selector).not.toContain(WHEN_ENABLED)
    }
  })

  it.each(['menu-item', 'i8-bare', 'calendar-cell', 'slider-thumb', 'rb-item', 'checkbox'])(
    '%s gates its hover and press rules the same way',
    async token => {
      await expectInteractionGated(token, 1)
    }
  )

  // disabled-soft's side of the same list is covered by the literal-class block below
  it('paints btn on the shared selector list', async () => {
    const btn = await parse('btn')
    expect(declarations(btn, `.btn${WHEN_DISABLED_DEFAULT}`)).toEqual({ opacity: '0.8' })
    expect(declarations(btn, `.btn${WHEN_DISABLED}`)).toEqual({ cursor: 'not-allowed' })
  })
})

// btn's opacity-80 sits under `:where()` (0,1,0), so any explicit disabled
// opacity (0,2,0) replaces it whatever order UnoCSS emits the rules in. The
// order is what an alias cannot promise: both bodies land on the alias class.
describe('btn disabled opacity is a default', () => {
  it('only opacity rule on btn is the zero-specificity one', async () => {
    const btn = await parse('btn')
    const disabled = selectorsSetting(btn, 'opacity').filter(s => !s.includes('loading'))
    expect(disabled).toEqual([`.btn${WHEN_DISABLED_DEFAULT}`])
  })

  it.each([
    ['btn disabled-soft', '0.4'],
    ['disabled-soft btn', '0.4'],
    ['btn disabled:opacity-50', '0.5'],
    ['btn btn-square c8-flat disabled-soft', '0.4'],
  ])("alias 'x': '%s' outranks btn's default", async (body, opacity) => {
    const utils = await parse('x', undefined, { x: body })
    expect(declarations(utils, `.x${WHEN_DISABLED_DEFAULT}`)).toEqual({ opacity: '0.8' })
    const explicit = selectorsSetting(utils, 'opacity').filter(
      s => s !== `.x${WHEN_DISABLED_DEFAULT}` && !s.includes('loading')
    )
    expect(explicit).toHaveLength(1)
    const [selector = ''] = explicit
    // `:is(…)` or `:disabled` on top of the class: 0,2,0 against the default's 0,1,0
    expect(selector).toMatch(/^\.x(:is\(|:disabled$)/)
    expect(declarations(utils, selector).opacity).toBe(opacity)
  })
})

describe('disabled-soft as a literal class', () => {
  // `-` is a variant separator, so without the preset's literal variant the
  // token reads as `disabled-` + `soft` and compiles to nothing.
  const PAINT = { opacity: '0.4', cursor: 'not-allowed' }

  it('compiles the bare class', async () => {
    const utils = await parse('disabled-soft')
    expect(declarations(utils, `.disabled-soft${WHEN_DISABLED}`)).toMatchObject(PAINT)
  })

  it('compiles behind leading variants', async () => {
    const utils = await parse('md:disabled-soft')
    expect(declarations(utils, `.md\\:disabled-soft${WHEN_DISABLED}`)).toMatchObject(PAINT)
  })

  it('still expands inside a consumer shortcut', async () => {
    const utils = await parse('x-row', undefined, { 'x-row': 'flex disabled-soft' })
    expect(declarations(utils, `.x-row${WHEN_DISABLED}`)).toMatchObject(PAINT)
  })

  it('carries consumer overrides of disabled-soft', async () => {
    const utils = await parse('disabled-soft', undefined, { 'disabled-soft': 'underline' })
    expect(declarations(utils, '.disabled-soft')['text-decoration-line']).toBe('underline')
  })

  it.each([
    ['disabled:opacity-50', '.disabled\\:opacity-50:disabled'],
    ['disabled-opacity-50', '.disabled-opacity-50:disabled'],
    ['disabled-bg-red-500', '.disabled-bg-red-500:disabled'],
  ])('leaves %s to the disabled variant', async (token, selector) => {
    const utils = await parse(token)
    expect(utils.map(util => util[1])).toEqual([selector])
  })

  it('stands aside when vunorShortcuts() is not registered', async () => {
    const uno = await createGenerator({ presets: [presetVunor()] })
    expect(await uno.parseToken('disabled-soft')).toBeUndefined()
  })
})
