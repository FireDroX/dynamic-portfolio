import { describe, it, expect, afterEach, vi } from "vitest";
import { fetchAllProjects, fetchProjectsPage } from "./projectsApi";

const json = (body) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

afterEach(() => vi.unstubAllGlobals());

describe("projectsApi", () => {
  it("sends the page, size and active filters", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json({ items: [] })));

    await fetchProjectsPage({ page: 2, year: 2025, q: "poke" });

    expect(fetch.mock.calls[0][0]).toBe(
      "/api/projects?page=2&size=10&year=2025&q=poke",
    );
  });

  it("walks every page to collect all projects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url) => {
        const page = Number(new URL(url, "http://x").searchParams.get("page"));
        return json({ items: [{ fileName: `p${page}` }], totalPages: 3 });
      }),
    );

    const projects = await fetchAllProjects();

    expect(projects.map((project) => project.fileName)).toEqual([
      "p1",
      "p2",
      "p3",
    ]);
  });
});
