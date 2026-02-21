---
name: vunor
description: "Vunor — Vue 3 / Nuxt 3 UI library and UnoCSS theme engine. Use this skill when working with: presetVunor, vunorShortcuts, defineShortcuts, mergeVunorShortcuts, VunorVueResolver, Vu-prefixed components (VuButton, VuInput, VuSelect, VuCombobox, VuCard, VuDialog, VuTabs, VuCheckbox, VuRadioGroup, VuSlider, VuDatePicker, VuMenu, VuAppLayout, VuIcon, VuPopover), vunor UnoCSS custom rules (scope-*, current-*, layer-*, surface-*, text-h1/text-body/text-label typography, text-mt-*/text-mb-* text margins, $xxs/$xs/$s/$m/$l/$xl/$xxl spacing tokens, card-* card spacing, fingertip-* touch targets, c8-filled/c8-flat/c8-outlined/c8-light clickable styles, i8-flat/i8-filled/i8-round input styles, i8-border-*/i8-bg-*/i8-outline-* input rules, icon-color/icon-size/icon-opacity-*, bg-current/text-current/icon-current/border-current current-color system), vunor Oklab perceptual color palette, vunor golden-ratio typography and spacing, vunor shortcut objects. Import paths: vunor, vunor/theme, vunor/utils, vunor/vite, vunor/nuxt."
---

# vunor

A UnoCSS theme engine that derives a complete design system from mathematical constants (golden ratio, Oklab color model) — plus 30+ accessible Vue 3 components built on Reka UI. All styling is UnoCSS-only with no CSS files.

## How to use this skill

Read the domain file that matches the task. Do not load all files — only what you need.

| Domain | File | Load when... |
|--------|------|-------------|
| Core concepts & setup | [core.md](core.md) | Installing vunor, setting up Vue+Vite or Nuxt, understanding the mental model |
| Color palette | [palette.md](palette.md) | Configuring colors, using layers/surfaces/scopes, understanding the current-color system |
| Typography & spacing | [typography.md](typography.md) | Using text utilities, spacing tokens, fingertip sizes, card spacing |
| Shortcut objects | [shortcuts.md](shortcuts.md) | Customizing component styles, understanding c8/i8 systems, merging shortcuts |
| Components overview | [components.md](components.md) | Using layout, action, feedback, or utility components (Card, Dialog, Button, Tabs, etc.) |
| Form components | [forms.md](forms.md) | Using Input, Select, Combobox, Checkbox, RadioGroup, Slider, DatePicker |
| UnoCSS custom rules | [rules.md](rules.md) | Understanding exact rule patterns, CSS custom properties, i8-*/scope-*/current-*/card-*/fingertip-*/icon-* rules |

## High-level guide

### Color scope — required foundation

**`scope-{color}` must be set at the root level** (`<html>`, `<body>`, or your app wrapper). It defines the default palette for the entire page — layers, surfaces, buttons, inputs, and all components depend on it. Without a scope, no colors are available.

```html
<html class="scope-primary">        <!-- sets the default palette for the whole app -->
  <body class="layer-0">            <!-- page background using that palette -->
```

You can override the scope on any subtree for a different palette:

```html
<body class="scope-primary layer-0">
  <main>                             <!-- inherits scope-primary -->
    <div class="scope-error">        <!-- this subtree uses error palette -->
      <button class="c8-filled">Delete</button>
    </div>
  </main>
</body>
```

See [palette.md](palette.md) for color configuration and details.

### Backgrounds: layers and surfaces

Use `scope-{color}` to set the active palette, then apply backgrounds:

- **`layer-0` through `layer-4`** — screen/page backgrounds. `layer-0` is the outermost (lightest in light mode, darkest in dark). Each layer steps progressively deeper. Layers auto-adapt to light/dark mode. Control the brightness difference between layers via `palette.layersDepth` in [palette.md](palette.md).

- **`surface-50` through `surface-900`** — colored blocks, banners, callouts. These map to the main 10-step palette and apply a full bg + text + icon set. `surface-0`–`surface-4` map to the layer scale. Configure via `palette.surfaces` — see [palette.md](palette.md).

```html
<div class="layer-0 scope-primary">           <!-- page background -->
  <div class="layer-1">                       <!-- card/section -->
    <div class="surface-100">info banner</div> <!-- colored block -->
    <div class="surface-500">bold accent</div>
  </div>
</div>
```

### Interactive elements: c8 and i8

- **`c8-filled` / `c8-flat` / `c8-outlined` / `c8-light`** — clickable styles for buttons and interactive elements. Each includes hover, active, focus, and disabled states. Always pair with `scope-{color}`. See [shortcuts.md](shortcuts.md).

- **`i8-flat` / `i8-filled` / `i8-round`** — input field styles with floating labels, underlines, and focus states. Used by `VuInput`, `VuSelect`, `VuCombobox`. See [shortcuts.md](shortcuts.md) and [forms.md](forms.md).

```html
<button class="scope-primary c8-filled">Save</button>
<button class="scope-error c8-flat">Cancel</button>
<VuInput v-model="name" label="Name" design="filled" />
```

### Spacing and typography

Golden-ratio spacing tokens work with all UnoCSS spacing utilities (`p-`, `m-`, `gap-`, etc.):

| Token | ~Value | Usage |
|-------|--------|-------|
| `$xxs` | 0.24em | Tiny gaps |
| `$xs` | 0.38em | Compact spacing |
| `$s` | 0.62em | Small spacing |
| `$m` | 1em | Standard spacing |
| `$l` | 1.62em | Large spacing |
| `$xl` | 2.62em | Section spacing |
| `$xxl` | 4.24em | Page-level spacing |

Typography utilities (`text-h1`..`text-caption`) set font size, weight, line height, and letter spacing in one class. Use `text-mt-*` / `text-mb-*` for optically-corrected margins between text blocks. See [typography.md](typography.md).

```html
<h1 class="text-h1 text-mb-$m">Title</h1>
<p class="text-body p-$s">Content with golden-ratio spacing</p>
```

## Quick reference

```ts
// Setup
import { presetVunor, vunorShortcuts } from 'vunor/theme'
import { VunorVueResolver } from 'vunor/vite'

// UnoCSS config
presets: [presetVunor({ palette: { colors: { primary: '#6B4EFF' } } })]
shortcuts: [vunorShortcuts()]

// Components auto-import (Vite)
resolvers: [VunorVueResolver]  // maps <VuButton> → import from 'vunor/Button'

// Nuxt — just add the module
modules: ['vunor/nuxt']
```
