// node --test test/
//
// The product's own logic, ported into lib/product-logic/ by
// scripts/sync-product-logic.mjs. These tests mirror the upstream suites
// (Jobmate-ltd/jobsafe src/lib/domain/riddor/knowledge.test.ts and
// src/lib/domain/risk/scoring.test.ts, the 5×5 banding cases) case for
// case, translated from vitest to node:test, so the free tools on the site
// provably agree with the app. The hazard, assessment and bowtie maths are
// not ported, so their upstream cases are not here. When SOURCE.json says the
// upstream tests changed, re-read them and update this file.
//
// Node 22 strips TypeScript types natively, so lib/*.ts is imported directly.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { RIDDOR_CATEGORIES, HIERARCHY } from '../lib/product-logic/enums.ts'
import { RIDDOR_CATEGORY_DEFS, SPECIFIED_INJURIES, OCC_DISEASES, DANGEROUS_OCCURRENCES, RECORD_REQUIREMENTS, HSE_CONTACT, riddorDeadline, triage } from '../lib/product-logic/riddor-knowledge.ts'
import { BANDS, LIKELIHOOD_SCALE, SEVERITY_SCALE, HIERARCHY_DEFS, bandOf, score } from '../lib/product-logic/risk-scoring.ts'
import { addCalendarDays, calendarDaysBetween, parseCalendar } from '../lib/product-logic/date.ts'

// ── upstream: knowledge.test.ts ──────────────────────────────────────────────

describe('RIDDOR knowledge base', () => {
  test('has a definition for every category key', () => {
    for (const k of RIDDOR_CATEGORIES) assert.equal(RIDDOR_CATEGORY_DEFS[k].key, k)
  })

  test('computes deadlines from the form days', () => {
    assert.deepEqual(riddorDeadline('Over7Day', '2026-09-01', '2026-09-10'), { deadlineAt: '2026-09-16', daysLeft: 6, overdue: false })
    assert.deepEqual(riddorDeadline('Specified', '2026-09-01', '2026-09-12'), { deadlineAt: '2026-09-11', daysLeft: -1, overdue: true })
    assert.equal(riddorDeadline('GasIncident', '2026-09-01', '2026-09-01').deadlineAt, '2026-09-15')
    assert.deepEqual(riddorDeadline('NotReportable', '2026-09-01', '2026-09-10'), { deadlineAt: null, daysLeft: null, overdue: false })
  })
})

describe('triage', () => {
  test('follows the HSE decision sequence', () => {
    assert.equal(triage({ workRelated: 'no' }).category, 'NotReportable')
    assert.equal(triage({ workRelated: 'yes', roadTraffic: 'yes', privateRoad: 'no' }).category, 'NotReportable')
    assert.equal(triage({ workRelated: 'yes', roadTraffic: 'yes', privateRoad: 'yes', outcome: 'death' }).category, 'Death')
    const spec = triage({ workRelated: 'yes', personType: 'worker', specifiedInjuries: ['fracture', 'nope'] })
    assert.equal(spec.category, 'Specified')
    assert.deepEqual(spec.specified, ['A fracture, other than to fingers, thumbs or toes'])
    assert.equal(triage({ workRelated: 'yes', personType: 'nonworker', hospitalTreatment: 'yes' }).category, 'NonWorker')
    assert.equal(triage({ workRelated: 'yes', personType: 'nonworker', hospitalTreatment: 'no' }).category, 'NotReportable')
    assert.match(triage({ workRelated: 'yes', category: 'disease', diseaseDiagnosed: 'yes', disease: 'havs' }).reasons[0], /HAVS/)
    assert.match(triage({ workRelated: 'yes', category: 'dangerous', dangerousPara: 18 }).reasons[0], /scaffolding/)
  })

  test('handles the incapacity thresholds', () => {
    assert.equal(triage({ workRelated: 'yes', personType: 'worker', daysOff: 8 }).category, 'Over7Day')
    assert.equal(triage({ workRelated: 'yes', personType: 'worker', daysOff: '7' }).category, 'Over3DayRecordOnly')
    assert.equal(triage({ workRelated: 'yes', personType: 'worker', daysOff: 4 }).category, 'Over3DayRecordOnly')
    assert.equal(triage({ workRelated: 'yes', personType: 'worker', daysOff: 2 }).category, 'NotReportable')
    const prov = triage({ workRelated: 'yes', personType: 'worker', daysOff: 2, stillOff: 'yes' })
    assert.equal(prov.category, 'Over7Day')
    assert.equal(prov.provisional, true)
    assert.equal(triage({ workRelated: 'yes', stillOff: 'yes' }).provisional, true)
    assert.equal(triage({ workRelated: 'yes' }).category, 'NotReportable')
  })
})

// ── upstream: scoring.test.ts, "5×5 banding" ─────────────────────────────────

describe('5×5 banding', () => {
  test('bands every cell of the matrix', () => {
    assert.equal(bandOf(1).key, 'Low')
    assert.equal(bandOf(4).key, 'Low')
    assert.equal(bandOf(5).key, 'Medium')
    assert.equal(bandOf(9).key, 'Medium')
    assert.equal(bandOf(10).key, 'High')
    assert.equal(bandOf(16).key, 'High')
    assert.equal(bandOf(17).key, 'Extreme')
    assert.equal(bandOf(25).key, 'Extreme')
  })

  test('clamps out-of-range inputs', () => {
    assert.equal(score(0, 9), 5)
    assert.equal(score(6, 6), 25)
  })
})

// ── the site's own guarantees over the port ──────────────────────────────────

describe('the port itself', () => {
  test('every ported file names its source repository, path and commit', () => {
    const manifest = JSON.parse(readFileSync(join(import.meta.dirname, '..', 'lib', 'product-logic', 'SOURCE.json'), 'utf8'))
    assert.match(manifest.commit, /^[0-9a-f]{40}$/)
    for (const [file, entry] of Object.entries(manifest.files)) {
      const head = readFileSync(join(import.meta.dirname, '..', 'lib', 'product-logic', file), 'utf8').split('\n').slice(0, 3).join('\n')
      assert.match(head, /GENERATED by scripts\/sync-product-logic\.mjs/, file)
      assert.ok(head.includes(`Jobmate-ltd/jobsafe ${entry.source} at commit ${manifest.commit}`), `${file} header names its source`)
    }
  })

  test('the 5×5 covers every cell exactly once and the scales have five steps', () => {
    for (let l = 1; l <= 5; l++) for (let s = 1; s <= 5; s++) {
      const value = score(l, s)
      assert.equal(value, l * s)
      assert.equal(BANDS.filter((b) => value >= b.min && value <= b.max).length, 1, `cell ${l}×${s}`)
    }
    assert.equal(LIKELIHOOD_SCALE.length, 5)
    assert.equal(SEVERITY_SCALE.length, 5)
    assert.deepEqual(Object.keys(HIERARCHY_DEFS), [...HIERARCHY])
    assert.deepEqual(BANDS.map((b) => b.key), ['Low', 'Medium', 'High', 'Extreme'])
  })

  test('the RIDDOR lists match the regulations the checker cites', () => {
    assert.equal(SPECIFIED_INJURIES.length, 8, 'Regulation 4 lists eight specified injuries')
    assert.ok(OCC_DISEASES.length >= 8)
    assert.ok(DANGEROUS_OCCURRENCES.length >= 10, 'the Schedule 2 paragraphs that apply to most workplaces')
    for (const d of DANGEROUS_OCCURRENCES) assert.ok(Number.isInteger(d.para) && d.label, `paragraph ${d.para}`)
    assert.ok(RECORD_REQUIREMENTS.fields.length >= 6)
    assert.match(HSE_CONTACT.phone, /^0345 300 9923$/)
    assert.match(HSE_CONTACT.portal, /^https:\/\/notifications\.hse\.gov\.uk\//)
  })

  test('every triage outcome has a category definition with a deadline rule', () => {
    const seen = new Set()
    const answers = [
      { workRelated: 'no' },
      { workRelated: 'yes', outcome: 'death' },
      { workRelated: 'yes', personType: 'worker', specifiedInjuries: ['fracture'] },
      { workRelated: 'yes', personType: 'nonworker', hospitalTreatment: 'yes' },
      { workRelated: 'yes', category: 'disease', diseaseDiagnosed: 'yes', disease: 'havs' },
      { workRelated: 'yes', category: 'dangerous', dangerousPara: 1 },
      { workRelated: 'yes', personType: 'worker', daysOff: 8 },
      { workRelated: 'yes', personType: 'worker', daysOff: 5 },
    ]
    for (const a of answers) {
      const r = triage(a)
      seen.add(r.category)
      assert.equal(r.def, RIDDOR_CATEGORY_DEFS[r.category])
      assert.ok(r.reasons.length > 0)
      const d = riddorDeadline(r.category, '2026-09-01', '2026-09-01')
      if (r.def.formDays === null) assert.equal(d.deadlineAt, null)
      else assert.equal(d.deadlineAt, addCalendarDays('2026-09-01', r.def.formDays))
    }
    assert.ok(seen.size >= 7)
  })

  test('calendar helpers are zone-independent', () => {
    assert.equal(addCalendarDays('2026-02-28', 1), '2026-03-01')
    assert.equal(addCalendarDays('2024-02-28', 1), '2024-02-29')
    assert.equal(calendarDaysBetween('2026-03-29', '2026-03-30'), 1)
    assert.equal(parseCalendar('2026-02-30'), null)
    assert.deepEqual(parseCalendar('2026-09-25'), { y: 2026, m: 9, d: 25 })
  })
})
