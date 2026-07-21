import { z } from "zod";

export const clientTypeValues = ["facility", "home"] as const;
export type ClientType = (typeof clientTypeValues)[number];

export const quoteRequestSchema = z.object({
  clientType: z.enum(clientTypeValues),
  service: z.string().min(1),
  sector: z.string().optional().default(""),
  city: z.string().min(2).max(80),
  name: z.string().min(2).max(120),
  company: z.string().max(160).optional().default(""),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?9665\d{8}|05\d{8}|5\d{8})$/, "invalid_phone"),
  email: z.string().email().max(160),
  message: z.string().max(2000).optional().default(""),
  consent: z.literal(true, { message: "consent_required" }),
  // Honeypot field: must stay empty. Real users never see or fill it.
  companyWebsite: z.string().max(0).optional().default(""),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

export const careerInterestSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?9665\d{8}|05\d{8}|5\d{8})$/, "invalid_phone"),
  areaOfInterest: z.string().min(2).max(160),
  message: z.string().max(2000).optional().default(""),
  consent: z.literal(true, { message: "consent_required" }),
  companyWebsite: z.string().max(0).optional().default(""),
});

export type CareerInterestInput = z.infer<typeof careerInterestSchema>;
