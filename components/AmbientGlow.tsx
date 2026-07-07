import { cn } from '@/lib/utils'

// Decorative brand ambient glow for otherwise-flat dark sections. Give the parent
// section `relative overflow-hidden` and lift its content with `relative z-10`.
// `position` is any CSS gradient position (e.g. 'top right', 'bottom left', 'top').
type Props = {
  position?: string
  intensity?: number
  className?: string
}

export default function AmbientGlow({ position = 'top right', intensity = 0.1, className }: Props) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        background: `radial-gradient(55% 55% at ${position}, rgb(var(--brand-rgb) / ${intensity}) 0%, transparent 70%)`,
      }}
    />
  )
}
