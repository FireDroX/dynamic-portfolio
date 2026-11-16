import { describe, it, expect } from "vitest";
import {
  TECH_CATALOG,
  TECH_SUGGESTIONS,
  getStack,
  getTech,
  getTechIcon,
  isValidTech,
  normalizeTech,
} from "./techStack";

describe("getTechIcon", () => {
  it("resolves canonical names", () => {
    expect(getTechIcon("React")).toEqual({
      src: "/assets/icons/react.svg",
      className: "",
    });
    expect(getTechIcon("MySQL")).toEqual({
      src: "/assets/icons/si-mysql.svg",
      className: "ic-land",
    });
  });

  it("resolves aliases regardless of case and spacing", () => {
    expect(getTech("nest").name).toBe("NestJS");
    expect(getTech("NODE.JS").name).toBe("Node.js");
    expect(getTech("  vs  code ").name).toBe("VS Code");
    expect(getTech("Visual Studio Code").name).toBe("VS Code");
    expect(getTech("postgres").name).toBe("PostgreSQL");
  });

  it("returns null for unknown or invalid names", () => {
    expect(getTechIcon("Brainfuck")).toBeNull();
    expect(getTechIcon("")).toBeNull();
    expect(getTechIcon(undefined)).toBeNull();
  });
});

describe("About stack names", () => {
  const expected = {
    React: ["react", ""],
    JavaScript: ["javascript", ""],
    TypeScript: ["typescript", ""],
    HTML: ["html-5", "ic-tall"],
    CSS: ["css", ""],
    Tailwind: ["tailwindcss", "ic-land"],
    Node: ["nodejs", ""],
    Express: ["si-express", "ic-land ic-ink"],
    Nest: ["nestjs", ""],
    PHP: ["php", "ic-wide"],
    MySQL: ["si-mysql", "ic-land"],
    PostgreSQL: ["postgres", ""],
    "VS Code": ["visual-studio-code", ""],
    Docker: ["docker", "ic-land"],
    Git: ["git", ""],
    GitHub: ["github", "ic-ink"],
    Cloudflare: ["cloudflare", "ic-wide"],
    WebStorm: ["webstorm", ""],
  };

  it.each(Object.entries(expected))("%s keeps its icon", (name, [icon, extra]) => {
    expect(getTechIcon(name)).toEqual({
      src: `/assets/icons/${icon}.svg`,
      className: extra,
    });
  });
});

describe("catalog", () => {
  it("suggests every canonical name once", () => {
    expect(TECH_SUGGESTIONS).toHaveLength(TECH_CATALOG.length);
    expect(new Set(TECH_SUGGESTIONS).size).toBe(TECH_CATALOG.length);
  });
});

describe("getStack", () => {
  it("is tolerant of missing or malformed stacks", () => {
    expect(getStack(undefined)).toEqual([]);
    expect(getStack({})).toEqual([]);
    expect(getStack({ stack: "React" })).toEqual([]);
    expect(getStack({ stack: ["React", 3, ""] })).toEqual(["React"]);
  });
});

describe("validation", () => {
  it("normalizes and validates like the server", () => {
    expect(normalizeTech("  VS   Code ")).toBe("VS Code");
    expect(isValidTech("C++")).toBe(true);
    expect(isValidTech("<b>")).toBe(false);
    expect(isValidTech("x".repeat(31))).toBe(false);
  });
});
