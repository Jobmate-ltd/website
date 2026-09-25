'use client'

import * as React from 'react'
import { Cloud, Inbox, Smartphone } from 'lucide-react'
import { AnimatedBeam } from '@/components/ui/animated-beam'

/**
 * SyncDiagram — phone → outbox → London cloud, drawn with Magic UI's
 * animated-beam: how a record leaves the device. Under reduced motion the
 * beams are static brand-tint strokes; the words beside it carry the meaning
 * either way.
 */
function Node({ icon, label, detail, nodeRef }: { icon: React.ReactNode; label: string; detail: string; nodeRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="relative z-10 flex flex-col items-center gap-3 text-center">
      <div ref={nodeRef} className="flex size-16 items-center justify-center rounded-control border border-line-1 bg-canvas text-brand shadow-rest [&>svg]:size-7">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-ink-1">{label}</p>
        <p className="type-small text-ink-5">{detail}</p>
      </div>
    </div>
  )
}

export function SyncDiagram() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const phoneRef = React.useRef<HTMLDivElement>(null)
  const outboxRef = React.useRef<HTMLDivElement>(null)
  const cloudRef = React.useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="relative grid grid-cols-3 items-start gap-4 rounded-frame border border-line-1 bg-bg p-6 md:p-10" role="img" aria-label="A record saves on the phone, queues in the outbox, then syncs to the London cloud when signal returns.">
      <Node nodeRef={phoneRef} icon={<Smartphone />} label="The phone" detail="Saved first, always" />
      <Node nodeRef={outboxRef} icon={<Inbox />} label="The outbox" detail="Queued in order, retried" />
      <Node nodeRef={cloudRef} icon={<Cloud />} label="London cloud" detail="Synced when signal returns" />
      <AnimatedBeam containerRef={containerRef} fromRef={phoneRef} toRef={outboxRef} startYOffset={-24} endYOffset={-24} curvature={-20} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={outboxRef} toRef={cloudRef} startYOffset={-24} endYOffset={-24} curvature={-20} duration={3} delay={1.5} />
    </div>
  )
}

export default SyncDiagram
