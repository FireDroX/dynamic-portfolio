import { afterAll, beforeAll, beforeEach, describe, it, expect } from "vitest";
import express from "express";
import auth from "../middleware/auth.js";
import loginRouter from "../api/login.js";

const PASSWORD = "correct horse battery staple";

// Minimal stand-in for express-session: like the real one, regenerate()
// replaces req.session with a fresh object carrying a new id.
let session;
const createSession = (id) => ({ id });

const attachSession = (req) => {
  req.session = session;
  const replace = (callback) => {
    session = createSession(session.id + 1);
    attachSession(req);
    callback();
  };
  session.regenerate = replace;
  session.destroy = replace;
};

let server;
let baseUrl;

beforeAll(async () => {
  const app = express();
  app.use((req, res, next) => {
    attachSession(req);
    next();
  });
  app.use(express.json());
  app.use("/login", loginRouter);
  app.get("/private", auth, (req, res) => res.json({ ok: true }));

  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterAll(() => new Promise((resolve) => server.close(resolve)));

beforeEach(() => {
  session = createSession(1);
  process.env.PANEL_PASSWORD = PASSWORD;
});

const login = (body) =>
  fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

describe("auth middleware", () => {
  it("answers a JSON 401 instead of redirecting", async () => {
    const response = await fetch(`${baseUrl}/private`, { redirect: "manual" });

    expect(response.status).toBe(401);
    expect(await response.json()).toHaveProperty("error");
  });

  it("lets an authenticated session through", async () => {
    session.authenticated = true;
    const response = await fetch(`${baseUrl}/private`);

    expect(response.status).toBe(200);
  });
});

describe("POST /login", () => {
  it("rejects a wrong password", async () => {
    const response = await login({ password: "nope" });

    expect(response.status).toBe(401);
    expect(session.authenticated).toBeUndefined();
  });

  it("logs in with the right password on a regenerated session", async () => {
    const response = await login({ password: PASSWORD });

    expect(response.status).toBe(200);
    expect(session.id).toBe(2);
    expect(session.authenticated).toBe(true);
  });

  it("fails closed when PANEL_PASSWORD is not set", async () => {
    delete process.env.PANEL_PASSWORD;
    const response = await login({});

    expect(response.status).toBe(401);
    expect(session.authenticated).toBeUndefined();
  });

  it("rejects a non-string password", async () => {
    const response = await login({ password: { $ne: "" } });

    expect(response.status).toBe(401);
  });

  it("answers 401, not 500, without a JSON body", async () => {
    const response = await fetch(`${baseUrl}/login`, {
      method: "POST",
      body: "password=nope",
    });

    expect(response.status).toBe(401);
  });

  it("rate-limits repeated failures", async () => {
    let response;
    // Earlier tests in this file already spent some of the 10 attempts.
    for (let attempt = 0; attempt < 10; attempt += 1) {
      response = await login({ password: "nope" });
      if (response.status === 429) break;
    }

    expect(response.status).toBe(429);
    expect((await login({ password: PASSWORD })).status).toBe(429);
  });
});
