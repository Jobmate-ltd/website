import * as React from 'react'
import { cn } from '@/lib/utils'
import { Container, type ContainerSize } from '@/components/ui/container'

/**
 * Section — a full-width band with the site's vertical rhythm.
 *
 * `tone="white"` sits on canvas, `tone="grey"` on bg. Rhythm is 64px on
 * mobile and 88–112px on desktop (`rhythm="loose"` for the taller one).
 * Renders its own <Container/> unless `bleed` is set.
 *
 * @example
 *   <Section tone="grey" id="pricing"><SectionHeading … /></Section>
 */
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: 'white' | 'grey'
  rhythm?: 'default' | 'loose' | 'tight'
  container?: ContainerSize
  /** Skip the inner container (the section manages its own width). */
  bleed?: boolean
  /** Hairline on top, to separate two sections of the same tone. */
  divider?: boolean
  as?: 'section' | 'div' | 'article' | 'aside'
}

const RHYTHM = {
  tight: 'py-12 md:py-16',
  default: 'py-16 md:py-[88px]',
  loose: 'py-16 md:py-28',
} as const

export function Section({
  tone = 'white',
  rhythm = 'default',
  container = 'default',
  bleed = false,
  divider = false,
  as: Tag = 'section',
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(
        tone === 'grey' ? 'bg-bg' : 'bg-canvas',
        divider && 'border-t border-line-1',
        RHYTHM[rhythm],
        className,
      )}
      {...props}
    >
      {bleed ? children : <Container size={container}>{children}</Container>}
    </Tag>
  )
}

export default Section
