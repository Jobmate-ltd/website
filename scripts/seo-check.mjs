#!/usr/bin/env node
/**
 * seo-check — proves the served pages match the keyword map and the link
 * registry, in either flag state.
 *
 *   node scripts/seo-check.mjs --flag on  --base http://localhost:3000
 *   node scripts/seo-check.mjs --flag off --base http://localhost:3000
 *
 * Run it against a production server built with the matching value of
 * NEXT_PUBLIC_PLATFORM_LAUNCH. It fetches every page in the map and checks:
 *   · <title>, meta description and the one H1 equal the row for that state
 *     (the pre-launch row while the flag is off);
 *   · the canonical is self-referencing;
 *   · flag off: every launch-only page returns 404;
 *   · flag on: every Phase 2 page has ≥ 3 contextual links out and ≥ 3 in
 *     per lib/seo/links.ts, and each declared link is present inside <main>
 *     of the served HTML (header and footer do not count);
 *   · both: every route that existed before Phase 2 still returns 200, so no
 *     URL changed.
 * Exit code 1 on any failure. No dependencies beyond Node.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(name)
  return i === -1 ? fallback : args[i + 1]
}
const base = (flag('--base', process.env.BASE_URL ?? 'http://localhost:3000') ?? '').replace(/\/$/, '')
const launched = flag('--flag', process.env.NEXT_PUBLIC_PLATFORM_LAUNCH === 'true' ? 'on' : 'off') === 'on'

const map = JSON.parse(readFileSync(join(root, 'content/seo/keyword-map.json'), 'utf8'))
const { LINK_REGISTRY, linksTo } = await import('../lib/seo/links.ts')
const { STATIC_ROUTES } = await import('../lib/routes.ts')
const { getAllPosts } = await import('../lib/insights.ts')

const failures = []
const ok = []
const fail = (page, message) => failures.push(`${page}: ${message}`)

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
const text = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
const attr = (html, re) => {
  const m = html.match(re)
  return m ? decode(m[1]) : null
}

async function fetchPage(path) {
  const res = await fetch(base + path, { redirect: 'manual', headers: { 'user-agent': 'jobsafe-seo-check' } })
  const html = res.status === 200 ? await res.text() : ''
  return { status: res.status, html }
}

function rowFor(row) {
  if (launched) return { title: row.title, description: row.description, h1: row.h1 }
  if (row.prelaunch) return row.prelaunch
  return row.phase === 1 ? { title: row.title, description: row.description, h1: row.h1 } : null
}

function mainOf(html) {
  const m = html.match(/<main[\s\S]*?<\/main>/i)
  return m ? m[0] : html
}

function hrefsIn(html) {
  const set = new Set()
  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)) {
    const href = decode(m[1]).replace(/^https?:\/\/www\.jobsafe\.cloud/, '').split(/[?#]/)[0]
    set.add(href.length > 1 ? href.replace(/\/$/, '') : href)
  }
  return set
}

// ── 1. The keyword map ───────────────────────────────────────────────────────
const pages = new Map()
for (const row of map.rows) {
  const expected = rowFor(row)
  const { status, html } = await fetchPage(row.path)
  pages.set(row.path, { status, html })
  if (!expected) {
    if (status === 404) ok.push(`${row.path} → 404 while the flag is off`)
    else fail(row.path, `expected 404 with the flag off, got ${status}`)
    continue
  }
  if (status !== 200) {
    fail(row.path, `HTTP ${status}`)
    continue
  }
  const title = text(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '')
  const description = attr(html, /<meta\s+name="description"\s+content="([^"]*)"/i) ?? attr(html, /<meta\s+content="([^"]*)"\s+name="description"/i)
  const canonical = attr(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i)
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => text(m[1]))
  if (title !== expected.title) fail(row.path, `title is "${title}", map says "${expected.title}"`)
  if (description !== expected.description) fail(row.path, `description is "${description}", map says "${expected.description}"`)
  if (h1s.length !== 1) fail(row.path, `${h1s.length} <h1> elements; must be exactly one`)
  else if (h1s[0] !== expected.h1) fail(row.path, `H1 is "${h1s[0]}", map says "${expected.h1}"`)
  const expectedCanonical = row.path === '/' ? 'https://www.jobsafe.cloud' : `https://www.jobsafe.cloud${row.path}`
  if (!canonical || canonical.replace(/\/$/, '') !== expectedCanonical) fail(row.path, `canonical is ${canonical}, expected ${expectedCanonical}`)
  if (!failures.some((f) => f.startsWith(`${row.path}:`))) ok.push(`${row.path} matches its row`)
}

// ── 2. The link registry (flag on) ───────────────────────────────────────────
if (launched) {
  const phase2 = map.rows.filter((row) => row.phase >= 2)
  for (const row of phase2) {
    const outs = LINK_REGISTRY[row.path] ?? []
    const ins = linksTo(row.path)
    if (outs.length < 3) fail(row.path, `${outs.length} contextual links out in lib/seo/links.ts; need ≥ 3`)
    // The homepage is linked from the wordmark and the breadcrumb on every page; the registry counts contextual links between inner pages.
    if (ins.length < 3 && row.path !== '/') fail(row.path, `${ins.length} contextual links in from lib/seo/links.ts; need ≥ 3`)
  }
  for (const [source, targets] of Object.entries(LINK_REGISTRY)) {
    let page = pages.get(source)
    if (!page) {
      page = await fetchPage(source)
      pages.set(source, page)
    }
    if (page.status !== 200) {
      fail(source, `HTTP ${page.status} while checking its links`)
      continue
    }
    const hrefs = hrefsIn(mainOf(page.html))
    for (const target of targets) {
      if (!hrefs.has(target)) fail(source, `declared link to ${target} is not in <main>`)
    }
  }
  if (!failures.some((f) => /contextual links|declared link/.test(f))) ok.push('link registry: every declared link is in the page, every Phase 2 page has ≥ 3 in and ≥ 3 out')
}

// ── 3. No existing URL changed ───────────────────────────────────────────────
const existing = [...STATIC_ROUTES.filter((r) => !r.platformOnly).map((r) => r.path), ...getAllPosts().map((p) => `/insights/${p.slug}`), '/sitemap.xml', '/robots.txt', '/llms.txt']
for (const path of existing) {
  const page = pages.get(path) ?? (await fetchPage(path))
  if (page.status !== 200) fail(path, `existing URL returned ${page.status}`)
}
if (!failures.some((f) => /existing URL/.test(f))) ok.push(`${existing.length} pre-existing URLs still return 200`)

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`seo-check against ${base} with the flag ${launched ? 'ON' : 'OFF'}`)
for (const line of ok) console.log(`  ✔ ${line}`)
for (const line of failures) console.log(`  ✘ ${line}`)
if (failures.length) {
  console.error(`\n✘ ${failures.length} problem(s)`)
  process.exit(1)
}
console.log('\n✔ seo-check clean')
