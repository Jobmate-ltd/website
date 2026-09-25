'use client'

import * as React from 'react'
import { openConsentSettings } from '@/lib/consent'

/**
 * CookieSettingsLink — reopens the consent banner's "Choose" panel. Rendered
 * in the footer of every page so the choice can be changed at any time.
 *
 * @example
 *   <CookieSettingsLink className="…">Cookie settings</CookieSettingsLink>
 */
export function CookieSettingsLink({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      {children}
    </button>
  )
}

export default CookieSettingsLink
