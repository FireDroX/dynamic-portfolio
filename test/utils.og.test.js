import { describe, it, expect } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createCanvas } = require("canvas");
const {
  renderPortfolioOg,
  renderProjectOg,
  sanitizeOgText,
  truncateLine,
  wrapText,
} = require("../utils/og.js");

const makeCtx = () => {
  const ctx = createCanvas(10, 10).getContext("2d");
  ctx.font = '400 24px "Urbanist", sans-serif';
  return ctx;
};

const expectPng = (buffer) => {
  expect(buffer.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect(buffer.readUInt32BE(16)).toBe(1200);
  expect(buffer.readUInt32BE(20)).toBe(630);
};

const LOREM = "Lorem ipsum dolor sit amet consectetur adipiscing elit. ".repeat(20);

describe("sanitizeOgText", () => {
  it("returns an empty string for nullish values", () => {
    expect(sanitizeOgText(null, 10)).toBe("");
    expect(sanitizeOgText(undefined, 10)).toBe("");
  });

  it("strips control and bidi characters and collapses whitespace", () => {
    expect(sanitizeOgText("  a\u0000b‮c \n\t d  ", 50)).toBe("a b c d");
  });

  it("caps by code points without splitting surrogate pairs", () => {
    expect(sanitizeOgText("😀😀😀", 2)).toBe("😀😀");
  });
});

describe("wrapText", () => {
  it("truncates long text with an ellipsis within the width", () => {
    const ctx = makeCtx();
    const lines = wrapText(ctx, LOREM, 400, 3);
    expect(lines).toHaveLength(3);
    expect(lines.at(-1).endsWith("…")).toBe(true);
    lines.forEach((l) => expect(ctx.measureText(l).width).toBeLessThanOrEqual(400));
  });

  it("breaks a single very long word", () => {
    const ctx = makeCtx();
    const lines = wrapText(ctx, "a".repeat(300), 300, 4);
    lines.forEach((l) => expect(ctx.measureText(l).width).toBeLessThanOrEqual(300));
  });

  it("leaves short text unchanged", () => {
    expect(wrapText(makeCtx(), "Hello world", 400, 2)).toEqual(["Hello world"]);
  });
});

describe("truncateLine", () => {
  it("truncates long strings", () => {
    const ctx = makeCtx();
    const out = truncateLine(ctx, "x".repeat(200), 200);
    expect(out.endsWith("…")).toBe(true);
    expect(ctx.measureText(out).width).toBeLessThanOrEqual(200);
  });

  it("keeps short strings", () => {
    expect(truncateLine(makeCtx(), "short", 200)).toBe("short");
  });
});

describe("renderPortfolioOg", () => {
  it("renders an empty portfolio", () => {
    expectPng(renderPortfolioOg([]));
  });

  it("renders many projects with a very long fileName", () => {
    const projects = Array.from({ length: 15 }, (_, i) => ({
      fileName: i === 0 ? "x".repeat(200) : `project-${i}`,
      createdAt: new Date(),
    }));
    expectPng(renderPortfolioOg(projects));
  });
});

describe("renderProjectOg", () => {
  const project = {
    name: "N".repeat(500),
    descriptionFr: LOREM,
    fileName: "f".repeat(200),
  };

  it("renders without an image", async () => {
    expectPng(await renderProjectOg(project, null));
  });

  it("renders with a valid image", async () => {
    const png = createCanvas(4, 4).toBuffer("image/png");
    expectPng(await renderProjectOg({ ...project, name: "Demo" }, png));
  });

  it("falls back to the placeholder on a corrupt image", async () => {
    expectPng(await renderProjectOg(project, Buffer.from("nope")));
  });
});
