'use client'
import { motion } from 'framer-motion'

/**
 * Restrained scroll-reveal used by the industry landing pages. Matches the
 * homepage sections' entrance language (short rise + fade, once, on view).
 * Reduced motion is handled globally by <MotionProvider reducedMotion="user">.
 */
export default function Reveal({
  children,
  index = 0,
  className,
}: {
  children: React.ReactNode
  /** Stagger position within a group; each step adds 80ms of delay. */
  index?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
