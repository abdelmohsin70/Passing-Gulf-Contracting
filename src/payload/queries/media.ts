/**
 * Resolves a Payload upload relationship (populated doc, raw ID, or empty)
 * into the plain URL string the frontend's <Image> components expect.
 * Returns undefined rather than throwing when a doc isn't populated
 * (e.g. shallow depth) or media hasn't been attached yet — callers already
 * treat a missing heroImage/gallery entry as "no photo yet", matching the
 * static-data behavior this replaces.
 */
export function resolveMediaUrl(value: unknown): string | undefined {
  if (!value || typeof value !== "object" || !("url" in value)) return undefined;
  const url = (value as { url?: unknown }).url;
  if (typeof url !== "string") return undefined;

  // Payload builds `url` as an absolute address (using
  // NEXT_PUBLIC_SERVER_URL). next/image's `images.localPatterns` config
  // only matches path-only sources, not absolute URLs with a hostname —
  // even when it's the same host — so strip the origin. Media is always
  // served from this same Next.js app, so the relative path is correct in
  // every environment, not just this one.
  try {
    return new URL(url).pathname;
  } catch {
    return url; // already relative
  }
}

export function resolveMediaUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(resolveMediaUrl).filter((url): url is string => Boolean(url));
}
