// ─────────────────────────────────────────────────────────────────────────────
// The homepage headline variants for a later A/B test. A ships by default.
// The variant is chosen at build time by NEXT_PUBLIC_HERO_VARIANT (A, B or
// C); a preview deployment can build B or C without touching the code. A
// runtime cookie switch is deliberately not wired: reading a cookie in the
// page would make the homepage dynamic and cost the static render.
//
// Every variant keeps the phrase "health and safety" and the row's keyword.
// ─────────────────────────────────────────────────────────────────────────────

export type HeroVariant = 'A' | 'B' | 'C'

export const HERO_HEADLINES: Readonly<Record<HeroVariant, string>> = {
  A: 'One health and safety platform. Built for UK law. Works without signal.',
  B: 'From the first report to the last certificate: health and safety in one record, offline.',
  C: 'Health and safety software for the yard, the site and the depot.',
}

export function heroVariant(env: NodeJS.ProcessEnv = process.env): HeroVariant {
  const value = env.NEXT_PUBLIC_HERO_VARIANT?.trim().toUpperCase()
  return value === 'B' || value === 'C' ? value : 'A'
}

export function heroHeadline(env: NodeJS.ProcessEnv = process.env): string {
  return HERO_HEADLINES[heroVariant(env)]
}
