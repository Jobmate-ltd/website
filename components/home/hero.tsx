import Image from 'next/image'
import { Camera, MapPin, Play, Server, WifiOff } from 'lucide-react'
import { ENTRY_PRICE_EX_VAT_LABEL, SIGNUP_TRIAL_URL, TRIAL } from '@/lib/brand'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Button } from '@/components/ui/button'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { HeroBackdrop } from '@/components/ui/hero-backdrop'
import { GlassFrame } from '@/components/ui/glass-frame'
import { Tagline } from '@/components/ui/tagline'
import { FactStrip, type Fact } from '@/components/ui/fact-strip'
import { VideoDialog } from '@/components/ui/video-dialog'

/** The product film shown from "See how it works". */
const HOW_IT_WORKS_YOUTUBE_ID = 'CqywS1hnPvw'

/**
 * Verifiable product facts. This row replaced a stat row of unsourced
 * multipliers; nothing here is a number we cannot stand behind.
 */
const FACTS: readonly Fact[] = [
  { icon: <WifiOff />, label: 'Works offline', detail: 'Syncs when signal returns' },
  { icon: <Camera />, label: 'Photo and video evidence', detail: 'Attached at the scene' },
  { icon: <MapPin />, label: 'GPS and timestamp', detail: 'On every report' },
  { icon: <Server />, label: 'Hosted in the UK', detail: 'UK-based AWS, under UK GDPR' },
]

export function Hero() {
  return (
    <>
      <section id="hero" className="relative overflow-hidden bg-canvas">
        <HeroBackdrop radial="right" />
        <Container size="wide" className="relative pb-14 pt-12 md:pb-20 md:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-14 xl:gap-20">
            <div className="flex flex-col gap-7">
              <Eyebrow>UK workplace incident reporting</Eyebrow>
              <Tagline as="h1" />
              <p className="type-lead measure text-ink-4">
                The mobile incident reporting app built for real-world risk. jobsafe brings HSSE reporting to construction,
                field service, care and transport environments where paper-based reporting is not good enough.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <BookDemoButton placement="home-hero" size="lg" />
                <Button variant="secondary" size="lg" asChild>
                  <a href={SIGNUP_TRIAL_URL}>Sign up now</a>
                </Button>
                <VideoDialog
                  youtubeId={HOW_IT_WORKS_YOUTUBE_ID}
                  title="jobsafe — how it works"
                  description="A short walkthrough of capturing, reviewing, forwarding and analysing incidents in jobsafe."
                >
                  <Button variant="ghost" size="lg">
                    <Play aria-hidden="true" className="fill-current" />
                    See how it works
                  </Button>
                </VideoDialog>
              </div>
              <p className="type-small text-ink-5">
                From {ENTRY_PRICE_EX_VAT_LABEL} per licence per month. {TRIAL.label}.
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <GlassFrame variant="bare" className="max-w-2xl lg:max-w-none" screenClassName="bg-bg px-4 py-8 sm:px-10 sm:py-12">
                <Image
                  src="/images/jobsafe-hero-duo.png"
                  alt="Two smartphones showing the jobsafe app: the HSSE and incident report menu, and the analytics dashboard with reports by category, site breakdown and 12-week trend"
                  width={793}
                  height={773}
                  priority
                  sizes="(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 100vw"
                  className="mx-auto h-auto w-full max-w-[560px]"
                />
              </GlassFrame>
            </div>
          </div>
        </Container>
      </section>
      <Container size="wide">
        <FactStrip facts={FACTS} className="border-t-0" />
      </Container>
    </>
  )
}

export default Hero
