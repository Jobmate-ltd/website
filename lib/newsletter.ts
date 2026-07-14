// ─────────────────────────────────────────────────────────────────────────────
// Newsletter subscription — Brevo (the ESP the team already uses).
//
// The footer form posts to /api/newsletter, which calls subscribe() below.
// Contacts land in one Brevo list; the weekly campaign is then written and
// sent FROM Brevo (campaigns → create → pick the list), so sending, bounce
// handling and the legally-required unsubscribe link all stay Brevo's job.
// This code only ever adds contacts.
//
// Configuration (add to .env.local and the Vercel project):
//   BREVO_API_KEY   required — Brevo → Settings → SMTP & API → API keys
//   BREVO_LIST_ID   required — the numeric id of the list campaigns send to
//                   (Brevo → Contacts → Lists; the id is in the URL)
// ─────────────────────────────────────────────────────────────────────────────

export type SubscribeResult = 'ok' | 'unconfigured' | 'failed'

/**
 * Add one contact to the newsletter list. Never throws.
 *
 * `updateEnabled: true` makes the call idempotent: subscribing an address that
 * is already on the list succeeds (204) instead of failing as a duplicate, so
 * a returning visitor re-subscribing sees success rather than an error.
 */
export async function subscribe(email: string): Promise<SubscribeResult> {
  const apiKey = process.env.BREVO_API_KEY
  const listId = Number(process.env.BREVO_LIST_ID)
  if (!apiKey || !Number.isInteger(listId) || listId <= 0) return 'unconfigured'

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    // 201 = created, 204 = existing contact updated onto the list.
    if (res.ok) return 'ok'

    // Belt and braces: with updateEnabled the duplicate code should not occur,
    // but if Brevo returns it anyway the visitor IS on the list. That is a win.
    const body = await res.text()
    if (res.status === 400 && body.includes('duplicate_parameter')) return 'ok'

    console.error('[newsletter] brevo rejected contact', res.status, body)
    return 'failed'
  } catch (err) {
    console.error('[newsletter] brevo call threw', err)
    return 'failed'
  }
}
