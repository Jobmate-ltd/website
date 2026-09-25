import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Button } from '@/components/ui/button'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { GridPattern } from '@/components/ui/grid-pattern'
import { HeroScreens } from '@/components/platform/hero-screens'
import { heroHeadline, heroVariant } from '@/lib/hero-variants'

/**
 * PlatformHero — section 2 of the Phase 2 homepage, on the shadcnblocks
 * "Hero 195" layout (https://www.shadcnblocks.com/block/hero195, free tier;
 * restyled to the tokens): a centred eyebrow, H1 and lead over a bordered
 * column, Book a demo and See how it works, then a wide tabbed product
 * screenshot framed by dashed ornamental lines with a crimson border beam.
 *
 * The H1 is variant A unless NEXT_PUBLIC_HERO_VARIANT says B or C. The
 * brand's 60px grid sits behind it at 4.5% ink with one crimson radial.
 */
export function PlatformHero() {
  const variant = heroVariant()
  return (
    <section id="hero" className="relative overflow-hidden border-b border-line-1 bg-canvas" data-hero-variant={variant}>
      <GridPattern className="[mask-image:linear-gradient(to_bottom,white_10%,transparent_70%)]" />
      <div aria-hidden="true" className="hero-radial absolute left-1/2 -top-56 size-[760px] -translate-x-1/2" />
      <Container size="wide" className="relative">
        <div className="border-x border-line-1 py-14 md:py-20">
          <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center">
            <Eyebrow>Record. Resolve. Prevent.</Eyebrow>
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
          <div className="mt-10 md:mt-16 lg:mt-20">
            <HeroScreens />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default PlatformHero
