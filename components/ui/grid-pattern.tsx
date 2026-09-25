import { useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * GridPattern — Magic UI `grid-pattern` (https://magicui.design/docs/components/grid-pattern,
 * MIT), recoloured: the brand's 60px grid as ink at 4.5%, no fills, masked
 * out towards the bottom by the caller. Purely decorative (`aria-hidden`).
 *
 * @example
 *   <GridPattern className="[mask-image:linear-gradient(to_bottom,white,transparent)]" />
 */
export interface GridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: string
  /** Cells to fill at 3% ink, as [column, row] pairs. */
  squares?: readonly (readonly [number, number])[]
}

export function GridPattern({ width = 60, height = 60, x = -1, y = -1, strokeDasharray = '0', squares, className, ...props }: GridPatternProps) {
  const id = useId()
  return (
    <svg aria-hidden="true" className={cn('pointer-events-none absolute inset-0 size-full fill-ink-1/[3%] stroke-ink-1/[4.5%]', className)} {...props}>
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" strokeDasharray={strokeDasharray} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares ? (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([sx, sy]) => (
            <rect strokeWidth="0" key={`${sx}-${sy}`} width={width - 1} height={height - 1} x={sx * width + 1} y={sy * height + 1} />
          ))}
        </svg>
      ) : null}
    </svg>
  )
}
