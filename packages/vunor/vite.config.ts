import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import RadixVueResolver from 'radix-vue/resolver'
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

export const nestedComponents = {
  InputShell: 'Input',
  CardHeader: 'Card',
  CardInner: 'Card',
  LoadingIndicator: 'Loading',
  MenuItem: 'Menu',
  SelectBase: 'Select',
  ButtonBase: 'Button',
} as Record<string, string | undefined>

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
      entry: ['src/theme.ts', 'src/vite.ts', 'src/nuxt.ts'],
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
    Components({
      dts: true,
      dirs: [],
      resolvers: [
        RadixVueResolver(),
        componentName => {
          if (componentName.startsWith('Preview')) {
            return {
              name: 'default',
              as: componentName,
              from: `@/previews/${componentName.slice(7).toLowerCase()}.vue`,
            }
          } else if (componentName.startsWith('Vu')) {
            const name = componentName.slice(2)
            return {
              name: 'default',
              as: componentName,
              from: `@/components/${nestedComponents[name] || name}/${name}.vue`,
            }
          }
        },
      ],
    }),
    AutoImport({
      dts: true,
      imports: ['vue'],
      resolvers: [
        {
          type: 'component',
          resolve: componentName => {
            if (componentName.startsWith('Preview'))
              return {
                name: 'default',
                as: componentName,
                from: `@/previews/${componentName.slice(7).toLowerCase()}.vue`,
              }
          },
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
