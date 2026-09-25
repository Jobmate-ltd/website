# Lighthouse — Phase 3

Mobile preset (simulated slow 4G, 4× CPU slowdown), Lighthouse 13.5.0, run 2026-09-25T15:28:01.709Z against `http://localhost:3000`. Targets: Accessibility 100 · SEO 100 · Best practices ≥ 95 · Performance ≥ 90.

| Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/tools/riddor-checker` | 94 | 100 | 100 | 100 | 3.0 s | 0 | 90 ms |
| `/industries/transport-logistics` | 93 | 100 | 100 | 100 | 3.1 s | 0 | 80 ms |
| `/platform/fleet-compliance` | 93 | 100 | 100 | 100 | 3.1 s | 0 | 80 ms |

Full HTML reports are written beside this file by `node scripts/lighthouse-routes.mjs` and are not committed.
