import fs from 'fs'
import path from 'path'

import { defineConfig } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'

const __dirname = import.meta.dirname

// Compile .vue files with Vue's production compiler build. @vue/compiler-core picks its
// dev or prod build from NODE_ENV when first loaded, and plugin-vue loads `vue` (which
// pulls the compiler in) on import, hence the dynamic import after setting it.
process.env.NODE_ENV = 'production'
const { default: vue } = await import('@vitejs/plugin-vue')

const componentsDir = path.join(__dirname, 'src', 'components')

// Read exported component entries from package.json (keys like "./Button" that map to ./dist/*.mjs)
const pkgJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'))
const vueEntries: Record<string, string> = {}

const knownTsExports = new Set(['.', './package.json', './theme', './utils', './vite', './nuxt'])
for (const exportPath of Object.keys(pkgJson.exports as Record<string, unknown>)) {
  if (knownTsExports.has(exportPath)) {
    continue
  }
  const match = exportPath.match(/^\.\/(\w+)$/)
  if (match) {
    const name = match[1]
    const sourcePath = findVueFile(componentsDir, `${name}.vue`)
    if (sourcePath) {
      vueEntries[name] = sourcePath
    }
  }
}

function findVueFile(dir: string, filename: string): string | undefined {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      const found = findVueFile(fullPath, filename)
      if (found) {
        return found
      }
    } else if (file.name === filename) {
      return fullPath
    }
  }
}

const vueFiles = Object.keys(vueEntries)

// Map from absolute .vue path → package import path (for externalizing cross-component imports)
const vueExternalMap = new Map<string, string>()
for (const [name, filePath] of Object.entries(vueEntries)) {
  vueExternalMap.set(filePath, `vunor/${name}`)
}

const ASSET_RE =
  /\.(css|scss|less|styl|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|mp[34]|webm|ogg|pdf)(\?.*)?$/

// Query-less id so no other plugin (e.g. plugin-vue's style transform) picks it up
const EMPTY_ASSET_ID = '\0vunor:empty-asset'

const sharedExternal = [
  'vue',
  'vue-router',
  'reka-ui',
  'path',
  'fs',
  '@prostojs/palitra',
  'defu',
  /^unocss(\/.*)?$/,
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
  /^@internationalized\//,
] satisfies Array<string | RegExp>

const sharedResolve = {
  alias: {
    'vunor/utils': path.resolve(__dirname, 'src/utils'),
    'vunor': path.resolve(__dirname, 'src/vunor'),
  },
}

// Config 1: .ts entry points with DTS generation
const tsConfig = defineConfig({
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
  // rolldown reads build-time constants from `transform.define` (a top-level `define` is
  // ignored and leaves the identifier unresolved in dist)
  transform: {
    define: {
      __vue_files__: JSON.stringify(vueFiles),
    },
  },
  external: sharedExternal,
  resolve: sharedResolve,
  plugins: [
    dts({
      tsconfig: './tsconfig.node.json',
    }),
  ],
})

// Config 2: .vue components compiled to JS (DTS generated separately via vue-tsc)
const vueConfig = defineConfig({
  input: vueEntries,
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: '[name].mjs',
  },
  external: sharedExternal,
  resolve: sharedResolve,
  plugins: [
    {
      // SFC <style> blocks and asset imports are not shipped (vunor styles via UnoCSS).
      // Resolve them to an empty side-effect-free module so the import disappears
      // from dist instead of leaking an unresolvable `\0stub:<abs path>` import.
      name: 'stub-assets',
      resolveId(source) {
        if (ASSET_RE.test(source)) {
          return { id: EMPTY_ASSET_ID, moduleSideEffects: false }
        }
      },
      load(id) {
        if (id === EMPTY_ASSET_ID) {
          return ''
        }
      },
    },
    {
      name: 'externalize-sibling-components',
      resolveId(source, importer) {
        if (!importer || !source.endsWith('.vue')) {
          return null
        }
        const importerClean = importer.split('?')[0]
        const resolved = path.resolve(path.dirname(importerClean), source)
        const externalPath = vueExternalMap.get(resolved)
        if (externalPath) {
          return { id: externalPath, external: true }
        }
      },
    },
    // Production SFC compilation. `comments: false` is explicit because comment
    // retention follows the NODE_ENV the compiler was loaded under, not `isProduction`.
    // A template comment next to the root element turns the root into a Fragment, and
    // the production Vue runtime then drops fallthrough attrs (class, @click, aria-*).
    vue({ isProduction: true, template: { compilerOptions: { comments: false } } }),
  ],
})

export default [tsConfig, vueConfig]
