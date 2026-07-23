import { existsSync, readdirSync } from "fs";
import path from "path";

/**
 * Payload stores uploads under /public/media and serves them through its
 * own /api/media/file/<name> route (a server function that reads the file
 * from disk). On a serverless/ephemeral host like Vercel those files are
 * not reliably present at request time, so those URLs 404 — which is what
 * produces broken images in production.
 *
 * Every image currently in the Media library was seeded FROM the bundled
 * /public/images photos (see the seed script), and those static files ARE
 * always served reliably (Vercel's static CDN, included in the build). So
 * we remap a Payload media URL to /images/<basename> whenever that bundled
 * file exists, guaranteeing the photo renders in every environment. Media
 * whose basename isn't bundled (e.g. a future client upload) is left on its
 * original Payload URL — that case needs cloud storage (S3), documented in
 * DEPLOYMENT.md.
 */
const BUNDLED_IMAGES: ReadonlySet<string> = (() => {
  try {
    const dir = path.resolve(process.cwd(), "public/images");
    return new Set(readdirSync(dir));
  } catch {
    return new Set<string>();
  }
})();

function toBundledPath(pathname: string): string {
  const basename = pathname.split("/").pop() ?? "";
  if (basename && BUNDLED_IMAGES.has(basename)) {
    return `/images/${basename}`;
  }
  // Also handle the case where the resolved static file simply exists.
  if (basename && existsSync(path.resolve(process.cwd(), "public/images", basename))) {
    return `/images/${basename}`;
  }
  return pathname;
}

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

  // Payload builds `url` as an absolute address (using NEXT_PUBLIC_SERVER_URL).
  // next/image's `images.localPatterns` config only matches path-only sources,
  // so strip the origin first, then remap to the bundled static photo when
  // possible (see BUNDLED_IMAGES note above).
  let pathname = url;
  try {
    pathname = new URL(url).pathname;
  } catch {
    // already relative
  }
  return toBundledPath(pathname);
}

export function resolveMediaUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(resolveMediaUrl).filter((url): url is string => Boolean(url));
}
