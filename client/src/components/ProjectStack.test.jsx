import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { resolvedLanguage: "en" },
  }),
}));

import Project from "./Project";
import ProjectHero from "./ProjectHero";

afterEach(cleanup);

const base = {
  name: "Demo",
  fileName: "demo",
  createdAt: "2025-01-02T00:00:00.000Z",
  hasImage: false,
};

const inRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Project card", () => {
  it("shows the stack", () => {
    inRouter(<Project p={{ ...base, stack: ["React", "Brainfuck"] }} />);
    expect(screen.getByRole("list", { name: "stack.label" })).toBeTruthy();
    expect(screen.getByText("Brainfuck")).toBeTruthy();
  });

  it("shows no list without a stack", () => {
    inRouter(<Project p={base} />);
    expect(screen.queryByRole("list")).toBeNull();
  });
});

describe("ProjectHero", () => {
  it("shows the stack", () => {
    inRouter(
      <ProjectHero project={{ ...base, stack: ["Node.js"] }} formattedDate="" />,
    );
    expect(screen.getByRole("list", { name: "stack.label" })).toBeTruthy();
  });

  it("shows no list without a stack", () => {
    inRouter(<ProjectHero project={base} formattedDate="" />);
    expect(screen.queryByRole("list")).toBeNull();
  });
});

describe("project type", () => {
  it("shows the translated type on the card", () => {
    const { container } = inRouter(<Project p={{ ...base, type: "game" }} />);
    expect(container.querySelector(".project-card__type").textContent).toBe(
      "projectTypes.game",
    );
  });

  it("shows no type on the card when missing or unknown", () => {
    for (const type of [null, undefined, "podcast"]) {
      const { container } = inRouter(<Project p={{ ...base, type }} />);
      expect(container.querySelector(".project-card__type")).toBeNull();
      cleanup();
    }
  });

  it("shows the type in the hero facts only when set", () => {
    inRouter(
      <ProjectHero project={{ ...base, type: "tool" }} formattedDate="" />,
    );
    expect(screen.getByText(/^projectTypes\.tool · /)).toBeTruthy();
    cleanup();
    const { container } = inRouter(
      <ProjectHero project={base} formattedDate="" />,
    );
    expect(container.querySelector(".project-hero__facts").textContent).toBe(
      "project.interactive",
    );
  });
});
