import { describe, it, expect } from "vitest";
import { getPageItems } from "./pagination";

describe("getPageItems", () => {
  it("shows nothing for a single page", () => {
    expect(getPageItems(1, 0)).toEqual([]);
    expect(getPageItems(1, 1)).toEqual([]);
  });

  it("lists every page when there are few", () => {
    expect(getPageItems(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("collapses distant pages into gaps", () => {
    expect(getPageItems(6, 12)).toEqual([1, "gap-5", 5, 6, 7, "gap-12", 12]);
  });

  it("fills a single missing page instead of a gap", () => {
    expect(getPageItems(4, 12)).toEqual([1, 2, 3, 4, 5, "gap-12", 12]);
  });
});
