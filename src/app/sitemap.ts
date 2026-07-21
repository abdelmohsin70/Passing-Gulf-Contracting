import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { solutions } from "@/data/solutions";
import { caseStudies } from "@/data/projects";
import { siteUrl } from "@/lib/seo";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteUrl();
  const entries: MetadataRoute.Sitemap = [];

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
      if (caseStudy.isPlaceholder) continue;
      entries.push({
        url: `${url}/${locale}/projects/${caseStudy.slug}`,
        lastModified: new Date(),
      });
    }
  }

  return entries;
}
