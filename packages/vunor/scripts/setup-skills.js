#!/usr/bin/env node
/* prettier-ignore */
import fs from 'fs'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SKILL_NAME = 'vunor'
const SKILL_SRC = path.join(__dirname, '..', 'skills', SKILL_NAME)

if (!fs.existsSync(SKILL_SRC)) {
  console.error(`No skills found at ${SKILL_SRC}`)
  console.error('Add your SKILL.md files to the skills/' + SKILL_NAME + '/ directory first.')
  process.exit(1)
}

const AGENTS = {
  'Claude Code': { dir: '.claude/skills',   global: path.join(os.homedir(), '.claude', 'skills') },
  'Cursor':      { dir: '.cursor/skills',   global: path.join(os.homedir(), '.cursor', 'skills') },
  'Windsurf':    { dir: '.windsurf/skills', global: path.join(os.homedir(), '.windsurf', 'skills') },
  'Codex':       { dir: '.codex/skills',    global: path.join(os.homedir(), '.codex', 'skills') },
  'OpenCode':    { dir: '.opencode/skills', global: path.join(os.homedir(), '.opencode', 'skills') },
}

const args = process.argv.slice(2)
const isGlobal = args.includes('--global') || args.includes('-g')
const isPostinstall = args.includes('--postinstall')
let installed = 0, skipped = 0

for (const [agentName, cfg] of Object.entries(AGENTS)) {
  const targetBase = isGlobal ? cfg.global : path.join(process.cwd(), cfg.dir)
  const agentRootDir = isGlobal
    ? path.dirname(cfg.global)
    : path.join(process.cwd(), path.dirname(cfg.dir))

  // In postinstall mode: silently skip agents that aren't set up in this project
  if (isPostinstall || isGlobal) {
    if (!fs.existsSync(agentRootDir)) { skipped++; continue }
  }

  const dest = path.join(targetBase, SKILL_NAME)
  try {
    fs.mkdirSync(dest, { recursive: true })
    fs.cpSync(SKILL_SRC, dest, { recursive: true })
    console.log(`✅  ${agentName}: installed to ${dest}`)
    installed++
  } catch (err) {
    console.warn(`⚠️   ${agentName}: failed — ${err.message}`)
  }
}

if (installed === 0 && isPostinstall) {
  // Silence is fine — no agents present, nothing to do
} else if (installed === 0 && skipped === Object.keys(AGENTS).length) {
  console.log('No agent directories detected. Try --global or run without it for project-local install.')
} else if (installed === 0) {
  console.log('Nothing installed. Run without --global to install project-locally.')
} else {
  console.log(`\n✨  Done! Restart your AI agent to pick up the "${SKILL_NAME}" skill.`)
  if (!isGlobal) {
    console.log('Tip: commit the .*/skills/ directories to share with your team,')
    console.log('     or add them to .gitignore if you prefer each developer to opt in.')
  }
}
