import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const componentsDir = path.join(__dirname, 'src', 'components')

function findVueFiles(dir: string): string[] {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  let vueFiles: string[] = []
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

const vueFiles = findVueFiles(componentsDir).map((file) => path.basename(file).slice(0, -4))

export default defineConfig({
  input: {
    theme: 'src/theme.ts',
    vite: 'src/vite.ts',
    nuxt: 'src/nuxt.ts',
    utils: 'src/utils.ts',
    vunor: 'src/vunor.ts',
  },
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: '[name].mjs',
  },
  define: {
    __vue_files__: JSON.stringify(vueFiles),
  },
  external: [
    'vue',
    'vue-router',
    'reka-ui',
    'path',
    'fs',
    '@prostojs/palitra',
    '@unocss/preset-mini',
    '@vueuse/core',
    'unplugin-vue-components',
    'defu',
    'unocss',
    'util',
    'os',
    'node:process',
    'node:assert',
    'node:path',
    'node:fs/promises',
    'node:fs',
    'node:url',
    'node:module',
    'node:util',
    'node:v8',
    'child_process',
    'stream',
    'buffer',
    'assert',
    'events',
    '@nuxt/kit',
    '@nuxt/schema',
    'vunor',
    'vunor/utils',
  ],
  resolve: {
    alias: {
      'vunor/utils': path.resolve(__dirname, 'src/utils'),
      'vunor': path.resolve(__dirname, 'src/vunor'),
    },
  },
  plugins: [
    dts({
      tsconfig: './tsconfig.node.json',
    }),
  ],
})
