import { describe, it, expect } from "vitest";
import { resolveTechIcon, toKey } from "../utils/techIcons.js";

describe("toKey", () => {
  it("ignores case, spaces, dots, dashes and underscores", () => {
    expect(toKey(" Socket.io ")).toBe("socketio");
    expect(toKey("Node-JS")).toBe("nodejs");
    expect(toKey("C++")).toBe("c++");
  });
});

describe("resolveTechIcon", () => {
  it("finds technologies by title", () => {
    for (const name of ["Socket.io", "Bootstrap", "C", "WebAssembly"]) {
      const icon = resolveTechIcon(name);
      expect(icon, name).not.toBeNull();
      expect(icon.hex).toMatch(/^[0-9A-F]{6}$/i);
      expect(icon.path).toMatch(/^M/);
    }
  });

  it("finds technologies by slug or alias", () => {
    expect(resolveTechIcon("socketdotio")?.title).toBe("Socket.io");
    expect(resolveTechIcon("wasm")?.title).toBe("WebAssembly");
  });

  it("is case-insensitive", () => {
    expect(resolveTechIcon("bootstrap")?.title).toBe("Bootstrap");
  });

  it("returns null for unknown or empty names", () => {
    expect(resolveTechIcon("ncurses")).toBeNull();
    expect(resolveTechIcon("")).toBeNull();
    expect(resolveTechIcon(undefined)).toBeNull();
  });
});
