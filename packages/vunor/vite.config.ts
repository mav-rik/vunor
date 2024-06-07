import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import RadixVueResolver from 'radix-vue/resolver'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
  },

  build: {
    lib: {
      // tell the build process to treat this project as library
      entry: ['src/lib.ts', 'src/theme.ts'],
      fileName: (format, entry) => entry + '.mjs',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        'radix-vue',
        'path',
        'fs',
        '@prostojs/palitra',
        '@unocss/preset-mini',
        '@vueuse/core',
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

      resolvers: [
        RadixVueResolver(),
        componentName => {
          if (componentName.startsWith('Preview'))
            return {
              name: 'default',
              as: componentName,
              from: `@/previews/${componentName.slice(7).toLowerCase()}.vue`,
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
