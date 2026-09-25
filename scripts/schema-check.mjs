#!/usr/bin/env node
/**
 * schema-check — structural validation of the JSON-LD every route serves.
 *
 *   node scripts/schema-check.mjs [--base http://localhost:3000] [--flag on|off] [--compare on|off]
 *
 * For each route it parses every <script type="application/ld+json">, checks
 * the graph is well-formed, and validates each node against the properties
 * schema.org (and Google's rich-result rules) require for its type:
 *
 *   Organization        name, url
 *   SoftwareApplication name, applicationCategory, operatingSystem, url;
 *                       `offers` only when a price exists and then with
 *                       priceCurrency and a numeric price; NO aggregateRating
 *   BreadcrumbList      itemListElement in order, each with position, name
 *                       and an absolute item URL that resolves 200
 *   FAQPage             ≥ 1 mainEntity Question with a non-empty acceptedAnswer,
 *                       and every question text present in the page HTML
 *   BlogPosting         headline, datePublished, author, mainEntityOfPage
 *
 * It also proves the Phase 2 rule that `operatingSystem` reads
 * "Web (installable on iOS and Android)" with the flag on, and that no
 * SoftwareApplication node links to an app store. Exit 1 on any miss. Node
 * only, no dependencies.
 */
const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(name)
  return i === -1 ? fallback : args[i + 1]
}
const base = (flag('--base', process.env.BASE_URL ?? 'http://localhost:3000') ?? '').replace(/\/$/, '')
const launched = flag('--flag', process.env.NEXT_PUBLIC_PLATFORM_LAUNCH === 'true' ? 'on' : 'off') === 'on'

const compare = flag('--compare', process.env.NEXT_PUBLIC_COMPARE_PAGES === 'true' ? 'on' : 'off') === 'on'
const { publicRoutes } = await import('../lib/routes.ts')
const { PHASE_3_INPUTS } = await import('../lib/brand.ts')
const { getAllPosts } = await import('../lib/insights.ts')

const routes = [
  ...publicRoutes(launched, { compare, inputs: PHASE_3_INPUTS }).map((r) => r.path),
  ...getAllPosts().map((p) => `/insights/${p.slug}`),
]

const failures = []
const fail = (route, message) => failures.push(`${route}: ${message}`)
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
const textOf = (html) =>
  decode(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' '),
  )

const statusCache = new Map()
async function status(url) {
  if (!statusCache.has(url)) statusCache.set(url, fetch(url, { method: 'GET', redirect: 'manual' }).then((r) => r.status).catch(() => 0))
  return statusCache.get(url)
}

function nodesOf(json) {
  if (Array.isArray(json)) return json.flatMap(nodesOf)
  if (json && typeof json === 'object') {
    if (Array.isArray(json['@graph'])) return json['@graph']
    return [json]
  }
  return []
}

let nodeCount = 0
for (const route of routes) {
  const res = await fetch(base + route)
  if (!res.ok) {
    fail(route, `HTTP ${res.status}`)
    continue
  }
  const html = await res.text()
  const text = textOf(html)
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1])
  if (blocks.length === 0) {
    fail(route, 'no JSON-LD block')
    continue
  }
  for (const block of blocks) {
    let json
    try {
      json = JSON.parse(block)
    } catch (e) {
      fail(route, `JSON-LD does not parse: ${e.message}`)
      continue
    }
    if (json['@context'] !== 'https://schema.org') fail(route, `@context is ${json['@context']}`)
    for (const node of nodesOf(json)) {
      nodeCount++
      const type = node['@type']
      const need = (...props) => {
        for (const p of props) if (node[p] === undefined || node[p] === '' || node[p] === null) fail(route, `${type} is missing ${p}`)
      }
      if ('aggregateRating' in node || 'review' in node) fail(route, `${type} carries a rating or review (there are none)`)
      // The platform is not in a store, so its SoftwareApplication node never links to one. Organization.sameAs may
      // still list the current app's listings: they are real and Log in / Sign up still go to that app.
      if (type === 'SoftwareApplication' && /apps\.apple\.com|play\.google\.com/.test(JSON.stringify(node))) fail(route, `${type} links to an app store`)
      switch (type) {
        case 'Organization':
          need('name', 'url')
          if (!/^https:\/\//.test(node.url)) fail(route, 'Organization.url is not absolute')
          break
        case 'SoftwareApplication': {
          need('name', 'applicationCategory', 'operatingSystem', 'url')
          if (launched && route !== '/about' && node.operatingSystem !== 'Web (installable on iOS and Android)' && !/^\/(academy|insights|toolkit|privacy-policy|terms|cookies)/.test(route)) {
            fail(route, `SoftwareApplication.operatingSystem is "${node.operatingSystem}"`)
          }
          if (node.offers) {
            const offers = Array.isArray(node.offers) ? node.offers : [node.offers]
            for (const offer of offers) {
              if (offer.priceCurrency !== 'GBP') fail(route, `offer priceCurrency is ${offer.priceCurrency}`)
              if (!(typeof offer.price === 'number' || /^\d+(\.\d+)?$/.test(String(offer.price)))) fail(route, `offer price is ${offer.price}`)
              if (!offer.name) fail(route, 'offer has no name')
            }
          }
          break
        }
        case 'BreadcrumbList': {
          const items = node.itemListElement ?? []
          if (!Array.isArray(items) || items.length === 0) fail(route, 'BreadcrumbList has no items')
          for (const [i, item] of items.entries()) {
            if (item.position !== i + 1) fail(route, `breadcrumb ${i + 1} has position ${item.position}`)
            if (!item.name) fail(route, `breadcrumb ${i + 1} has no name`)
            if (!/^https:\/\//.test(item.item ?? '')) fail(route, `breadcrumb ${i + 1} item is not absolute: ${item.item}`)
            else {
              const local = item.item.replace(/^https:\/\/www\.jobsafe\.cloud/, '')
              const code = await status(base + (local === '' ? '/' : local))
              if (code !== 200) fail(route, `breadcrumb ${item.item} returns ${code}`)
            }
          }
          break
        }
        case 'FAQPage': {
          const questions = node.mainEntity ?? []
          if (!Array.isArray(questions) || questions.length === 0) fail(route, 'FAQPage has no questions')
          for (const q of questions) {
            if (q['@type'] !== 'Question' || !q.name) fail(route, 'FAQPage entry is not a named Question')
            const answer = q.acceptedAnswer?.text
            if (!answer || answer.length < 20) fail(route, `FAQ "${q.name}" has no real answer`)
            if (!text.includes(decode(q.name).slice(0, 40))) fail(route, `FAQ question not in the HTML: "${q.name}"`)
            if (answer && !text.includes(decode(answer).slice(0, 40))) fail(route, `FAQ answer not in the HTML: "${q.name}"`)
          }
          break
        }
        case 'BlogPosting':
          need('headline', 'datePublished', 'author', 'mainEntityOfPage')
          break
        case 'WebSite':
        case 'WebPage':
        case 'CollectionPage':
        case 'ContactPage':
        case 'AboutPage':
          need('name', 'url')
          break
        default:
          if (!type) fail(route, 'node without @type')
      }
    }
  }
}

console.log(`schema-check against ${base} with the flag ${launched ? 'ON' : 'OFF'}${launched ? ` and compare ${compare ? 'ON' : 'OFF'}` : ''}: ${routes.length} routes, ${nodeCount} nodes`)
if (failures.length) {
  for (const f of failures) console.log(`  ✘ ${f}`)
  console.error(`\n✘ schema-check: ${failures.length} problem${failures.length === 1 ? '' : 's'}.`)
  process.exit(1)
}
console.log('\n✔ schema-check clean')
