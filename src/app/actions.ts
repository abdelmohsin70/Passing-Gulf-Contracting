"use server";

import { headers } from "next/headers";
import { quoteRequestSchema, careerInterestSchema } from "@/lib/validation";
import { consumeRateLimit } from "@/lib/rate-limit";
import { sendLeadNotification, generateReferenceId } from "@/lib/notify";

export type ActionResult =
  | { ok: true; referenceId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

async function getClientKey(): Promise<string> {
  const headerList = await headers();
  return (
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown"
  );
}

export async function submitQuoteRequest(_prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  // Zod's `true` literal check needs an actual boolean, not the string "on".
  const parsed = quoteRequestSchema.safeParse({
    ...raw,
    consent: raw.consent === "true" || raw.consent === "on",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "validation_failed", fieldErrors };
  }

  // Silently succeed on honeypot fill — do not tip off bots.
  if (parsed.data.companyWebsite) {
    return { ok: true, referenceId: generateReferenceId("IK") };
  }

  const clientKey = await getClientKey();
  const rateLimit = consumeRateLimit(`quote:${clientKey}`);
  if (!rateLimit.allowed) {
    return { ok: false, error: "rate_limited" };
  }

  const referenceId = generateReferenceId("IK");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- discard the honeypot field before sending
  const { companyWebsite: _honeypot, ...payload } = parsed.data;

  await sendLeadNotification({
    referenceId,
    kind: "quote_request",
    submittedAt: new Date().toISOString(),
    payload,
  });

  return { ok: true, referenceId };
}

export async function submitCareerInterest(_prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = careerInterestSchema.safeParse({
    ...raw,
    consent: raw.consent === "true" || raw.consent === "on",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "validation_failed", fieldErrors };
  }

  if (parsed.data.companyWebsite) {
    return { ok: true, referenceId: generateReferenceId("IK-CAR") };
  }

  const clientKey = await getClientKey();
  const rateLimit = consumeRateLimit(`career:${clientKey}`);
  if (!rateLimit.allowed) {
    return { ok: false, error: "rate_limited" };
  }

  const referenceId = generateReferenceId("IK-CAR");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- discard the honeypot field before sending
  const { companyWebsite: _honeypot, ...payload } = parsed.data;

  await sendLeadNotification({
    referenceId,
    kind: "career_interest",
    submittedAt: new Date().toISOString(),
    payload,
  });

  return { ok: true, referenceId };
}
