import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const componentsDir = path.join(__dirname, 'src', 'components')
const packageJsonPath = path.join(__dirname, 'package.json')

// Function to read package.json
async function readPackageJson() {
  const data = await fs.promises.readFile(packageJsonPath, 'utf8')
  return JSON.parse(data)
}

// Function to write to package.json
async function writePackageJson(data) {
  const jsonString = JSON.stringify(data, null, 2)
  await fs.promises.writeFile(packageJsonPath, jsonString, 'utf8')
}

// Recursive function to find .vue files
async function findVueFiles(dir) {
  const files = await fs.promises.readdir(dir, { withFileTypes: true })
  let vueFiles = []
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      vueFiles = vueFiles.concat(await findVueFiles(fullPath))
    } else if (file.isFile() && file.name.endsWith('.vue')) {
      vueFiles.push(fullPath)
    }
  }
  return vueFiles
}

// Main function to update package.json
async function updatePackageExports() {
  try {
    const vueFiles = await findVueFiles(componentsDir)
    const packageJson = await readPackageJson()
    packageJson.exports = packageJson.exports || {}

    vueFiles.forEach(file => {
      const fileName = path.basename(file)
      const relativePath = `./${path.relative(__dirname, file)}`
      packageJson.exports[`./${fileName}`] = relativePath
    })

    await writePackageJson(packageJson)
    console.log('package.json has been updated with Vue component exports.')
  } catch (error) {
    console.error('Failed to update package.json:', error)
  }
}

updatePackageExports()
