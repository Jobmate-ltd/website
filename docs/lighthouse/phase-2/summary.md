# Lighthouse — Phase 2

Mobile preset (simulated slow 4G, 4× CPU slowdown), Lighthouse 13.5.0, run 2026-09-25T13:56:32.550Z against `http://localhost:3000`. Targets: Accessibility 100 · SEO 100 · Best practices ≥ 95 · Performance ≥ 90.

| Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 91 | 100 | 100 | 100 | 3.4 s | 0 | 120 ms |
| `/platform` | 91 | 100 | 100 | 100 | 3.5 s | 0 | 40 ms |
| `/pricing` | 93 | 100 | 100 | 100 | 3.1 s | 0 | 120 ms |
| `/platform/riddor` | 93 | 100 | 100 | 100 | 3.2 s | 0 | 70 ms |

Full HTML reports are written beside this file by `node scripts/lighthouse-routes.mjs` and are not committed.
