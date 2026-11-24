import { createGenerator } from 'unocss'
import { describe, expect, it } from 'vitest'

import {
  defineShortcuts,
  mergeVunorShortcuts,
  mergedVunorShortcuts,
  presetVunor,
  replaceShortcut,
  vunorShortcuts,
} from './theme'

import type { TVunorShortcut } from './theme'

// taken before any test can call vunorShortcuts()
const pristine = structuredClone(mergedVunorShortcuts)

// vunor's own `press` (src/theme/shortcuts/extras.ts)
const BUILT_IN_PRESS = ['-webkit-tap-highlight-color', '--press-scale']

function expectNoBuiltInPress(press: string) {
  for (const builtIn of BUILT_IN_PRESS) {
    expect(press).not.toContain(builtIn)
  }
}

/** CSS UnoCSS generates for `my-box` from a shortcut map handed to it directly */
async function myBoxCss(shortcuts: TVunorShortcut) {
  const uno = await createGenerator({
    presets: [presetVunor()],
    shortcuts: [shortcuts as Record<string, string | string[]>],
  })
  const { css } = await uno.generate('my-box', { preflights: false })
  return css
}

describe('vunorShortcuts with replaceShortcut', () => {
  it('a marked shortcut replaces the built-in one; an unmarked one still merges', () => {
    const mine = defineShortcuts({
      'press': replaceShortcut({ 'active:': 'scale-95' }),
      'c8-filled': { '': 'rounded-full' },
    })
    const result = vunorShortcuts(mine)
    expect(result.press).toBe('active:scale-95')
    expectNoBuiltInPress(result.press)
    expect(result['c8-filled']).toBe(`${vunorShortcuts()['c8-filled']} rounded-full`)
  })

  it.each([
    [
      'marked in one list only',
      [
        defineShortcuts({ press: replaceShortcut({ 'active:': 'scale-95' }) }),
        defineShortcuts({ 'my-row': 'p-2' }),
      ],
      'active:scale-95',
    ],
    [
      'marked, then appended to',
      [
        defineShortcuts({ press: 'p-1' }),
        defineShortcuts({ press: replaceShortcut({ 'active:': 'scale-95' }) }),
        defineShortcuts({ press: 'duration-150' }),
      ],
      'active:scale-95 duration-150',
    ],
  ])('an app shortcut %s replaces the built-in one after a merge', (_case, lists, press) => {
    const result = vunorShortcuts(mergeVunorShortcuts(lists))
    expect(result.press).toBe(press)
    expectNoBuiltInPress(result.press)
  })

  it('an unmarked app shortcut merges into the built-in one of the same name', () => {
    const result = vunorShortcuts(defineShortcuts({ press: 'duration-150' }))
    expect(result.press).toBe(`${vunorShortcuts().press} duration-150`)
  })

  it('returns plain strings and leaves the built-in shortcuts unchanged', () => {
    const mine = defineShortcuts({
      'press': replaceShortcut('scale-95'),
      'my-row': ['p-2', 'm-1 c-red'],
    })
    const result = vunorShortcuts(mine)
    expect(Object.entries(result).filter(([, value]) => typeof value !== 'string')).toEqual([])
    expect(result.press).toBe('scale-95')
    expect(result['my-row']).toBe('p-2 m-1 c-red')
    expect(vunorShortcuts(mine)).toEqual(result)
    expect(mergedVunorShortcuts).toEqual(pristine)
  })

  // a merged map of strings is a valid UnoCSS shortcut map; a marked entry keeps it one
  it.each(['m-2', 'hover:(bg-red-500 c-white)'])(
    'a merged map with a marked `%s` can be handed to UnoCSS directly',
    async classes => {
      const expected = await myBoxCss({ 'my-box': classes })
      expect(expected).toContain('.my-box')
      const merged = mergeVunorShortcuts([
        { 'my-box': 'p-2' },
        { 'my-box': replaceShortcut(classes) },
      ])
      expect(await myBoxCss(merged)).toBe(expected)
    }
  )
})
