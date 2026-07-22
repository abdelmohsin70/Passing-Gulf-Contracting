"use client";

import { useActionState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { submitCareerInterest, type ActionResult } from "@/app/actions";
import { Label, TextInput, Textarea, FieldError } from "@/components/primitives/Field";
import { Button } from "@/components/primitives/Button";
import { CheckIcon } from "@/components/icons/icons";

const initialState: ActionResult | null = null;

export function CareerInterestForm({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const [state, formAction, isPending] = useActionState(submitCareerInterest, initialState);

  function topLevelError(): string | undefined {
    if (!state || state.ok) return undefined;
    if (state.error === "rate_limited") return dictionary.quoteForm.errors.rateLimited;
    if (state.error === "generic") return dictionary.quoteForm.errors.generic;
    if (state.error === "validation_failed" && !state.fieldErrors) return dictionary.quoteForm.errors.generic;
    return undefined;
  }

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
      </div>
    );
  }

  function fieldError(field: string): string | undefined {
    if (state && !state.ok && state.fieldErrors?.[field]) {
      const code = state.fieldErrors[field];
      if (code === "invalid_phone") return dictionary.quoteForm.errors.invalidPhone;
      if (code === "consent_required") return dictionary.quoteForm.errors.consentRequired;
      return dictionary.quoteForm.errors.required;
    }
    return undefined;
  }

  return (
    <form action={formAction} className="rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft sm:p-8">
      <h2 className="text-lg font-bold text-navy">{dictionary.careers.formTitle}</h2>
      <input type="hidden" name="locale" value={locale} />

      {topLevelError() ? (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
        >
          {topLevelError()}
        </div>
      ) : null}

      <div aria-hidden className="absolute size-px overflow-hidden" style={{ clip: "rect(0 0 0 0)" }}>
        <label htmlFor="companyWebsite-career">Company website</label>
        <input id="companyWebsite-career" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="career-name" required>
            {dictionary.quoteForm.contact.nameLabel}
          </Label>
          <TextInput id="career-name" name="name" required minLength={2} />
          <FieldError>{fieldError("name")}</FieldError>
        </div>
        <div>
          <Label htmlFor="career-area" required>
            {dictionary.careers.fields.areaOfInterest}
          </Label>
          <TextInput id="career-area" name="areaOfInterest" required minLength={2} />
          <FieldError>{fieldError("areaOfInterest")}</FieldError>
        </div>
        <div>
          <Label htmlFor="career-phone" required>
            {dictionary.quoteForm.contact.phoneLabel}
          </Label>
          <TextInput id="career-phone" name="phone" type="tel" dir="ltr" placeholder={dictionary.quoteForm.contact.phonePlaceholder} required />
          <FieldError>{fieldError("phone")}</FieldError>
        </div>
        <div>
          <Label htmlFor="career-email" required>
            {dictionary.quoteForm.contact.emailLabel}
          </Label>
          <TextInput id="career-email" name="email" type="email" dir="ltr" required />
          <FieldError>{fieldError("email")}</FieldError>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="career-message">{dictionary.quoteForm.contact.messageLabel}</Label>
          <Textarea id="career-message" name="message" />
        </div>
      </div>

      <label className="mt-5 flex items-start gap-3 rounded-xl bg-sand p-4 text-sm text-navy">
        <input type="checkbox" name="consent" value="true" required className="mt-1 size-4 accent-orange" />
        {dictionary.quoteForm.contact.consentLabel}
      </label>
      <FieldError>{fieldError("consent")}</FieldError>

      <Button type="submit" className="mt-6" disabled={isPending}>
        {isPending ? dictionary.quoteForm.buttons.submitting : dictionary.quoteForm.buttons.submit}
      </Button>
    </form>
  );
}
