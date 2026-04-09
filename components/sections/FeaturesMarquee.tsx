'use client'
import { cn } from '@/lib/utils'
import { Marquee } from '@/components/ui/marquee'
import { Zap, WifiOff, Camera, MapPin, Bell, ShieldCheck, BarChart2, ClipboardCheck } from 'lucide-react'

const features = [
  { icon: Zap,            title: 'One-tap capture',      description: "Log an incident before you've left the scene" },
  { icon: WifiOff,        title: 'Offline mode',          description: 'Works without signal, syncs when back online' },
  { icon: Camera,         title: 'Photo, video & voice',  description: 'Rich media attached in seconds' },
  { icon: MapPin,         title: 'Auto GPS & timestamp',  description: 'Every report is anchored in time and place' },
  { icon: Bell,           title: 'Real-time alerts',      description: 'Supervisors notified the moment it happens' },
  { icon: ShieldCheck,    title: 'Full audit trail',      description: 'Immutable, timestamped record for every action' },
  { icon: BarChart2,      title: 'Dashboard analytics',   description: 'Spot patterns before they become incidents' },
  { icon: ClipboardCheck, title: 'HSSE compliance',       description: 'Aligned with industry reporting standards' },
]

const firstRow = features.slice(0, 4)
const secondRow = features.slice(4)

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) => (
  <figure
    className={cn(
      'relative h-full w-80 overflow-hidden rounded-xl border p-5',
      'border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-200',
    )}
  >
    <div className="flex flex-col gap-3">
      <Icon className="size-5 text-[#e5342a]" strokeWidth={1.5} />
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-white/50 mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  </figure>
)

export default function FeaturesMarquee() {
  return (
    <section id="features" className="py-24 bg-[#0a0a0a]">
      <div className="text-center mb-16 px-4">
        <p className="text-xs font-bold tracking-widest text-[#e5342a] uppercase mb-4">Meet JobSafe</p>
        <h2 className="text-4xl md:text-5xl font-black text-white">
          Everything your team needs.<br />Nothing they don&apos;t.
        </h2>
        <p className="text-white/50 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
          The fastest, simplest way to capture, manage, and learn from workplace incidents — built for real environments, not just offices.
        </p>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-4">
        <Marquee pauseOnHover className="[--duration:25s]">
          {firstRow.map((f) => <FeatureCard key={f.title} {...f} />)}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:25s]">
          {secondRow.map((f) => <FeatureCard key={f.title} {...f} />)}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#0a0a0a]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#0a0a0a]" />
      </div>

      <div className="flex justify-center mt-12">
        <a
          href="#"
          className="bg-[#e5342a] hover:bg-[#c42d24] text-white font-bold text-sm px-8 py-4 rounded-md transition-colors"
        >
          START FREE TRIAL →
        </a>
      </div>
    </section>
  )
}
