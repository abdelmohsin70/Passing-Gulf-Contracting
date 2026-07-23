import type { SocialLinks as SocialLinksData } from "@/payload/queries/contactSettings";
import {
  InstagramIcon,
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
  SnapchatIcon,
  TikTokIcon,
  FacebookIcon,
} from "@/components/icons/icons";

const PLATFORMS = [
  { key: "instagram", Icon: InstagramIcon, label: "Instagram" },
  { key: "linkedin", Icon: LinkedInIcon, label: "LinkedIn" },
  { key: "x", Icon: XIcon, label: "X" },
  { key: "youtube", Icon: YouTubeIcon, label: "YouTube" },
  { key: "snapchat", Icon: SnapchatIcon, label: "Snapchat" },
  { key: "tiktok", Icon: TikTokIcon, label: "TikTok" },
  { key: "facebook", Icon: FacebookIcon, label: "Facebook" },
] as const;

/**
 * Renders a row of social icon links from the CMS-provided socials. Only
 * platforms with a real URL appear — nothing is invented, so the row is
 * empty (renders nothing) until an editor adds the client's real pages.
 * `variant` picks the styling for the two placements: "footer" (bordered
 * circles) and "topbar" (compact icons on the navy utility strip).
 */
export function SocialLinks({
  socials,
  variant = "footer",
  className = "",
}: {
  socials: SocialLinksData;
  variant?: "footer" | "topbar";
  className?: string;
}) {
  const links = PLATFORMS.map((p) => ({ ...p, href: socials[p.key] })).filter(
    (p): p is (typeof PLATFORMS)[number] & { href: string } => Boolean(p.href)
  );
  if (links.length === 0) return null;

  const linkClass =
    variant === "footer"
      ? "focus-ring flex size-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-orange hover:text-orange"
      : "focus-ring flex size-6 items-center justify-center rounded-md text-white/70 transition-colors hover:text-orange";
  const iconClass = variant === "footer" ? "size-4" : "size-3.5";

  return (
    <div className={`flex items-center ${variant === "footer" ? "gap-3" : "gap-1.5"} ${className}`}>
      {links.map(({ key, href, Icon, label }) => (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={linkClass}>
          <Icon className={iconClass} />
        </a>
      ))}
    </div>
  );
}
