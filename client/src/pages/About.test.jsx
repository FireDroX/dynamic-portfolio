import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import fr from "../locales/fr.json";
import en from "../locales/en.json";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { resolvedLanguage: "fr" } }),
}));
vi.mock("../components/PortfolioDiagram", () => ({ default: () => null }));
vi.mock("../components/CvButton", () => ({ default: () => null }));

import About from "./About";

afterEach(cleanup);

const STEPS = ["bac", "but", "esgi", "internship", "work"];

describe("About path", () => {
  it("renders the five steps in order", () => {
    const { container } = render(
      <MemoryRouter>
        <About />
      </MemoryRouter>,
    );
    const items = [...container.querySelectorAll(".about-path > li")];
    expect(items).toHaveLength(5);
    expect(
      items.map((li) => li.querySelector(".about-path__title").textContent),
    ).toEqual(STEPS.map((id) => `about.path.${id}.title`));
    items.forEach((li, i) => {
      const meta = li.querySelector(".about-path__meta").textContent;
      expect(meta).toContain(`about.path.${STEPS[i]}.place`);
      expect(meta).toContain(`about.path.${STEPS[i]}.period`);
    });
  });

  it("marks only the internship as experience", () => {
    const { container } = render(
      <MemoryRouter>
        <About />
      </MemoryRouter>,
    );
    const experience = container.querySelectorAll(
      ".about-path__step--experience",
    );
    expect(experience).toHaveLength(1);
    expect(experience[0].textContent).toContain("about.path.internship.title");
  });

  it.each([
    ["fr", fr],
    ["en", en],
  ])("defines every step in %s.json", (_, locale) => {
    for (const id of STEPS) {
      for (const key of ["title", "place", "period", "text"]) {
        expect(locale.about.path[id][key]).toBeTruthy();
      }
    }
    expect(locale.about.path.internship.stack).toBeTruthy();
  });
});
