import { describe, it, expect } from "vitest";
import { getSiteUrl, SITE_URL } from "../config.js";

const makeReq = (headers, protocol = "https") => ({
  protocol,
  get(name) {
    return headers[name.toLowerCase()];
  },
});

describe("getSiteUrl", () => {
  it("falls back to SITE_URL for an unrecognized host", () => {
    const req = makeReq({ host: "evil.example.com" });

    expect(getSiteUrl(req)).toBe(SITE_URL);
  });

  it("returns https for an allowed non-local hostname", () => {
    const req = makeReq({ host: "portfolio.addrien.fr" }, "http");

    expect(getSiteUrl(req)).toBe("https://portfolio.addrien.fr");
  });

  it("keeps http and the port for localhost", () => {
    const req = makeReq({ host: "localhost:5173" }, "http");

    expect(getSiteUrl(req)).toBe("http://localhost:5173");
  });

  it("prefers x-forwarded-host and x-forwarded-proto when present", () => {
    const req = makeReq(
      {
        host: "internal-service:3000",
        "x-forwarded-host": "addrien.fr, internal-service",
        "x-forwarded-proto": "https, http",
      },
      "http",
    );

    expect(getSiteUrl(req)).toBe("https://addrien.fr");
  });
});
