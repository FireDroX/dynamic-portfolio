import { describe, it, expect, beforeEach } from "vitest";
import {
  readJson,
  writeJson,
  readArray,
  readObject,
  readNumber,
  writeNumber,
} from "./storage";

beforeEach(() => {
  localStorage.clear();
});

describe("readJson / writeJson", () => {
  it("round-trips a JSON value", () => {
    writeJson("key", { a: 1 });

    expect(readJson("key", null)).toEqual({ a: 1 });
  });

  it("returns the fallback when the key is missing", () => {
    expect(readJson("missing", "fallback")).toBe("fallback");
  });

  it("returns the fallback when the stored value is not valid JSON", () => {
    localStorage.setItem("key", "{not json");

    expect(readJson("key", "fallback")).toBe("fallback");
  });
});

describe("readArray", () => {
  it("returns the stored array", () => {
    writeJson("key", [1, 2, 3]);

    expect(readArray("key")).toEqual([1, 2, 3]);
  });

  it("returns an empty array when the stored value is not an array", () => {
    writeJson("key", { a: 1 });

    expect(readArray("key")).toEqual([]);
  });
});

describe("readObject", () => {
  it("returns the stored object", () => {
    writeJson("key", { a: 1 });

    expect(readObject("key")).toEqual({ a: 1 });
  });

  it("returns an empty object when the stored value is an array or missing", () => {
    writeJson("key", [1, 2, 3]);

    expect(readObject("key")).toEqual({});
    expect(readObject("missing")).toEqual({});
  });
});

describe("readNumber / writeNumber", () => {
  it("round-trips a number", () => {
    writeNumber("key", 42);

    expect(readNumber("key")).toBe(42);
  });

  it("returns the fallback when the stored value is not a finite number", () => {
    localStorage.setItem("key", "not-a-number");

    expect(readNumber("key", 7)).toBe(7);
  });
});
