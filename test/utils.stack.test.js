import { describe, it, expect } from "vitest";
import {
  MAX_STACK,
  MAX_TECH_LENGTH,
  parseStack,
  readStoredStack,
} from "../utils/stack.js";

describe("parseStack", () => {
  it("parses arrays and JSON strings", () => {
    expect(parseStack('["React", "Node.js"]')).toEqual(["React", "Node.js"]);
    expect(parseStack(["C#", "C++", "VS Code"])).toEqual(["C#", "C++", "VS Code"]);
  });

  it("treats an empty field as an empty stack", () => {
    expect(parseStack("")).toEqual([]);
    expect(parseStack("  ")).toEqual([]);
    expect(parseStack("[]")).toEqual([]);
  });

  it("returns null for invalid JSON or non-lists", () => {
    expect(parseStack("[oops")).toBeNull();
    expect(parseStack('{"a":1}')).toBeNull();
    expect(parseStack(42)).toBeNull();
    expect(parseStack(undefined)).toBeNull();
  });

  it("trims and collapses whitespace", () => {
    expect(parseStack(["  VS   Code "])).toEqual(["VS Code"]);
  });

  it("dedupes case-insensitively keeping the first spelling", () => {
    expect(parseStack(["React", "react", "REACT"])).toEqual(["React"]);
  });

  it("drops invalid, non-string and too long entries", () => {
    expect(
      parseStack(["<b>", "", 3, null, "x".repeat(MAX_TECH_LENGTH + 1), "Vue"]),
    ).toEqual(["Vue"]);
    expect(parseStack(["x".repeat(MAX_TECH_LENGTH)])).toHaveLength(1);
  });

  it("caps the list", () => {
    const many = Array.from({ length: 30 }, (_, i) => `Tech${i}`);
    expect(parseStack(many)).toHaveLength(MAX_STACK);
  });
});

describe("readStoredStack", () => {
  it("is tolerant of NULL, garbage and arrays", () => {
    expect(readStoredStack(null)).toEqual([]);
    expect(readStoredStack("garbage")).toEqual([]);
    expect(readStoredStack('["React"]')).toEqual(["React"]);
    expect(readStoredStack(["React"])).toEqual(["React"]);
  });
});
