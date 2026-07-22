import { getPayloadClient } from "../lib/getClient";
import { resolveMediaUrl, resolveMediaUrls } from "./media";
import type { Bilingual } from "@/data/process";
import type { FAQItem, Solution } from "@/data/solutions";

/**
 * Shape of a Solutions doc as returned by the Local API with `locale: "all"`
 * — every localized field comes back as `{ ar, en }` directly, which is
 * exactly the `Bilingual` shape the existing frontend components expect.
 * This is intentionally loose (not the generated payload-types shape, which
 * assumes a single resolved locale) since it only describes the fields this
 * adapter actually reads.
 */
type RawSolutionDoc = {
  slug: string;
  icon: Solution["icon"];
  title: Bilingual;
  summary: Bilingual;
  heroOutcome: Bilingual;
  problem: Bilingual;
  methodology: Bilingual;
  quality: Bilingual;
  featured?: boolean | null;
  scope?: Array<{ item: Bilingual }> | null;
  faqs?: Array<{ question: Bilingual; answer: Bilingual }> | null;
  sectors?: Array<{ slug: string } | string> | null;
  heroImage?: unknown;
  gallery?: unknown;
};

function sectorSlugs(value: RawSolutionDoc["sectors"]): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => (typeof entry === "object" ? entry.slug : undefined)).filter((slug): slug is string => Boolean(slug));
}

function mapSolution(doc: RawSolutionDoc): Solution {
  return {
    slug: doc.slug,
    icon: doc.icon,
    title: doc.title,
    summary: doc.summary,
    heroOutcome: doc.heroOutcome,
    problem: doc.problem,
    scope: (doc.scope ?? []).map((row) => row.item),
    sectors: sectorSlugs(doc.sectors),
    methodology: doc.methodology,
    quality: doc.quality,
    faqs: (doc.faqs ?? []).map((row): FAQItem => ({ question: row.question, answer: row.answer })),
    featured: Boolean(doc.featured),
    heroImage: resolveMediaUrl(doc.heroImage),
    gallery: resolveMediaUrls(doc.gallery),
  };
}

/** Published solutions, ordered the same way the CMS admin sorts them. */
export async function getSolutions(): Promise<Solution[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "solutions",
    locale: "all",
    depth: 2,
    limit: 100,
    sort: "sortOrder",
    where: { _status: { equals: "published" } },
  });
  return result.docs.map((doc) => mapSolution(doc as unknown as RawSolutionDoc));
}

export async function getSolutionBySlug(slug: string): Promise<Solution | undefined> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "solutions",
    locale: "all",
    depth: 2,
    limit: 1,
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] },
  });
  const doc = result.docs[0];
  return doc ? mapSolution(doc as unknown as RawSolutionDoc) : undefined;
}
