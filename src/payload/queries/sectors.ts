import { getPayloadClient } from "../lib/getClient";
import { getSolutions } from "./solutions";
import type { Bilingual } from "@/data/process";
import type { Sector } from "@/data/sectors";

type RawSectorDoc = {
  slug: string;
  icon: Sector["icon"];
  title: Bilingual;
  summary: Bilingual;
};

/**
 * Published sectors, with `relevantSolutions` derived from each published
 * solution's own `sectors` relationship rather than a separate reverse
 * field — the seed data only populates the Solutions -> Sectors direction,
 * and deriving the reverse here means it can never drift out of sync with
 * what solutions actually declare.
 */
export async function getSectors(): Promise<Sector[]> {
  const payload = await getPayloadClient();
  const [result, solutions] = await Promise.all([
    payload.find({
      collection: "sectors",
      locale: "all",
      depth: 0,
      limit: 100,
      sort: "sortOrder",
      where: { _status: { equals: "published" } },
    }),
    getSolutions(),
  ]);

  return result.docs.map((rawDoc) => {
    const doc = rawDoc as unknown as RawSectorDoc;
    return {
      slug: doc.slug,
      icon: doc.icon,
      title: doc.title,
      description: doc.summary,
      relevantSolutions: solutions.filter((solution) => solution.sectors.includes(doc.slug)).map((solution) => solution.slug),
    };
  });
}

export type SectorDetail = Sector & {
  operatingModel?: Bilingual;
  challenges: Bilingual[];
  faqs: Array<{ question: Bilingual; answer: Bilingual }>;
};

type RawSectorDetailDoc = RawSectorDoc & {
  operatingModel?: Bilingual | null;
  challenges?: Array<{ item: Bilingual }> | null;
  faqs?: Array<{ question: Bilingual; answer: Bilingual }> | null;
};

/**
 * Full published sector by slug for the detail page — includes challenges,
 * operating model, and FAQs (which the lightweight list query omits).
 * relevantSolutions is derived the same way as the list query so the two
 * never drift.
 */
export async function getSectorBySlug(slug: string): Promise<SectorDetail | null> {
  const payload = await getPayloadClient();
  const [result, solutions] = await Promise.all([
    payload.find({
      collection: "sectors",
      locale: "all",
      depth: 0,
      limit: 1,
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] },
    }),
    getSolutions(),
  ]);

  const rawDoc = result.docs[0];
  if (!rawDoc) return null;
  const doc = rawDoc as unknown as RawSectorDetailDoc;

  const hasBilingual = (value: Bilingual | null | undefined): value is Bilingual =>
    Boolean(value && (value.ar || value.en));

  return {
    slug: doc.slug,
    icon: doc.icon,
    title: doc.title,
    description: doc.summary,
    relevantSolutions: solutions.filter((s) => s.sectors.includes(doc.slug)).map((s) => s.slug),
    operatingModel: hasBilingual(doc.operatingModel) ? doc.operatingModel : undefined,
    challenges: (doc.challenges ?? []).map((c) => c.item).filter(hasBilingual),
    faqs: (doc.faqs ?? []).filter((f) => hasBilingual(f.question) && hasBilingual(f.answer)),
  };
}
