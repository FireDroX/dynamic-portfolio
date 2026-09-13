import { describe, it, expect } from "vitest";
import getProjectDescription from "./projectDescription";

describe("getProjectDescription", () => {
  it("returns the French description for a French-ish language tag", () => {
    const project = { descriptionFr: "Bonjour", descriptionEn: "Hello" };

    expect(getProjectDescription(project, "fr")).toBe("Bonjour");
  });

  it("returns the English description for an English language tag", () => {
    const project = { descriptionFr: "Bonjour", descriptionEn: "Hello" };

    expect(getProjectDescription(project, "en-US")).toBe("Hello");
  });

  it("falls back to the other language when the primary one is missing", () => {
    const project = { descriptionEn: "Hello" };

    expect(getProjectDescription(project, "fr")).toBe("Hello");
  });

  it("returns an empty string when the project has no description", () => {
    expect(getProjectDescription({}, "fr")).toBe("");
    expect(getProjectDescription(null, "fr")).toBe("");
  });
});
