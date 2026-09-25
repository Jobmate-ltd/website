import { Bell, Camera, ChartColumn, ClipboardCheck, MapPin, ShieldCheck, WifiOff, Zap } from 'lucide-react'
import { SIGNUP_TRIAL_URL } from '@/lib/brand'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'

const FEATURES = [
  { icon: <Zap />, title: 'One-tap capture', description: 'Log an incident before you have left the scene.' },
  { icon: <WifiOff />, title: 'Offline mode', description: 'Works without signal, syncs when back online.' },
  { icon: <Camera />, title: 'Photo, video and voice', description: 'Rich media attached to the report.' },
  { icon: <MapPin />, title: 'Auto GPS and timestamp', description: 'Every report is anchored in time and place.' },
  { icon: <Bell />, title: 'Real-time alerts', description: 'Supervisors notified the moment it happens.' },
  { icon: <ShieldCheck />, title: 'Full audit trail', description: 'A timestamped record of every action on a report.' },
  { icon: <ChartColumn />, title: 'Dashboard analytics', description: 'Spot patterns before they become incidents.' },
  { icon: <ClipboardCheck />, title: 'HSSE compliance', description: 'Aligned with industry reporting standards.' },
] as const

export function Features() {
  return (
    <Section id="features" divider>
      <SectionHeading
        eyebrow="Meet jobsafe"
        title={
          <>
            Everything your team needs.
            <br />
            Nothing they don&apos;t.
          </>
        }
        lead="Everything your team needs to go from incident to insight, whether they are on a depot floor, up a ladder, or in a cab with no signal."
      />
      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, i) => (
          <Reveal as="li" key={feature.title} index={i % 4}>
            <Card className="flex h-full flex-col gap-3 p-5">
              <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-control bg-brand-tint-08 text-brand [&>svg]:size-[18px]">
                {feature.icon}
              </span>
              <h3 className="text-[15px] font-bold text-ink-1">{feature.title}</h3>
              <p className="type-small text-ink-5">{feature.description}</p>
            </Card>
          </Reveal>
        ))}
      </ul>
      <div className="mt-10 flex justify-center">
        <Button variant="primary" size="lg" asChild>
          <a href={SIGNUP_TRIAL_URL}>Sign up now</a>
        </Button>
      </div>
    </Section>
  )
}

export default Features
