// ─────────────────────────────────────────────────────────────────────────────
// The 5×5 risk matrix calculator's data, on top of the product's own scoring.
//
// `score()`, `bandOf()`, the two scales, the bands and the hierarchy of
// control come from lib/product-logic/risk-scoring.ts; this file lays the 25
// cells out, labels them for a screen reader, keeps the selection in a query
// string and carries the page copy. Node's test runner imports it directly.
// ─────────────────────────────────────────────────────────────────────────────

import { BANDS, HIERARCHY_DEFS, LIKELIHOOD_SCALE, SEVERITY_SCALE, bandOf, score, type BandDef } from '../product-logic/risk-scoring.ts'
import { HIERARCHY, type Hierarchy } from '../product-logic/enums.ts'
import type { FaqEntry, HowToStep } from '../schema.ts'
import { HSE_RISK_URL } from './index.ts'

export type Likelihood = (typeof LIKELIHOOD_SCALE)[number]
export type Severity = (typeof SEVERITY_SCALE)[number]

export interface MatrixCell {
  readonly l: number
  readonly s: number
  readonly score: number
  readonly band: BandDef
  /** What a screen reader hears: "Likelihood 3 Possible, severity 4 Major, score 12, High". */
  readonly label: string
}

export function likelihoodOf(v: number): Likelihood {
  const found = LIKELIHOOD_SCALE.find((step) => step.v === v)
  if (!found) throw new RangeError(`Likelihood ${v} is not on the scale`)
  return found
}

export function severityOf(v: number): Severity {
  const found = SEVERITY_SCALE.find((step) => step.v === v)
  if (!found) throw new RangeError(`Severity ${v} is not on the scale`)
  return found
}

export function cellLabel(l: number, s: number): string {
  const value = score(l, s)
  return `Likelihood ${l} ${likelihoodOf(l).label}, severity ${s} ${severityOf(s).label}, score ${value}, ${bandOf(value).key}`
}

export function cellFor(l: number, s: number): MatrixCell {
  const value = score(l, s)
  return { l, s, score: value, band: bandOf(value), label: cellLabel(l, s) }
}

/** All 25 cells, likelihood-major (row by row). */
export const MATRIX_CELLS: readonly MatrixCell[] = LIKELIHOOD_SCALE.flatMap((row) => SEVERITY_SCALE.map((col) => cellFor(row.v, col.v)))

/** The band's tone as one of the site's status tokens (chip.tsx), so the band is never colour alone. */
export const BAND_STATUS: Readonly<Record<BandDef['tone'], 'good' | 'warning' | 'critical'>> = {
  green: 'good',
  amber: 'warning',
  red: 'critical',
}

/** The band's SLA as a sentence. */
export function slaLabel(band: BandDef): string {
  if (band.sla === null) return 'No deadline: keep the existing controls in place and review at the usual interval.'
  if (band.sla === 0) return 'Stop the activity until further controls bring the score down.'
  return `Close further controls within ${band.sla} days.`
}

export interface HierarchyLevel {
  readonly key: Hierarchy
  readonly rank: number
  readonly name: string
  readonly desc: string
}

const HIERARCHY_NAMES: Readonly<Record<Hierarchy, string>> = {
  Eliminate: 'Eliminate',
  Substitute: 'Substitute',
  Engineering: 'Engineering controls',
  Administrative: 'Administrative controls',
  PPE: 'PPE',
}

/** The five levels in rank order, with the product's wording. */
export const HIERARCHY_LEVELS: readonly HierarchyLevel[] = [...HIERARCHY]
  .map((key) => ({ key, rank: HIERARCHY_DEFS[key].rank, name: HIERARCHY_NAMES[key], desc: HIERARCHY_DEFS[key].desc }))
  .sort((a, b) => a.rank - b.rank)

// ── URL state ────────────────────────────────────────────────────────────────

export interface MatrixSelection {
  readonly l: number | null
  readonly s: number | null
}

/** `l=3&s=4`, without the leading `?`. Empty when nothing is chosen. */
export function encodeMatrix(selection: MatrixSelection): string {
  const params = new URLSearchParams()
  if (selection.l !== null) params.set('l', String(selection.l))
  if (selection.s !== null) params.set('s', String(selection.s))
  return params.toString()
}

function onScale(value: string | null): number | null {
  if (value === null || !/^[1-5]$/.test(value)) return null
  return Number(value)
}

export function decodeMatrix(input: URLSearchParams | string | null | undefined): MatrixSelection {
  const params = input instanceof URLSearchParams ? input : new URLSearchParams(input ?? '')
  return { l: onScale(params.get('l')), s: onScale(params.get('s')) }
}

// ── Page copy ────────────────────────────────────────────────────────────────

/** HSE's five steps, in plain words. The last step carries the link to HSE's guide. */
export const RISK_STEPS: readonly HowToStep[] = [
  { name: 'Identify the hazards', text: 'Walk the job and list what could cause harm: the plant, the substances, the height, the traffic, the way the work is organised. Ask the people who do it.' },
  { name: 'Decide who might be harmed and how', text: 'Name the groups at risk, including contractors, visitors, lone workers and members of the public, and say how each one could be hurt.' },
  { name: 'Evaluate the risks and decide on precautions', text: 'Score likelihood and severity for each hazard, read the band, then work down the hierarchy of control from eliminating the hazard to PPE as the last resort.' },
  { name: 'Record your findings and implement them', text: 'Write down the significant findings, who is responsible for each control and by when, and put the controls in place. Five or more employees means the record is a legal requirement.' },
  { name: 'Review and update', text: 'Look at it again when something changes, after an incident or near miss, and at a set interval. HSE’s own guide to risk assessment sets these five steps out in full.' },
] as const

export const RISK_PAA: readonly string[] = ['What is the 5x5 risk matrix?', 'What are the 5 risk rating levels?', 'What are the dimensions of the HSE 5x5 risk matrix?']

const likelihoods = LIKELIHOOD_SCALE.map((step) => step.label).join(', ')
const severities = SEVERITY_SCALE.map((step) => step.label).join(', ')
const bands = BANDS.map((b) => `${b.key} (${b.min} to ${b.max})`).join(', ')

export const RISK_FAQS: readonly FaqEntry[] = [
  {
    q: RISK_PAA[0],
    a: `A 5×5 risk matrix scores a hazard by multiplying how likely harm is (1 to 5) by how severe it would be (1 to 5), giving a score from 1 to 25 that falls into a band with a required action. It is a way to rank the risks you have found so the worst get attention first; it does not replace the judgement in the assessment. This calculator uses the scales and bands jobsafe uses in its own risk assessments.`,
  },
  {
    q: RISK_PAA[1],
    a: `Likelihood runs ${likelihoods}; severity runs ${severities}. Each is scored 1 to 5, and the product of the two is the risk score. The bands on this matrix are ${bands}.`,
  },
  {
    q: RISK_PAA[2],
    a: 'Five likelihood steps by five severity steps: 25 cells, scored 1 to 25. HSE does not prescribe a matrix of any size; its guidance asks for a suitable and sufficient assessment and lets you choose how to rank what you find. A 5×5 is the most common choice in UK workplaces because it gives enough spread to separate a first-aid cut from a RIDDOR-reportable injury.',
  },
  {
    q: 'What do the four bands mean?',
    a: `${BANDS.map((b) => `${b.key}, ${b.min} to ${b.max}: ${b.action}`).join(' ')} The band name is always shown in text beside the colour, so nothing depends on colour alone.`,
  },
  {
    q: 'Is a 5×5 matrix required by law?',
    a: 'No. The Management of Health and Safety at Work Regulations 1999 require a suitable and sufficient risk assessment, recorded if you have five or more employees, and HSE’s guidance describes five steps rather than a scoring method. A matrix is one accepted way to evaluate and rank risks; what matters is that the controls you decide on are put in place and reviewed.',
  },
  {
    q: 'What is the hierarchy of control?',
    a: `The order in which to look for controls: ${HIERARCHY_LEVELS.map((level) => `${level.name.toLowerCase()} (${level.desc.toLowerCase()})`).join('; ')}. Start at the top: eliminating or substituting the hazard removes the risk for everyone, while PPE protects only the wearer and only when it is worn correctly.`,
  },
] as const

export { HSE_RISK_URL }
