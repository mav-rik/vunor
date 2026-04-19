# Feature request — `baseRadius`-derived radius utilities

## Problem

`baseRadius` is advertised as the single-knob control for corner rounding: set it once, and every vunor-idiomatic utility (`rounded-base`, `c8-*`, `i8-filled`, cards) tracks it. Setting `baseRadius: '0'` produces a fully square UI; setting `baseRadius: '12px'` a warm rounded one. The skill docs describe this as vunor's design philosophy.

But in practice, a real design system almost always needs **more than one radius size** in the same theme:

- Containers (cards, dialogs, popovers, table shells) want the full base radius — a clear "container" corner.
- Small controls (buttons, checkboxes, chips, tight indicator pills) want **less than** base — otherwise at `baseRadius: 8px` a 16px checkbox renders as a full circle.
- Hero surfaces / emphasized cards occasionally want **more than** base.

Today the only radius utility that tracks `baseRadius` is literally `rounded-base` and nothing else. To get "half of base" or "twice of base", a consumer has to reach for one of:

1. `rounded-$xs` / `rounded-$xxs` — *decouples from `baseRadius`* (these come from `spacing`, which is `em`-based and independent). At `baseRadius: '0'` they still render a visible corner, breaking the single-knob promise.
2. `rounded-[4px]` / `rounded-[0.28em]` — hardcoded literal, also decoupled, also breaks single-knob.
3. A parallel CSS variable in their own preset, synced by hand to `baseRadius` — what we ended up doing downstream, but it's redundant with vunor already owning the value.

None of these honour the "one knob, baseRadius=0 ⇒ everything flat" contract that the skill docs promise.

## Ask

Expose `baseRadius`-derived radius utilities that scale with the knob. **Exact naming, API, and whether to make the scale configurable is yours to design** — we'd just like the `rounded-*` utility set to cover the three sizes below.

### Three sizes we expect

| Intent | Value at `baseRadius: '8px'` | Value at `baseRadius: '0'` | Use case |
|---|---|---|---|
| **Minimum** — floored at `2px` unless base is zero | `2px` | `0` | Buttons, checkboxes, tight chips, small icon buttons. A floor is needed because proportional-only (e.g. "half of base") produces a visually invisible `1px` at small bases like `baseRadius: '2px'` — we still want *some* corner there, but respect the "flat everything" preset when the user explicitly chose `0`. |
| **Half** — `baseRadius × 0.5` | `4px` | `0` | Inputs and controls that should feel distinctly tighter than containers but still follow the knob. Alternative to minimum when the consumer wants proportional scaling rather than a floor. |
| **Twice** — `baseRadius × 2` | `16px` | `0` | Dialogs, hero cards, emphasized surfaces that want a rounder corner than the default container. |

Plus the existing **base** (= `baseRadius × 1`).

### Critical behaviour (single-knob promise)

All three must collapse to `0` when `baseRadius: '0'`, so the "flat everything" preset stays flat. A CSS `min()` / `calc()` formulation makes this trivial to express:

```ts
// illustrative; final shape is vunor's call
{
  'rounded-base': opts.baseRadius,
  'rounded-minimum': `min(2px, calc(${opts.baseRadius} * 9999))`,
  'rounded-half':    `calc(${opts.baseRadius} * 0.5)`,
  'rounded-twice':   `calc(${opts.baseRadius} * 2)`,
}
```

Names above are placeholders — `rounded-min` / `rounded-half` / `rounded-double`, or `rounded-base-sm` / `rounded-base-lg`, or something else entirely, all fine. The *behaviour* is what matters.

## Non-goals / out of scope

- Not asking for a change to `spacing` or the `$xxs..$xxl` scale — those should stay `em`-based and independent of `baseRadius`.
- Not requesting the new utilities leak into `width` / `height` / `padding` / `margin`. Keep them on `borderRadius` only.
- Not requesting a specific naming vocabulary — pick whatever fits vunor's style.
- Not requesting configurable multipliers as a hard requirement for v1 — a fixed sensible default is enough.

## Context / downstream use case

We hit this building atscript-ui (a forms + tables library on top of vunor). Our shortcuts currently use `rounded-base` for containers and have to hand-roll `--as-radius-half: calc(var(--as-radius-base) * 0.5)` preflights + `rounded-[var(--as-radius-half)]` for buttons and checkboxes, syncing `--as-radius-base` to the same value we pass into `presetVunor({ baseRadius })`. If vunor owns the scale natively, every consumer that builds on top (ours, and any future design system that uses vunor as the base layer) gets it for free.

## Acceptance criteria

- At `baseRadius: '0'`, the minimum / half / twice utilities all render `border-radius: 0`.
- At `baseRadius: '8px'`, minimum renders `2px`, half renders `4px`, twice renders `16px`.
- At a tiny non-zero base like `baseRadius: '1px'`, minimum still renders `2px` (the floor), while half renders `0.5px` — consumers choose between "floor-with-fallback" vs "strictly proportional" per-use-case.
- The set is available through `rounded-*` UnoCSS utilities (no manual CSS variable plumbing required by the consumer).
- New utilities only live on `borderRadius` (no leakage into `spacing`-derived rules like `p-*`, `w-*`, `m-*`).
- Skill docs ([theme.md](skills/vunor/references/theme.md) `baseRadius` subsection, [typography.md](skills/vunor/references/typography.md) radius table) updated so the "single knob" promise is documented as covering the full scale, not just `rounded-base`.

## Nice to have

- Custom multipliers via `presetVunor({ baseRadius, radiusScale: { … } })` — lets consumers tune the whole ladder in one place.
- Companion shortcuts for common patterns, e.g. a built-in "small c8" variant that uses the smaller radius (optional — can live downstream).
