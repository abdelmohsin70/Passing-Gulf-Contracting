import { getPayloadClient } from "../lib/getClient";

export type SocialLinks = {
  instagram?: string;
  linkedin?: string;
  x?: string;
  youtube?: string;
  snapchat?: string;
  tiktok?: string;
  facebook?: string;
};

/**
 * Social links from the ContactSettings global. Only returns entries that
 * are set to a real URL — nothing is invented, so the footer social row
 * simply stays empty until an editor adds the client's actual pages in the
 * admin (ContactSettings → socials).
 */
export async function getSocialLinks(): Promise<SocialLinks> {
  const payload = await getPayloadClient();
  const settings = await payload.findGlobal({ slug: "contact-settings", depth: 0 }).catch(() => null);
  const socials = (settings as { socials?: Record<string, unknown> } | null)?.socials ?? {};
  const clean: SocialLinks = {};
  for (const key of ["instagram", "linkedin", "x", "youtube", "snapchat", "tiktok", "facebook"] as const) {
    const value = socials[key];
    if (typeof value === "string" && value.trim().startsWith("http")) {
      clean[key] = value.trim();
    }
  }
  return clean;
}
