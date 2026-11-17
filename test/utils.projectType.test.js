import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  PROJECT_TYPES,
  PROJECT_TYPE_LABELS,
  findMatchingTypes,
  parseProjectType,
  readStoredType,
} from "../utils/projectType.js";

const readLocale = (lang) =>
  JSON.parse(
    readFileSync(
      new URL(`../client/src/locales/${lang}.json`, import.meta.url),
      "utf8",
    ),
  );

describe("findMatchingTypes", () => {
  it("matches ids and displayed labels, case-insensitively", () => {
    expect(findMatchingTypes("JEU")).toEqual(["game"]);
    expect(findMatchingTypes("game")).toEqual(["game"]);
    expect(findMatchingTypes("outil")).toEqual(["tool"]);
    expect(findMatchingTypes("application")).toEqual(["webapp"]);
  });

  it("returns nothing for an empty or unrelated search", () => {
    expect(findMatchingTypes("")).toEqual([]);
    expect(findMatchingTypes("docker")).toEqual([]);
  });

  it("knows the labels the site displays", () => {
    const fr = readLocale("fr").projectTypes;
    const en = readLocale("en").projectTypes;
    expect(Object.keys(PROJECT_TYPE_LABELS)).toEqual([...PROJECT_TYPES]);
    for (const type of PROJECT_TYPES) {
      expect(PROJECT_TYPE_LABELS[type]).toEqual([fr[type], en[type]]);
    }
  });
});

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
