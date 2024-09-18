/**
 * Represents the possible types for CSS classes in Vue components.
 * Can be a string, an array of strings, or an object with string keys and boolean or undefined values.
 */
export type TVueCssClass = string | string[] | Record<string, boolean | undefined>

/**
 * Merges CSS classes from various input types into a single object.
 *
 * @param {...(TVueCssClass | undefined)[]} args - CSS classes to merge. Can be strings, arrays of strings, objects, or undefined.
 * @returns {Record<string, boolean>} An object where keys are CSS class names and values are boolean flags.
 */
export function mergeCssClasses(...args: (TVueCssClass | undefined)[]): Record<string, boolean> {
  const result: Record<string, boolean> = {}

  for (const arg of args) {
    if (!arg) {
      continue
    }
    if (typeof arg === 'string') {
      result[arg] = true
    } else if (Array.isArray(arg)) {
      result[arg.join(' ')] = true
    } else if (typeof arg === 'object') {
      Object.assign(result, arg)
    }
  }

  return result
}
