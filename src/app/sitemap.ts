import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getSolutions } from "@/payload/queries/solutions";
import { getVerifiedCaseStudies } from "@/payload/queries/projects";
import { siteUrl } from "@/lib/seo";

// Pulls Solutions/Projects from Payload — regenerate per-request so newly
// published/verified content appears in the sitemap without a redeploy.
export const dynamic = "force-dynamic";

const staticPaths = [
  "",
  "/about",
  "/solutions",
  "/sectors",
  "/projects",
  "/quality-safety",
  "/contact",
  "/careers",
  "/privacy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = siteUrl();
  const entries: MetadataRoute.Sitemap = [];
  const [solutions, caseStudies] = await Promise.all([getSolutions(), getVerifiedCaseStudies()]);

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${url}/${locale}${path}`,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${url}/${l}${path}`])),
        },
      });
    }

    for (const solution of solutions) {
      entries.push({
        url: `${url}/${locale}/solutions/${solution.slug}`,
        lastModified: new Date(),
      });
    }

    for (const caseStudy of caseStudies) {
      entries.push({
        url: `${url}/${locale}/projects/${caseStudy.slug}`,
        lastModified: new Date(),
      });
    }
  }

  return entries;
}
