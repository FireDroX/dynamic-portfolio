import { describe, it, expect } from "vitest";
import {
  PREVIEW_TOKEN_TTL_MS,
  createPreviewToken,
  getPreviewUrl,
  verifyPreviewToken,
} from "../utils/previewToken.js";

const options = { now: 1_000_000, secret: "test-secret" };

describe("preview tokens", () => {
  it("accepts a fresh token for the same project", () => {
    const token = createPreviewToken("pokedex", options);
    expect(verifyPreviewToken(token, "pokedex", options)).toBe(true);
  });

  it("rejects another project, another secret, a tampered or expired token", () => {
    const token = createPreviewToken("pokedex", options);
    expect(verifyPreviewToken(token, "lff", options)).toBe(false);
    expect(
      verifyPreviewToken(token, "pokedex", { ...options, secret: "other" }),
    ).toBe(false);
    expect(verifyPreviewToken(`${token}x`, "pokedex", options)).toBe(false);
    expect(verifyPreviewToken("garbage", "pokedex", options)).toBe(false);
    expect(
      verifyPreviewToken(token, "pokedex", {
        ...options,
        now: options.now + PREVIEW_TOKEN_TTL_MS + 1,
      }),
    ).toBe(false);
  });

  it("builds a preview URL ending with a slash for relative assets", () => {
    expect(getPreviewUrl("pokedex", options)).toMatch(
      /^\/api\/panel\/preview\/[^/]+\/pokedex\/$/,
    );
  });
});
