import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));
vi.mock("../components/Seo", () => ({ default: () => null }));

import NotFound from "./NotFound";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>,
  );

describe("NotFound", () => {
  it("echoes the requested path in the terminal", () => {
    const { container } = renderAt("/une-page-qui-n-existe-pas");
    const lines = [...container.querySelectorAll(".notfound__line")].map(
      (line) => line.textContent,
    );
    expect(lines).toContain("command not found: /une-page-qui-n-existe-pas");
    expect(container.querySelector("h1")).toBeTruthy();
  });

  it("dispatches the lost-page event once", () => {
    const spy = vi.spyOn(window, "dispatchEvent");
    renderAt("/nope");
    const events = spy.mock.calls
      .map(([event]) => event)
      .filter((event) => event.type === "portfolio:lost-page");
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(CustomEvent);
  });
});
