// The one definition of "disabled" every vunor shortcut keys on. An element
// counts as disabled when any of these holds:
//
//   :disabled             native form control, including one inside a disabled <fieldset>
//   [disabled]            the attribute on a non-form element, e.g. <VuButton to="…" disabled>,
//                         which renders <a disabled>
//   [aria-disabled=true]  disabled but still focusable, the accessible pattern (VuInput and
//                         the Reka UI primitives use it)
//   [data-disabled]       Reka UI's state attribute (slider thumbs carry only this one)
//
// Paint that marks an element as disabled (`disabled-soft`, `btn`) goes under
// `whenDisabled`. Interaction states that must not react on a disabled element
// (hover and press washes) go under `whenEnabled`. Both wrap the same selector
// list in a single `:is()` / `:not()`, so either one adds 0,1,0 to the
// specificity whichever attribute matched.
//
// They are arbitrary-selector variants (`[&:not(…)]:`) rather than UnoCSS's
// `not-[…]:` / `is-[…]:`: those read their bracket greedily, so a later
// bracketed variant in the same chain (`not-[…]:data-[highlighted]:`) compiles
// to `:not(undefined)`. The `[&…]:` form composes in any position.
const disabledSelectors = ':disabled,[disabled],[aria-disabled=true],[data-disabled]'

/** Variant prefix that matches while the element is disabled. */
export const whenDisabled = `[&:is(${disabledSelectors})]:`

/** Variant prefix that matches only while the element is not disabled. */
export const whenEnabled = `[&:not(${disabledSelectors})]:`
