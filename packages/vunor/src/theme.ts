import { rawVunorShortcuts } from './theme/shortcuts/raw'
import { mergeVunorShortcuts, toUnoShortcut } from './theme/utils/shortcut-obj'

import type { TVunorShortcut } from './theme/utils/define-sc'

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
export { rawVunorShortcuts } from './theme/shortcuts/raw'
export { mergeVunorShortcuts, toUnoShortcut } from './theme/utils/shortcut-obj'

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

export { componentClasses, getComponentClasses } from './theme/generated/component-classes'
