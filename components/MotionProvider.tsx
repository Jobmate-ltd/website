'use client'
import { MotionConfig } from 'framer-motion'

/**
 * Wraps the app so every framer-motion animation respects the user's
 * `prefers-reduced-motion` setting. With `reducedMotion="user"`, transform
 * and layout animations are disabled for users who opt out (the phone float,
 * slide-in reveals, etc.), while gentle opacity fades are preserved.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
