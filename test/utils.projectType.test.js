import { describe, it, expect } from "vitest";
import {
  PROJECT_TYPES,
  parseProjectType,
  readStoredType,
} from "../utils/projectType.js";

describe("parseProjectType", () => {
  it("returns undefined when the field is absent", () => {
    expect(parseProjectType(undefined)).toBeUndefined();
  });

  it("returns an empty string to clear the type", () => {
    expect(parseProjectType("")).toBe("");
    expect(parseProjectType("   ")).toBe("");
  });

  it("accepts every known type, trimmed", () => {
    for (const id of PROJECT_TYPES) {
      expect(parseProjectType(id)).toBe(id);
      expect(parseProjectType(` ${id} `)).toBe(id);
    }
  });

  it("rejects unknown values, other casings and non-strings", () => {
    expect(parseProjectType("podcast")).toBeNull();
    expect(parseProjectType("GAME")).toBeNull();
    expect(parseProjectType(null)).toBeNull();
    expect(parseProjectType(1)).toBeNull();
    expect(parseProjectType(["game"])).toBeNull();
  });
});

describe("readStoredType", () => {
  it("returns a known type", () => {
    expect(readStoredType("tool")).toBe("tool");
  });

  it("returns null for NULL or unknown values", () => {
    expect(readStoredType(null)).toBeNull();
    expect(readStoredType(undefined)).toBeNull();
    expect(readStoredType("garbage")).toBeNull();
  });
});
