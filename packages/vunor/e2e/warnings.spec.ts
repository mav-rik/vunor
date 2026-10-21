import fs from 'node:fs'
import path from 'node:path'

import { test, expect } from './test'

// the Vue-warning check lives in ./test: a spec importing `test` straight from
// @playwright/test would skip it
test('every e2e spec uses the warning-checking `test` from ./test', () => {
  const dir = import.meta.dirname
  const bypassing = fs
    .readdirSync(dir)
    .filter(file => file.endsWith('.spec.ts'))
    .filter(file =>
      /import\s*\{[^}]*\btest\b[^}]*\}\s*from\s*(['"])@playwright\/test\1/.test(
        fs.readFileSync(path.join(dir, file), 'utf8')
      )
    )
  expect(bypassing).toEqual([])
})
