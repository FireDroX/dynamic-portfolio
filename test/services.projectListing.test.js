import { describe, it, expect, vi } from "vitest";
import {
  MAX_PAGE_SIZE,
  buildProjectFilters,
  listPublishedProjects,
  parseProjectListQuery,
} from "../services/projectListing.js";

describe("parseProjectListQuery", () => {
  it("defaults to the first page of 10 projects", () => {
    expect(parseProjectListQuery({})).toEqual({
      page: 1,
      size: 10,
      year: null,
      search: "",
    });
  });

  it("reads page, size, year and search", () => {
    expect(
      parseProjectListQuery({ page: "3", size: "5", year: "2025", q: " poke " }),
    ).toEqual({ page: 3, size: 5, year: 2025, search: "poke" });
  });

  it("falls back on invalid values and caps the page size", () => {
    expect(
      parseProjectListQuery({ page: "-2", size: "1.5", year: "25", q: ["a"] }),
    ).toEqual({ page: 1, size: 10, year: null, search: "" });
    expect(parseProjectListQuery({ size: "5000" }).size).toBe(MAX_PAGE_SIZE);
  });
});

describe("buildProjectFilters", () => {
  it("always restricts to published projects", () => {
    expect(buildProjectFilters({ year: null, search: "" })).toEqual({
      where: "published = 1",
      params: [],
    });
  });

  it("escapes LIKE wildcards in the search", () => {
    const { where, params } = buildProjectFilters({
      year: 2024,
      search: "100%_ok",
    });
    expect(where).toContain("YEAR(createdAt) = ?");
    expect(params[0]).toBe(2024);
    expect(params.slice(1)).toEqual(Array(4).fill("%100\\%\\_ok%"));
  });
});

describe("listPublishedProjects", () => {
  it("returns the page with total, size, page count and year facets", async () => {
    const pool = {
      query: vi
        .fn()
        .mockResolvedValueOnce([[{ total: 23 }]])
        .mockResolvedValueOnce([[{ fileName: "a" }, { fileName: "b" }]])
        .mockResolvedValueOnce([
          [
            { year: 2026, count: 20 },
            { year: 2025, count: 3 },
          ],
        ]),
    };

    const result = await listPublishedProjects(pool, { page: "3", size: "10" });

    expect(result).toEqual({
      items: [{ fileName: "a" }, { fileName: "b" }],
      page: 3,
      size: 10,
      total: 23,
      totalPages: 3,
      years: [
        { year: 2026, count: 20 },
        { year: 2025, count: 3 },
      ],
    });
    const [sql, params] = pool.query.mock.calls[1];
    expect(sql).toContain("LIMIT ? OFFSET ?");
    expect(params).toEqual([10, 20]);
  });
});
