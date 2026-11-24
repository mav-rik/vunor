import { rawVunorShortcuts } from './theme/shortcuts/raw'
import { mergeVunorShortcuts, toClassString } from './theme/utils/shortcut-obj'

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
export { whenDisabled, whenEnabled } from './theme/utils/disabled'
export { whenCanHover, whenHover, whenHoverIdle } from './theme/utils/hover'
export { rawVunorShortcuts } from './theme/shortcuts/raw'
export { mergeVunorShortcuts, replaceShortcut, toUnoShortcut } from './theme/utils/shortcut-obj'

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
  const result: Record<string, string> = {}
  for (const [key, val] of Object.entries(merged)) {
    result[key] = toClassString(val)
  }
  return result
}

export { componentClasses, getComponentClasses } from './theme/generated/component-classes'
