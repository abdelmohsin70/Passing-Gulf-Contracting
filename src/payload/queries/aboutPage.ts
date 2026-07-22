import { getPayloadClient } from "../lib/getClient";
import { resolveMediaUrl } from "./media";
import type { Bilingual } from "@/data/process";

export type AboutPageContent = {
  title: Bilingual;
  subtitle: Bilingual;
  story: { title: Bilingual; body: Bilingual; image?: string };
  missionSection: {
    sectionTitle: Bilingual;
    visionLabel: Bilingual;
    visionBody: Bilingual;
    missionLabel: Bilingual;
    missionBody: Bilingual;
  };
  valuesLabel?: Bilingual;
  values: Array<{ title: Bilingual; body: Bilingual }>;
  whyTitle: Bilingual;
  why: Array<{ item: Bilingual }>;
  sideImage?: string;
};

type RawAboutPage = {
  title: Bilingual;
  subtitle: Bilingual;
  story: { title: Bilingual; body: Bilingual; image?: unknown };
  missionSection: AboutPageContent["missionSection"];
  valuesLabel?: Bilingual;
  values?: Array<{ title: Bilingual; body: Bilingual }> | null;
  whyTitle: Bilingual;
  why?: Array<{ item: Bilingual }> | null;
  sideImage?: unknown;
};

export async function getAboutPage(): Promise<AboutPageContent> {
  const payload = await getPayloadClient();
  const doc = (await payload.findGlobal({ slug: "about-page", locale: "all", depth: 1 })) as unknown as RawAboutPage;

  return {
    title: doc.title,
    subtitle: doc.subtitle,
    story: { title: doc.story.title, body: doc.story.body, image: resolveMediaUrl(doc.story.image) },
    missionSection: doc.missionSection,
    valuesLabel: doc.valuesLabel,
    values: doc.values ?? [],
    whyTitle: doc.whyTitle,
    why: doc.why ?? [],
    sideImage: resolveMediaUrl(doc.sideImage),
  };
}
