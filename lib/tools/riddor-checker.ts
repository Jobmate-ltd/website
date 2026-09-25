// ─────────────────────────────────────────────────────────────────────────────
// The RIDDOR checker's question flow, on top of the product's own triage.
//
// `triage()` in lib/product-logic/riddor-knowledge.ts decides the category;
// nothing here re-implements a rule. This file only decides which question
// to ask next (mirroring the order triage reads the answers in), keeps the
// answers in a URL query string so a verdict can be shared, and carries the
// page copy. Node's test runner imports it directly, so the imports are
// relative and the file is free of React.
// ─────────────────────────────────────────────────────────────────────────────

import { DANGEROUS_OCCURRENCES, OCC_DISEASES, RIDDOR_CATEGORY_DEFS, SPECIFIED_INJURIES, triage, type TriageAnswers, type TriageResult } from '../product-logic/riddor-knowledge.ts'
import type { RiddorCategory } from '../product-logic/enums.ts'
import { parseCalendar } from '../product-logic/date.ts'
import type { FaqEntry, HowToStep } from '../schema.ts'

export type AnswerKey = keyof TriageAnswers
export type QuestionKind = 'radio' | 'multi' | 'select' | 'number'

export interface QuestionOption {
  readonly value: string
  readonly label: string
  readonly help?: string
}

export interface Question {
  readonly key: AnswerKey
  readonly kind: QuestionKind
  readonly title: string
  readonly help?: string
  /** Radio, multi and select options. Empty for a number. */
  readonly options: readonly QuestionOption[]
  /** A select that also offers "none of these", stored as the empty string, which triage reads as "not a listed occurrence". */
  readonly noneLabel?: string
  /** Number inputs. */
  readonly min?: number
  readonly max?: number
  readonly unit?: string
  /** Does this question apply, given the answers so far? Mirrors the branch triage() would take. */
  readonly when: (answers: TriageAnswers) => boolean
}

/** Every key triage() reads, in the order the checker asks about them. */
export const ANSWER_KEYS: readonly AnswerKey[] = ['workRelated', 'roadTraffic', 'privateRoad', 'outcome', 'personType', 'specifiedInjuries', 'hospitalTreatment', 'daysOff', 'stillOff', 'category', 'diseaseDiagnosed', 'disease', 'dangerousPara']

const YES_NO: readonly QuestionOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

const workRelated = (a: TriageAnswers) => a.workRelated === 'yes'
/** Past the road-traffic exclusion: not a road accident, or one on a private road. */
const pastRoad = (a: TriageAnswers) => workRelated(a) && (a.roadTraffic === 'no' || (a.roadTraffic === 'yes' && a.privateRoad === 'yes'))
const injured = (a: TriageAnswers) => pastRoad(a) && a.outcome === 'injury'
const workerInjured = (a: TriageAnswers) => injured(a) && a.personType === 'worker'
const noSpecified = (a: TriageAnswers) => workerInjured(a) && Array.isArray(a.specifiedInjuries) && a.specifiedInjuries.length === 0
const noInjury = (a: TriageAnswers) => pastRoad(a) && a.outcome === 'none'

export const QUESTIONS: readonly Question[] = [
  {
    key: 'workRelated',
    kind: 'radio',
    title: 'Did it arise out of or in connection with work?',
    help: 'The way the work was done or organised, the premises, or the plant and substances used at work.',
    options: [
      { value: 'yes', label: 'Yes, it was work-related' },
      { value: 'no', label: 'No, it was not connected to work' },
    ],
    when: () => true,
  },
  {
    key: 'roadTraffic',
    kind: 'radio',
    title: 'Did it involve a vehicle moving on a road?',
    help: 'Injuries from a vehicle moving on a public road are for the police, not RIDDOR. Loading, unloading or working beside the road are still work activities, so answer no for those.',
    options: YES_NO,
    when: workRelated,
  },
  {
    key: 'privateRoad',
    kind: 'radio',
    title: 'Was the road private, with no public access?',
    help: 'A yard, a depot, a site road or a car park the public cannot use. A public highway means RIDDOR does not apply.',
    options: YES_NO,
    when: (a) => workRelated(a) && a.roadTraffic === 'yes',
  },
  {
    key: 'outcome',
    kind: 'radio',
    title: 'What was the outcome?',
    options: [
      { value: 'death', label: 'Someone died' },
      { value: 'injury', label: 'Someone was injured' },
      { value: 'none', label: 'No injury: a diagnosed disease or a dangerous occurrence' },
    ],
    when: pastRoad,
  },
  {
    key: 'personType',
    kind: 'radio',
    title: 'Who was injured?',
    options: [
      { value: 'worker', label: 'A worker', help: 'An employee, a self-employed person or someone on work experience, whoever they work for.' },
      { value: 'nonworker', label: 'Someone not at work', help: 'A member of the public, a visitor, a customer or a patient.' },
    ],
    when: injured,
  },
  {
    key: 'specifiedInjuries',
    kind: 'multi',
    title: 'Did the worker suffer any of these specified injuries?',
    help: 'Regulation 4 lists eight. Tick every one that applies, or none and press Next.',
    options: SPECIFIED_INJURIES.map((s) => ({ value: s.id, label: s.label })),
    when: workerInjured,
  },
  {
    key: 'hospitalTreatment',
    kind: 'radio',
    title: 'Were they taken straight from the scene to hospital for treatment?',
    help: 'Treatment of the injury, not a precautionary check. An X-ray or another diagnostic test on its own does not count.',
    options: YES_NO,
    when: (a) => injured(a) && a.personType === 'nonworker',
  },
  {
    key: 'daysOff',
    kind: 'number',
    title: 'How many consecutive days has the worker been unable to do their normal duties?',
    help: 'Count from the day after the accident and include weekends and rest days. Enter 0 if they carried on as normal.',
    options: [],
    min: 0,
    max: 3650,
    unit: 'days',
    when: noSpecified,
  },
  {
    key: 'stillOff',
    kind: 'radio',
    title: 'Are they still off, or still on lighter duties?',
    help: 'Once the absence passes seven consecutive days it becomes reportable.',
    options: [
      { value: 'yes', label: 'Yes, still unable to do their normal duties' },
      { value: 'no', label: 'No, back to normal duties' },
    ],
    when: (a) => noSpecified(a) && daysOffOf(a) !== null && (daysOffOf(a) as number) <= 3,
  },
  {
    key: 'category',
    kind: 'radio',
    title: 'What are you checking?',
    help: 'A dangerous occurrence is one of the events listed in Schedule 2 and is reportable whether or not anyone was hurt.',
    options: [
      { value: 'disease', label: 'An occupational disease diagnosed by a doctor' },
      { value: 'dangerous', label: 'A dangerous occurrence' },
    ],
    when: noInjury,
  },
  {
    key: 'diseaseDiagnosed',
    kind: 'radio',
    title: 'Has a doctor diagnosed one of the listed diseases in writing, with work as the likely cause?',
    help: 'RIDDOR lists eight diseases; the next step shows them. If the diagnosis is not one of them, answer no.',
    options: YES_NO,
    when: (a) => noInjury(a) && a.category === 'disease',
  },
  {
    key: 'disease',
    kind: 'select',
    title: 'Which disease was diagnosed?',
    options: OCC_DISEASES.map((d) => ({ value: d.id, label: d.label, help: d.when })),
    when: (a) => noInjury(a) && a.category === 'disease' && a.diseaseDiagnosed === 'yes',
  },
  {
    key: 'dangerousPara',
    kind: 'select',
    title: 'Which dangerous occurrence was it?',
    help: 'The Schedule 2 paragraphs that apply to most workplaces, numbered as HSE lists them.',
    options: DANGEROUS_OCCURRENCES.map((d) => ({ value: String(d.para), label: `${d.para}. ${d.label}`, help: d.note })),
    noneLabel: 'None of these',
    when: (a) => noInjury(a) && a.category === 'dangerous',
  },
]

export function questionFor(key: AnswerKey): Question {
  const q = QUESTIONS.find((question) => question.key === key)
  if (!q) throw new Error(`No question for ${key}`)
  return q
}

/** The days-off answer as a whole number, or null when unanswered or unreadable. */
export function daysOffOf(a: TriageAnswers): number | null {
  if (a.daysOff === undefined || a.daysOff === null || a.daysOff === '') return null
  const n = typeof a.daysOff === 'number' ? a.daysOff : parseInt(String(a.daysOff), 10)
  return Number.isFinite(n) ? n : null
}

export function answered(answers: TriageAnswers, q: Question): boolean {
  return answers[q.key] !== undefined
}

/**
 * Drops every answer whose question no longer applies, walking the flow in
 * order so a changed early answer clears the branch that hung off the old
 * one. Keeps the result stable: prune(prune(a)) equals prune(a).
 */
export function prune(answers: TriageAnswers): TriageAnswers {
  const kept: TriageAnswers = {}
  for (const q of QUESTIONS) {
    const value = answers[q.key]
    if (value !== undefined && q.when(kept)) (kept as Record<string, unknown>)[q.key] = value
  }
  return kept
}

/** The questions that apply to these answers, in order. The last may be unanswered. */
export function stepsFor(answers: TriageAnswers): readonly Question[] {
  const pruned = prune(answers)
  return QUESTIONS.filter((q) => q.when(pruned))
}

/** True once every applicable question is answered: triage() has everything it reads. */
export function decided(answers: TriageAnswers): boolean {
  const pruned = prune(answers)
  return stepsFor(pruned).every((q) => answered(pruned, q))
}

/** The product's verdict for these answers: exactly what triage() returns. */
export function resultFor(answers: TriageAnswers): TriageResult {
  return triage(prune(answers))
}

/** The category alone, for tests and announcements. */
export function verdictFor(answers: TriageAnswers): RiddorCategory {
  return resultFor(answers).category
}

/** Records one answer and prunes what no longer applies. */
export function setAnswer(answers: TriageAnswers, key: AnswerKey, value: TriageAnswers[AnswerKey]): TriageAnswers {
  return prune({ ...answers, [key]: value })
}

/** Candidate values per question, for working out how many questions can be left. */
function candidates(q: Question): readonly TriageAnswers[AnswerKey][] {
  switch (q.kind) {
    case 'radio':
      return q.options.map((o) => o.value) as readonly TriageAnswers[AnswerKey][]
    case 'multi':
      return [[], [q.options[0]?.value ?? '']]
    case 'select':
      return q.noneLabel ? [q.options[0]?.value ?? '', ''] : [q.options[0]?.value ?? '']
    case 'number':
      return ['0', '10']
  }
}

/**
 * The most questions any completion of these answers can involve, so the
 * progress line reads "Question 2 of 7" and the total only ever shrinks.
 */
export function maxTotal(answers: TriageAnswers): number {
  const pruned = prune(answers)
  const steps = stepsFor(pruned)
  const open = steps.find((q) => !answered(pruned, q))
  if (!open) return steps.length
  return Math.max(...candidates(open).map((value) => maxTotal(setAnswer(pruned, open.key, value))))
}

/** How the verdict chip is toned: nothing sent, a record, or a report (by phone first, or by form). */
export function verdictTone(category: RiddorCategory): 'neutral' | 'info' | 'warning' | 'critical' {
  const def = RIDDOR_CATEGORY_DEFS[category]
  if (category === 'NotReportable') return 'neutral'
  if (def.recordOnly) return 'info'
  return def.phone ? 'critical' : 'warning'
}

// ── URL state ────────────────────────────────────────────────────────────────

const DATE_KEY = 'date'

/** Answers (and the date it happened) as a query string, without the leading `?`. Empty when nothing is set. */
export function encodeAnswers(answers: TriageAnswers, date?: string | null): string {
  const pruned = prune(answers)
  const params = new URLSearchParams()
  for (const q of QUESTIONS) {
    const value = pruned[q.key]
    if (value === undefined || value === null) continue
    params.set(q.key, Array.isArray(value) ? value.join(',') : String(value))
  }
  if (date && parseCalendar(date)) params.set(DATE_KEY, date)
  return params.toString()
}

/** Reads answers back from a query string, dropping anything that is not a value the checker offers. */
export function decodeAnswers(input: URLSearchParams | string | null | undefined): { answers: TriageAnswers; date: string | null } {
  const params = input instanceof URLSearchParams ? input : new URLSearchParams(input ?? '')
  const raw: TriageAnswers = {}
  for (const q of QUESTIONS) {
    const value = params.get(q.key)
    if (value === null) continue
    const valid = new Set(q.options.map((o) => o.value))
    switch (q.kind) {
      case 'radio':
        if (valid.has(value)) (raw as Record<string, unknown>)[q.key] = value
        break
      case 'select':
        if (valid.has(value) || (q.noneLabel && value === '')) (raw as Record<string, unknown>)[q.key] = value
        break
      case 'multi': {
        const ids = value === '' ? [] : [...new Set(value.split(',').filter((id) => valid.has(id)))]
        if (value === '' || ids.length) (raw as Record<string, unknown>)[q.key] = ids
        break
      }
      case 'number':
        if (/^\d{1,4}$/.test(value)) (raw as Record<string, unknown>)[q.key] = value
        break
    }
  }
  const date = params.get(DATE_KEY)
  return { answers: prune(raw), date: date && parseCalendar(date) ? date : null }
}

// ── Page copy ────────────────────────────────────────────────────────────────

export const RIDDOR_STEPS: readonly HowToStep[] = [
  { name: 'Answer the questions in order', text: 'Start with whether it was work-related, then the outcome, who was hurt and how long they were off. Each answer decides the next question, so most checks take four to six.' },
  { name: 'Set the date it happened', text: 'The deadline is counted in calendar days from the incident, or from the diagnosis for a disease, so set the date before you read the verdict.' },
  { name: 'Read the verdict and the reasons', text: 'The category, the regulation it comes from and the reasons given are the same ones jobsafe attaches to an incident report.' },
  { name: 'Report it to HSE, or record it', text: 'If it is reportable, phone the Incident Contact Centre or use the online form by the date shown. If it is not, record it in your accident book and investigate as normal.' },
] as const

/** The "People also ask" questions from the keyword map, answered first. */
export const RIDDOR_PAA: readonly string[] = ['What are the 8 categories of reportable incidents?', 'What is the 7-day rule for reporting RIDDOR incidents?', 'What is not RIDDOR reportable?']

const REPORTED = Object.values(RIDDOR_CATEGORY_DEFS).filter((d) => !d.recordOnly)
const RECORDED = Object.values(RIDDOR_CATEGORY_DEFS).filter((d) => d.recordOnly && d.key !== 'NotReportable')
const listOf = (labels: readonly string[]) => labels.map((l) => l.toLowerCase()).join('; ')
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'] as const
const inWords = (n: number) => WORDS[n] ?? String(n)

export const RIDDOR_FAQS: readonly FaqEntry[] = [
  {
    q: RIDDOR_PAA[0],
    a: `Eight: ${inWords(REPORTED.length)} that are reported to HSE and ${inWords(RECORDED.length)} that is recorded but not reported. Reported: ${listOf(REPORTED.map((d) => d.label))}. Recorded only: ${listOf(RECORDED.map((d) => d.label.replace(/, record only$/i, '')))}, which goes in the accident book and is not sent to HSE. Anything that meets none of these thresholds is not reportable, though you should still record and investigate it.`,
  },
  {
    q: RIDDOR_PAA[1],
    a: 'If a worker is away from work, or unable to do their normal duties, for more than seven consecutive days because of a work-related accident, the injury is reportable and the report must reach HSE within 15 days of the accident. The day of the accident is not counted; weekends and rest days are. An absence of more than three days but not more than seven is recorded in the accident book and not reported.',
  },
  {
    q: RIDDOR_PAA[2],
    a: 'Anything that meets none of the RIDDOR thresholds: an incident that did not arise from work, a road traffic accident on a public road (report that to the police), a worker back on normal duties within three days, a member of the public who was not taken straight from the scene to hospital for treatment, a hospital visit that was only a check or an X-ray, and a near miss that is not a listed dangerous occurrence. Record all of them internally anyway; they are the evidence your investigation and your risk assessments run on.',
  },
  {
    q: 'When is the deadline 10 days and when is it 15?',
    a: 'Fifteen days applies only to over-7-day incapacitation, counted from the accident. Everything else is ten days: a death or a specified injury (which must also be phoned through without delay), an injury to a non-worker taken to hospital, a dangerous occurrence, and an occupational disease counted from the diagnosis. Flammable gas incidents have 14 days. The checker works the calendar date out from the date you enter.',
  },
  {
    q: 'What is the over-3-day rule?',
    a: 'A worker who is unable to do their normal duties for more than three consecutive days, but not more than seven, is a record-only case under Regulation 12: it goes in the accident book and is not reported to HSE. Once the absence passes seven days it becomes reportable within 15 days of the accident, so keep watching an open absence.',
  },
  {
    q: 'Is a member of the public taken to hospital reportable?',
    a: 'Yes, if they were injured by a work activity and taken directly from the scene to hospital for treatment of that injury. Diagnostic tests such as X-rays are not treatment, and a precautionary trip with no apparent injury is not reportable. The report is due within ten days.',
  },
  {
    q: 'Who submits the report to HSE?',
    a: 'The responsible person: the employer of the injured worker, the person in control of the premises where the incident happened, or the self-employed person. You submit it yourself on HSE’s online forms, or by phone first for a death or a specified injury. jobsafe does not submit it for you: it tells you what is reportable and by when, and keeps the record with the reference number HSE gives you.',
  },
] as const
