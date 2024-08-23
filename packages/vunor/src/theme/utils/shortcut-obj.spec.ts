import { describe, expect, it } from 'vitest'

import { mergeVunorShortcuts, toUnoShortcut } from './shortcut-obj'

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
