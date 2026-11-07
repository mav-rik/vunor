import { execSync } from 'child_process'
import { readFileSync } from 'fs'

// Bump with --no-git-tag-version and commit/tag ourselves after sync, so the tag lands on the
// commit that carries the new version in every package.json. The tag is annotated because
// `git push --follow-tags` only pushes annotated tags.

const bump = process.argv[2] ?? 'patch'
if (!['patch', 'minor', 'major'].includes(bump)) {
  console.error(`Unknown bump "${bump}": use patch, minor or major`)
  process.exit(1)
}

const run = cmd => execSync(cmd, { stdio: 'inherit' })
const versionOf = file => JSON.parse(readFileSync(file, 'utf8')).version

if (execSync('git status --porcelain', { encoding: 'utf8' }).trim()) {
  console.error('Working tree is not clean: commit or stash first')
  process.exit(1)
}

run('pnpm run test')
run(`pnpm version ${bump} --no-git-tag-version`)
run('node ./scripts/sync')

const version = versionOf('package.json')
if (versionOf('packages/vunor/package.json') !== version) {
  console.error(`packages/vunor/package.json was not synced to ${version}`)
  process.exit(1)
}

run('pnpm run build')
run('git add package.json packages/*/package.json')
run(`git commit -m "chore: release v${version}"`)
run(`git tag -a v${version} -m v${version}`)
run('git push --follow-tags')
run('pnpm run pub')
