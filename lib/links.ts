/**
 * Outbound destinations, re-exported from `lib/brand.ts`.
 *
 * Components import from this short path; the values themselves are declared
 * once, in the file the header of `lib/brand.ts` and `npm run seo:audit` both
 * treat as the single source of truth. Previously `LOGIN_URL` and
 * `SIGNUP_TRIAL_URL` were typed out again here, so the same two URLs existed in
 * two files. They no longer do.
 */
export { DEMO_BOOKING_URL, LOGIN_URL, SIGNUP_TRIAL_URL } from '@/lib/brand'
