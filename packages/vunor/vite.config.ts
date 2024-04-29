import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import RadixVueResolver from 'radix-vue/resolver'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  plugins: [
    UnoCSS(),
    vue(),
    Components({
      dts: true,

      resolvers: [
        RadixVueResolver(),
        componentName => {
          console.log(componentName)
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
