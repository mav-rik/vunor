/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import type { TVunorShortcut } from './define-sc'

/* eslint-disable sonarjs/no-nested-template-literals */
export function scFromObject(obj: TVunorShortcut): string {
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

export const mergeShortcuts = (target: TVunorShortcut, source: TVunorShortcut): TVunorShortcut => {
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
        result[key] = `${targetValue} ${scFromObject(sourceValue)}`
      } else if (typeof sourceValue === 'string' && typeof targetValue === 'object') {
        result[key] = `${scFromObject(targetValue)} ${sourceValue}`
      } else if (typeof sourceValue === 'object' && typeof targetValue === 'object') {
        result[key] = `${scFromObject(targetValue)} ${scFromObject(sourceValue)}`
      }
    }
  }
  return result
}

export const mergeAllShortcuts = (shortcuts: TVunorShortcut[]): TVunorShortcut =>
  shortcuts.reduce((acc, shortcut) => mergeShortcuts(acc, shortcut), {})
