# Imported components

Every UI component that did not start life in this repo, with where it came
from and under what licence. All of them were restyled to the light tokens
in `app/globals.css` (no dark-only styling survives), respect
`prefers-reduced-motion`, and pass axe as used on the pages. The animation
libraries are `motion` (Framer Motion's successor, MIT) for component motion
and `lenis` (MIT) for the site-wide smooth scroll; page transitions are the
browser's View Transitions API through React's `<ViewTransition>`, and
everything else is CSS.

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
| `Marquee` (`components/ui/marquee.tsx`) | Built in Phase 1 from the Magic UI `marquee` pattern — https://magicui.design/docs/components/marquee | MIT | pauses on hover/focus, static under reduced motion |
| `BentoGrid`, `BentoCard` (`components/ui/bento-grid.tsx`) | Magic UI `bento-grid` — https://magicui.design/docs/components/bento-grid | MIT | 4px radius, hairline, always-visible link (no hover-only affordance), lucide icon |
| `AnimatedBeam` (`components/ui/animated-beam.tsx`) | Magic UI `animated-beam` — https://magicui.design/docs/components/animated-beam | MIT | gradient from token CSS variables; static brand-tint stroke under reduced motion |
| `OrbitingCircles` (`components/ui/orbiting-circles.tsx`) | Magic UI `orbiting-circles` — https://magicui.design/docs/components/orbiting-circles | MIT | line-1 ring; `orbit` keyframes in globals.css; per-instance duration as inline longhands (a `var()` in the theme value resolved on `:root`); a static start transform so the ring is intact under reduced motion, where the orbit halts |
| `NumberTicker` (`components/ui/number-ticker.tsx`) | Magic UI `number-ticker` — https://magicui.design/docs/components/number-ticker | MIT | en-GB formatting, prefix/suffix, re-animates on value change, `sr-only` final figure, instant under reduced motion |
| `StickyScroll` (`components/ui/sticky-scroll-reveal.tsx`) | Aceternity UI `sticky-scroll-reveal` — https://ui.aceternity.com/components/sticky-scroll-reveal | MIT | document scroll instead of an inner scroll box; the current step comes from an IntersectionObserver, not `motion`'s scroll tracking; light; inactive steps step down a shade of ink (opacity failed 4.5:1), never hidden; inline pictures on small screens (the `FrameScope` id prefixing went with the SVG device frames) |
| `ProductTour` (`components/platform/product-tour.tsx`) | NextStep.js — https://nextstepjs.com (npm `nextstepjs`) | MIT | 5-step spotlight tour over real screenshots; card restyled to tokens; keyboard operable |
| `PlatformHero` + `HeroScreens` (`components/platform/hero.tsx`, `hero-screens.tsx`) | shadcnblocks "Hero 195" — https://www.shadcnblocks.com/block/hero195 (free "basic" tier, used under the shadcnblocks licence: https://www.shadcnblocks.com/license) | shadcnblocks free-tier licence | Centred tagline and headline, tabbed 2:1 screenshot in a liquid-glass pane wider than the text, border beam round the glass (the dashed frame lines went with the grid); tokens throughout; real captures instead of stock images; four-second cycling that pauses on hover/focus and stops under reduced motion; 44px dot targets on small screens |
| `BorderBeam` (`components/ui/border-beam.tsx`) | Magic UI `border-beam` — https://magicui.design/docs/components/border-beam | MIT | crimson gradient from the tokens, thin and slow; rebuilt as CSS keyframes on `offset-distance` (no `motion`, no hydration; it was the only reason the homepage loaded the library); hidden under reduced motion (the only animated border on the site, at the user's request) |
| `HeroBackdrop` (`components/ui/hero-backdrop.tsx`) | 21st.dev Background Grid Beam — https://21st.dev/@minhxthanh/components/background-grid-beam (Phase 1, one of the two daily retrievals) | MIT | now the crimson radial only: the grid and the beam that traced it are retired site-wide |
| `GlassFrame` (`components/ui/glass-frame.tsx`) | Built in-house (replaces Magic UI `safari` and `iphone` around product screenshots) | — | translucent blurred pane, specular rim, inner glow and its own aura, all CSS in `app/globals.css`; concentric screen radius; desktop window bar or phone bezel; `overlay` slot for the tour's spotlights; no SVG, no ids, no client JavaScript |
| `Tagline` (`components/ui/tagline.tsx`) | Built in-house | — | "Record. Resolve. Prevent." at `type-tagline` (stacked) or `type-tagline-inline` |
| `SmoothScroll` (`components/site/smooth-scroll.tsx`) | Lenis — https://lenis.darkroom.engineering (npm `lenis`) | MIT | lazy-loaded after hydration; off under reduced motion; anchors honour `scroll-padding-top`; pauses under scroll locks; Lenis's stylesheet inlined in globals.css |
| `PageMain` (`components/site/page-main.tsx`) | React `<ViewTransition>` — https://react.dev/reference/react/ViewTransition, Next.js view-transitions guide | MIT | every page's `<main>` (and the footer) exit/enter with the `page` class; header held still as `site-header` |
| `RouteProgress` (`components/site/route-progress.tsx`) | Built in-house (the NProgress pattern) | — | 2px crimson line; starts on an internal link or back/forward, trickles, completes on the pathname change |
| `Reveal` (`components/ui/reveal.tsx`) | Built in Phase 1 from the scroll-reveal pattern (21st.dev scroll-reveal was a visual reference only) | — | never hides content; IntersectionObserver only |
| `FactStrip` (`components/ui/fact-strip.tsx`) | Built in Phase 1 (21st.dev logo-cloud-3 was a visual reference only) | — | — |

21st.dev retrievals in Phase 2: **0**. Every 21st.dev URL in the brief was
used as a visual reference through its public preview.

Libraries added after Phase 2: `lenis` (MIT), for the smooth scroll.

Libraries added in Phase 2: `motion` (MIT), `nextstepjs` (MIT),
`@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `@radix-ui/react-slider`,
`@radix-ui/react-switch`, `@radix-ui/react-toggle-group`,
`@radix-ui/react-popover` (all MIT).
