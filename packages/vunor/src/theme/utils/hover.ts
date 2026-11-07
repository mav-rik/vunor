// Hover paint is applied only where the primary input can hover (`hover: hover`,
// not `any-hover`, which would bring sticky hover back on hybrid devices). On a touch
// screen a tap leaves the element in `:hover` until the next tap elsewhere, so
// an ungated hover wash sticks to whatever was tapped last. Every hover rule in
// vunor's shortcuts goes through one of the prefixes below.

/** Variant prefix for any rule that should only apply on hover-capable devices. */
export const whenCanHover = '[@media(hover:hover)]:'

/** Variant prefix: `hover:` gated behind `@media (hover: hover)`. */
export const whenHover = `${whenCanHover}hover:`

/**
 * Variant prefix: `hover:` gated behind `@media (hover: hover)` that also stands
 * aside while the element is `:active`. Use it next to an `active:` paint: the
 * gated block is emitted after the plain rules, so a plain gated `hover:` would
 * beat the press paint on a mouse.
 */
export const whenHoverIdle = `${whenCanHover}[&:hover:not(:active)]:`
