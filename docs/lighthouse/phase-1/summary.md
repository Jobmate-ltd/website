# Lighthouse — Phase 1

Mobile preset (simulated slow 4G, 4× CPU slowdown), Lighthouse 13.5.0, run 2026-09-25T11:28:29.608Z against `http://localhost:3000`. Targets: Accessibility 100 · SEO 100 · Best practices ≥ 95 · Performance ≥ 90.

| Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 91 | 100 | 100 | 100 | 3.1 s | 0 | 170 ms |
| `/industries/healthcare` | 92 | 100 | 100 | 100 | 3.3 s | 0 | 80 ms |
| `/insights/riddor-reporting-explained` | 95 | 100 | 100 | 100 | 2.9 s | 0 | 60 ms |

Full HTML reports are written beside this file by `node scripts/lighthouse-routes.mjs` and are not committed.
