import { afterAll, beforeAll, describe, it, expect } from "vitest";
import express from "express";
import rateLimitModule from "../middleware/rateLimit.js";

const {
  GLOBAL_THROTTLE_LIMIT,
  GLOBAL_THROTTLE_TTL_MS,
  OG_IMAGE_THROTTLE_LIMIT,
  OG_IMAGE_THROTTLE_TTL_MS,
  globalLimiter,
  ogImageLimiter,
} = rateLimitModule;

let server;
let baseUrl;

beforeAll(async () => {
  const app = express();
  app.use(globalLimiter);
  app.use("/render", ogImageLimiter);
  app.use((req, res) => res.json({ ok: true }));

  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterAll(() => new Promise((resolve) => server.close(resolve)));

// Each test uses its own address, so each one starts with an empty bucket.
const get = (path, ip) =>
  fetch(`${baseUrl}${path}`, { headers: { "cf-connecting-ip": ip } });

const remaining = (response) =>
  Number(response.headers.get("ratelimit").match(/r=(\d+)/)[1]);

describe("globalLimiter", () => {
  it("allows 100 requests per minute", () => {
    expect(GLOBAL_THROTTLE_TTL_MS).toBe(60000);
    expect(GLOBAL_THROTTLE_LIMIT).toBe(100);
  });

  it("answers a JSON 429 once the limit is reached", async () => {
    for (let count = 0; count < GLOBAL_THROTTLE_LIMIT; count += 1) {
      const response = await get("/og-image", "203.0.113.1");
      expect(response.status).toBe(200);
    }

    const blocked = await get("/og-image", "203.0.113.1");

    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toEqual({
      error: "Trop de requêtes, réessayez plus tard.",
    });
  });

  it("counts each visitor separately", async () => {
    await get("/og-image", "203.0.113.2");
    const other = await get("/og-image", "203.0.113.3");

    expect(remaining(other)).toBe(GLOBAL_THROTTLE_LIMIT - 1);
  });

  it.each([
    "/assets/index-C4Zy6Sdt.js",
    "/api/projects/pokedex/sprites/1.png",
    "/api/panel/preview/token/pokedex/game.js",
  ])("does not count static file %s", async (path) => {
    const response = await get(path, "203.0.113.4");

    expect(response.status).toBe(200);
    expect(response.headers.get("ratelimit")).toBeNull();
  });

  // Express routes these to the same handlers, whatever the case or the
  // trailing slash: none of them may pass for a static file.
  it.each([
    "/",
    "/projects",
    "/sitemap.xml",
    "/api/projects",
    "/api/projects/pokedex/",
    "/api/projects/pokedex/meta",
    "/api/projects/pokedex/meta/",
    "/api/projects/pokedex/META",
    "/api/projects/pokedex/image",
    "/api/projects/pokedex/Image/",
  ])("counts %s", async (path) => {
    const response = await get(path, "203.0.113.5");

    expect(response.headers.get("ratelimit")).not.toBeNull();
  });
});

describe("ogImageLimiter", () => {
  it("allows 10 renders per minute", () => {
    expect(OG_IMAGE_THROTTLE_TTL_MS).toBe(60000);
    expect(OG_IMAGE_THROTTLE_LIMIT).toBe(10);
  });

  it("blocks renders long before the global limit, and only renders", async () => {
    for (let count = 0; count < OG_IMAGE_THROTTLE_LIMIT; count += 1) {
      const response = await get("/render/pokedex", "203.0.113.6");
      expect(response.status).toBe(200);
    }

    const blocked = await get("/render", "203.0.113.6");
    const otherRoute = await get("/projects", "203.0.113.6");

    expect(blocked.status).toBe(429);
    expect(otherRoute.status).toBe(200);
  });
});
