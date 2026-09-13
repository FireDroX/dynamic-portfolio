import { describe, it, expect } from "vitest";
import { parseImageDataUrl } from "../utils/images.js";

const MINIMAL_PNG_HEX = "89504e470d0a1a0a" + "0000000049454e44ae426082";
const MINIMAL_JPEG_HEX = "ffd8ffd9";

const toDataUrl = (mimeType, hex) =>
  `data:${mimeType};base64,${Buffer.from(hex, "hex").toString("base64")}`;

describe("parseImageDataUrl", () => {
  it("accepts a minimal complete PNG", () => {
    const result = parseImageDataUrl(toDataUrl("image/png", MINIMAL_PNG_HEX));

    expect(result).not.toBeNull();
    expect(result.mimeType).toBe("image/png");
    expect(result.buffer).toEqual(Buffer.from(MINIMAL_PNG_HEX, "hex"));
  });

  it("accepts a minimal complete JPEG", () => {
    const result = parseImageDataUrl(
      toDataUrl("image/jpeg", MINIMAL_JPEG_HEX),
    );

    expect(result).not.toBeNull();
    expect(result.mimeType).toBe("image/jpeg");
  });

  it("rejects a truncated PNG (missing IEND chunk)", () => {
    const result = parseImageDataUrl(toDataUrl("image/png", "89504e470d0a1a0a"));

    expect(result).toBeNull();
  });

  it("rejects a value that is not a data URL", () => {
    expect(parseImageDataUrl("not-a-data-url")).toBeNull();
    expect(parseImageDataUrl(null)).toBeNull();
    expect(parseImageDataUrl(undefined)).toBeNull();
  });

  it("rejects a data URL with a non-image mime type", () => {
    const encoded = Buffer.from(MINIMAL_PNG_HEX, "hex").toString("base64");
    expect(parseImageDataUrl(`data:text/plain;base64,${encoded}`)).toBeNull();
  });

  it("rejects invalid base64 content", () => {
    expect(parseImageDataUrl("data:image/png;base64,not_base64!!")).toBeNull();
  });
});
