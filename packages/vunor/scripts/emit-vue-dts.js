/**
 * Generates .d.mts declaration files for Vue components using vue-tsc.
 *
 * 1. Runs vue-tsc to emit .vue.d.ts files to dist/dts-tmp/
 * 2. Maps each component export from package.json to its .vue.d.ts file
 * 3. Resolves and inlines local relative imports (e.g., ./utils, ./types)
 * 4. Writes bundled declarations to dist/{Name}.d.mts
 * 5. Cleans up the temporary directory
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const distDir = path.join(root, 'dist')
const dtsTmpDir = path.join(distDir, 'dts-tmp')

// Step 1: Run vue-tsc to emit declarations
console.log('Running vue-tsc to emit Vue component declarations...')
try {
  execSync('npx vue-tsc -p tsconfig.dts.json', { cwd: root, stdio: 'pipe' })
} catch (e) {
  // vue-tsc may exit with errors (e.g. type mismatches) but still emit declarations
  if (!fs.existsSync(dtsTmpDir)) {
    console.error('vue-tsc failed and no output was generated')
    process.exit(1)
  }
  console.log('vue-tsc completed with type warnings (declarations still emitted)')
}

// Step 2: Read package.json exports to find component entries
const pkgJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'))
const knownTsExports = new Set(['.', './package.json', './theme', './utils', './vite', './nuxt'])

// Cache for resolved local .d.ts file contents (keyed by absolute path)
const resolvedCache = new Map()

let copied = 0

for (const exportPath of Object.keys(pkgJson.exports)) {
  if (knownTsExports.has(exportPath)) continue
  const match = exportPath.match(/^\.\/(\w+)$/)
  if (!match) continue

  const name = match[1]

  // Find the .vue.d.ts file in dts-tmp
  const dtsFile = findFile(path.join(dtsTmpDir, 'components'), `${name}.vue.d.ts`)
  if (!dtsFile) {
    console.warn(`  WARNING: No .vue.d.ts found for ${name}`)
    continue
  }

  // Read and bundle (resolve local imports)
  const content = fs.readFileSync(dtsFile, 'utf-8')
  const bundled = bundleLocalImports(content, path.dirname(dtsFile))

  // Write to dist/{Name}.d.mts
  const destPath = path.join(distDir, `${name}.d.mts`)
  fs.writeFileSync(destPath, bundled, 'utf-8')
  copied++
}

console.log(`Bundled ${copied} component declaration files to dist/`)

// Step 3: Clean up temporary directory
fs.rmSync(dtsTmpDir, { recursive: true, force: true })
console.log('Cleaned up temporary dts-tmp directory')

/**
 * Resolves local relative imports in a .d.ts file by inlining the referenced types.
 * Only handles `import type { ... } from './...'` and `import { type ... } from './...'` patterns.
 * External imports (from packages like 'vue', 'reka-ui', 'vunor/utils') are left as-is.
 */
function bundleLocalImports(content, baseDir) {
  const localImportRe = /^import\s+(?:type\s+)?{([^}]+)}\s+from\s+['"](\.[^'"]+)['"]\s*;?\s*$/gm
  const inlinedTypes = []
  const processedFiles = new Set()

  const result = content.replace(localImportRe, (match, names, specifier) => {
    // Resolve the .d.ts file path
    let resolved = path.resolve(baseDir, specifier)
    if (!resolved.endsWith('.d.ts')) {
      // Try .d.ts extension
      if (fs.existsSync(resolved + '.d.ts')) {
        resolved = resolved + '.d.ts'
      } else if (fs.existsSync(resolved + '/index.d.ts')) {
        resolved = resolved + '/index.d.ts'
      } else {
        // Can't resolve — leave the import as-is
        return match
      }
    }

    if (processedFiles.has(resolved)) {
      // Already inlined this file, just remove the import
      return ''
    }
    processedFiles.add(resolved)

    // Read the .d.ts file and extract all exported declarations
    const helperContent = readAndProcessHelper(resolved)
    inlinedTypes.push(helperContent)

    // Remove this import line
    return ''
  })

  if (inlinedTypes.length === 0) return content

  return inlinedTypes.join('\n') + '\n' + result
}

/**
 * Reads a helper .d.ts file and converts exported declarations to local declarations.
 * - Strips `export` keywords from all declarations
 * - Preserves external imports (from packages like 'vue')
 * - Removes local relative imports within the helper
 */
function readAndProcessHelper(filePath) {
  if (resolvedCache.has(filePath)) return resolvedCache.get(filePath)

  const content = fs.readFileSync(filePath, 'utf-8')

  const result = content
    // Remove local relative imports
    .replace(/^import\s+.*from\s+['"]\..*['"];?\s*$/gm, '')
    // Convert `export declare` → `declare`
    .replace(/^export\s+declare\s+/gm, 'declare ')
    // Convert `export interface` → `interface`
    .replace(/^export\s+interface\s+/gm, 'interface ')
    // Convert `export type` → `type`
    .replace(/^export\s+type\s+/gm, 'type ')
    .trim()

  resolvedCache.set(filePath, result)
  return result
}

function findFile(dir, filename) {
  if (!fs.existsSync(dir)) return undefined
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const found = findFile(fullPath, filename)
      if (found) return found
    } else if (entry.name === filename) {
      return fullPath
    }
  }
}
