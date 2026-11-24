import { describe, expect, it } from 'vitest'

import { mergeVunorShortcuts, replaceShortcut, toUnoShortcut } from './shortcut-obj'

describe('shortcut objects', () => {
  it('must flatten sc object', () => {
    expect(toUnoShortcut({ '': 'text-blue', 'hover:': ['text-red', 'bg-black'] })).toEqual(
      'text-blue hover:text-red hover:bg-black'
    )
  })
  it('must flatten deeply nested sc object', () => {
    const obj = {
      '': {
        '': {
          '': 'root1 root2',
        },
        'hover:': {
          '': ['h1', 'h2'],
          '[&.cl]:': 'cl1',
        },
      },
      'dark:': {
        '': {
          '': ['d-root1', 'd-root2'],
        },
        'hover:': {
          '': ['dh1', 'dh2'],
          '[&.cl]:': 'cl2',
        },
      },
    }
    expect(toUnoShortcut(obj)).toEqual(
      'root1 root2 hover:h1 hover:h2 hover:[&.cl]:cl1 dark:d-root1 dark:d-root2 dark:hover:dh1 dark:hover:dh2 dark:hover:[&.cl]:cl2'
    )
  })
  it('must flatten object respecting spaces', () => {
    const l = 1
    const d = 3
    expect(
      toUnoShortcut({
        '': `bg-scope-light-${l} text-scope-dark-2`,
        'dark:': `bg-scope-dark-${d} text-scope-light-2 shadow-black/30`,
        '[&.dark]:': `bg-scope-dark-${d} text-scope-light-2 shadow-black/30`,
      })
    ).toEqual(
      `bg-scope-light-${l} text-scope-dark-2 dark:bg-scope-dark-${d} dark:text-scope-light-2 dark:shadow-black/30 [&.dark]:bg-scope-dark-${d} [&.dark]:text-scope-light-2 [&.dark]:shadow-black/30`
    )
  })
})

describe('mergeShortcuts', () => {
  it('must merge shortcut objects', () => {
    const result = mergeVunorShortcuts([
      {
        i8: {
          '': 'color-black',
          'dark:': {
            'focus:': 'outline',
          },
        },
      },
      {
        i8: {
          'dark:': 'color-white',
        },
      },
      {
        i8: {
          'dark:': ['s2', 's3'],
        },
      },
      {
        i8: 'h-3rem',
      },
    ])
    expect(result).toEqual({
      i8: 'color-black dark:focus:outline dark:color-white dark:s2 dark:s3 h-3rem',
    })
  })
  it('must merge objects with no common props', () => {
    const result = mergeVunorShortcuts([{ prop1: 'val1' }, { prop2: 'val2' }])
    expect(result).toEqual({ prop1: 'val1', prop2: 'val2' })
  })
})

describe('replaceShortcut', () => {
  it.each([
    ['string', 'm-2 p-2', ['m-2 p-2']],
    ['array', ['m-2', 'p-2 c-red'], ['m-2 p-2 c-red']],
    ['object', { '': 'm-2', 'hover:': ['p-2', 'c-red'] }, ['m-2 hover:p-2 hover:c-red']],
  ])('a marked %s entry drops the earlier definitions of its name', (_form, value, classes) => {
    const result = mergeVunorShortcuts([
      { a: { '': 'old-1', 'dark:': 'old-2' }, b: 'keep' },
      { a: 'old-3' },
      { a: replaceShortcut(value) },
    ])
    expect(result).toEqual({ a: classes, b: 'keep' })
  })

  it('later normal entries append to a marked one', () => {
    const result = mergeVunorShortcuts([
      { a: 'old' },
      { a: replaceShortcut('m-2') },
      { a: 'p-2' },
      { a: { 'hover:': 'c-red' } },
    ])
    expect(result.a).toEqual(['m-2', 'p-2', 'hover:c-red'])
  })

  it('has no effect on a variant key', () => {
    expect(toUnoShortcut({ 'hover:': replaceShortcut('m-2 p-2') })).toBe('hover:m-2 hover:p-2')
  })

  it('appending to a reused marked entry leaves it unchanged', () => {
    const marked = replaceShortcut('m-2')
    mergeVunorShortcuts([{ a: marked }, { a: 'p-2' }])
    const result = mergeVunorShortcuts([{ a: marked }, { a: 'c-red' }])
    expect(result.a).toEqual(['m-2', 'c-red'])
    expect([...marked]).toEqual(['m-2'])
  })

  it('a later marked entry replaces an earlier marked one', () => {
    const result = mergeVunorShortcuts([
      { a: replaceShortcut('m-2') },
      { a: replaceShortcut('p-2') },
    ])
    expect(result.a).toEqual(['p-2'])
  })

  it('the mark survives a merge: the result still replaces when merged again', () => {
    // marked and appended to
    const appended = mergeVunorShortcuts([{ a: replaceShortcut('m-2') }, { a: 'p-2' }])
    // marked, in one list only
    const alone = mergeVunorShortcuts([{ b: 'x' }, { a: replaceShortcut('m-2') }])
    expect(mergeVunorShortcuts([{ a: 'old' }, appended]).a).toEqual(['m-2', 'p-2'])
    expect(mergeVunorShortcuts([{ a: 'old' }, alone]).a).toEqual(['m-2'])
  })
})
