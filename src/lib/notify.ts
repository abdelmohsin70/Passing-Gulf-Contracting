/**
 * Lead notification adapter.
 *
 * By default (no env vars set) this logs a structured, non-sensitive
 * summary to the server console so leads are never silently dropped during
 * development or before a real provider is wired up.
 *
 * To connect a real provider, set NOTIFY_WEBHOOK_URL to an endpoint that
 * accepts a JSON POST (e.g. a Zapier/Make webhook, a CRM inbound-lead API,
 * or a transactional email API's webhook relay). See README.md for setup
 * notes.
 */

export type LeadNotification = {
  referenceId: string;
  kind: "quote_request" | "career_interest";
  submittedAt: string;
  payload: Record<string, unknown>;
};

export async function sendLeadNotification(notification: LeadNotification): Promise<void> {
  const webhookUrl = process.env.NOTIFY_WEBHOOK_URL;

  if (!webhookUrl) {
    // Dev-safe fallback: log only non-sensitive metadata, never full PII to
    // shared logs by default beyond what's needed to trace the lead.
    console.info(
      `[notify] ${notification.kind} received — ref ${notification.referenceId} at ${notification.submittedAt}`
    );
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(notification),
    });
  } catch (error) {
    console.error(`[notify] failed to deliver ${notification.kind} ${notification.referenceId}`, error);
  }
}

export function generateReferenceId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  const stamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${stamp}-${random}`;
}
