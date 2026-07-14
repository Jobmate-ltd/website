import { z } from "zod";

/**
 * The gate: full name, work email, company, phone. The phone is required
 * because sales calls every lead back, so a lead without a number is a lead
 * they cannot work.
 */
export const leadSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(80, "That name is too long")
    .refine((v) => /\p{L}/u.test(v), "Please enter your full name"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, "Please enter your work email")
    .max(160, "That email is too long")
    .email("That does not look like a valid email"),
  company: z
    .string()
    .trim()
    .min(2, "Please enter your company name")
    .max(120, "That company name is too long"),
  // Required: sales dials every lead. Permissive on format (UK mobile, landline
  // or international, with spaces/+/-/() all fine) but must carry 7–15 real digits.
  phone: z
    .string()
    .trim()
    .min(1, "Please enter a phone number")
    .max(32, "That phone number is too long")
    .refine((v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    }, "Please enter a valid phone number"),
  // Unchecked consent is allowed: the toolkit is not gated on marketing consent,
  // it only decides whether they go on the nurture list (GDPR: separate purposes).
  marketingConsent: z.boolean().optional().default(false),
  // Honeypot. Real users never fill this; bots almost always do.
  companyWebsite: z.string().max(0, "Rejected").optional().default(""),
  utm: z
    .object({
      source: z.string().max(80).optional(),
      medium: z.string().max(80).optional(),
      campaign: z.string().max(80).optional(),
      content: z.string().max(80).optional(),
    })
    .optional(),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

/** Free-mail domains: not blocked, just flagged so sales can prioritise. */
const FREE_MAIL = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "hotmail.com",
  "hotmail.co.uk", "outlook.com", "live.co.uk", "icloud.com", "aol.com",
  "btinternet.com", "sky.com", "protonmail.com", "proton.me", "gmx.com",
]);

export function isWorkEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return domain.length > 0 && !FREE_MAIL.has(domain);
}

/** Obvious throwaway domains. Rejected outright: they are never a real lead. */
const DISPOSABLE = new Set([
  "mailinator.com", "10minutemail.com", "guerrillamail.com", "yopmail.com",
  "tempmail.com", "trashmail.com", "sharklasers.com", "getnada.com",
  "dispostable.com", "temp-mail.org", "throwawaymail.com", "fakeinbox.com",
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return DISPOSABLE.has(domain);
}
