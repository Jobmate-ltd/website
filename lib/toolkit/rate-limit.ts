/**
 * Fixed-window limiter, in memory.
 *
 * Good enough for one Vercel instance and a lead-magnet form. If the page ever
 * gets real traffic across many lambdas, swap the Map for Upstash Redis:
 * the interface below is deliberately the same shape.
 */
interface Window {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Window>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  key: string,
  limit = 8,
  windowMs = 60 * 60 * 1000,
  now: number = Date.now(),
): RateLimitResult {
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const fresh: Window = { count: 1, resetAt: now + windowMs };
    buckets.set(key, fresh);
    sweep(now);
    return { allowed: true, remaining: limit - 1, resetAt: fresh.resetAt };
  }

  existing.count += 1;
  const allowed = existing.count <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
}

/** Keeps the Map from growing without bound on a long-lived instance. */
function sweep(now: number): void {
  if (buckets.size < 2000) return;
  for (const [key, win] of buckets) {
    if (win.resetAt <= now) buckets.delete(key);
  }
}

export function resetRateLimits(): void {
  buckets.clear();
}

/** Vercel/Cloudflare put the real client IP here. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
