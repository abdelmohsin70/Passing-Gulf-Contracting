"use client";

import { useActionState, useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Solution } from "@/data/solutions";
import type { Sector } from "@/data/sectors";
import { submitQuoteRequest, type ActionResult } from "@/app/actions";
import { Label, TextInput, Textarea, Select, FieldError } from "@/components/primitives/Field";
import { Button } from "@/components/primitives/Button";
import { CheckIcon } from "@/components/icons/icons";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const stepOfField: Record<string, number> = {
  service: 1,
  sector: 1,
  city: 1,
  name: 2,
  company: 2,
  phone: 2,
  email: 2,
  message: 2,
  consent: 3,
};

const initialState: ActionResult | null = null;

const errorMessageKey: Record<string, keyof Dictionary["quoteForm"]["errors"]> = {
  invalid_phone: "invalidPhone",
  invalid_string: "invalidEmail",
  consent_required: "consentRequired",
  required: "required",
};

export function QuoteWizard({
  locale,
  dictionary,
  initialService,
  solutions,
  sectors,
}: {
  locale: Locale;
  dictionary: Dictionary;
  initialService?: string;
  solutions: Solution[];
  sectors: Sector[];
}) {
  const [state, formAction, isPending] = useActionState(submitQuoteRequest, initialState);
  const [step, setStep] = useState(0);
  const [clientType, setClientType] = useState<"facility" | "home">(
    initialService === "home-care" ? "home" : "facility"
  );
  const [service, setService] = useState(initialService ?? "");

  const steps = [
    dictionary.quoteForm.steps.clientType,
    dictionary.quoteForm.steps.service,
    dictionary.quoteForm.steps.contact,
    dictionary.quoteForm.steps.review,
  ];

  useEffect(() => {
    trackEvent("quote_start", { locale });
    // Fire once on mount only — starting a new request shouldn't re-fire this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Synchronize local UI (current step, analytics) with the outcome of the
  // server action each time it changes. This genuinely responds to an
  // external system (the server action result), which is exactly the case
  // effects exist for, so the setState-in-effect call here is intentional.
  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      trackEvent("quote_submit", { locale, referenceId: state.referenceId });
      return;
    }
    if (state.fieldErrors) {
      const erroredSteps = Object.keys(state.fieldErrors).map((field) => stepOfField[field] ?? 3);
      if (erroredSteps.length) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing UI to an external server-action result
        setStep(Math.min(...erroredSteps));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (state?.ok) {
    return (
      <div className="rounded-[var(--radius-card)] border border-success/20 bg-success/5 p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success text-white">
          <CheckIcon className="size-7" />
        </span>
        <h3 className="mt-5 text-xl font-bold text-navy">{dictionary.quoteForm.success.title}</h3>
        <p className="mt-2 text-sm text-slate">{dictionary.quoteForm.success.body}</p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-white px-4 py-2 text-sm font-semibold text-navy shadow-soft">
          {dictionary.quoteForm.success.referenceLabel}: <span dir="ltr">{state.referenceId}</span>
        </p>
        <div className="mt-6">
          <Button variant="outline" onClick={() => window.location.reload()}>
            {dictionary.quoteForm.success.newRequest}
          </Button>
        </div>
      </div>
    );
  }

  function fieldError(field: string): string | undefined {
    const code = state && !state.ok ? state.fieldErrors?.[field] : undefined;
    if (!code) return undefined;
    const key = errorMessageKey[code] ?? "generic";
    return dictionary.quoteForm.errors[key];
  }

  // A prominent, always-visible failure notice — not just the small
  // per-field messages, which are easy to miss (especially when the
  // failure has no associated field, e.g. a rate limit or a server error).
  function topLevelError(): string | undefined {
    if (!state || state.ok) return undefined;
    if (state.error === "rate_limited") return dictionary.quoteForm.errors.rateLimited;
    if (state.error === "generic") return dictionary.quoteForm.errors.generic;
    if (state.error === "validation_failed" && !state.fieldErrors) return dictionary.quoteForm.errors.generic;
    return undefined;
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft sm:p-8">
      <ol className="mb-8 flex items-center gap-2 text-xs font-semibold text-slate">
        {steps.map((label, index) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px]",
                index <= step ? "border-orange bg-orange text-white" : "border-navy/20 text-slate"
              )}
            >
              {index + 1}
            </span>
            <span className={cn("hidden sm:inline", index === step && "text-navy")}>{label}</span>
            {index < steps.length - 1 ? <span className="h-px flex-1 bg-navy/10" /> : null}
          </li>
        ))}
      </ol>

      {topLevelError() ? (
        <div
          role="alert"
          className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
        >
          {topLevelError()}
        </div>
      ) : null}

      <form action={formAction} noValidate>
        <input type="hidden" name="clientType" value={clientType} />
        <input type="hidden" name="service" value={service} />
        <input type="hidden" name="locale" value={locale} />
        {/* Honeypot: real users never see this field. */}
        <div aria-hidden className="absolute size-px overflow-hidden" style={{ clip: "rect(0 0 0 0)" }}>
          <label htmlFor="companyWebsite">Company website</label>
          <input id="companyWebsite" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className={cn(step !== 0 && "hidden")}>
          <h3 className="mb-5 text-lg font-bold text-navy">{dictionary.quoteForm.clientType.title}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(["facility", "home"] as const).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setClientType(type)}
                className={cn(
                  "focus-ring rounded-[var(--radius-card)] border-2 p-5 text-start transition-colors",
                  clientType === type ? "border-orange bg-orange/5" : "border-navy/10 hover:border-navy/20"
                )}
              >
                <span className="block font-bold text-navy">{dictionary.quoteForm.clientType[type]}</span>
                <span className="mt-1 block text-sm text-slate">{dictionary.quoteForm.clientType[`${type}Hint`]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={cn(step !== 1 && "hidden")}>
          <h3 className="mb-5 text-lg font-bold text-navy">{dictionary.quoteForm.service.title}</h3>
          <div className="grid grid-cols-1 gap-5">
            <div>
              <Label htmlFor="service-select" required>
                {dictionary.quoteForm.service.serviceLabel}
              </Label>
              <Select id="service-select" value={service} onChange={(event) => setService(event.target.value)} required>
                <option value="" disabled>
                  {dictionary.quoteForm.service.servicePlaceholder}
                </option>
                {solutions.map((solution) => (
                  <option key={solution.slug} value={solution.slug}>
                    {solution.title[locale]}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="sector">{dictionary.quoteForm.service.sectorLabel}</Label>
              <Select id="sector" name="sector" defaultValue="">
                <option value="">{dictionary.quoteForm.service.sectorPlaceholder}</option>
                {sectors.map((sector) => (
                  <option key={sector.slug} value={sector.slug}>
                    {sector.title[locale]}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="city" required>
                {dictionary.quoteForm.service.cityLabel}
              </Label>
              <TextInput id="city" name="city" placeholder={dictionary.quoteForm.service.cityPlaceholder} required minLength={2} />
              <FieldError>{fieldError("city")}</FieldError>
            </div>
          </div>
        </div>

        <div className={cn(step !== 2 && "hidden")}>
          <h3 className="mb-5 text-lg font-bold text-navy">{dictionary.quoteForm.contact.title}</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="name" required>
                {dictionary.quoteForm.contact.nameLabel}
              </Label>
              <TextInput id="name" name="name" placeholder={dictionary.quoteForm.contact.namePlaceholder} required minLength={2} />
              <FieldError>{fieldError("name")}</FieldError>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="company">{dictionary.quoteForm.contact.companyLabel}</Label>
              <TextInput id="company" name="company" placeholder={dictionary.quoteForm.contact.companyPlaceholder} />
            </div>
            <div>
              <Label htmlFor="phone" required>
                {dictionary.quoteForm.contact.phoneLabel}
              </Label>
              <TextInput id="phone" name="phone" type="tel" dir="ltr" placeholder={dictionary.quoteForm.contact.phonePlaceholder} required />
              <FieldError>{fieldError("phone")}</FieldError>
            </div>
            <div>
              <Label htmlFor="email" required>
                {dictionary.quoteForm.contact.emailLabel}
              </Label>
              <TextInput id="email" name="email" type="email" dir="ltr" placeholder={dictionary.quoteForm.contact.emailPlaceholder} required />
              <FieldError>{fieldError("email")}</FieldError>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="message">{dictionary.quoteForm.contact.messageLabel}</Label>
              <Textarea id="message" name="message" placeholder={dictionary.quoteForm.contact.messagePlaceholder} />
            </div>
          </div>
        </div>

        <div className={cn(step !== 3 && "hidden")}>
          <h3 className="mb-5 text-lg font-bold text-navy">{dictionary.quoteForm.review.title}</h3>
          <label className="flex items-start gap-3 rounded-xl bg-sand p-4 text-sm text-navy">
            <input type="checkbox" name="consent" value="true" required className="mt-1 size-4 accent-orange" />
            {dictionary.quoteForm.contact.consentLabel}
          </label>
          <FieldError>{fieldError("consent")}</FieldError>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            className={cn(step === 0 && "invisible")}
          >
            {dictionary.quoteForm.buttons.back}
          </Button>

          {step < steps.length - 1 ? (
            <Button
              key="next"
              type="button"
              onClick={() => {
                if (step === 1 && !service) return;
                setStep((value) => Math.min(steps.length - 1, value + 1));
              }}
              disabled={step === 1 && !service}
            >
              {dictionary.quoteForm.buttons.next}
            </Button>
          ) : (
            <Button key="submit" type="submit" disabled={isPending}>
              {isPending ? dictionary.quoteForm.buttons.submitting : dictionary.quoteForm.buttons.submit}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
