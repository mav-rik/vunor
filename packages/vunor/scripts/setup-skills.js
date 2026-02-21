#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')

const SKILL_NAME = 'vunor'

// Source skill folder ships inside this package
const SKILL_SRC = path.join(__dirname, '..', 'skills', SKILL_NAME)

if (!fs.existsSync(SKILL_SRC)) {
  console.error(`No skills found at ${SKILL_SRC}`)
  console.error('Add your SKILL.md files to the skills/' + SKILL_NAME + '/ directory first.')
  process.exit(1)
}

// Known agent skill directories (project-relative and global)
const AGENTS = {
  'Claude Code':  { dir: '.claude/skills',   global: path.join(os.homedir(), '.claude', 'skills') },
  'Cursor':       { dir: '.cursor/skills',   global: path.join(os.homedir(), '.cursor', 'skills') },
  'Windsurf':     { dir: '.windsurf/skills', global: path.join(os.homedir(), '.windsurf', 'skills') },
  'Codex':        { dir: '.codex/skills',    global: path.join(os.homedir(), '.codex', 'skills') },
  'OpenCode':     { dir: '.opencode/skills', global: path.join(os.homedir(), '.opencode', 'skills') },
}

const args = process.argv.slice(2)
const isGlobal = args.includes('--global') || args.includes('-g')

let installed = 0
let skipped = 0

for (const [agentName, cfg] of Object.entries(AGENTS)) {
  const targetBase = isGlobal ? cfg.global : path.join(process.cwd(), cfg.dir)
  const dest = path.join(targetBase, SKILL_NAME)

  // For global installs, only write if the agent's home dir already exists
  // (meaning the agent is actually installed on this machine)
  if (isGlobal) {
    const agentHome = path.dirname(cfg.global)
    if (!fs.existsSync(agentHome)) {
      skipped++
      continue
    }
  }

  try {
    fs.mkdirSync(dest, { recursive: true })
    fs.cpSync(SKILL_SRC, dest, { recursive: true })
    console.log(`\u2705  ${agentName}: installed to ${dest}`)
    installed++
  } catch (err) {
    console.warn(`\u26a0\ufe0f   ${agentName}: failed \u2014 ${err.message}`)
  }
}

if (installed === 0 && skipped === Object.keys(AGENTS).length) {
  console.log('No agent directories detected on this machine.')
  console.log('Try --global after installing an agent, or run without --global for project-local install.')
} else if (installed === 0) {
  console.log('Nothing installed. Run without --global to install project-locally.')
} else {
  console.log(`\n\u2728  Done! Restart your AI agent to pick up the "${SKILL_NAME}" skill.`)
  if (!isGlobal) {
    console.log('Tip: commit the generated .*/skills/ directories to share skills with your team.')
    console.log('     Or add them to .gitignore if you prefer each developer to opt in.')
  }
}
