#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// jobsafe — claims check for the platform relaunch (Phase 2).
//
// The Phase 2 brief keeps two lists that no platform copy may cross:
//
//   never say      immutable audit trail, ISO 45001, HSSE compliant, files
//                  RIDDOR with HSE for you, unsourced multipliers
//   say once built push or email alerts, voice notes, Google or Apple
//                  sign-in, escalation rules, native store apps, SSO, API,
//                  import from spreadsheets, PDF generation, AI
//
// and three things a new page may not mention at all: a free trial, checkout,
// migrating existing customers. This script proves the copy stays inside
// those lines, in two modes:
//
//   node scripts/claims-check.mjs
//       Source mode. Scans the platform-only files and the platform regions
//       of the shared files (chat widget, llms.txt, nav, price book).
//
//   node scripts/claims-check.mjs --base http://localhost:3000
//       Rendered mode, against a server built with the flag ON. Scans the
//       text and JSON-LD of every route plus llms.txt, and reports every
//       Sign up / Log in / Book a demo destination and every external host
//       so the PR can paste the result.
//
// A sentence that negates the claim ("not available yet", "no push alerts",
// "you submit to HSE") is allowed and listed as such; a positive claim fails.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PLATFORM_ONLY_PATHS } from './seo-audit.mjs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const args = process.argv.slice(2)
const arg = (name) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : null
}
const BASE = arg('--base')?.replace(/\/$/, '') ?? null

/** Claims that must never appear as a positive statement in platform copy. */
export const FORBIDDEN = [
  { id: 'push-alerts', pattern: /\bpush (notification|alert|reminder)s?\b/i, why: 'once built' },
  { id: 'email-alerts', pattern: /\bemail (notification|alert|reminder)s?\b|\balerts? by email\b|\bemails? (you|the (manager|supervisor|owner))\b/i, why: 'once built' },
  { id: 'voice-notes', pattern: /\bvoice (note|memo|recording)s?\b/i, why: 'once built' },
  { id: 'immutable', pattern: /\bimmutable\b|\btamper-?proof\b/i, why: 'never' },
  { id: 'iso-45001', pattern: /ISO ?45001/i, why: 'never' },
  { id: 'hsse-compliant', pattern: /\bHSSE[- ]compliant\b/i, why: 'never' },
  { id: 'social-sign-in', pattern: /\bsign (in|up) with (google|apple|microsoft)\b|\b(google|apple|microsoft) sign-?in\b/i, why: 'once built' },
  { id: 'escalation-rules', pattern: /\bescalation rules?\b|\bauto-?escalat/i, why: 'once built' },
  { id: 'store-apps', pattern: /\bApp Store\b|\bGoogle Play\b|\bnative (ios|android|store|mobile) apps?\b|\bdownload the app\b/i, why: 'once built' },
  { id: 'sso-api', pattern: /\bSSO\b|\bsingle sign-?on\b|\bAPI (access|integration|key)s?\b|\bpublic API\b/i, why: 'once built (enterprise row)' },
  // "webhook" is an internal lead-sink name in lib/demo; as a word shown to a visitor it is an integration claim.
  { id: 'webhooks', pattern: /\bwebhooks?\b/i, why: 'once built (integrations)', renderedOnly: true },
  { id: 'files-riddor', pattern: /\b(files?|submits?|sends?) (your |the )?RIDDOR (reports? |notifications? )?(to|with) (the )?HSE\b/i, why: 'never' },
  { id: 'import', pattern: /\bimport (from|your) (a )?spreadsheets?\b|\bbulk import\b|\bCSV import\b/i, why: 'once built' },
  { id: 'pdf-generation', pattern: /\bgenerates? (a )?PDFs?\b|\bPDF reports?\b/i, why: 'once built' },
  { id: 'ai', pattern: /\bAI[- ](written|generated|powered|assisted)\b|\bartificial intelligence\b/i, why: 'once built' },
  { id: 'multiplier', pattern: /\b\d+(\.\d+)?[×x] (faster|quicker|fewer|more)\b|\bunder \d+ seconds\b|\bin (under |less than )?\d+ seconds\b|\bover \d+%/i, why: 'never (unsourced)' },
  { id: 'certified', pattern: /\b(cyber essentials|iso ?27001|soc ?2)\b/i, why: 'not held' },
]

/** May not appear at all on a new page. */
export const NEW_PAGE_ONLY = [
  { id: 'free-trial', pattern: /\bfree trial\b|\btrial\b(?! and error)/i, why: 'no trial on new pages' },
  { id: 'checkout', pattern: /\bcheckout\b/i, why: 'no checkout on new pages' },
  { id: 'migration', pattern: /\bmigrat(e|ing|ion)\b/i, why: 'no migration on new pages' },
]

/** Sentence-level negation that turns a hit into an honest "not yet". */
const NEGATED = /\b(not|no|never|nor|without|isn't|aren't|doesn't|don't|cannot|can't|unavailable|yet to|nothing|rather than|instead of|does not|is not|are not)\b/i

/** Shared files: only the platform region is platform copy. */
const REGIONS = {
  'components/site/chat-widget.tsx': ['const PLATFORM_KNOWLEDGE_BASE', 'const ACTIVE_KNOWLEDGE_BASE'],
  'app/llms.txt/route.ts': ['function platformBody', 'function phase1Body'],
  'lib/site.ts': ['export const PLATFORM_INDUSTRY_LINKS', 'export function navForFlag'],
  'lib/brand.ts': ['export const PRICE_BOOK', 'export function priceBookLabel'],
  'lib/schema.ts': ['export function platformApplicationSchema', 'export function breadcrumbsFromTrail'],
  'components/site/industry-page.tsx': ['export function IndustryPage', null],
  'app/industries/healthcare/page.tsx': ['launch:', 'closing:'],
  'app/industries/window-door-fitters/page.tsx': ['launch:', 'closing:'],
}

const SOURCE_EXTS = new Set(['.ts', '.tsx', '.json'])

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (SOURCE_EXTS.has(extname(entry))) out.push(full)
  }
  return out
}

function platformOnlyFiles() {
  const files = []
  for (const p of PLATFORM_ONLY_PATHS) {
    const full = join(ROOT, p)
    try {
      if (statSync(full).isDirectory()) walk(full, files)
      else files.push(full)
    } catch {
      // a listed path that does not exist yet is fine
    }
  }
  return files.map((f) => relative(ROOT, f))
}

function sentenceAround(text, index) {
  const start = Math.max(text.lastIndexOf('.', index - 1), text.lastIndexOf('\n', index - 1), text.lastIndexOf("'", index - 60), text.lastIndexOf('"', index - 60), -1) + 1
  const endCandidates = [text.indexOf('.', index), text.indexOf('\n', index)].filter((i) => i >= 0)
  const end = endCandidates.length ? Math.min(...endCandidates) : text.length
  return text.slice(start, end).trim()
}

/** Every hit of `rules` in `text`, tagged positive or negated. */
export function scan(text, rules, { skipCode = false } = {}) {
  const hits = []
  for (const rule of rules) {
    const re = new RegExp(rule.pattern.source, rule.pattern.flags.includes('g') ? rule.pattern.flags : rule.pattern.flags + 'g')
    let m
    while ((m = re.exec(text))) {
      const lineStart = text.lastIndexOf('\n', m.index) + 1
      const line = text.slice(lineStart, text.indexOf('\n', m.index) === -1 ? text.length : text.indexOf('\n', m.index))
      if (skipCode && /^\s*(import|export type|\/\/|\*|\/\*|const \w+ = \[|readonly|\w+:\s*\w+;?$)/.test(line) && !/['"`]/.test(line)) continue
      // Identifiers and paths are not claims.
      if (skipCode && /(\w[-_]|[-_]\w)/.test(m[0]) === false && /[\w/]\b(api)\b/.test(line) && /app\/api|\/api\//.test(line)) continue
      const sentence = sentenceAround(text, m.index)
      const lineNo = text.slice(0, m.index).split('\n').length
      hits.push({ rule: rule.id, why: rule.why, match: m[0], negated: NEGATED.test(sentence), sentence: sentence.slice(0, 160), line: lineNo })
    }
  }
  return hits
}

function regionOf(rel, source) {
  const region = REGIONS[rel]
  if (!region) return source
  const [startMarker, endMarker] = region
  const start = source.indexOf(startMarker)
  if (start < 0) return ''
  const end = endMarker ? source.indexOf(endMarker, start + startMarker.length) : -1
  return source.slice(start, end < 0 ? undefined : end)
}

// ── source mode ──────────────────────────────────────────────────────────────

export function checkSources() {
  const findings = []
  const files = [...platformOnlyFiles(), ...Object.keys(REGIONS)]
  for (const rel of files) {
    let source
    try {
      source = readFileSync(join(ROOT, rel), 'utf8')
    } catch {
      continue
    }
    const isPlatformOnly = !REGIONS[rel]
    let text = regionOf(rel, source)
    // The keyword map carries each page's pre-launch (Phase 1) copy under `prelaunch`; only the launch copy is platform copy.
    if (rel.endsWith('keyword-map.json')) text = JSON.stringify(JSON.parse(source).rows.map((row) => { const { prelaunch, ...launch } = row; void prelaunch; return launch }), null, 1)
    const rules = (isPlatformOnly ? [...FORBIDDEN, ...NEW_PAGE_ONLY] : FORBIDDEN).filter((rule) => !rule.renderedOnly)
    for (const hit of scan(text, rules, { skipCode: true })) {
      const fullLine = rel.endsWith('.json') ? '' : (source.split('\n')[regionLine(source, text, hit.line) - 1] ?? '')
      // A `doNotClaim` list names the things NOT claimed, by design; a `keywords:` list is what a visitor might type, not what we say.
      if (/doNotClaim|do-not-claim|NEVER_CLAIM|FORBIDDEN|seo-audit-ignore|claims-check-ignore|^\s*keywords:/.test(fullLine)) continue
      findings.push({ where: `${rel}:${rel.endsWith('.json') ? 'launch copy' : regionLine(source, text, hit.line)}`, ...hit })
    }
  }
  return findings
}

function regionLine(source, region, lineInRegion) {
  const offset = source.indexOf(region.slice(0, 40))
  const before = offset < 0 ? 0 : source.slice(0, offset).split('\n').length - 1
  return before + lineInRegion
}

// ── rendered mode ────────────────────────────────────────────────────────────

const ROUTES_PHASE_2 = ['/platform', '/platform/incident-reporting', '/platform/riddor', '/platform/risk-assessments', '/platform/permits-to-work', '/platform/offline', '/pricing', '/security', '/demo', '/contact']
const ROUTES_PHASE_1 = ['/', '/about', '/industries/window-door-fitters', '/industries/healthcare', '/industries/field-services', '/industries/transport-logistics', '/academy', '/insights', '/toolkit', '/privacy-policy', '/terms', '/cookies', '/insights/riddor-reporting-explained', '/insights/near-miss-reporting-safety-culture', '/insights/lone-worker-safety-guide', '/insights/how-to-investigate-a-workplace-accident', '/insights/accident-book-requirements-uk', '/insights/rams-risk-assessments-method-statements', '/insights/first-aid-at-work-requirements', '/insights/riddor-changes-2026-consultation', '/insights/toolbox-talks-that-work']

function textOf(html) {
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n')
  const body = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
  return { body, jsonLd }
}

/** A URL is a destination, not a claim: `…/signup-trial` is where Sign up has always gone. */
function stripUrls(text) {
  return text.replace(/https?:\/\/[^\s"')<>]+/g, ' ')
}

function anchors(html) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((m) => {
    const href = /href="([^"]*)"/.exec(m[1])?.[1] ?? ''
    const label = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    return { href, label }
  })
}

export async function checkRendered(base) {
  const findings = []
  const links = { signup: new Set(), login: new Set(), demo: new Set(), hosts: new Map() }
  const routes = [...ROUTES_PHASE_2, ...ROUTES_PHASE_1]
  for (const route of routes) {
    const res = await fetch(base + route)
    if (!res.ok) {
      findings.push({ where: route, rule: 'http', why: `status ${res.status}`, match: '', negated: false, sentence: '' })
      continue
    }
    const html = await res.text()
    const { body, jsonLd } = textOf(html)
    const isNew = ROUTES_PHASE_2.includes(route) || route === '/'
    const rules = isNew ? [...FORBIDDEN, ...NEW_PAGE_ONLY] : FORBIDDEN
    for (const hit of scan(stripUrls(body), rules)) findings.push({ where: route, ...hit })
    for (const hit of scan(jsonLd, FORBIDDEN)) findings.push({ where: `${route} (JSON-LD)`, ...hit })
    for (const a of anchors(html)) {
      if (/^sign up/i.test(a.label)) links.signup.add(a.href)
      if (/^log in/i.test(a.label)) links.login.add(a.href)
      if (/^book a demo/i.test(a.label)) links.demo.add(a.href)
      if (/^https?:\/\//.test(a.href)) {
        const host = new URL(a.href).host
        if (!links.hosts.has(host)) links.hosts.set(host, new Set())
        links.hosts.get(host).add(route)
      }
    }
  }
  const llms = await fetch(base + '/llms.txt')
  if (llms.ok) {
    const text = await llms.text()
    for (const hit of scan(stripUrls(text), [...FORBIDDEN, ...NEW_PAGE_ONLY])) findings.push({ where: '/llms.txt', ...hit })
  } else {
    findings.push({ where: '/llms.txt', rule: 'http', why: `status ${llms.status}`, match: '', negated: false, sentence: '' })
  }
  return { findings, links }
}

// ── main ─────────────────────────────────────────────────────────────────────

function report(findings) {
  const positive = findings.filter((f) => !f.negated)
  const negated = findings.filter((f) => f.negated)
  for (const f of negated) console.log(`  · ${f.where}  [${f.rule}] negated: "${f.sentence}"`)
  for (const f of positive) console.log(`  ✘ ${f.where}  [${f.rule}, ${f.why}] "${f.match}" — ${f.sentence}`)
  return positive.length
}

async function main() {
  let failures = 0
  console.log('claims-check: source')
  failures += report(checkSources())
  if (BASE) {
    console.log(`\nclaims-check: rendered, ${BASE} (flag on)`)
    const { findings, links } = await checkRendered(BASE)
    failures += report(findings)
    console.log('\n  Sign up →', [...links.signup].join(', ') || '(none)')
    console.log('  Log in  →', [...links.login].join(', ') || '(none)')
    console.log('  Book a demo →', [...links.demo].join(', ') || '(none)')
    console.log('  External hosts linked:')
    for (const [host, routes] of [...links.hosts.entries()].sort()) console.log(`    ${host}  (${routes.size} page${routes.size === 1 ? '' : 's'})`)
    const badSignup = [...links.signup].filter((h) => h !== 'https://app.jobsafe.cloud/signup-trial')
    const badLogin = [...links.login].filter((h) => h !== 'https://app.jobsafe.cloud/login')
    const badDemo = [...links.demo].filter((h) => !/^https:\/\/calendly\.com\/jobmate-sales\/30min/.test(h) && h !== '/demo')
    const platformHosts = [...links.hosts.keys()].filter((h) => /platform\.|demo\.jobsafe|jobsafe\.app/.test(h))
    for (const [label, list] of [['Sign up', badSignup], ['Log in', badLogin], ['Book a demo', badDemo], ['platform/live-demo host', platformHosts]]) {
      if (list.length) {
        console.log(`  ✘ ${label} points somewhere it must not: ${list.join(', ')}`)
        failures += list.length
      }
    }
  }
  if (failures) {
    console.error(`\n✘ claims-check: ${failures} positive claim${failures === 1 ? '' : 's'} to remove.`)
    process.exit(1)
  }
  console.log('\n✔ claims-check clean')
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
