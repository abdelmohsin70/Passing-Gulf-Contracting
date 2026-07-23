import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api/", "/ar/design-system", "/en/design-system"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
