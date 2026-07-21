import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

describe("WhatsAppButton", () => {
  it("renders nothing when no number is configured", () => {
    const { container } = render(<WhatsAppButton number={null} label="WhatsApp" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a wa.me link when a number is configured", () => {
    render(<WhatsAppButton number="+966500000000" label="WhatsApp" />);
    const link = screen.getByRole("link", { name: "WhatsApp" });
    expect(link.getAttribute("href")).toContain("wa.me/966500000000");
  });
});
