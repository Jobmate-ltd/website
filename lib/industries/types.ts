// ─────────────────────────────────────────────────────────────────────────────
// Industry page content (Phase 3). One typed object per sector, rendered by
// components/industries/industry-page.tsx. The template supplies the layout,
// the schema and the shared closing; the content file supplies the words, the
// screens and the facts.
//
// Facts: every statistic on an industry page is a `SourcedFact`: the figure
// as the source states it, the source name and year, the URL, and the date
// it was checked against that URL. The template prints the source and the
// year beside the figure. No fact is reused across industries; a figure that
// could not be verified from a primary source is left out, and a page may
// carry fewer than three.
//
// Every product claim is a claim the module pages already make; nothing here
// invents a capability. Inputs assumed `no` (docs/PHASE-3.md): no email
// alerts (owners see overdue items in the in-app bell), no PDF generation,
// no CSV import, no checklist builder, no in-app contractor records.
// ─────────────────────────────────────────────────────────────────────────────

import type { FaqEntry } from '../schema.ts'
import type { ProductImageId } from '../product-images.ts'
import type { ModulePageId } from '../platform-modules.ts'

export interface FactSource {
  /** As the publisher names it, e.g. "HSE, Work-related fatal injuries in Great Britain, 2025/26 (provisional)". */
  readonly name: string
  /** The statistical year or edition, e.g. "2025/26" or "2025". Printed beside the figure. */
  readonly year: string
  readonly url: string
  /** DD/MM/YYYY the figure was read from `url`. */
  readonly checked: string
  /** The sentence or table cell the figure comes from, verbatim. Not rendered; kept for the audit trail. */
  readonly quote: string
}

export interface SourcedFact {
  /** The number, short, as the source states it, e.g. "15" or "30%". */
  readonly figure: string
  /** What the figure counts, in the source's own terms. */
  readonly detail: string
  readonly source: FactSource
  /** A caveat the source attaches (provisional, all-industry, sector definition). Rendered when present. */
  readonly note?: string
}

export interface IndustryPain {
  /** The thing that goes wrong, in the sector's words. */
  readonly pain: string
  /** The module page that answers it. */
  readonly module: ModulePageId
  /** What the record looks like with jobsafe, in one or two sentences, claiming only what the module page claims. */
  readonly outcome: string
}

export interface IndustryScreen {
  readonly id: ProductImageId
  /** The caption under the screen, written for this sector. */
  readonly caption: string
}

export interface LegalSource {
  readonly name: string
  readonly url: string
  readonly checked: string
}

export interface LegalPoint {
  readonly title: string
  readonly body: string
  /** The primary source for the framing, linked beside it. */
  readonly source?: LegalSource
}

export interface IndustryContent {
  readonly path: string
  /** The last breadcrumb and the sector name in headings. */
  readonly name: string
  /** Analytics placement prefix, e.g. "industry-transport". */
  readonly placement: string
  readonly eyebrow: string
  /** The lead under the H1 (the H1 itself comes from the keyword map). */
  readonly lead: string
  readonly hero: ProductImageId
  /** Up to three verified statistics; fewer if fewer verify. */
  readonly facts: readonly SourcedFact[]
  /** One line introducing the facts, naming the series they come from. */
  readonly factsLead: string
  /** Six pains, each mapped to the module that answers it. */
  readonly pains: readonly IndustryPain[]
  /** Three real screens with sector captions. */
  readonly screens: readonly IndustryScreen[]
  readonly legal: {
    readonly title: string
    readonly lead: string
    readonly points: readonly LegalPoint[]
  }
  /** Free tools that fit the sector; each links a tool page. */
  readonly tools: readonly { readonly label: string; readonly href: string; readonly why: string }[]
  /** Eight questions, each naming the regulation it answers, answer-first. */
  readonly faqs: readonly FaqEntry[]
  readonly faqLead: string
  readonly closing: {
    readonly title: string
    readonly copy: string
  }
}
