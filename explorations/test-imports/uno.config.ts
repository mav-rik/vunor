import { defineConfig } from 'unocss'
import { presetVunor, vunorShortcuts } from 'vunor/theme'

export default defineConfig({
  presets: [presetVunor()],
  shortcuts: [vunorShortcuts()],
})
