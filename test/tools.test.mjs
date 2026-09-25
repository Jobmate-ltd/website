// node --test test/tools.test.mjs
//
// The free tools (Phase 3, Part C): the RIDDOR checker's question flow on
// top of the product's triage(), the URL state helpers, the AFR arithmetic
// and its sourced conventions, the 25 matrix cells, the link registry
// coverage of the shared shell, and the copy guards (no forbidden claims, no
// bracketed placeholders). Node 22 strips TypeScript types natively, so
// lib/*.ts is imported directly.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { RIDDOR_CATEGORY_DEFS, SPECIFIED_INJURIES, OCC_DISEASES, DANGEROUS_OCCURRENCES, triage } from '../lib/product-logic/riddor-knowledge.ts'
import { BANDS, LIKELIHOOD_SCALE, SEVERITY_SCALE, bandOf, score } from '../lib/product-logic/risk-scoring.ts'
import { HIERARCHY } from '../lib/product-logic/enums.ts'
import { ANSWER_KEYS, QUESTIONS, answered, decided, decodeAnswers, encodeAnswers, maxTotal, prune, questionFor, resultFor, setAnswer, stepsFor, verdictFor, verdictTone, RIDDOR_FAQS, RIDDOR_PAA, RIDDOR_STEPS } from '../lib/tools/riddor-checker.ts'
import { MATRIX_CELLS, cellFor, cellLabel, decodeMatrix, encodeMatrix, slaLabel, BAND_STATUS, HIERARCHY_LEVELS, RISK_FAQS, RISK_PAA, RISK_STEPS, HSE_RISK_URL } from '../lib/tools/risk-matrix.ts'
import { AFR_CONVENTIONS, AFR_HOURS, PER_MILLION_NOTE, afr, afrWorking, formatRate, AFR_FAQS, AFR_STEPS } from '../lib/tools/afr.ts'
import { TOOLS, INDUSTRY_LABELS, MODULE_LABELS, formatNumber, formatUkDate, partitionLinks, toolByPath, toolBySlug } from '../lib/tools/index.ts'
import { MODULES } from '../lib/platform.ts'
import { TOOL_PATHS, linksFrom } from '../lib/seo/links.ts'
import { findRow } from '../lib/seo/keyword-map.ts'
import { FORBIDDEN, NEW_PAGE_ONLY, scan } from '../scripts/claims-check.mjs'

const ROOT = join(import.meta.dirname, '..')
const TOOLS_DIR = join(ROOT, 'lib', 'tools')
const TOOL_PAGES = [TOOL_PATHS.riddor, TOOL_PATHS.matrix, TOOL_PATHS.afr]

/** The rules platform copy must stay inside, in source mode (rendered-only rules do not apply to a file). */
const RULES = [...FORBIDDEN, ...NEW_PAGE_ONLY].filter((rule) => !rule.renderedOnly)

/** Every positive (non-negated) hit; a negated sentence such as "does not send it for you" is allowed. */
function positiveClaims(text, options) {
  return scan(text, RULES, options).filter((hit) => !hit.negated)
}

/** Every string literal in a TypeScript source, so brackets in code (`a[0]`, `[...x]`) are not mistaken for copy placeholders. */
function stringLiterals(source) {
  const out = []
  const re = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g
  let m
  // Interpolations inside a template literal are code, not copy.
  while ((m = re.exec(source))) out.push((m[1] ?? m[2] ?? m[3] ?? '').replace(/\$\{[^}]*\}/g, ''))
  return out
}

/** Every string value in a nested object or array (functions and numbers are not copy). */
function stringsOf(value, out = []) {
  if (typeof value === 'string') out.push(value)
  else if (Array.isArray(value)) value.forEach((item) => stringsOf(item, out))
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => stringsOf(item, out))
  return out
}

const LIB_SOURCES = readdirSync(TOOLS_DIR)
  .filter((f) => f.endsWith('.ts'))
  .map((f) => ({ file: `lib/tools/${f}`, source: readFileSync(join(TOOLS_DIR, f), 'utf8') }))

// ── the RIDDOR checker ───────────────────────────────────────────────────────

describe('RIDDOR checker flow (lib/tools/riddor-checker.ts)', () => {
  test('asks about every key triage() reads, once each', () => {
    const asked = QUESTIONS.map((q) => q.key)
    assert.equal(new Set(asked).size, asked.length, 'a key is asked twice')
    assert.deepEqual([...asked].sort(), [...ANSWER_KEYS].sort())
    for (const key of ['workRelated', 'roadTraffic', 'privateRoad', 'outcome', 'personType', 'specifiedInjuries', 'hospitalTreatment', 'category', 'diseaseDiagnosed', 'disease', 'dangerousPara', 'daysOff', 'stillOff']) {
      assert.ok(asked.includes(key), `${key} is never asked`)
    }
    assert.equal(QUESTIONS.length, 13)
  })

  test('the options are the product lists, verbatim', () => {
    assert.deepEqual(questionFor('specifiedInjuries').options.map((o) => o.label), SPECIFIED_INJURIES.map((s) => s.label))
    assert.deepEqual(questionFor('disease').options.map((o) => o.value), OCC_DISEASES.map((d) => d.id))
    assert.deepEqual(questionFor('dangerousPara').options.map((o) => o.value), DANGEROUS_OCCURRENCES.map((d) => String(d.para)))
    assert.equal(questionFor('dangerousPara').noneLabel, 'None of these')
    assert.equal(questionFor('daysOff').kind, 'number')
    for (const q of QUESTIONS) {
      if (q.kind === 'number') continue
      assert.ok(q.options.length >= 2, `${q.key} has ${q.options.length} options`)
      assert.equal(new Set(q.options.map((o) => o.value)).size, q.options.length, `${q.key} repeats a value`)
    }
  })

  const CASES = [
    { answers: { workRelated: 'no' } },
    { answers: { workRelated: 'yes', roadTraffic: 'yes', privateRoad: 'no' } },
    { answers: { workRelated: 'yes', roadTraffic: 'yes', privateRoad: 'yes', outcome: 'death' } },
    { answers: { workRelated: 'yes', personType: 'worker', specifiedInjuries: ['fracture', 'nope'] } },
    { answers: { workRelated: 'yes', personType: 'nonworker', hospitalTreatment: 'yes' } },
    { answers: { workRelated: 'yes', personType: 'nonworker', hospitalTreatment: 'no' } },
    { answers: { workRelated: 'yes', category: 'disease', diseaseDiagnosed: 'yes', disease: 'havs' } },
    { answers: { workRelated: 'yes', category: 'dangerous', dangerousPara: 18 } },
    { answers: { workRelated: 'yes', personType: 'worker', daysOff: 8 } },
    { answers: { workRelated: 'yes', personType: 'worker', daysOff: '7' } },
    { answers: { workRelated: 'yes', personType: 'worker', daysOff: 4 } },
    { answers: { workRelated: 'yes', personType: 'worker', daysOff: 2 } },
    { answers: { workRelated: 'yes', personType: 'worker', daysOff: 2, stillOff: 'yes' } },
    { answers: { workRelated: 'yes', stillOff: 'yes' } },
    { answers: { workRelated: 'yes' } },
    // Complete paths, as the checker asks them.
    { answers: { workRelated: 'yes', roadTraffic: 'no', outcome: 'injury', personType: 'worker', specifiedInjuries: ['fracture'] }, complete: true, category: 'Specified' },
    { answers: { workRelated: 'yes', roadTraffic: 'no', outcome: 'injury', personType: 'worker', specifiedInjuries: [], daysOff: '8' }, complete: true, category: 'Over7Day' },
    { answers: { workRelated: 'yes', roadTraffic: 'no', outcome: 'injury', personType: 'worker', specifiedInjuries: [], daysOff: '5' }, complete: true, category: 'Over3DayRecordOnly' },
    { answers: { workRelated: 'yes', roadTraffic: 'no', outcome: 'injury', personType: 'worker', specifiedInjuries: [], daysOff: '2', stillOff: 'no' }, complete: true, category: 'NotReportable' },
    { answers: { workRelated: 'yes', roadTraffic: 'no', outcome: 'injury', personType: 'worker', specifiedInjuries: [], daysOff: '1', stillOff: 'yes' }, complete: true, category: 'Over7Day', provisional: true },
    { answers: { workRelated: 'yes', roadTraffic: 'no', outcome: 'injury', personType: 'nonworker', hospitalTreatment: 'yes' }, complete: true, category: 'NonWorker' },
    { answers: { workRelated: 'yes', roadTraffic: 'no', outcome: 'none', category: 'disease', diseaseDiagnosed: 'yes', disease: 'cts' }, complete: true, category: 'OccDisease' },
    { answers: { workRelated: 'yes', roadTraffic: 'no', outcome: 'none', category: 'disease', diseaseDiagnosed: 'no' }, complete: true, category: 'NotReportable' },
    { answers: { workRelated: 'yes', roadTraffic: 'no', outcome: 'none', category: 'dangerous', dangerousPara: '1' }, complete: true, category: 'DangerousOccurrence' },
    { answers: { workRelated: 'yes', roadTraffic: 'no', outcome: 'none', category: 'dangerous', dangerousPara: '' }, complete: true, category: 'NotReportable' },
    { answers: { workRelated: 'yes', roadTraffic: 'yes', privateRoad: 'yes', outcome: 'death' }, complete: true, category: 'Death' },
    { answers: { workRelated: 'yes', roadTraffic: 'yes', privateRoad: 'no' }, complete: true, category: 'NotReportable' },
  ]

  test('verdictFor(answers) is exactly triage(answers).category, for every product case and every complete path', () => {
    assert.ok(CASES.length >= 8)
    for (const { answers } of CASES) {
      const pruned = prune(answers)
      assert.equal(verdictFor(answers), triage(pruned).category, JSON.stringify(answers))
      assert.equal(resultFor(answers).def, RIDDOR_CATEGORY_DEFS[verdictFor(answers)])
    }
  })

  test('a complete path is decided with the expected category, and stops asking once triage has decided', () => {
    for (const c of CASES.filter((x) => x.complete)) {
      assert.equal(decided(c.answers), true, JSON.stringify(c.answers))
      assert.equal(verdictFor(c.answers), c.category, JSON.stringify(c.answers))
      assert.equal(resultFor(c.answers).provisional ?? false, c.provisional ?? false, JSON.stringify(c.answers))
      // Nothing was pruned: every answer given was one the flow asks for on that path.
      assert.deepEqual(prune(c.answers), c.answers)
      const steps = stepsFor(c.answers)
      assert.equal(steps.length, Object.keys(c.answers).length)
      assert.ok(steps.every((q) => answered(c.answers, q)))
    }
    // The product's partial cases are not decided by the flow: it still has questions to ask.
    assert.equal(decided({ workRelated: 'yes' }), false)
    assert.equal(decided({}), false)
    assert.equal(decided({ workRelated: 'no' }), true)
  })

  test('the progress total is the longest completion left and only shrinks along a path', () => {
    assert.equal(maxTotal({}), 8)
    let answers = {}
    let last = maxTotal(answers)
    for (const [key, value] of [['workRelated', 'yes'], ['roadTraffic', 'no'], ['outcome', 'injury'], ['personType', 'worker'], ['specifiedInjuries', []], ['daysOff', '2'], ['stillOff', 'no']]) {
      answers = setAnswer(answers, key, value)
      const total = maxTotal(answers)
      assert.ok(total <= last, `${key}: ${total} > ${last}`)
      assert.ok(total >= stepsFor(answers).length)
      last = total
    }
    assert.equal(last, 7)
    assert.equal(decided(answers), true)
  })

  test('changing an earlier answer prunes the branch that hung off it', () => {
    const full = { workRelated: 'yes', roadTraffic: 'no', outcome: 'injury', personType: 'worker', specifiedInjuries: [], daysOff: '9' }
    assert.equal(verdictFor(full), 'Over7Day')
    assert.deepEqual(setAnswer(full, 'personType', 'nonworker'), { workRelated: 'yes', roadTraffic: 'no', outcome: 'injury', personType: 'nonworker' })
    assert.deepEqual(setAnswer(full, 'workRelated', 'no'), { workRelated: 'no' })
    assert.deepEqual(setAnswer(full, 'specifiedInjuries', ['burns']), { workRelated: 'yes', roadTraffic: 'no', outcome: 'injury', personType: 'worker', specifiedInjuries: ['burns'] })
    assert.deepEqual(setAnswer(full, 'daysOff', undefined), { workRelated: 'yes', roadTraffic: 'no', outcome: 'injury', personType: 'worker', specifiedInjuries: [] })
    assert.deepEqual(prune(prune(full)), prune(full))
  })

  test('the URL encoding round-trips, including an empty multi-select, "none of these" and the date', () => {
    const states = [
      { answers: {}, date: null },
      { answers: { workRelated: 'no' }, date: '2026-09-25' },
      { answers: { workRelated: 'yes', roadTraffic: 'no', outcome: 'injury', personType: 'worker', specifiedInjuries: ['fracture', 'burns'] }, date: '2026-01-31' },
      { answers: { workRelated: 'yes', roadTraffic: 'no', outcome: 'injury', personType: 'worker', specifiedInjuries: [], daysOff: '8' }, date: null },
      { answers: { workRelated: 'yes', roadTraffic: 'no', outcome: 'injury', personType: 'worker', specifiedInjuries: [], daysOff: '2', stillOff: 'yes' }, date: '2026-12-01' },
      { answers: { workRelated: 'yes', roadTraffic: 'no', outcome: 'none', category: 'dangerous', dangerousPara: '' }, date: null },
      { answers: { workRelated: 'yes', roadTraffic: 'no', outcome: 'none', category: 'dangerous', dangerousPara: '18' }, date: null },
      { answers: { workRelated: 'yes', roadTraffic: 'no', outcome: 'none', category: 'disease', diseaseDiagnosed: 'yes', disease: 'havs' }, date: null },
      { answers: { workRelated: 'yes', roadTraffic: 'yes', privateRoad: 'yes', outcome: 'death' }, date: '2026-02-28' },
    ]
    for (const state of states) {
      const query = encodeAnswers(state.answers, state.date)
      const back = decodeAnswers(query)
      assert.deepEqual(back.answers, state.answers, query)
      assert.equal(back.date, state.date, query)
      assert.deepEqual(decodeAnswers(new URLSearchParams(query)), back)
      assert.equal(encodeAnswers(back.answers, back.date), query)
    }
    assert.equal(encodeAnswers({}), '')
    assert.equal(encodeAnswers({ workRelated: 'yes', roadTraffic: 'no', outcome: 'injury', personType: 'worker', specifiedInjuries: [] }), 'workRelated=yes&roadTraffic=no&outcome=injury&personType=worker&specifiedInjuries=')
    assert.equal(encodeAnswers({ workRelated: 'yes' }, '2026-02-30'), 'workRelated=yes', 'an impossible date is dropped')
  })

  test('decoding drops values the checker does not offer, and answers with no question before them', () => {
    const junk = decodeAnswers('workRelated=maybe&daysOff=abc&specifiedInjuries=nope&date=2026-02-30&disease=havs')
    assert.deepEqual(junk.answers, {})
    assert.equal(junk.date, null)
    // A later answer without the ones the flow asks first is pruned: the checker starts where the answers stop.
    assert.deepEqual(decodeAnswers('workRelated=yes&personType=worker&daysOff=8').answers, { workRelated: 'yes' })
    assert.deepEqual(decodeAnswers('workRelated=yes&roadTraffic=no&outcome=injury&personType=worker&specifiedInjuries=fracture,nope,fracture').answers.specifiedInjuries, ['fracture'])
    assert.deepEqual(decodeAnswers('workRelated=yes&roadTraffic=no&outcome=injury&personType=worker&specifiedInjuries=&daysOff=99999').answers.daysOff, undefined)
  })

  test('the verdict chip tone separates nothing sent, a record and a report', () => {
    assert.equal(verdictTone('NotReportable'), 'neutral')
    assert.equal(verdictTone('Over3DayRecordOnly'), 'info')
    assert.equal(verdictTone('Over7Day'), 'warning')
    assert.equal(verdictTone('Specified'), 'critical')
    assert.equal(verdictTone('Death'), 'critical')
  })

  test('four How-it-works steps and an FAQ that opens with the three People-also-ask questions', () => {
    assert.equal(RIDDOR_STEPS.length, 4)
    const row = findRow(TOOL_PATHS.riddor)
    assert.deepEqual(RIDDOR_PAA, row.paa)
    assert.deepEqual(RIDDOR_FAQS.slice(0, 3).map((f) => f.q), row.paa)
    assert.ok(RIDDOR_FAQS.length >= 6)
    assert.match(RIDDOR_FAQS[0].a, /^Eight: seven that are reported to HSE and one that is recorded/)
    for (const def of Object.values(RIDDOR_CATEGORY_DEFS)) {
      if (def.key === 'NotReportable') continue
      assert.ok(RIDDOR_FAQS[0].a.toLowerCase().includes(def.label.replace(/, record only$/i, '').toLowerCase()), `FAQ 1 lists ${def.label}`)
    }
    assert.match(RIDDOR_FAQS[1].a, /^If a worker is away/)
    assert.match(RIDDOR_FAQS[1].a, /within 15 days/)
    assert.match(RIDDOR_FAQS[2].a, /^Anything that meets none of the RIDDOR thresholds/)
    const questions = RIDDOR_FAQS.map((f) => f.q.toLowerCase())
    for (const topic of [/10 days and when is it 15/, /over-3-day/, /member of the public/, /who submits/]) assert.ok(questions.some((q) => topic.test(q)), `FAQ covers ${topic}`)
    assert.match(RIDDOR_FAQS.find((f) => /who submits/i.test(f.q)).a, /jobsafe does not submit it for you/)
  })
})

// ── the risk matrix ──────────────────────────────────────────────────────────

describe('risk matrix (lib/tools/risk-matrix.ts)', () => {
  test('25 cells, each labelled with both axes, the score and the band', () => {
    assert.equal(MATRIX_CELLS.length, 25)
    assert.equal(new Set(MATRIX_CELLS.map((c) => `${c.l}-${c.s}`)).size, 25)
    assert.equal(new Set(MATRIX_CELLS.map((c) => c.label)).size, 25)
    for (const l of LIKELIHOOD_SCALE) {
      for (const s of SEVERITY_SCALE) {
        const cell = cellFor(l.v, s.v)
        assert.equal(cell.score, score(l.v, s.v))
        assert.equal(cell.band, bandOf(l.v * s.v))
        assert.equal(cell.label, `Likelihood ${l.v} ${l.label}, severity ${s.v} ${s.label}, score ${l.v * s.v}, ${bandOf(l.v * s.v).key}`)
        assert.equal(cellLabel(l.v, s.v), cell.label)
      }
    }
    assert.equal(cellLabel(3, 4), 'Likelihood 3 Possible, severity 4 Major, score 12, High')
    assert.throws(() => cellLabel(0, 1))
  })

  test('every band has a status token and an SLA sentence; the hierarchy is the product order', () => {
    for (const band of BANDS) {
      assert.ok(['good', 'warning', 'critical'].includes(BAND_STATUS[band.tone]), band.key)
      assert.ok(slaLabel(band).length > 20, band.key)
    }
    assert.match(slaLabel(bandOf(25)), /^Stop the activity/)
    assert.match(slaLabel(bandOf(12)), /within 30 days/)
    assert.match(slaLabel(bandOf(1)), /^No deadline/)
    assert.deepEqual(HIERARCHY_LEVELS.map((h) => h.key), [...HIERARCHY])
    assert.deepEqual(HIERARCHY_LEVELS.map((h) => h.rank), [1, 2, 3, 4, 5])
  })

  test('the selection round-trips through the query string and rejects anything off the scale', () => {
    assert.equal(encodeMatrix({ l: 3, s: 4 }), 'l=3&s=4')
    assert.equal(encodeMatrix({ l: null, s: null }), '')
    assert.equal(encodeMatrix({ l: 2, s: null }), 'l=2')
    assert.deepEqual(decodeMatrix('l=3&s=4'), { l: 3, s: 4 })
    assert.deepEqual(decodeMatrix(new URLSearchParams('?l=3&s=4')), { l: 3, s: 4 })
    assert.deepEqual(decodeMatrix('l=0&s=9'), { l: null, s: null })
    assert.deepEqual(decodeMatrix('l=abc'), { l: null, s: null })
    assert.deepEqual(decodeMatrix(''), { l: null, s: null })
    for (const cell of MATRIX_CELLS) assert.deepEqual(decodeMatrix(encodeMatrix(cell)), { l: cell.l, s: cell.s })
  })

  test('five HSE steps with one link to HSE, and an FAQ that opens with the three People-also-ask questions', () => {
    assert.equal(RISK_STEPS.length, 5)
    assert.deepEqual(RISK_STEPS.map((s) => s.name), ['Identify the hazards', 'Decide who might be harmed and how', 'Evaluate the risks and decide on precautions', 'Record your findings and implement them', 'Review and update'])
    assert.equal(HSE_RISK_URL, 'https://www.hse.gov.uk/simple-health-safety/risk/')
    const row = findRow(TOOL_PATHS.matrix)
    assert.deepEqual(RISK_PAA, row.paa)
    assert.deepEqual(RISK_FAQS.slice(0, 3).map((f) => f.q), row.paa)
    assert.ok(RISK_FAQS.length >= 6)
    for (const step of [...LIKELIHOOD_SCALE, ...SEVERITY_SCALE]) assert.ok(RISK_FAQS[1].a.includes(step.label), `FAQ 2 names ${step.label}`)
    for (const band of BANDS) assert.ok(RISK_FAQS[3].a.includes(band.action), `FAQ 4 quotes the ${band.key} action`)
    assert.match(RISK_FAQS[2].a, /HSE does not prescribe a matrix/)
  })
})

// ── the accident frequency rate ──────────────────────────────────────────────

describe('accident frequency rate (lib/tools/afr.ts)', () => {
  test('afr() is (injuries × multiplier) ÷ hours, and null for zero hours', () => {
    assert.ok(Math.abs(afr(4, 812_000, 100_000) - 0.49261) < 0.001)
    assert.equal(afr(0, 1_000, 100_000), 0)
    assert.equal(afr(2, 200_000, 100_000), 1)
    assert.equal(afr(1, 0, 100_000), null)
    assert.equal(afr(1, -5, 100_000), null)
    assert.equal(afr(-1, 100, 100_000), null)
    assert.equal(afr(Number.NaN, 100, 100_000), null)
    assert.equal(afr(1, Number.POSITIVE_INFINITY, 100_000), null)
    assert.equal(afr(1, 100, 0), null)
  })

  test('the working is shown in full, to two decimal places, with thousands separated', () => {
    assert.equal(afrWorking(4, 812_000, 100_000), '(4 × 100,000) ÷ 812,000 = 0.49')
    assert.equal(afrWorking(0, 1_000, 100_000), '(0 × 100,000) ÷ 1,000 = 0.00')
    assert.equal(afrWorking(12, 1_234_567, 100_000), '(12 × 100,000) ÷ 1,234,567 = 0.97')
    assert.equal(afrWorking(1, 0, 100_000), null)
    assert.equal(formatRate(1 / 3), '0.33')
  })

  test('two conventions, each with a name, a denominator and verified sources; nothing left to verify', () => {
    assert.equal(AFR_CONVENTIONS.length, 2)
    assert.deepEqual(AFR_CONVENTIONS.map((c) => c.id), ['per-100k-hours', 'per-100k-workers'])
    assert.deepEqual(AFR_CONVENTIONS.map((c) => c.denominator), ['hours', 'workers'])
    assert.equal(AFR_HOURS.id, 'per-100k-hours')
    assert.equal(AFR_HOURS.multiplier, 100_000)
    for (const c of AFR_CONVENTIONS) {
      assert.equal(c.multiplier, 100_000, c.id)
      assert.ok(c.sources.length >= 2, `${c.id} has ${c.sources.length} sources`)
      for (const s of c.sources) {
        assert.match(s.url, /^https:\/\/[^\s[\]]+$/, `${c.id}: ${s.url}`)
        assert.equal(s.checked, '25/09/2026', `${c.id}: ${s.name}`)
        assert.ok(s.quote.length > 20, `${c.id}: ${s.name} has no quote`)
        assert.ok(s.name.length > 10)
        assert.ok(!/\[|\]|verify/i.test(s.url + s.quote + s.name), `${c.id}: ${s.name} still carries a placeholder`)
      }
    }
    assert.match(AFR_CONVENTIONS[1].sources[0].url, /^https:\/\/www\.hse\.gov\.uk\/statistics\//)
    assert.match(AFR_CONVENTIONS[1].explain, /headcount, not hours/)
    assert.match(PER_MILLION_NOTE, /no UK regulator or industry body defines it/)
    assert.ok(!JSON.stringify(AFR_CONVENTIONS).includes('1,000,000'), 'the per-million rate is not presented as a convention')
  })

  test('four How-it-works steps and an FAQ that names a benchmark only where HSE publishes one', () => {
    assert.equal(AFR_STEPS.length, 4)
    assert.deepEqual(AFR_STEPS.map((s) => s.name), ['Count the reportable injuries', 'Total the hours worked', 'Multiply and divide', 'State the period'])
    assert.ok(AFR_FAQS.length >= 4)
    const questions = AFR_FAQS.map((f) => f.q.toLowerCase())
    for (const topic of [/counts as an injury/, /what hours/, /why do rates differ/, /good accident frequency rate/]) assert.ok(questions.some((q) => topic.test(q)), `FAQ covers ${topic}`)
    const good = AFR_FAQS.find((f) => /good accident frequency rate/i.test(f.q)).a
    assert.match(good, /^It depends on the sector/)
    assert.match(good, /HSE publishes injury rates per 100,000 workers/)
    assert.ok(!/\b\d+\.\d+\b/.test(good), 'no invented benchmark figure')
    assert.match(AFR_FAQS.find((f) => /Does jobsafe calculate/i.test(f.q)).a, /^No\./)
  })
})

// ── the shell, the hub and the copy guards ───────────────────────────────────

describe('tool definitions and the link registry (lib/tools/index.ts)', () => {
  test('three tools, one per registry path, each named and described', () => {
    assert.deepEqual(TOOLS.map((t) => t.path), [TOOL_PATHS.riddor, TOOL_PATHS.matrix, TOOL_PATHS.afr])
    assert.deepEqual(TOOLS.map((t) => t.slug), ['riddor-checker', 'risk-matrix', 'accident-frequency-rate'])
    for (const t of TOOLS) {
      assert.equal(toolByPath(t.path), t)
      assert.equal(toolBySlug(t.slug), t)
      assert.ok(t.name.length > 5 && t.short.length > 40 && t.description.length > 40, t.slug)
      assert.equal(t.path, `${TOOL_PATHS.hub}/${t.slug}`)
    }
    assert.equal(TOOLS[0].name, 'RIDDOR checker')
    assert.throws(() => toolByPath('/tools/nowhere'))
  })

  test('the shell renders every registry link: partitionLinks covers each declared target exactly once', () => {
    for (const path of TOOL_PAGES) {
      const declared = linksFrom(path)
      assert.ok(declared.length >= 3, path)
      const groups = partitionLinks(path)
      const rendered = [...groups.modules, ...groups.articles, ...groups.industries, ...groups.tools, ...groups.other, ...(groups.demo ? ['/demo'] : [])]
      assert.deepEqual([...rendered].sort(), [...declared].sort(), path)
      assert.equal(rendered.length, new Set(rendered).size, `${path} renders a link twice`)
      assert.deepEqual(groups.other, [], `${path} has links the shell has no home for`)
      assert.equal(groups.demo, true, `${path} must link the demo from its CTA`)
      assert.ok(groups.modules.length >= 1, `${path} links no module`)
      assert.ok(groups.tools.includes(TOOL_PATHS.hub), `${path} links the hub`)
      for (const other of TOOL_PAGES.filter((p) => p !== path)) assert.ok(groups.tools.includes(other), `${path} links ${other}`)
      for (const href of groups.industries) assert.ok(INDUSTRY_LABELS[href], `${href} has no label`)
      // The bowtie page is not a module in lib/platform.ts; the shell needs a label for anything like it.
      for (const href of groups.modules) assert.ok(MODULES.some((m) => m.path === href) || MODULE_LABELS[href], `${href} is neither a module nor labelled`)
    }
    assert.deepEqual(linksFrom(TOOL_PATHS.hub), [TOOL_PATHS.riddor, TOOL_PATHS.matrix, TOOL_PATHS.afr, '/toolkit', '/platform'])
  })

  test('date and number formatting', () => {
    assert.equal(formatUkDate('2026-10-05'), '05/10/2026')
    assert.equal(formatUkDate('2026-01-31'), '31/01/2026')
    assert.equal(formatUkDate('not a date'), 'not a date')
    assert.equal(formatNumber(812000), '812,000')
    assert.equal(formatNumber(999), '999')
    assert.equal(formatNumber(0.4926, 2), '0.49')
    assert.equal(formatNumber(1234567.891, 2), '1,234,567.89')
    assert.equal(formatNumber(-1500), '-1,500')
    assert.equal(formatNumber(Number.NaN), '')
  })
})

describe('copy guards for lib/tools/', () => {
  const COPY = { QUESTIONS, RIDDOR_FAQS, RIDDOR_STEPS, RISK_FAQS, RISK_STEPS, AFR_FAQS, AFR_STEPS, AFR_CONVENTIONS, PER_MILLION_NOTE, TOOLS, INDUSTRY_LABELS }

  test('no FAQ answer, step, question or convention makes a forbidden claim', () => {
    for (const [name, value] of Object.entries(COPY)) {
      const text = JSON.stringify(value)
      const hits = positiveClaims(text)
      assert.deepEqual(hits, [], `${name}: ${hits.map((h) => `[${h.rule}] "${h.match}" in "${h.sentence}"`).join('; ')}`)
    }
    for (const faqs of [RIDDOR_FAQS, RISK_FAQS, AFR_FAQS]) {
      for (const faq of faqs) {
        assert.ok(faq.a.length > 60, faq.q)
        assert.ok(!/—/.test(faq.q + faq.a), `em dash in "${faq.q}"`)
        assert.ok(!/JobSafe|Jobsafe|JOBSAFE/.test(faq.q + faq.a), `brand miscased in "${faq.q}"`)
      }
    }
  })

  test('no source file under lib/tools/ makes a forbidden claim', () => {
    assert.ok(LIB_SOURCES.length >= 4)
    for (const { file, source } of LIB_SOURCES) {
      const hits = positiveClaims(source, { skipCode: true })
      assert.deepEqual(hits, [], `${file}: ${hits.map((h) => `${h.line} [${h.rule}] "${h.match}"`).join('; ')}`)
    }
  })

  test('no bracketed placeholder is left in any string under lib/tools/', () => {
    for (const { file, source } of LIB_SOURCES) {
      for (const literal of stringLiterals(source)) {
        assert.ok(!/\[[^\]]*\]/.test(literal), `${file}: placeholder in "${literal.slice(0, 80)}"`)
        assert.ok(!/to verify|TODO|TBC|lorem/i.test(literal), `${file}: unfinished copy in "${literal.slice(0, 80)}"`)
      }
      assert.ok(!/—/.test(source), `${file}: em dash in copy`)
    }
    for (const text of stringsOf(COPY)) assert.ok(!/\[[^\]]*\]/.test(text), `a placeholder reached the exported copy: "${text.slice(0, 80)}"`)
  })
})
