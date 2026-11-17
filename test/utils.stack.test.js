import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  MAX_STACK,
  MAX_TECH_LENGTH,
  TECH_PATTERN,
  parseStack,
  readStoredStack,
} from "../utils/stack.js";

// The panel validates the stack with a copy of these rules
// (client/src/utils/techStack.js): keep both sides in sync.
describe("client mirror", () => {
  const client = readFileSync(
    new URL("../client/src/utils/techStack.js", import.meta.url),
    "utf8",
  );

  it("uses the same limits and pattern as the server", () => {
    expect(client).toContain(`export const MAX_STACK = ${MAX_STACK};`);
    expect(client).toContain(`export const MAX_TECH_LENGTH = ${MAX_TECH_LENGTH};`);
    expect(client).toContain(
      `const TECH_PATTERN = /${TECH_PATTERN.source}/${TECH_PATTERN.flags};`,
    );
  });
});

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

  it("rejects the whole list when one entry is invalid", () => {
    for (const bad of ["<b>", "", 3, null, "x".repeat(MAX_TECH_LENGTH + 1)]) {
      expect(parseStack([bad, "Vue"])).toBeNull();
    }
    expect(parseStack(["x".repeat(MAX_TECH_LENGTH)])).toHaveLength(1);
  });

  it("rejects more than MAX_STACK technologies instead of truncating", () => {
    const tech = (count) => Array.from({ length: count }, (_, i) => `Tech${i}`);
    expect(parseStack(tech(MAX_STACK))).toHaveLength(MAX_STACK);
    expect(parseStack(tech(MAX_STACK + 1))).toBeNull();
  });

  it("counts the limit after deduplication", () => {
    const list = [...Array.from({ length: MAX_STACK }, (_, i) => `T${i}`), "t0"];
    expect(parseStack(list)).toHaveLength(MAX_STACK);
  });
});

describe("readStoredStack", () => {
  it("is tolerant of NULL, garbage and arrays", () => {
    expect(readStoredStack(null)).toEqual([]);
    expect(readStoredStack("garbage")).toEqual([]);
    expect(readStoredStack('["React"]')).toEqual(["React"]);
    expect(readStoredStack(["React"])).toEqual(["React"]);
  });

  it("drops bad entries and caps the list without failing", () => {
    expect(readStoredStack(["<b>", "Vue", "vue"])).toEqual(["Vue"]);
    const many = Array.from({ length: 30 }, (_, i) => `Tech${i}`);
    expect(readStoredStack(many)).toHaveLength(MAX_STACK);
  });
});
