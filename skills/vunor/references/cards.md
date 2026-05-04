# Cards — Vunor

The `card` shortcut, `card-{level}` rule, `--card-spacing`, density, rounded corners, headers, borders, and the math that ties padding to the heading typography.

## The card idea

Vunor cards bind padding to **typography**. The size of the card's main heading (`<VuCardHeader>`) determines `--card-spacing`, which fills four roles:

- the card's own `padding`
- the optional rounded-corner radius (`rounded-$card-spacing`)
- a virtual gap unit you can use inside the card (`gap-$card-spacing`, `mt-$card-spacing-dense`)
- the size of the card-header text itself (when you use the `text-card-header` virtual level)

Big-headline card → big padding. Small body-level card → tight padding. Same proportions, no manual tuning.

```html
<VuCard level="h3" rounded>
  <VuCardHeader>Big section</VuCardHeader>      <!-- ≈ h3 size -->
  <p>Padding scales with the h3 heading.</p>
</VuCard>

<VuCard level="body" rounded>
  <VuCardHeader>Compact section</VuCardHeader>  <!-- ≈ body size -->
  <p>Tighter padding because the heading is body-sized.</p>
</VuCard>
```

## How `card-{level}` works

The rule `card-{name}` (where `name` is any typography key — `h1, h2, …, h6, body, body-l, body-s, subheading, callout, label, caption, overline`) sets these custom properties from that level's metrics:

```css
.card-h3 {
  --card-spacing:           <h3-corrected-size × cardSpacingFactor.regular>;
  --card-spacing-dense:     <h3-corrected-size × cardSpacingFactor.dense>;
  --card-heading-size:      <h3 size>;
  --card-heading-bold:      <h3 bold-weight>;
  --card-heading-corrected: <h3 corrected size>;
  --card-heading-weight:    <h3 weight>;
  --card-heading-lh:        <h3 line-height>;
  --card-heading-ls:        <h3 letter-spacing>;
  --card-heading-bc:        <h3 bottom-correction>;
  --card-heading-tc:        <h3 top-correction>;
  padding:                   var(--card-spacing);
}
```

- `cardSpacingFactor.regular` defaults to `1` (so `--card-spacing` ≈ corrected size). Set it lower (`0.75`) for tighter cards across the board.
- `cardSpacingFactor.dense` defaults to `0.6`.
- `--card-spacing` becomes the active value; `card-dense` swaps it to `--card-spacing-dense`.

## The `card` shortcut

`card` is a tiny shortcut that wires the data attributes set by `<VuCard>` to the right rules:

```ts
card: `data-[rounded=true]:rounded-$card-spacing
       data-[dense=true]:card-dense!
       data-[level=h1]:card-h1 data-[level=h2]:card-h2 …
       data-[level=body]:card-body data-[level=body-l]:card-body-l … `
```

So `<VuCard level="h3" rounded dense />` ends up with three rules taking effect: `card-h3` (→ padding + heading vars), `card-dense` (→ `--card-spacing` swaps to dense), and `rounded-$card-spacing` (→ corner radius equals the padding for a soft pillow).

## `<VuCard>` props

| Prop | Type | Default | Effect |
|------|------|---------|--------|
| `level` | typography key | `h6` (or whatever `<VuCardHeader>` later requests) | Sets `card-{level}` → `--card-spacing` and heading vars |
| `dense` | boolean | `false` | Adds `card-dense` → `--card-spacing-dense` becomes active |
| `rounded` | boolean | `false` | Adds `rounded-$card-spacing` (radius equals padding) |
| `noPadding` | boolean | `false` | Sets inline `padding: 0` (overrides `card-{level}` padding only) |
| `as` | string | `'div'` | HTML element |
| `asChild` | boolean | `false` | Reka UI polymorphic — render onto child instead of wrapping |

Card *propagates the level via PI* to nested `<VuCardHeader>` — see "Header levels" below.

```html
<VuCard level="h3" rounded dense>…</VuCard>           <!-- typical -->
<VuCard level="body" no-padding>…</VuCard>           <!-- bare wrapper, just typography vars -->
<VuCard as="section" level="h4" class="border">…</VuCard>
```

## `<VuCardHeader>` and the level

`<VuCardHeader>` renders the card's heading and applies `text-card-header text-mt-0`:

```vue
<template>
  <Primitive :as="_as" :asChild class="text-card-header text-mt-0">
    <slot />
  </Primitive>
</template>
```

`text-card-header` is a special typography utility that pulls all its size/weight/line-height/letter-spacing values from `--card-heading-*` — which `<VuCard level="h3">` set above. So the header looks correct without you specifying its level twice.

`text-mt-0` zeros the top margin (with font correction), so the header sits flush at the top of the card.

The `as` element defaults to `h6`, but if you set `level` on `<VuCardHeader>` (or on the parent `<VuCard>` and let PI propagate it), `<VuCardHeader>` upgrades the rendered element to that tag for semantic correctness. If your card is inside an `h2` page section, set `<VuCard level="h3">` so the header renders as `<h3>` and the spacing matches.

```html
<VuCard level="h3">
  <VuCardHeader>Renders as &lt;h3&gt; sized like h3</VuCardHeader>
  …
</VuCard>
```

`<VuCardHeader>` can also explicitly set its own level prop independently of the card's spacing:

```html
<VuCard level="h3">
  <VuCardHeader level="h2">Big header inside h3-padded card</VuCardHeader>
</VuCard>
```

## `<VuCardInner>` — nested card section

`<VuCardInner>` is a thin wrapper that applies `p-$card-spacing` only — useful for sub-sections that should respect the same padding scale as the outer card:

```html
<VuCard level="h3" no-padding>
  <VuCardInner>
    <VuCardHeader>Section A</VuCardHeader>
    …
  </VuCardInner>
  <hr />
  <VuCardInner>
    <VuCardHeader>Section B</VuCardHeader>
    …
  </VuCardInner>
</VuCard>
```

## Borders

Cards don't have borders by default — the visual hierarchy comes from the layer/surface system. Add a border explicitly when you need one:

```html
<VuCard level="h3" class="border">…</VuCard>            <!-- 1px default border color -->
<VuCard level="h3" class="border border-current/20">…</VuCard>  <!-- scope-aware border -->
<VuCard level="h3" class="surface-100">…</VuCard>       <!-- surface includes its own border -->
```

UnoCSS's default border-color uses `--un-default-border-color`, set by the Vunor preflight to a translucent grey:

```css
:root {
  --un-border-opacity: 0.25;
  --un-default-border-color: rgb(150 150 150 / var(--un-border-opacity));
}
```

So `class="border"` always renders a visible-but-subtle 1px line in both light and dark mode without further work.

For brand-colored borders, use the current-system or `border-scope-*`:

```html
<VuCard level="h3" class="scope-primary border border-current-hl/40">…</VuCard>
<VuCard level="h3" class="border border-scope-color-300">…</VuCard>
```

## Radius

Three common patterns:

```html
<!-- rounded prop: radius equals the padding (soft pillow look) -->
<VuCard level="h3" rounded>…</VuCard>

<!-- explicit class: any size from the spacing scale -->
<VuCard level="h3" class="rounded-base">…</VuCard>
<VuCard level="h3" class="rounded-$s">…</VuCard>
<VuCard level="h3" class="rounded-fingertip-half">…</VuCard>

<!-- square -->
<VuCard level="h3">…</VuCard>
```

`rounded-$card-spacing` (what `rounded` produces) makes the radius **scale with the heading** — so an h1-card has a big squishy corner and an h6-card has a tight one. That's the intended look. To use the standard radius regardless of card size, drop `rounded` and use `class="rounded-base"`.

## Density

`dense` swaps `--card-spacing` for `--card-spacing-dense` (default 60% of regular). Use it for compact lists or dashboard tiles.

```html
<VuCard level="h4" rounded dense>…</VuCard>
```

Tweak the dense ratio globally:

```ts
presetVunor({ cardSpacingFactor: { regular: 1, dense: 0.5 } })
```

## Common patterns

### Card with header, content, and a sub-card

```html
<VuCard level="h3" rounded class="border">
  <VuCardHeader>User Profile</VuCardHeader>
  <p class="text-mt-$s text-mb-$m">Subtitle copy.</p>

  <div class="flex flex-col gap-$m">
    <VuCard level="body" class="border surface-100">
      <VuCardHeader>Personal Info</VuCardHeader>
      <p class="text-mb-0">Name, email, …</p>
    </VuCard>

    <VuCard level="body" class="border surface-100">
      <VuCardHeader>Preferences</VuCardHeader>
      <p class="text-mb-0">Settings…</p>
    </VuCard>
  </div>
</VuCard>
```

### Tile grid

```html
<div class="grid grid-cols-3 gap-$m">
  <VuCard v-for="t in tiles" :key="t.id"
          level="h6" rounded dense class="border surface-50">
    <VuCardHeader>{{ t.title }}</VuCardHeader>
    <p class="text-caption text-mb-0">{{ t.subtitle }}</p>
  </VuCard>
</div>
```

### Card with a sticky header strip

```html
<VuCard level="h4" rounded no-padding class="border overflow-hidden">
  <header class="surface-100 px-$card-spacing py-$card-spacing-dense">
    <VuCardHeader class="text-mt-0 text-mb-0">Inbox</VuCardHeader>
  </header>
  <VuCardInner>
    <ul class="flex flex-col gap-$xs text-mb-0">…</ul>
  </VuCardInner>
</VuCard>
```

### Borderless card with elevation

```html
<VuCard level="h3" rounded class="surface-0 shadow-popup">
  <VuCardHeader>Settings</VuCardHeader>
  …
</VuCard>
```

`shadow-popup` is a built-in Vunor shortcut for floating-card shadow.

### `popup-card` — surface chrome for hand-rolled popovers

When you need a floating surface but don't want the `<VuCard>` machinery (no header/footer/spacing logic), use the public `popup-card` shortcut. It bundles `surface-0 + bg-current + rounded-r2 + overflow-hidden + shadow-popup + z-[100] + border` so any popover/menu/listbox picks up the same surface look as `<VuSelect>`'s dropdown.

```html
<div class="popup-card w-[14em] py-$xs">
  <button class="menu-item">Save</button>
  <button class="menu-item">Duplicate</button>
  <button class="menu-item">Delete</button>
</div>
```

`popup-card` is the symmetric partner of `dialog-card` — `dialog-card` is positioning-focused (centered modal), `popup-card` is surface-focused (chrome only). Add `min-w-` / `max-w-` per use.

## Gotchas

- The `card` shortcut uses `data-*` attributes set by `<VuCard>`. Putting `class="card"` on a plain `<div>` does nothing unless you also wire `data-rounded`, `data-dense`, `data-level` yourself.
- `card-{level}` sets `padding` directly. Don't add another `p-*` class on the same element — they collide. Use `noPadding` and rebuild padding via `<VuCardInner>` if needed.
- `--card-spacing` only exists on the element that has `card-{level}` (or a descendant). Children deeper than `<VuCardInner>` may not see it — set the level on the right ancestor.
- `text-card-header` reads the heading vars only inside a `card-*` context. Outside a card, it falls back to whatever the cascade provides — usually nothing.
- `rounded` (the prop) and `rounded-base` (the class) are different: the prop ties radius to padding, the class uses the global default. Don't combine them — the cascade is order-dependent and surprising.
- Setting `level="body"` (or `body-s`) gives a *very* small card. That is correct for inline cards inside paragraphs but jarring as a top-level layout block.
