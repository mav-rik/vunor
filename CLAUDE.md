# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vunor is a Vue 3 UI component library built on UnoCSS. It provides a custom UnoCSS preset (`presetVunor`), typed shortcut objects, a palette generation engine, and reusable Vue 3 components. Supports Vue 3 + Vite and Nuxt 3.

## Repository Structure

pnpm workspace monorepo with a single publishable package at `packages/vunor/`. All development happens there.

## Commands

All commands run from `packages/vunor/`:

```bash
pnpm dev              # Start dev server (component preview app)
pnpm build            # Build library to dist/
pnpm type-check       # vue-tsc --build --force
pnpm lint             # oxlint
pnpm fmt              # oxfmt (format all files)
pnpm fmt:check        # oxfmt --check (CI check)
```

Tests (vitest, no `test` script defined — run directly):

```bash
pnpm exec vitest run                                    # Run all tests
pnpm exec vitest run src/theme/utils/shortcut-obj.spec.ts  # Run a single test file
pnpm exec vitest                                        # Watch mode
```

Root-level release workflow:

```bash
pnpm release    # test → version bump → sync → build → git push → publish
```

## Architecture

### Styling: UnoCSS Only

All visual styling uses UnoCSS class strings — no CSS files or scoped styles. Component appearance is defined through UnoCSS shortcuts, rules, and CSS custom properties.

### Shortcut Object Pattern

Component styles use `defineShortcuts()` which creates structured nested objects instead of flat strings:

```typescript
defineShortcuts({
  'btn': {
    '': 'h-fingertip flex items-center',   // base
    'hover:': 'bg-current/05',              // variant prefix
    'dark:': 'text-white',
    '[&.btn-round]:': 'rounded-full',       // selector modifier
  }
})
```

`toUnoShortcut()` flattens these to UnoCSS strings. `mergeVunorShortcuts()` merges arrays with priority (later wins). Defined in `src/theme/utils/`.

### Color Scope System

Custom UnoCSS rules enable color scoping without hardcoded values:
- `scope-primary` — sets `--scope-color-*` CSS vars to a palette
- `current-bg-primary-500` — sets `--current-bg` to a specific color
- `bg-current` / `text-current` / `icon-current` — applies current-scoped colors
- `layer-0` through `layer-4` — full light/dark background+text+icon layers

Semantic palette colors: `primary`, `secondary`, `good`, `warn`, `error`, `grey`, `neutral`.

### Provide/Inject (PI) Pattern

Typed parent-child communication via `useProvideInject` helper (`src/components/utils/provide-inject.ts`):

```typescript
// Parent: useInputPi().provide()
// Child:  useInputPi().inject(...)
```

Each component folder with a `pi.ts` file defines its own PI composable.

### Component Conventions

- All components use `Vu` prefix in templates: `<VuButton>`, `<VuInput>`, `<VuCard>`
- Source files omit prefix: `Button.vue`, `Input.vue`
- `VunorVueResolver` (from `vunor/vite`) maps `VuButton` → `import from 'vunor/Button.vue'`
- Nuxt module (`vunor/nuxt`) auto-registers all `Vu*` components
- Radix Vue `<Primitive>` is used as the polymorphic base element in components

### Typography & Sizing

- Typography uses golden ratio scale (`k = 1.618`). Type names are UnoCSS utilities: `text-h1`, `text-body`, `text-label`
- Touch targets controlled via `--v-fingertip` CSS variable: `fingertip-xs` through `fingertip-xl`
- `card-<typography>` sets `--card-spacing` based on heading size for harmonious padding

### Package Exports

Five JS entry points plus individual `.vue` component files:
- `vunor` — PI composables
- `vunor/theme` — UnoCSS preset, shortcuts, palette
- `vunor/utils` — `mergeCssClasses`, `useProvideInject`
- `vunor/vite` — `VunorVueResolver`
- `vunor/nuxt` — Nuxt 3 module

## Code Style

- Formatter: oxfmt (`.oxfmtrc.json`) — no semicolons, single quotes, trailing commas (es5), 100 char width, import sorting
- Linter: oxlint (`.oxlintrc.json`) with `import`, `typescript`, `unicorn`, `promise` plugins
