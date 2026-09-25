import Image from 'next/image'
import { cn } from '@/lib/utils'
import { WORDMARK } from '@/lib/brand'

/**
 * Wordmark — the jobsafe logo on light: ink "job", crimson "safe".
 *
 * Renders the 2× PNG so it stays crisp on every screen; next/image serves the
 * right size. `height` is the rendered height in pixels (default 40).
 *
 * @example
 *   <Link href="/"><Wordmark height={36} priority /></Link>
 */
export function Wordmark({
  height = 40,
  priority = false,
  className,
}: {
  height?: number
  priority?: boolean
  className?: string
}) {
  const width = Math.round((WORDMARK.width / WORDMARK.height) * height)
  return (
    <Image
      src={WORDMARK.src2x}
      alt={WORDMARK.alt}
      width={width}
      height={height}
      priority={priority}
      sizes={`${width}px`}
      className={cn('block h-auto', className)}
      style={{ width, height }}
    />
  )
}

export default Wordmark
