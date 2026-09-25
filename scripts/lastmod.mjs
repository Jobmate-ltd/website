#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// jobsafe — sitemap lastmod helper.
//
// The sitemap's `lastmod` is the real date a page's content last changed,
// kept by hand in lib/routes.ts (never the build time). This prints, for
// every static route, the date in the manifest beside the last git commit
// date of the page's source, so the two can be reconciled before a release.
//
//   node scripts/lastmod.mjs
// ─────────────────────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { STATIC_ROUTES } from '../lib/routes.ts'

const root = process.cwd()

function sourceFor(path) {
  const dir = path === '/' ? 'app' : join('app', path.replace(/^\//, ''))
  const page = join(root, dir, 'page.tsx')
  return existsSync(page) ? page : null
}

function gitDate(file) {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: root, encoding: 'utf8' }).trim() || '(uncommitted)'
  } catch {
    return '(no git)'
  }
}

console.log('route'.padEnd(40), 'manifest'.padEnd(12), 'git')
for (const route of STATIC_ROUTES) {
  const source = sourceFor(route.path)
  const git = source ? gitDate(source) : '(no page.tsx)'
  const flag = git > route.updated ? '  ← source is newer than the manifest' : ''
  console.log(route.path.padEnd(40), route.updated.padEnd(12), git + flag)
}
