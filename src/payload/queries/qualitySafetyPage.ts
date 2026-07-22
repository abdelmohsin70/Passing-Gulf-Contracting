import { getPayloadClient } from "../lib/getClient";
import { resolveMediaUrl } from "./media";
import type { Bilingual } from "@/data/process";

export type QualitySafetyPageContent = {
  title: Bilingual;
  subtitle: Bilingual;
  heroImage?: string;
  commitments: Array<{ title: Bilingual; body: Bilingual }>;
  certificationsSection: { title: Bilingual; note?: Bilingual };
};

type RawQualitySafetyPage = {
  title: Bilingual;
  subtitle: Bilingual;
  heroImage?: unknown;
  commitments?: Array<{ title: Bilingual; body: Bilingual }> | null;
  certificationsSection: { title: Bilingual; note?: Bilingual };
};

export async function getQualitySafetyPage(): Promise<QualitySafetyPageContent> {
  const payload = await getPayloadClient();
  const doc = (await payload.findGlobal({
    slug: "quality-safety-page",
    locale: "all",
    depth: 1,
  })) as unknown as RawQualitySafetyPage;

  return {
    title: doc.title,
    subtitle: doc.subtitle,
    heroImage: resolveMediaUrl(doc.heroImage),
    commitments: doc.commitments ?? [],
    certificationsSection: doc.certificationsSection,
  };
}
