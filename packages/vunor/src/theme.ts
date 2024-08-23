import { shortcuts as sc } from './components/shortcuts'
import { c8 } from './theme/shortcuts/c8'
import { i8 } from './theme/shortcuts/i8'
import type { TVunorShortcut } from './theme/utils/define-sc'
import { mergeVunorShortcuts, toUnoShortcut } from './theme/utils/shortcut-obj'

export type {
  TVunorLayerPaletteAdvanced,
  TVunorMainPaletteAdvanced,
  TVunorPaletteColor,
  TVunorPaletteOptions,
  TVunorSurfaceConfig,
} from './theme/palitra'
export { presetVunor } from './theme/preset-vunor'
export type { TVunorTheme } from './theme/theme'
export type { TVunorShortcut } from './theme/utils/define-sc'
export { defineShortcuts } from './theme/utils/define-sc'
export { mergeVunorShortcuts, toUnoShortcut } from './theme/utils/shortcut-obj'

/**
 * Array of raw vunor shortcuts (not merged)
 */
export const rawVunorShortcuts = [i8, c8, ...sc]

/**
 * Vunor shortcuts (merged version of rawVunorShortcuts)
 */
export const mergedVunorShortcuts = mergeVunorShortcuts(rawVunorShortcuts)

/**
 * Builds uno shortcuts consumable by uno, extendable with customShortcuts
 *
 * @param customShortcuts your custom vunor shortcut with highest priority
 * @param baseShortcuts (default: mergedVunorShortcuts)
 * @returns
 */
export function vunorShortcuts(
  customShortcuts?: TVunorShortcut,
  baseShortcuts = mergedVunorShortcuts
) {
  const merged = customShortcuts
    ? mergeVunorShortcuts([baseShortcuts, customShortcuts])
    : baseShortcuts
  for (const [key, val] of Object.entries(merged)) {
    merged[key] = typeof val === 'string' ? val : toUnoShortcut(val as TVunorShortcut)
  }
  return merged as Record<string, string>
}
