import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendCustomerConfirmation } from "@/lib/customer-notify";

const baseInput = {
  name: "أحمد",
  email: "ahmad@example.com",
  phone: "0512345678",
  referenceId: "IK-TEST123",
  locale: "ar" as const,
  kind: "quote_request" as const,
};

describe("sendCustomerConfirmation", () => {
  const originalEnv = { ...process.env };
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  it("sends neither channel when nothing is configured (safe no-op)", async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.TWILIO_ACCOUNT_SID;
    delete process.env.TWILIO_AUTH_TOKEN;
    delete process.env.TWILIO_WHATSAPP_FROM;

    await sendCustomerConfirmation(baseInput);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("calls the Resend API when RESEND_API_KEY is set", async () => {
    process.env.RESEND_API_KEY = "test-key";
    delete process.env.TWILIO_ACCOUNT_SID;

    await sendCustomerConfirmation(baseInput);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer test-key" }),
      })
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.to).toBe(baseInput.email);
    expect(body.from).toBe("onboarding@resend.dev");
  });

  it("calls the Twilio API with a normalized E.164 WhatsApp number when configured", async () => {
    delete process.env.RESEND_API_KEY;
    process.env.TWILIO_ACCOUNT_SID = "ACtest";
    process.env.TWILIO_AUTH_TOKEN = "secret";
    process.env.TWILIO_WHATSAPP_FROM = "whatsapp:+14155238886";

    await sendCustomerConfirmation(baseInput);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.twilio.com/2010-04-01/Accounts/ACtest/Messages.json",
      expect.objectContaining({ method: "POST" })
    );
    const call = fetchMock.mock.calls[0];
    const params = new URLSearchParams(call[1].body as string);
    expect(params.get("To")).toBe("whatsapp:+966512345678");
    expect(params.get("From")).toBe("whatsapp:+14155238886");
  });

  it("does not throw when the Resend API call fails", async () => {
    process.env.RESEND_API_KEY = "test-key";
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500, text: async () => "server error" });

    await expect(sendCustomerConfirmation(baseInput)).resolves.toBeUndefined();
  });

  it("does not throw when fetch itself rejects (network failure)", async () => {
    process.env.RESEND_API_KEY = "test-key";
    fetchMock.mockRejectedValueOnce(new Error("network down"));

    await expect(sendCustomerConfirmation(baseInput)).resolves.toBeUndefined();
  });
});
