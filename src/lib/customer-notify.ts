/**
 * Customer-facing confirmation for a submitted lead (quote request or
 * career interest) — separate from src/lib/notify.ts, which alerts the
 * internal sales team. This tells the *customer* their request was
 * received and that the team will follow up.
 *
 * Both channels are safe no-ops until configured, following the same
 * pattern as the rest of this project: nothing is invented, nothing is
 * silently dropped (a skip is always logged), and a channel failing never
 * fails the customer's actual form submission.
 *
 * Email: Resend (https://resend.com) — set RESEND_API_KEY. Free tier
 * available; RESEND_FROM_EMAIL defaults to Resend's shared sandbox sender
 * (onboarding@resend.dev), which works without a verified domain but is
 * clearly a "resend.dev" address to recipients — set RESEND_FROM_EMAIL to
 * a verified address on your own domain before relying on this for real.
 *
 * WhatsApp: Twilio (https://twilio.com) — set TWILIO_ACCOUNT_SID,
 * TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM (a WhatsApp-enabled Twilio
 * sender, e.g. "whatsapp:+14155238886" for the sandbox). Twilio's WhatsApp
 * sandbox is free for testing but requires the recipient to first opt in
 * by messaging the sandbox number; a production WhatsApp sender requires
 * Meta Business verification, which no amount of code can skip.
 */

type Locale = "ar" | "en";

type ConfirmationInput = {
  name: string;
  email: string;
  phone: string;
  referenceId: string;
  locale: Locale;
  kind: "quote_request" | "career_interest";
};

const emailCopy: Record<Locale, { subject: string; body: (name: string, ref: string) => string }> = {
  ar: {
    subject: "تم استلام طلبك — اجتياز الخليج للمقاولات",
    body: (name, ref) =>
      `مرحبًا ${name}،\n\nنشكرك على تواصلك مع اجتياز الخليج للمقاولات. تم استلام طلبك بنجاح، وسيقوم فريقنا بالتواصل معك خلال يوم عمل.\n\nرقم المرجع: ${ref}\n\nمع تحيات فريق اجتياز الخليج`,
  },
  en: {
    subject: "Your request was received — Ijtiyaz Al Khaleej Contracting",
    body: (name, ref) =>
      `Hi ${name},\n\nThank you for contacting Ijtiyaz Al Khaleej Contracting. Your request has been received, and our team will follow up within one business day.\n\nReference: ${ref}\n\nBest regards,\nIjtiyaz Al Khaleej team`,
  },
};

const whatsAppCopy: Record<Locale, (name: string, ref: string) => string> = {
  ar: (name, ref) =>
    `مرحبًا ${name}، تم استلام طلبك من اجتياز الخليج للمقاولات (مرجع ${ref}). سيتواصل معك فريقنا قريبًا.`,
  en: (name, ref) =>
    `Hi ${name}, your request was received by Ijtiyaz Al Khaleej Contracting (ref ${ref}). Our team will contact you shortly.`,
};

/** Normalizes the app's accepted Saudi phone formats to E.164 (+9665XXXXXXXX). */
function toE164Saudi(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("9665")) return `+${digits}`;
  if (digits.startsWith("05")) return `+966${digits.slice(1)}`;
  if (digits.startsWith("5")) return `+966${digits}`;
  return phone.startsWith("+") ? phone : `+${digits}`;
}

async function sendConfirmationEmail(input: ConfirmationInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const copy = emailCopy[input.locale];

  if (!apiKey) {
    console.info(`[customer-notify] email skipped (RESEND_API_KEY not set) — ref ${input.referenceId}`);
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: input.email,
        subject: copy.subject,
        text: copy.body(input.name, input.referenceId),
      }),
    });
    if (!response.ok) {
      console.error(`[customer-notify] Resend API error ${response.status} for ref ${input.referenceId}`);
    }
  } catch (error) {
    console.error(`[customer-notify] failed to send confirmation email for ref ${input.referenceId}`, error);
  }
}

async function sendConfirmationWhatsApp(input: ConfirmationInput): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !fromNumber) {
    console.info(`[customer-notify] WhatsApp skipped (Twilio not configured) — ref ${input.referenceId}`);
    return;
  }

  const toNumber = `whatsapp:${toE164Saudi(input.phone)}`;
  const body = whatsAppCopy[input.locale](input.name, input.referenceId);

  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ From: fromNumber, To: toNumber, Body: body }).toString(),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(`[customer-notify] Twilio API error ${response.status} for ref ${input.referenceId}: ${detail}`);
    }
  } catch (error) {
    console.error(`[customer-notify] failed to send WhatsApp confirmation for ref ${input.referenceId}`, error);
  }
}

/**
 * Sends both channels in parallel, best-effort — a delivery failure on
 * either channel is logged but never thrown, since the lead is already
 * safely persisted by this point and the customer's form submission must
 * still succeed regardless of notification delivery.
 */
export async function sendCustomerConfirmation(input: ConfirmationInput): Promise<void> {
  await Promise.all([sendConfirmationEmail(input), sendConfirmationWhatsApp(input)]);
}
