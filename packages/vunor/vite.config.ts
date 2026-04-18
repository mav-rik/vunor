import fs from 'fs'
import { fileURLToPath, URL } from 'node:url'
import path from 'path'

import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitest/config'

const __filename = import.meta.filename
const __dirname = import.meta.dirname

const componentsDir = path.join(__dirname, 'src', 'components')

// Recursive function to find .vue files
function findVueFiles(dir: string) {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  let vueFiles = [] as string[]
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      vueFiles = vueFiles.concat(findVueFiles(fullPath))
    } else if (file.isFile() && file.name.endsWith('.vue')) {
      vueFiles.push(fullPath)
    }
  }
  return vueFiles
}

const vueFiles = findVueFiles(componentsDir).map(file => path.basename(file).slice(0, -4))

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
  },

  define: {
    __vue_files__: JSON.stringify(vueFiles, null, '  '),
  },

  plugins: [
    UnoCSS(),
    vue(),
  ],
  test: {
    exclude: ['e2e/**', 'node_modules/**'],
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vunor/utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      'vunor': fileURLToPath(new URL('./src/vunor', import.meta.url)),
    },
  },
})
