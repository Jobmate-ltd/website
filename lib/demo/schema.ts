import { z } from 'zod'
import { isDisposableEmail, isWorkEmail } from '../toolkit/schema.ts'

/**
 * The demo request form: name, work email, company, team size, main need.
 * Same shape of validation as the toolkit lead (lib/toolkit/schema.ts) so the
 * API route can reuse the honeypot and rate-limit handling.
 */
export const TEAM_SIZES = ['1-25', '26-250', '250+'] as const
export type TeamSize = (typeof TEAM_SIZES)[number]

export const NEEDS = [
  'Incident and near-miss reporting',
  'RIDDOR compliance',
  'Risk assessments and bowtie',
  'Permits and contractor control',
  'Fleet and plant compliance',
  'Replacing paper and spreadsheets',
  'Multi-site visibility',
  'Something else',
] as const

const name = z.string().trim().min(2, 'Tell us your name.').max(80, 'That name is a bit long.')

export const demoLeadSchema = z.object({
  fullName: name,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Enter a valid email address.')
    .max(254)
    .refine((v) => !isDisposableEmail(v), 'Please use a work or permanent email address.'),
  company: z.string().trim().min(2, 'Which company are you with?').max(120),
  teamSize: z.enum(TEAM_SIZES, { message: 'Pick a team size.' }),
  need: z.enum(NEEDS, { message: 'Pick what matters most.' }),
  notes: z.string().trim().max(600, 'Keep notes under 600 characters.').optional().default(''),
  marketingConsent: z.boolean().optional().default(false),
  /** Honeypot: must stay empty. */
  companyWebsite: z.string().max(0, 'bot').optional().default(''),
  utm: z.record(z.string(), z.string().max(80)).optional(),
  path: z.string().max(200).optional(),
})

export type DemoLeadInput = z.input<typeof demoLeadSchema>
export type DemoLead = z.output<typeof demoLeadSchema>

export { isWorkEmail }
