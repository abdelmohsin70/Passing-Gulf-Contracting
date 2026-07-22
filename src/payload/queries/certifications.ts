import { getPayloadClient } from "../lib/getClient";
import { company } from "@/config/company";
import type { Bilingual } from "@/data/process";

export type CertificationDisplay = {
  code: string;
  label: Bilingual;
  /** true once a real, current certificate copy has been confirmed and published. */
  verified: boolean;
};

/**
 * Real, publicly-visible certifications from the CMS if any exist, else
 * the static placeholder list (company.certifications — all "pending",
 * matching what's actually seeded). Mirrors the same zero-risk fallback
 * pattern used for case studies: never render an empty section, and never
 * claim a certificate is verified until an editor explicitly marks it so.
 */
export async function getPublicCertifications(): Promise<CertificationDisplay[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "certifications",
    depth: 0,
    limit: 50,
    where: { publicVisibility: { equals: true } },
  });

  if (result.docs.length === 0) {
    return company.certifications.map((cert) => ({ code: cert.code, label: cert.label, verified: false }));
  }

  return result.docs.map((doc) => ({
    code: String(doc.code),
    label: { ar: String(doc.labelAr ?? doc.code), en: String(doc.labelEn ?? doc.code) },
    verified: true,
  }));
}
