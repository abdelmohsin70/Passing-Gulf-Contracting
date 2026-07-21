import { describe, expect, it } from "vitest";
import { quoteRequestSchema } from "@/lib/validation";

const validPayload = {
  clientType: "facility" as const,
  service: "facility-management",
  sector: "commercial-admin",
  city: "Riyadh",
  name: "Test User",
  company: "Test Co",
  phone: "0512345678",
  email: "test@example.com",
  message: "",
  consent: true,
  companyWebsite: "",
};

describe("quoteRequestSchema", () => {
  it("accepts a fully valid submission", () => {
    const result = quoteRequestSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = quoteRequestSchema.safeParse({ ...validPayload, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid phone number", () => {
    const result = quoteRequestSchema.safeParse({ ...validPayload, phone: "12345" });
    expect(result.success).toBe(false);
  });

  it("accepts a Saudi number with the +966 prefix", () => {
    const result = quoteRequestSchema.safeParse({ ...validPayload, phone: "+966512345678" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = quoteRequestSchema.safeParse({ ...validPayload, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("requires consent to be exactly true", () => {
    const result = quoteRequestSchema.safeParse({ ...validPayload, consent: false });
    expect(result.success).toBe(false);
  });

  it("rejects a filled honeypot field", () => {
    const result = quoteRequestSchema.safeParse({ ...validPayload, companyWebsite: "http://spam.example" });
    expect(result.success).toBe(false);
  });
});
