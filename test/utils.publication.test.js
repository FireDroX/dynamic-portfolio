import { describe, it, expect } from "vitest";
import { parsePublished } from "../utils/publication.js";

describe("parsePublished", () => {
  it("maps the form values to 1/0", () => {
    expect(parsePublished("1")).toBe(1);
    expect(parsePublished("true")).toBe(1);
    expect(parsePublished("0")).toBe(0);
    expect(parsePublished("false")).toBe(0);
  });

  it("keeps an absent field undefined and flags invalid values", () => {
    expect(parsePublished(undefined)).toBeUndefined();
    expect(parsePublished("maybe")).toBeNull();
    expect(parsePublished("")).toBeNull();
  });
});
