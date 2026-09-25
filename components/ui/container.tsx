import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Container — centres content with the site's side gutters.
 *
 * `size` sets the max width: `prose` (~65ch for running text), `narrow`
 * (56rem), `default` (72rem) or `wide` (80rem).
 *
 * @example
 *   <Container size="narrow"><h1>…</h1></Container>
 */
export type ContainerSize = 'prose' | 'narrow' | 'default' | 'wide'

const SIZES: Record<ContainerSize, string> = {
  prose: 'max-w-3xl',
  narrow: 'max-w-4xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
}

export function Container({
  size = 'default',
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { size?: ContainerSize }) {
  return <div className={cn('mx-auto w-full px-4 sm:px-6', SIZES[size], className)} {...props} />
}

export default Container
