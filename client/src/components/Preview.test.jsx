import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

import Preview from "./Preview";

afterEach(cleanup);

const project = {
  name: "NestWiki",
  descriptionKey: "featured.nestwiki",
  stack: ["NestJS", "React"],
  fileName: "nestwiki",
  image: "preview4",
};

const renderPreview = () =>
  render(
    <MemoryRouter>
      <Preview project={project} />
    </MemoryRouter>,
  );

describe("Preview", () => {
  it("links the whole card to the project page", () => {
    renderPreview();
    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "/projects/nestwiki",
    );
  });

  it("shows the name, the stack and the playable badge", () => {
    renderPreview();
    expect(screen.getByRole("heading", { name: "NestWiki" })).toBeTruthy();
    expect(screen.getByText("NestJS")).toBeTruthy();
    expect(screen.getByText("preview.playable")).toBeTruthy();
  });

  it("shows a logo next to each technology of the catalog", () => {
    const { container } = renderPreview();
    const pills = container.querySelectorAll(".preview__stack .tech-pill");
    expect(pills).toHaveLength(2);
    pills.forEach((pill) =>
      expect(pill.querySelector("svg.tech-pill__icon")).toBeTruthy(),
    );
  });

  it("has no caption under the thumbnail", () => {
    const { container } = renderPreview();
    expect(container.querySelector("figcaption")).toBeNull();
    expect(container.querySelector("img").getAttribute("alt")).toBe("");
  });
});
