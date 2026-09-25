# Imported components

Every UI component that did not start life in this repo, with where it came
from and under what licence. All of them were restyled to the light tokens
in `app/globals.css` (no dark-only styling survives), respect
`prefers-reduced-motion`, and pass axe as used on the pages. The one
animation library is `motion` (Framer Motion's successor, MIT); nothing else
animates.

Sourcing order, per `docs/REBUILD.md` and the Phase 2 brief: Phase 1
components → official shadcn/ui → free shadcn-compatible registries →
21st.dev (two retrievals a day, spent only where nothing else fits).

| Component (file) | Source | Licence | What changed |
| --- | --- | --- | --- |
| `Tabs` (`components/ui/tabs.tsx`) | shadcn/ui `tabs` — https://ui.shadcn.com/docs/components/tabs | MIT | line-3 well, canvas active pill, brand focus ring, 44px list |
| `Accordion` (`components/ui/accordion.tsx`) | shadcn/ui `accordion` — https://ui.shadcn.com/docs/components/accordion | MIT | `forceMount` so answers are in the HTML; collapsed with `h-0` + `invisible`; brand plus icon; keyframes in globals.css |
| `Tooltip` (`components/ui/tooltip.tsx`) | shadcn/ui `tooltip` — https://ui.shadcn.com/docs/components/tooltip | MIT | ink-1 surface, canvas text, 4px radius, fade only |
| `Table` (`components/ui/table.tsx`) | shadcn/ui `table` — https://ui.shadcn.com/docs/components/table | MIT | canvas-muted head, line hairlines, uppercase eyebrow heads, focusable scroll region |
| `Slider` (`components/ui/slider.tsx`) | shadcn/ui `slider` — https://ui.shadcn.com/docs/components/slider | MIT | brand-strong range, 44px hit area, `thumbLabel` |
| `Switch` (`components/ui/switch.tsx`) | shadcn/ui `switch` — https://ui.shadcn.com/docs/components/switch | MIT | grey-400 off / brand-strong on, larger hit area |
| `ToggleGroup` (`components/ui/toggle-group.tsx`) | shadcn/ui `toggle-group` + `toggle` — https://ui.shadcn.com/docs/components/toggle-group | MIT | variants folded in; segmented control in a line-3 well |
| `Popover` (`components/ui/popover.tsx`) | shadcn/ui `popover` — https://ui.shadcn.com/docs/components/popover | MIT | canvas panel, line-1 hairline, menu-in animation |
| `NavigationMenu` (`components/ui/navigation-menu.tsx`) | shadcn/ui `navigation-menu` — https://ui.shadcn.com/docs/components/navigation-menu (Phase 1; visual reference 21st.dev navigation-menu-06) | MIT | Phase 1 restyle; Phase 2 mega-menu panels added |
| `Sheet` (`components/ui/sheet.tsx`) | shadcn/ui `sheet` — https://ui.shadcn.com/docs/components/sheet (Phase 1) | MIT | Phase 1 restyle; Phase 2 mobile menu with accordion groups |
| `Safari` (`components/ui/safari.tsx`) | Magic UI `safari` — https://magicui.design/docs/components/safari | MIT | chrome drawn in line-1 / canvas / grey-400; mono address bar; `children` slot instead of `<img>`; mask and clip ids from `useFrameId()` (`components/ui/frame-scope.tsx`), unique even when the same picture is rendered twice; a client component for that reason |
| `Iphone` (`components/ui/iphone.tsx`) | Magic UI `iphone` — https://magicui.design/docs/components/iphone | MIT | body in tokens; `children` slot for a `next/image`; mask id from `useFrameId()`; a client component for that reason |
| `Marquee` (`components/ui/marquee.tsx`) | Built in Phase 1 from the Magic UI `marquee` pattern — https://magicui.design/docs/components/marquee | MIT | pauses on hover/focus, static under reduced motion |
| `BentoGrid`, `BentoCard` (`components/ui/bento-grid.tsx`) | Magic UI `bento-grid` — https://magicui.design/docs/components/bento-grid | MIT | 4px radius, hairline, always-visible link (no hover-only affordance), lucide icon |
| `GridPattern` (`components/ui/grid-pattern.tsx`) | Magic UI `grid-pattern` — https://magicui.design/docs/components/grid-pattern | MIT | 60px, ink at 4.5%, `aria-hidden` |
| `AnimatedBeam` (`components/ui/animated-beam.tsx`) | Magic UI `animated-beam` — https://magicui.design/docs/components/animated-beam | MIT | gradient from token CSS variables; static brand-tint stroke under reduced motion |
| `OrbitingCircles` (`components/ui/orbiting-circles.tsx`) | Magic UI `orbiting-circles` — https://magicui.design/docs/components/orbiting-circles | MIT | line-1 ring; `orbit` keyframes in globals.css; per-instance duration as inline longhands (a `var()` in the theme value resolved on `:root`); a static start transform so the ring is intact under reduced motion, where the orbit halts |
| `NumberTicker` (`components/ui/number-ticker.tsx`) | Magic UI `number-ticker` — https://magicui.design/docs/components/number-ticker | MIT | en-GB formatting, prefix/suffix, re-animates on value change, `sr-only` final figure, instant under reduced motion |
| `StickyScroll` (`components/ui/sticky-scroll-reveal.tsx`) | Aceternity UI `sticky-scroll-reveal` — https://ui.aceternity.com/components/sticky-scroll-reveal | MIT | document scroll instead of an inner scroll box; the current step comes from an IntersectionObserver, not `motion`'s scroll tracking; light; inactive steps step down a shade of ink (opacity failed 4.5:1), never hidden; inline pictures on small screens; each copy of a picture wrapped in a `FrameScope` so the SVG mask ids stay unique |
| `ProductTour` (`components/platform/product-tour.tsx`) | NextStep.js — https://nextstepjs.com (npm `nextstepjs`) | MIT | 5-step spotlight tour over real screenshots; card restyled to tokens; keyboard operable |
| `PlatformHero` + `HeroScreens` (`components/platform/hero.tsx`, `hero-screens.tsx`) | shadcnblocks "Hero 195" — https://www.shadcnblocks.com/block/hero195 (free "basic" tier, used under the shadcnblocks licence: https://www.shadcnblocks.com/license) | shadcnblocks free-tier licence | Centred headline, tabbed 16:10 screenshot, dashed frame lines, border beam; tokens throughout; real captures instead of stock images; four-second cycling that pauses on hover/focus and stops under reduced motion; 44px dot targets on small screens |
| `BorderBeam` (`components/ui/border-beam.tsx`) | Magic UI `border-beam` — https://magicui.design/docs/components/border-beam | MIT | crimson gradient from the tokens, thin and slow; rebuilt as CSS keyframes on `offset-distance` (no `motion`, no hydration; it was the only reason the homepage loaded the library); hidden under reduced motion (the only animated border on the site, at the user's request) |
| `HeroBackdrop` (`components/ui/hero-backdrop.tsx`) | 21st.dev Background Grid Beam — https://21st.dev/@minhxthanh/components/background-grid-beam (Phase 1, one of the two daily retrievals) | MIT | recoloured to ink 4.5% |
| `Reveal` (`components/ui/reveal.tsx`) | Built in Phase 1 from the scroll-reveal pattern (21st.dev scroll-reveal was a visual reference only) | — | never hides content; IntersectionObserver only |
| `FactStrip` (`components/ui/fact-strip.tsx`) | Built in Phase 1 (21st.dev logo-cloud-3 was a visual reference only) | — | — |

21st.dev retrievals in Phase 2: **0**. Every 21st.dev URL in the brief was
used as a visual reference through its public preview.

Libraries added in Phase 2: `motion` (MIT), `nextstepjs` (MIT),
`@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `@radix-ui/react-slider`,
`@radix-ui/react-switch`, `@radix-ui/react-toggle-group`,
`@radix-ui/react-popover` (all MIT).

## Phase 3

Built in this repository, on the primitives above; nothing new was imported.

| Component (file) | Built on | Notes |
| --- | --- | --- |
| `IndustryPageTemplate` (`components/industries/industry-page.tsx`) | Section, SectionHeading, Card, ProductShot, FaqAccordion, CtaBand | One template for all seven industry pages, driven by `lib/industries/*.ts`: sourced facts with the source and year printed beside each figure, six pains each linking a module page, three screens with sector captions, the legal framing with its sources, the two free tools, eight FAQs (FAQPage from the same array). A templates slot is reserved for Phase 4. |
| `FreeTools` (`components/platform/free-tools.tsx`) | Section, Card pattern | Section 11 of the homepage: the three tools and the hub. |
| `ModulePageTemplate` (`components/platform/module-page.tsx`, extended) | as Phase 2 | Now handles the bowtie page (a page of the risk module with its own URL), pages gated on a Phase 3 input (`notFound()` until the input is true), a "Built for" row of industry pages and a "Try it free" row of tools. |
| `ComparePageTemplate`, `RowHelp` (`components/compare/compare-page.tsx`, `row-help.tsx`) | Table, Tooltip, Chip, FaqAccordion, CtaBand | The 15-row comparison with a tooltip per row, an edge marker in text, the competitor cell marked `data-claims="competitor"` with its source link and checked date; a stacked card list under `md:` so nothing scrolls sideways at 320px. |
| `ToolPage` and the three tools (`components/tools/`) | PageHero, ToggleGroup, Slider, Card, FaqAccordion | The RIDDOR checker (`triage()` from `lib/product-logic/`, one question at a time, answers in the URL, `aria-live` verdict), the 5×5 matrix (the product's scales and bands) and the AFR calculator (the working shown, the convention sourced). Keyboard-only throughout. |
