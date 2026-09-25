'use client'

import * as React from 'react'

/**
 * FrameScope — a prefix for the SVG mask and clip ids inside `Safari` and
 * `Iphone`. `React.useId()` is unique per component instance, but the same
 * element rendered in two places at once (the sticky-scroll story renders
 * every picture inline for small screens and again in the sticky column)
 * can land on the same id, and `url(#id)` then resolves to whichever copy
 * comes first in the document, a `display: none` one included, which leaves
 * the visible frame unmasked. Wrap each copy in a scope to keep the ids apart.
 *
 * @example
 *   <FrameScope value="sticky"><ProductShot id="…" frame /></FrameScope>
 */
const FrameScopeContext = React.createContext('')

export function FrameScope({ value, children }: { value: string; children: React.ReactNode }) {
  return <FrameScopeContext.Provider value={value}>{children}</FrameScopeContext.Provider>
}

/** A document-unique id for an SVG definition inside a frame. */
export function useFrameId(prefix: string): string {
  const scope = React.useContext(FrameScopeContext)
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return `${prefix}-${scope ? `${scope}-` : ''}${id}`
}
