import { describe, it, expect } from "vitest";
import formatProjectDate, { getDateLocale } from "./formatProjectDate";

describe("formatProjectDate", () => {
  it("maps the site language to a date locale", () => {
    expect(getDateLocale("en")).toBe("en-GB");
    expect(getDateLocale("fr")).toBe("fr-FR");
    expect(getDateLocale(undefined)).toBe("fr-FR");
  });

  it("formats a short date without the abbreviation dot", () => {
    expect(formatProjectDate("2025-01-05", "fr")).toBe("05 janv 2025");
    expect(formatProjectDate("2025-01-05", "en")).toBe("05 Jan 2025");
  });

  it("formats a long date on request", () => {
    expect(formatProjectDate("2025-01-05", "fr", { month: "long" })).toBe(
      "05 janvier 2025",
    );
  });

  it("returns null for a missing or invalid date", () => {
    expect(formatProjectDate(undefined, "fr")).toBeNull();
    expect(formatProjectDate(null, "fr")).toBeNull();
    expect(formatProjectDate("nope", "en")).toBeNull();
  });
});
