import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

vi.mock("next/navigation", () => ({
  usePathname: () => "/ar/solutions/facility-management",
}));

describe("LanguageSwitcher", () => {
  it("swaps the locale segment while preserving the rest of the path", () => {
    render(<LanguageSwitcher locale="ar" label="English" />);
    const link = screen.getByRole("link", { name: "English" });
    expect(link).toHaveAttribute("href", "/en/solutions/facility-management");
    expect(link).toHaveAttribute("lang", "en");
  });
});
