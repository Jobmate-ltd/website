import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Card — a hairlined surface on canvas. 4px radius, quiet shadow, lifts a
 * little on hover when `interactive`.
 *
 * @example
 *   <Card interactive className="p-6">…</Card>
 */
export function Card({
  interactive = false,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-control border border-line-1 bg-canvas shadow-rest',
        interactive && 'transition-[border-color,box-shadow] duration-200 ease-out-expo hover:border-grey-400 hover:shadow-hover',
        className,
      )}
      {...props}
    />
  )
}

export default Card
