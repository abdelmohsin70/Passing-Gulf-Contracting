import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/primitives/Button";

describe("Button", () => {
  it("renders an internal link with the given href when used as a CTA", () => {
    render(<Button href="/ar/contact">اطلب معاينة وعرضًا</Button>);
    const link = screen.getByRole("link", { name: "اطلب معاينة وعرضًا" });
    expect(link).toHaveAttribute("href", "/ar/contact");
  });

  it("renders a native button when no href is provided", () => {
    render(<Button>Submit</Button>);
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toHaveAttribute("type", "button");
  });

  it("renders an external anchor for tel: links", () => {
    render(<Button href="tel:+966500000000">Call</Button>);
    const link = screen.getByRole("link", { name: "Call" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "tel:+966500000000");
  });
});
