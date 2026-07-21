import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { QuoteWizard } from "@/components/forms/QuoteWizard";
import { getDictionary } from "@/i18n/dictionaries";

describe("QuoteWizard", () => {
  it("pre-fills the service step when initialService is provided", () => {
    const { container } = render(
      <QuoteWizard locale="ar" dictionary={getDictionary("ar")} initialService="pest-control" />
    );
    const select = container.querySelector<HTMLSelectElement>("#service-select");
    expect(select?.value).toBe("pest-control");
  });

  it("defaults the client type to home when the initial service is home-care", () => {
    render(<QuoteWizard locale="ar" dictionary={getDictionary("ar")} initialService="home-care" />);
    const homeOption = screen.getByText(getDictionary("ar").quoteForm.clientType.home).closest("button");
    expect(homeOption?.className).toContain("border-orange");
  });

  it("shows the client-type step first when no initial service is given", () => {
    render(<QuoteWizard locale="en" dictionary={getDictionary("en")} />);
    expect(screen.getByText(getDictionary("en").quoteForm.clientType.title)).toBeVisible();
  });
});
