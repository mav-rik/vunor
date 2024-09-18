import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import dts from 'vite-plugin-dts'

import fs from 'fs'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

// export const nestedComponents = {
//   InputBase: 'Input',
//   CardHeader: 'Card',
//   CardInner: 'Card',
//   LoadingIndicator: 'Loading',
//   MenuItem: 'Menu',
//   SelectBase: 'Select',
//   ButtonBase: 'Button',
// } as Record<string, string | undefined>

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
  },

  define: {
    __vue_files__: JSON.stringify(vueFiles, null, '  '),
  },

  build: {
    lib: {
      entry: ['src/theme.ts', 'src/vite.ts', 'src/nuxt.ts', 'src/utils.ts', 'src/vunor.ts'],
      fileName: (format, entry) => entry + '.mjs',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        'radix-vue',
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
    },
  },

  plugins: [
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
      exclude: ['src/previews'],
      compilerOptions: { moduleResolution: 2 },
      include: ['components.d.ts', 'auto-imports.d.ts', 'env.d.ts', 'src/**/*', 'src/**/*.vue'],
    }),
    UnoCSS(),
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
