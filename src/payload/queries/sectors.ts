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
