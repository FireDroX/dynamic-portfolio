import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { resolvedLanguage: "en" } }),
}));

const seo = vi.fn();
vi.mock("../components/Seo", () => ({
  default: (props) => {
    seo(props);
    return null;
  },
}));
vi.mock("../components/ProjectLivePreview", () => ({ default: () => null }));

import ProjectDetail from "./ProjectDetail";

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/projects/demo"]}>
      <Routes>
        <Route path="/projects/:project" element={<ProjectDetail />} />
      </Routes>
    </MemoryRouter>,
  );

afterEach(() => {
  cleanup();
  seo.mockReset();
  vi.unstubAllGlobals();
});

describe("ProjectDetail", () => {
  it("shows the not-found state, kept out of the index, on a 404", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false, status: 404 })));
    renderPage();
    expect(await screen.findByText("project.notFoundTitle")).toBeTruthy();
    expect(seo).toHaveBeenCalledWith(expect.objectContaining({ noIndex: true }));
  });

  it("shows a load error, not the not-found state, on a server error", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false, status: 500 })));
    renderPage();
    expect(await screen.findByText("project.loadErrorTitle")).toBeTruthy();
    expect(screen.queryByText("project.notFoundTitle")).toBeNull();
  });

  it("shows a load error on a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("offline"))));
    renderPage();
    expect(await screen.findByText("project.loadErrorTitle")).toBeTruthy();
  });
});
