import { describe, it, expect } from "vitest";
import { CV_URLS, getCvUrl } from "./cv";

describe("getCvUrl", () => {
  it("returns the French CV for fr", () => {
    expect(getCvUrl("fr")).toBe(CV_URLS.fr);
  });

  it("returns the English CV for en and regional variants", () => {
    expect(getCvUrl("en")).toBe(CV_URLS.en);
    expect(getCvUrl("en-GB")).toBe(CV_URLS.en);
  });

  it("falls back to the French CV without a language", () => {
    expect(getCvUrl(undefined)).toBe(CV_URLS.fr);
  });
});
