import * as React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Eyebrow } from '@/components/ui/eyebrow'

/**
 * FeatureRow — alternating media and text with three sub-points and an
 * optional "See it in the tour" link.
 *
 * `media` is any framed image, video or phone mock; `reverse` puts it on the
 * right. Sub-points render as a definition list so the icon, title and detail
 * are associated for assistive tech.
 *
 * @example
 *   <FeatureRow eyebrow="How it works" title="…" points={[…]} media={<PhoneFrame>…</PhoneFrame>}
 *               link={{ label: 'See it in the tour', href: '/academy' }} />
 */
export interface FeaturePoint {
  icon?: React.ReactNode
  title: string
  detail: string
}

export interface FeatureRowProps {
  eyebrow?: string
  title: React.ReactNode
  lead?: React.ReactNode
  points: readonly FeaturePoint[]
  media: React.ReactNode
  reverse?: boolean
  link?: { label: string; href: string }
  /** Heading level; a page's first row after the H1 is an h2. */
  level?: 'h2' | 'h3'
  id?: string
  className?: string
}

export function FeatureRow({ eyebrow, title, lead, points, media, reverse = false, link, level = 'h2', id, className }: FeatureRowProps) {
  const Heading = level
  return (
    <div id={id} className={cn('grid items-center gap-10 lg:grid-cols-2 lg:gap-16', className)}>
      <div className={cn('flex flex-col gap-6', reverse && 'lg:order-2')}>
        <div className="flex flex-col gap-4">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <Heading className="type-h2 text-ink-1">{title}</Heading>
          {lead ? <p className="type-lead text-ink-4 measure">{lead}</p> : null}
        </div>
        <dl className="flex flex-col divide-y divide-line-1 border-y border-line-1">
          {points.map((point) => (
            // A <dl> may only wrap dt/dd pairs in a single <div>, so the icon
            // lives inside the <dt> and the <dd> indents to match it.
            <div key={point.title} className="py-4">
              <dt className="flex items-center gap-4 text-[15px] font-bold text-ink-1">
                {point.icon ? (
                  <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-control bg-brand-tint-08 text-brand [&>svg]:size-4">
                    {point.icon}
                  </span>
                ) : null}
                {point.title}
              </dt>
              <dd className={cn('type-small mt-1 text-ink-5', point.icon && 'pl-12')}>{point.detail}</dd>
            </div>
          ))}
        </dl>
        {link ? (
          <Link
            href={link.href}
            className="inline-flex w-max items-center gap-1.5 text-sm font-bold text-brand-strong underline decoration-brand-tint-18 underline-offset-4 transition-colors hover:decoration-brand-strong"
          >
            {link.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
      <div className={cn('flex justify-center', reverse && 'lg:order-1')}>{media}</div>
    </div>
  )
}

export default FeatureRow
