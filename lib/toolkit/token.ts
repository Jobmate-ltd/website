import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";

/**
 * Stateless, signed, short-lived download grant.
 *
 * The PDF lives outside /public, so the only way to it is a token this server
 * minted after a successful form post. No database, no session, no cookie.
 *
 * Format: base64url(payload).base64url(hmac-sha256(payload, secret))
 */
export interface DownloadClaims {
  /** who it was issued to (audit trail in the access log) */
  sub: string;
  /** unix ms expiry */
  exp: number;
  /** unique id, so two downloads are distinguishable in logs */
  jti: string;
}

const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes: enough for a slow phone, short enough to not be a public link

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function secret(): string {
  const s = process.env.TOOLKIT_DOWNLOAD_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "TOOLKIT_DOWNLOAD_SECRET is missing or too short (needs >= 32 chars). " +
        "Generate one with: openssl rand -base64 48",
    );
  }
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createDownloadToken(
  sub: string,
  ttlMs: number = DEFAULT_TTL_MS,
  now: number = Date.now(),
): string {
  const claims: DownloadClaims = { sub, exp: now + ttlMs, jti: randomUUID() };
  const payload = b64url(JSON.stringify(claims));
  return `${payload}.${sign(payload)}`;
}

export type VerifyResult =
  | { ok: true; claims: DownloadClaims }
  | { ok: false; reason: "malformed" | "bad-signature" | "expired" };

export function verifyDownloadToken(
  token: string | null | undefined,
  now: number = Date.now(),
): VerifyResult {
  if (!token || typeof token !== "string") return { ok: false, reason: "malformed" };

  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return { ok: false, reason: "malformed" };
  const [payload, signature] = parts;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  // Length check first: timingSafeEqual throws on a length mismatch.
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return { ok: false, reason: "bad-signature" };
  }

  let claims: DownloadClaims;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return { ok: false, reason: "malformed" };
  }

  if (typeof claims?.exp !== "number" || typeof claims?.sub !== "string") {
    return { ok: false, reason: "malformed" };
  }
  if (claims.exp < now) return { ok: false, reason: "expired" };

  return { ok: true, claims };
}
