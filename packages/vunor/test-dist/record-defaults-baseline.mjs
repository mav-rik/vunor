// Records defaults-baseline.json: what default usage of every wrapper in contract.mjs
// passes to its wrapped components, measured on a RELEASED vunor (the baseline is 0.3.2).
//
//   npm pack vunor@0.3.2 && tar xzf vunor-0.3.2.tgz        # -> ./package
//   node test-dist/record-defaults-baseline.mjs ./package
//
// It copies this test-dist into that package (so `vunor/*` resolves to its dist) and
// runs mount-dist.mjs there in both Vue runtimes. Re-record only when contract.mjs gains
// targets; intended default changes go to `defaultChanges` instead.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import { wrappers } from './contract.mjs'

// 0.3.2's VuOverflowContainer never finishes mounting without a layout engine
const UNMEASURABLE = { OverflowContainer: 'hangs on mount in 0.3.2 (zero-width fit loop)' }

const here = import.meta.dirname
const target = path.resolve(process.argv[2] ?? '')
const released = JSON.parse(fs.readFileSync(path.join(target, 'package.json'), 'utf8'))
fs.cpSync(here, path.join(target, 'test-dist'), { recursive: true })
if (!fs.existsSync(path.join(target, 'node_modules'))) {
  fs.symlinkSync(path.join(here, '..', 'node_modules'), path.join(target, 'node_modules'))
}

const baseline = { recordedFrom: `vunor@${released.version}` }
for (const nodeEnv of ['production', 'development']) {
  const outFile = path.join(target, `defaults-${nodeEnv}.json`)
  execFileSync(process.execPath, [path.join(target, 'test-dist', 'mount-dist.mjs'), outFile], {
    cwd: target,
    env: {
      ...process.env,
      NODE_ENV: nodeEnv,
      VUNOR_DIST_SKIP: Object.keys(UNMEASURABLE).join(','),
    },
    stdio: 'ignore',
  })
  const report = JSON.parse(fs.readFileSync(outFile, 'utf8'))
  const defaults = Object.fromEntries(
    Object.entries(report.defaults).map(([name, r]) => [name, { props: r.props }])
  )
  for (const [wrapperName, reason] of Object.entries(UNMEASURABLE)) {
    for (const t of wrappers[wrapperName].targets) {
      defaults[`${wrapperName} → ${t.root.replace(/^vunor\//, '')}`] = {
        props: `unmeasurable: ${reason}`,
      }
    }
  }
  baseline[nodeEnv] = defaults
}
fs.writeFileSync(
  path.join(here, 'defaults-baseline.json'),
  `${JSON.stringify(baseline, null, 2)}\n`
)
console.log(`recorded ${path.join(here, 'defaults-baseline.json')} from vunor@${released.version}`)
