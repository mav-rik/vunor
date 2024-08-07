import { shortcuts as sc } from './components/shortcuts'
import { c8 } from './theme/shortcuts/c8'
import { i8 } from './theme/shortcuts/i8'
import type { TVunorShortcut } from './theme/utils/define-sc'
import { mergeAllShortcuts, scFromObject } from './theme/utils/shortcut-obj'

export { presetVunor } from './theme/preset-vunor'
export type { TVunorTheme } from './theme/theme'
export { defineShortcuts } from './theme/utils/define-sc'
export { scFromObject } from './theme/utils/shortcut-obj'

export const shortcuts = mergeAllShortcuts([i8, c8, ...sc])
export function vunorShortcuts(customShortcuts?: TVunorShortcut) {
  const merged = customShortcuts ? mergeAllShortcuts([shortcuts, customShortcuts]) : shortcuts
  for (const [key, val] of Object.entries(merged)) {
    merged[key] = typeof val === 'string' ? val : scFromObject(val as TVunorShortcut)
  }
  return merged as Record<string, string>
}
