import { describe, expect, it } from 'vitest'

import { mergeVunorShortcuts } from '../utils/shortcut-obj'
import { rawVunorShortcuts } from './raw'

// scripts/extract-component-classes.ts and src/theme.ts both feed this list
// into the same merge pipeline. The original bug — fixed by extracting raw.ts
// — was that btn / menu / popupCard / disabledSoft were missing from the
// script's local copy, so their classes never reached componentClasses. This
// test guards the invariant directly: every documented public primitive must
// be reachable from rawVunorShortcuts.
describe('rawVunorShortcuts', () => {
  const merged = mergeVunorShortcuts(rawVunorShortcuts)

  it.each([
    // Public composition primitives (skills/vunor/references/shortcuts.md)
    'btn',
    'btn-round',
    'btn-square',
    'btn-label',
    'btn-icon',
    'menu-root',
    'menu-item',
    'popup-card',
    'shadow-popup',
    'disabled-soft',
    'i8-bare',
    // Core c8 (clickable) family
    'c8-filled',
    'c8-flat',
    'c8-flat-selected',
    'c8-outlined',
    'c8-chrome',
    'c8-light',
    // Core i8 (input) family
    'i8',
    'i8-input',
    'i8-textarea',
    'i8-label',
  ])('exposes %s', key => {
    expect(merged).toHaveProperty(key)
  })
})
