import { getPayloadClient } from "./getClient";
import type { QuoteRequestInput, CareerInterestInput } from "@/lib/validation";

type SourceMeta = {
  sourcePage?: string;
  locale?: string;
  referrer?: string;
  utm?: { source?: string; medium?: string; campaign?: string; term?: string; content?: string };
};

async function findIdBySlug(collection: "solutions" | "sectors", slug: string): Promise<number | undefined> {
  if (!slug) return undefined;
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const doc = result.docs[0] as { id: number } | undefined;
  return doc?.id;
}

export async function createQuoteLead(
  referenceNumber: string,
  data: Omit<QuoteRequestInput, "companyWebsite">,
  meta: SourceMeta
): Promise<void> {
  const payload = await getPayloadClient();

  const [serviceId, sectorId] = await Promise.all([
    findIdBySlug("solutions", data.service),
    data.sector ? findIdBySlug("sectors", data.sector) : Promise.resolve(undefined),
  ]);

  const lead = await payload.create({
    collection: "leads",
    overrideAccess: true,
    data: {
      referenceNumber,
      type: data.clientType === "home" ? "home" : "business",
      status: "new",
      name: data.name,
      company: data.company || undefined,
      email: data.email,
      phone: data.phone,
      service: serviceId,
      serviceSlug: data.service,
      sector: sectorId,
      sectorSlug: data.sector || undefined,
      city: data.city,
      message: data.message || undefined,
      sourcePage: meta.sourcePage,
      locale: meta.locale,
      referrer: meta.referrer,
      utm: meta.utm,
      consentAt: new Date().toISOString(),
    },
  });

  await payload.create({
    collection: "lead-activities",
    overrideAccess: true,
    data: {
      lead: lead.id,
      type: "note",
      note: "طلب جديد عبر نموذج الموقع.",
      toStatus: "new",
      occurredAt: new Date().toISOString(),
    },
  });
}

export async function createJobApplicationLead(
  referenceNumber: string,
  data: Omit<CareerInterestInput, "companyWebsite">
): Promise<void> {
  const payload = await getPayloadClient();

  await payload.create({
    collection: "job-applications",
    overrideAccess: true,
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      areaOfInterest: data.areaOfInterest,
      message: data.message || undefined,
      consentAt: new Date().toISOString(),
      status: "new",
    },
  });

  // Also mirror into Leads so sales has one unified inbox, tagged type=career.
  await payload.create({
    collection: "leads",
    overrideAccess: true,
    data: {
      referenceNumber,
      type: "career",
      status: "new",
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: `مجال الاهتمام: ${data.areaOfInterest}${data.message ? ` — ${data.message}` : ""}`,
      consentAt: new Date().toISOString(),
    },
  });
}
