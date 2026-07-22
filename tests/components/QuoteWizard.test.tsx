import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { getDictionary } from "@/i18n/dictionaries";
import type { Solution } from "@/data/solutions";
import type { Sector } from "@/data/sectors";

// The wizard imports the real server action, which pulls in the Payload
// Local API (@payload-config) — not resolvable/needed in a jsdom unit test.
// These tests only exercise client-side DOM/submit behavior.
vi.mock("@/app/actions", () => ({
  submitQuoteRequest: async () => ({ ok: false, error: "not_called_in_test" }),
}));

const { QuoteWizard } = await import("@/components/forms/QuoteWizard");

// The wizard now receives solutions/sectors as props (fetched from Payload
// by its parent page) instead of importing the static data files directly.
// This is a minimal fixture, not real CMS data.
const testSolutions: Solution[] = [
  { slug: "pest-control", icon: "bug", title: { ar: "مكافحة الآفات", en: "Pest Control" }, summary: { ar: "", en: "" }, heroOutcome: { ar: "", en: "" }, problem: { ar: "", en: "" }, scope: [], sectors: [], methodology: { ar: "", en: "" }, quality: { ar: "", en: "" }, faqs: [], featured: false },
  { slug: "home-care", icon: "home", title: { ar: "العناية المنزلية", en: "Home Care" }, summary: { ar: "", en: "" }, heroOutcome: { ar: "", en: "" }, problem: { ar: "", en: "" }, scope: [], sectors: [], methodology: { ar: "", en: "" }, quality: { ar: "", en: "" }, faqs: [], featured: false },
];
const testSectors: Sector[] = [
  { slug: "commercial-admin", icon: "office", title: { ar: "التجاري والإداري", en: "Commercial & Office" }, description: { ar: "", en: "" }, relevantSolutions: [] },
];

describe("QuoteWizard", () => {
  // Regression test: the Next (type=button) and Submit (type=submit)
  // buttons occupy the same JSX position via a ternary. Without a distinct
  // `key` on each branch, React reuses/mutates the same DOM <button> in
  // place when advancing from step 2 to step 3, flipping its type from
  // "button" to "submit" mid-click. In real browsers this caused that same
  // click to also fire a native form submission (see the double-lead bug
  // in actions.ts history: one POST with real data but no consent, followed
  // by a second POST after React's post-action form reset wiped the
  // fields). The fix gives each branch a distinct `key` so React unmounts
  // the old button and mounts a fresh one instead of mutating it in place —
  // which this test verifies directly via DOM node identity.
  it("mounts a distinct DOM node for the submit button instead of mutating the next button in place", () => {
    const dictionary = getDictionary("ar");
    render(<QuoteWizard locale="ar" dictionary={dictionary} initialService="pest-control" solutions={testSolutions} sectors={testSectors} />);

    // Step 0 (client type) -> step 1 (service)
    fireEvent.click(screen.getByText(dictionary.quoteForm.buttons.next));
    // Step 1 (service) -> step 2 (contact)
    fireEvent.click(screen.getByText(dictionary.quoteForm.buttons.next));
    const nextButtonBeforeTransition = screen.getByText(dictionary.quoteForm.buttons.next);

    // Step 2 (contact) -> step 3 (review) — the transition where Next
    // becomes Submit.
    fireEvent.click(nextButtonBeforeTransition);
    const submitButton = screen.getByText(dictionary.quoteForm.buttons.submit);

    expect(submitButton).not.toBe(nextButtonBeforeTransition);
    expect(submitButton.getAttribute("type")).toBe("submit");
    expect(screen.getByText(dictionary.quoteForm.review.title)).toBeVisible();
  });

  it("pre-fills the service step when initialService is provided", () => {
    const { container } = render(
      <QuoteWizard locale="ar" dictionary={getDictionary("ar")} initialService="pest-control" solutions={testSolutions} sectors={testSectors} />
    );
    const select = container.querySelector<HTMLSelectElement>("#service-select");
    expect(select?.value).toBe("pest-control");
  });

  it("defaults the client type to home when the initial service is home-care", () => {
    render(<QuoteWizard locale="ar" dictionary={getDictionary("ar")} initialService="home-care" solutions={testSolutions} sectors={testSectors} />);
    const homeOption = screen.getByText(getDictionary("ar").quoteForm.clientType.home).closest("button");
    expect(homeOption?.className).toContain("border-orange");
  });

  it("shows the client-type step first when no initial service is given", () => {
    render(<QuoteWizard locale="en" dictionary={getDictionary("en")} solutions={testSolutions} sectors={testSectors} />);
    expect(screen.getByText(getDictionary("en").quoteForm.clientType.title)).toBeVisible();
  });
});
