import { getPayloadClient } from "../lib/getClient";
import type { Bilingual } from "@/data/process";
import { caseStudies as staticPlaceholderCaseStudies, type CaseStudy } from "@/data/projects";

type RawKpi = { label: Bilingual; beforeValue?: string | null; afterValue?: string | null };

type RawProjectDoc = {
  slug: string;
  clientDisplayName: Bilingual;
  sector?: { slug: string } | string | null;
  relatedSolutions?: Array<{ slug: string } | string> | null;
  city?: Bilingual | null;
  scope: Bilingual;
  challenge: Bilingual;
  solutionApproach: Bilingual;
  kpis?: RawKpi[] | null;
};

const EMPTY_BILINGUAL: Bilingual = { ar: "", en: "" };

function firstRelatedSolutionSlug(value: RawProjectDoc["relatedSolutions"]): string {
  const first = value?.[0];
  return first && typeof first === "object" ? first.slug : (first ?? "");
}

function sectorSlug(value: RawProjectDoc["sector"]): string {
  return value && typeof value === "object" ? value.slug : (value ?? "");
}

/**
 * The static CaseStudy type has a single free-text `result` field; Payload
 * models results as structured, sourced KPIs instead (label + before/after,
 * with an internal-only sourceNote — see Projects.ts). Synthesize a
 * human-readable result summary from those KPIs rather than requiring a
 * frontend/CMS shape rewrite for this one field.
 */
function synthesizeResult(kpis: RawKpi[] | null | undefined): Bilingual {
  if (!kpis || kpis.length === 0) return EMPTY_BILINGUAL;
  return {
    ar: kpis.map((kpi) => `${kpi.label.ar}: ${kpi.beforeValue ?? "—"} ← ${kpi.afterValue ?? "—"}`).join("\n"),
    en: kpis.map((kpi) => `${kpi.label.en}: ${kpi.beforeValue ?? "—"} → ${kpi.afterValue ?? "—"}`).join("\n"),
  };
}

function mapProject(doc: RawProjectDoc): CaseStudy {
  return {
    slug: doc.slug,
    isPlaceholder: false,
    clientLabel: doc.clientDisplayName,
    sectorSlug: sectorSlug(doc.sector),
    solutionSlug: firstRelatedSolutionSlug(doc.relatedSolutions),
    city: doc.city ?? EMPTY_BILINGUAL,
    scope: doc.scope,
    challenge: doc.challenge,
    approach: doc.solutionApproach,
    result: synthesizeResult(doc.kpis),
  };
}

/**
 * Real, CMS-managed case studies — visible only once BOTH gates are true:
 * published (`_status`) and independently fact-checked
 * (`verificationStatus: verified`). See CONTENT-VERIFICATION.md. Today this
 * returns an empty array (all seeded projects are drafts), which is
 * correct, not a bug — callers should fall back to the static illustrative
 * template rather than rendering an empty grid.
 */
export async function getVerifiedCaseStudies(): Promise<CaseStudy[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "projects",
    locale: "all",
    depth: 1,
    limit: 100,
    where: { and: [{ _status: { equals: "published" } }, { verificationStatus: { equals: "verified" } }] },
  });
  return result.docs.map((doc) => mapProject(doc as unknown as RawProjectDoc));
}

/**
 * What the frontend should actually render: real verified case studies
 * once they exist, or — until then — the single static illustrative
 * template (clearly labeled `isPlaceholder`) so the page never renders an
 * empty grid. Once the first real case study is published and verified in
 * the CMS, it replaces the placeholder automatically.
 */
export async function getHomepageCaseStudies(): Promise<CaseStudy[]> {
  const verified = await getVerifiedCaseStudies();
  return verified.length > 0 ? verified : staticPlaceholderCaseStudies;
}

export async function getVerifiedCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "projects",
    locale: "all",
    depth: 1,
    limit: 1,
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }, { verificationStatus: { equals: "verified" } }],
    },
  });
  const doc = result.docs[0];
  return doc ? mapProject(doc as unknown as RawProjectDoc) : undefined;
}
