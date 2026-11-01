import { describe, it, expect } from "vitest";
import {
  MAX_CONTRIBUTORS,
  isGithubLogin,
  parseContributors,
  readStoredContributors,
} from "../utils/contributors.js";

describe("parseContributors", () => {
  it("parses the JSON list sent by the panel and strips the @", () => {
    expect(parseContributors('["@FireDroX", "octo-cat"]')).toEqual([
      "FireDroX",
      "octo-cat",
    ]);
  });

  it("treats an empty field as no contributors", () => {
    expect(parseContributors("")).toEqual([]);
    expect(parseContributors("[]")).toEqual([]);
  });

  it("drops invalid logins and case-insensitive duplicates", () => {
    expect(
      parseContributors([
        "FireDroX",
        "firedrox",
        "-bad",
        "bad-",
        "dou--ble",
        "a".repeat(40),
        "<script>",
        42,
      ]),
    ).toEqual(["FireDroX"]);
  });

  it("caps the list", () => {
    const logins = Array.from({ length: 30 }, (_, index) => `user${index}`);
    expect(parseContributors(logins)).toHaveLength(MAX_CONTRIBUTORS);
  });

  it("returns null for anything that is not a list", () => {
    expect(parseContributors("not json")).toBeNull();
    expect(parseContributors('{"login":"x"}')).toBeNull();
  });
});

describe("readStoredContributors", () => {
  it("reads the stored column and tolerates NULL or garbage", () => {
    expect(readStoredContributors('["FireDroX"]')).toEqual(["FireDroX"]);
    expect(readStoredContributors(null)).toEqual([]);
    expect(readStoredContributors(undefined)).toEqual([]);
    expect(readStoredContributors("{oops")).toEqual([]);
  });
});

describe("isGithubLogin", () => {
  it("accepts a login with or without @", () => {
    expect(isGithubLogin("@Claude")).toBe(true);
    expect(isGithubLogin("with space")).toBe(false);
  });
});
