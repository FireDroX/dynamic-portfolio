import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) => (options?.name ? `${key}:${options.name}` : key),
    i18n: { resolvedLanguage: "fr" },
  }),
}));

const fetchAllProjects = vi.hoisted(() => vi.fn());
vi.mock("../utils/projectsApi", () => ({ fetchAllProjects }));

import HomeProjectTerminal from "./HomeProjectTerminal";

afterEach(() => {
  cleanup();
  fetchAllProjects.mockReset();
});

const Location = () => <p data-testid="location">{useLocation().pathname}</p>;

const renderTerminal = async () => {
  fetchAllProjects.mockResolvedValue([
    { name: "Pokeflip", fileName: "pokeflip", createdAt: "2025-01-02" },
    { name: "NestWiki", fileName: "nestwiki", createdAt: "2025-03-04" },
  ]);
  render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<HomeProjectTerminal />} />
        <Route path="*" element={<Location />} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findByRole("link", { name: /nestwiki/i });
  return screen.getByRole("textbox");
};

const type = (input, value) => fireEvent.change(input, { target: { value } });

describe("HomeProjectTerminal", () => {
  it("lists the projects as links to their page, sorted by slug", async () => {
    await renderTerminal();
    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/projects/nestwiki",
      "/projects/pokeflip",
    ]);
  });

  it("completes the typed prefix with Tab", async () => {
    const input = await renderTerminal();
    type(input, "poke");
    fireEvent.keyDown(input, { key: "Tab" });
    expect(input.value).toBe("pokeflip");
  });

  it("opens the project when Enter validates an exact name", async () => {
    const input = await renderTerminal();
    type(input, "nestwiki");
    fireEvent.submit(input.closest("form"));
    expect((await screen.findByTestId("location")).textContent).toBe(
      "/projects/nestwiki",
    );
  });

  it("shows an alert for an unknown project", async () => {
    const input = await renderTerminal();
    type(input, "nope");
    fireEvent.submit(input.closest("form"));
    expect((await screen.findByRole("alert")).textContent).toContain("nope");
  });
});
