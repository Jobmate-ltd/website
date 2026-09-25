// ─────────────────────────────────────────────────────────────────────────────
// Design tokens, read from app/globals.css.
//
// Server-only. The CSS `@theme` block is the single source of truth for colour;
// the OG image renderer and the theme-color meta tag need those values as
// strings, so they are parsed out of the stylesheet here rather than typed
// again. Importing this from a client component would pull node:fs into the
// browser bundle and fail the build, which is the intended guard.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export type TokenName =
  | 'canvas'
  | 'bg'
  | 'canvas-muted'
  | 'ink-1'
  | 'ink-2'
  | 'ink-3'
  | 'ink-4'
  | 'ink-5'
  | 'line-1'
  | 'line-2'
  | 'line-3'
  | 'grey-400'
  | 'brand'
  | 'brand-strong'
  | 'brand-dark'
  | 'brand-tint-04'
  | 'brand-tint-08'
  | 'brand-tint-18'

let cache: Record<string, string> | null = null

/** Parses every `--color-<name>: <value>;` declaration in the theme block. */
export function readColourTokens(cssPath?: string): Record<string, string> {
  if (cache && !cssPath) return cache
  // The literal path keeps output file tracing scoped to app/globals.css.
  const css = cssPath ? readFileSync(cssPath, 'utf8') : readFileSync(join(process.cwd(), 'app', 'globals.css'), 'utf8')
  const tokens: Record<string, string> = {}
  for (const match of css.matchAll(/--color-([a-z0-9-]+):\s*([^;]+);/g)) {
    tokens[match[1]] = match[2].trim()
  }
  if (!cssPath) cache = tokens
  return tokens
}

/** A single colour token, e.g. `token('brand')` → the brand crimson hex. Throws if missing. */
export function token(name: TokenName): string {
  const value = readColourTokens()[name]
  if (!value) throw new Error(`Design token --color-${name} is not defined in app/globals.css`)
  return value
}

/**
 * A hex token at a given alpha, as `rgba()`. For renderers (satori) that do
 * not understand `color-mix()`. `withAlpha('ink-1', 0.045)` → the hero grid ink.
 */
export function withAlpha(name: TokenName, alpha: number): string {
  const hex = token(name).replace('#', '')
  if (!/^[0-9a-f]{6}$/i.test(hex)) throw new Error(`--color-${name} is not a 6-digit hex value; cannot apply alpha`)
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
