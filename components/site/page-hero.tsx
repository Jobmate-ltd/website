import * as React from 'react'
import { cn } from '@/lib/utils'
import { Container, type ContainerSize } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { HeroBackdrop } from '@/components/ui/hero-backdrop'

/**
 * PageHero — the hero band for an inner page: the grid texture, an eyebrow,
 * the H1, a lead, optional actions and optional media on the right.
 *
 * @example
 *   <PageHero eyebrow="About" title="About jobsafe" lead="…" breadcrumbs={<Breadcrumbs … />} />
 */
export interface PageHeroProps {
  eyebrow?: string
  title: React.ReactNode
  lead?: React.ReactNode
  breadcrumbs?: React.ReactNode
  actions?: React.ReactNode
  media?: React.ReactNode
  /** Small print under the actions. */
  note?: React.ReactNode
  container?: ContainerSize
  className?: string
  id?: string
}

export function PageHero({ eyebrow, title, lead, breadcrumbs, actions, media, note, container = 'default', className, id }: PageHeroProps) {
  return (
    <section id={id} className={cn('relative overflow-hidden border-b border-line-1 bg-canvas', className)}>
      <HeroBackdrop radial={media ? 'right' : 'center'} />
      <Container size={container} className="relative pb-14 pt-12 md:pb-20 md:pt-16">
        <div className={cn('grid items-center gap-10', media && 'lg:grid-cols-[1.05fr_0.95fr] lg:gap-16')}>
          <div className="flex flex-col gap-6">
            {breadcrumbs}
            <div className="flex flex-col gap-4">
              {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
              <h1 className="type-display max-w-[16ch] text-ink-1">{title}</h1>
              {lead ? <p className="type-lead measure text-ink-4">{lead}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
            {note ? <p className="type-small text-ink-5">{note}</p> : null}
          </div>
          {media ? <div className="flex justify-center lg:justify-end">{media}</div> : null}
        </div>
      </Container>
    </section>
  )
}

export default PageHero
