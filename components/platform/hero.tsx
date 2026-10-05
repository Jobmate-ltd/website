import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { Tagline } from '@/components/ui/tagline'
import { HeroScreens } from '@/components/platform/hero-screens'
import { heroHeadline, heroVariant } from '@/lib/hero-variants'

/**
 * PlatformHero — section 2 of the Phase 2 homepage, on the shadcnblocks
 * "Hero 195" layout (https://www.shadcnblocks.com/block/hero195, free tier;
 * restyled to the tokens): the tagline set large over a centred H1 and lead,
 * Book a demo and See how it works, then a wide tabbed product screenshot in
 * a liquid-glass pane that runs wider than the text above it.
 *
 * The H1 is variant A unless NEXT_PUBLIC_HERO_VARIANT says B or C. One
 * crimson radial lights it from above; there is no grid texture.
 */
export function PlatformHero() {
  const variant = heroVariant()
  return (
    <section id="hero" className="relative overflow-hidden border-b border-line-1 bg-canvas" data-hero-variant={variant}>
      <div aria-hidden="true" className="hero-radial absolute left-1/2 -top-56 size-[960px] -translate-x-1/2" />
      <Container size="wide" className="relative pt-14 md:pt-20">
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <Tagline variant="inline" />
          <h1 className="type-display text-ink-1">{heroHeadline()}</h1>
          <p className="type-lead mx-auto max-w-3xl text-ink-4">
            Report incidents, triage RIDDOR, run risk assessments, issue permits, check vehicles and track training. One app for the office and the frontline, hosted in the UK.
          </p>
          <div className="flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center">
            <BookDemoButton placement="home-hero" size="lg" className="w-full sm:w-auto" />
            <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto">
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>
          <p className="type-small text-ink-5">A 30-minute walkthrough on a UK haulier’s setup. No form to fill in first.</p>
        </div>
      </Container>
      <Container size="full" className="relative pb-14 pt-10 md:pb-24 md:pt-16 lg:pt-20">
        <HeroScreens />
      </Container>
    </section>
  )
}

export default PlatformHero
