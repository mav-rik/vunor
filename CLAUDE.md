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
- Reka UI `<Primitive>` is used as the polymorphic base element in components

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

## E2E Testing (Playwright)

E2E tests live in `packages/vunor/e2e/` and run against the dev preview app.

```bash
pnpm test:e2e                              # Run all e2e tests
pnpm exec playwright test e2e/input.spec.ts  # Run a single file
pnpm exec playwright test --ui              # Interactive debug mode
```

Config: `packages/vunor/playwright.config.ts` — Chromium only, auto-starts dev server on port 5179.

### Dev App Navigation

The preview app (`src/App.vue`) has **no URL routes**. Views are switched by clicking sidebar menu items (a `VuMenu` backed by Reka UI `ComboboxRoot`). The `navigateTo()` helper in `e2e/utils.ts` handles this:

```ts
await navigateTo(page, 'Inputs') // clicks the sidebar menu item
```

### Reka UI Gotchas for Selectors

1. **Sidebar is always-open ComboboxRoot** — it renders its own `[role="listbox"]` with `[role="option"]` items. Never use unscoped `page.getByRole('option')` or `page.locator('[role="listbox"]')` — they'll match sidebar elements too. Scope to `main` for triggers: `page.locator('main [role="combobox"]')`.

2. **Select popups portal to body** — Reka UI `SelectPortal` teleports the dropdown to `<body>`. Use `page.locator('.select-content')` to target the popup (this CSS class is applied directly to `SelectContent`).

3. **Hidden native `<select>` elements** — Reka UI renders invisible native `<select>/<option>` for form submission alongside custom UI. `getByRole('option')` and `[role="option"]` match BOTH native and custom options. Always scope popup options to `div[role="option"]` within the popup container:
   ```ts
   const popup = page.locator('.select-content')
   popup.locator('div[role="option"]', { hasText: 'Apple' })
   ```

4. **ARIA attributes, not HTML attributes** — Reka UI uses `aria-disabled="true"` (not `disabled`), `aria-required="true"` (not `required`), and `data-state="checked"|"unchecked"|"indeterminate"` for state.

5. **Port collisions** — The dev server defaults to port 5173 which may conflict with other Vite apps. Playwright config uses port 5179 with `reuseExistingServer: !process.env.CI`.

### Component CSS Classes for Selectors

- **Input**: `.i8` (wrapper), `input.i8-input` / `textarea.i8-textarea`, `label.i8-label`, `[aria-disabled="true"]`, `[data-has-value]`
- **Checkbox**: `label.checkbox-root`, `button.checkbox`, `.checkbox-indicator`, `[data-state="checked"|"unchecked"|"indeterminate"]`
- **RadioGroup**: `.rb-root`, `button.rb-item`, `label.rb-item-label`, `.rb-item-indicator`, `[data-state]`, `[data-disabled]`
- **Select**: `[role="combobox"]` (trigger), `.select-content` (popup), `.select-item` (items)

## Code Style

- Formatter: oxfmt (`.oxfmtrc.json`) — no semicolons, single quotes, trailing commas (es5), 100 char width, import sorting
- Linter: oxlint (`.oxlintrc.json`) with `import`, `typescript`, `unicorn`, `promise` plugins
