import { describe, it, expect } from "vitest";
import { SiGithub, SiMysql, SiReact } from "react-icons/si";
import {
  INK_COLOR,
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
    expect(getTechIcon("React")).toEqual({ Icon: SiReact, color: "#61DAFB" });
    expect(getTechIcon("MySQL")).toEqual({ Icon: SiMysql, color: "#4479A1" });
  });

  it("falls back to the theme ink for black marks", () => {
    expect(getTechIcon("GitHub")).toEqual({ Icon: SiGithub, color: INK_COLOR });
    expect(getTechIcon("Express").color).toBe(INK_COLOR);
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
  it.each([
    "React", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind", "Node",
    "Express", "Nest", "PHP", "MySQL", "PostgreSQL", "VS Code", "Docker",
    "Git", "GitHub", "Cloudflare", "WebStorm",
  ])("%s has an icon", (name) => {
    expect(typeof getTechIcon(name).Icon).toBe("function");
  });
});

describe("Homelab stack names", () => {
  it.each(["Proxmox", "proxmox ve", "Cloudflare", "Docker"])(
    "%s has a bundled icon",
    (name) => {
      expect(typeof getTechIcon(name).Icon).toBe("function");
    },
  );
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
