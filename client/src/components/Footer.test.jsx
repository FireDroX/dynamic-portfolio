import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

const mockCredits = vi.hoisted(() => []);
vi.mock("../utils/credits", () => ({ default: mockCredits }));

import Footer from "./Footer";

afterEach(() => {
  cleanup();
  mockCredits.length = 0;
});

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );

describe("Footer", () => {
  it("omits the credits line when there are no credits", () => {
    const { container } = renderFooter();
    expect(container.querySelector(".credits")).toBeNull();
    expect(screen.queryByText(/footer.credits/)).toBeNull();
  });

  it("renders the credits line, linking entries that have an href", () => {
    mockCredits.push(
      { label: "Jane Doe", href: "https://example.com/jane" },
      { label: "John Roe" },
    );
    const { container } = renderFooter();
    expect(container.querySelector(".credits")).not.toBeNull();
    expect(screen.getByText(/footer.credits/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Jane Doe" }).getAttribute("href")).toBe(
      "https://example.com/jane",
    );
    expect(screen.queryByRole("link", { name: "John Roe" })).toBeNull();
    expect(container.querySelector(".credits").textContent).toContain("John Roe");
  });
});
