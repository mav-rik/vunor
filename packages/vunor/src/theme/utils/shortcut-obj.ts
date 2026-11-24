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
    return input.flatMap(item => item.split(' '))
  }
  const a = []
  for (const [key, val] of Object.entries(input)) {
    a.push(...prepareScArray(val as TVunorShortcut).map(v => `${key}${v}`))
  }
  return a
}

// Registry symbol, so a value marked by one copy of vunor is recognised by another
const REPLACE = Symbol.for('vunor.replaceShortcut')

/** A shortcut value as one UnoCSS class string */
export const toClassString = (value: string | string[] | TVunorShortcut | undefined = ''): string =>
  typeof value === 'string' ? value : Array.isArray(value) ? value.join(' ') : toUnoShortcut(value)

const markReplacement = (classes: string[]): string[] =>
  Object.defineProperty(classes, REPLACE, { value: true })

const isReplacement = (value: unknown): value is string[] =>
  Array.isArray(value) && REPLACE in value

/**
 * Marks a top-level shortcut entry as a replacement: when shortcuts are merged
 * (`mergeVunorShortcuts`, `vunorShortcuts`), it drops every earlier definition of
 * the same name instead of merging into it. Later entries still merge on top of it.
 *
 * @example
 * vunorShortcuts(defineShortcuts({ press: replaceShortcut({ 'active:': 'scale-95' }) }))
 *
 * @param value the shortcut, in any form a normal entry accepts
 * @returns the shortcut's class string in a marked array
 */
export const replaceShortcut = (value: string | string[] | TVunorShortcut): string[] =>
  markReplacement([toClassString(value)])

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
  for (const key of Array.from(keys)) {
    const inSource = Object.prototype.hasOwnProperty.call(source, key)
    const inTarget = Object.prototype.hasOwnProperty.call(target, key)
    const targetEntry = target[key]
    if (inSource && isReplacement(source[key])) {
      // a replacement drops everything before it
      result[key] = source[key]
    } else if (inSource && inTarget && isReplacement(targetEntry)) {
      // later entries append to a replacement, which stays one
      result[key] = markReplacement([...targetEntry, toClassString(source[key])])
    } else if (inSource && inTarget) {
      let sourceValue = source[key]
      let targetValue = targetEntry

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
    } else if (inSource) {
      result[key] = source[key]
    } else {
      result[key] = target[key]
    }
  }
  return result
}

/**
 * Merges an array of vunor shortcuts
 * Items from the beginning have less priority. An entry marked with
 * `replaceShortcut` drops the earlier entries of its name.
 *
 * @param shortcuts TVunorShortcut[]
 * @returns TVunorShortcut
 */
export const mergeVunorShortcuts = (shortcuts: TVunorShortcut[]): TVunorShortcut =>
  shortcuts.reduce((acc, shortcut) => mergeTwoVunorShortcuts(acc, shortcut), {})
