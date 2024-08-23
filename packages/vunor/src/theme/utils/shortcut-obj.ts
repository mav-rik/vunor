/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
/* eslint-disable sonarjs/no-nested-template-literals */

import type { TVunorShortcut } from './define-sc'

/**
 * Build uno shortcut from vunor shortcut object
 * @param obj - shortcut object
 * @returns string
 */
export function toUnoShortcut(obj: TVunorShortcut): string {
  let s = ''
  for (const [key, val] of Object.entries(obj)) {
    const a = prepareScArray(val as TVunorShortcut)
    s += `${a.map(v => `${key}${v}`).join(' ')} `
  }
  return s.trim()
}

function prepareScArray(input: string | string[] | TVunorShortcut): string[] {
  if (typeof input === 'string') {
    return input.split(' ')
  }
  if (Array.isArray(input)) {
    return input
  }
  const a = []
  for (const [key, val] of Object.entries(input)) {
    a.push(...prepareScArray(val as TVunorShortcut).map(v => `${key}${v}`))
  }
  return a
}

/**
 * Merges source vunor shortcut with target vunor shortcut
 * The target vunor shortcut has more power
 *
 * @param target TVunorShortcut
 * @param source TVunorShortcut
 * @returns TVunorShortcut
 */
const mergeTwoVunorShortcuts = (target: TVunorShortcut, source: TVunorShortcut): TVunorShortcut => {
  const result = {} as TVunorShortcut
  const keys = new Set([...Object.keys(source), ...Object.keys(target)])
  // eslint-disable-next-line guard-for-in
  for (const key of Array.from(keys)) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
      result[key] = target[key]
      // eslint-disable-next-line unicorn/no-negated-condition
    } else if (!Object.prototype.hasOwnProperty.call(target, key)) {
      result[key] = source[key]
    } else {
      let sourceValue = source[key]
      let targetValue = target[key]

      if (Array.isArray(sourceValue)) {
        sourceValue = sourceValue.join(' ')
      }
      if (Array.isArray(targetValue)) {
        targetValue = targetValue.join(' ')
      }

      if (typeof sourceValue === 'string' && typeof targetValue === 'string') {
        result[key] = `${targetValue} ${sourceValue}`
      } else if (typeof sourceValue === 'object' && typeof targetValue === 'string') {
        result[key] = `${targetValue} ${toUnoShortcut(sourceValue)}`
      } else if (typeof sourceValue === 'string' && typeof targetValue === 'object') {
        result[key] = `${toUnoShortcut(targetValue)} ${sourceValue}`
      } else if (typeof sourceValue === 'object' && typeof targetValue === 'object') {
        result[key] = `${toUnoShortcut(targetValue)} ${toUnoShortcut(sourceValue)}`
      }
    }
  }
  return result
}

/**
 * Merges an array of vunor shortcuts
 * Items from the beginning have less priority
 *
 * @param shortcuts TVunorShortcut[]
 * @returns TVunorShortcut
 */
export const mergeVunorShortcuts = (shortcuts: TVunorShortcut[]): TVunorShortcut =>
  shortcuts.reduce((acc, shortcut) => mergeTwoVunorShortcuts(acc, shortcut), {})
