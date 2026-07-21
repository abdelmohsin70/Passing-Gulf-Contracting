/**
 * Minimal in-memory rate limiter (token bucket per key). Good enough to
 * blunt naive form spam on a single-instance deployment. If you deploy
 * across multiple serverless instances or need durable limits, swap this
 * for a shared store (Redis/Upstash) behind the same `consume` interface.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

export function consumeRateLimit(key: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - bucket.windowStart) };
  }

  bucket.count += 1;
  return { allowed: true };
}
