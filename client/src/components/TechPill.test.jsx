import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import TechPill, { TechStack } from "./TechPill";
import { INK_COLOR } from "../utils/techStack";
import { clearTechIconCache, getIconColor } from "../utils/techIconApi";

afterEach(() => {
  cleanup();
  clearTechIconCache();
  vi.unstubAllGlobals();
});

describe("TechPill", () => {
  it("shows the icon of a known technology", () => {
    const { container } = render(<TechPill name="React" />);
    expect(screen.getByText("React")).toBeTruthy();
    const svg = container.querySelector("svg.tech-pill__icon");
    expect(svg).toBeTruthy();
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("color")).toBe("#61DAFB");
  });

  it("falls back to text only for an unknown technology", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false })));
    const { container } = render(<TechPill name="Brainfuck" />);
    expect(screen.getByText("Brainfuck")).toBeTruthy();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(container.querySelector("svg")).toBeNull();
  });

  it("shows the server icon of a technology outside the catalog", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ title: "Bootstrap", hex: "7952B3", path: "M0 0h24v24H0z" }),
        }),
      ),
    );
    const { container } = render(<TechPill name="Bootstrap" />);
    const svg = await waitFor(() => {
      const found = container.querySelector("svg.tech-pill__icon");
      expect(found).toBeTruthy();
      return found;
    });
    expect(fetch).toHaveBeenCalledWith("/api/tech-icons?name=Bootstrap");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.style.color).toBe("rgb(121, 82, 179)");
    expect(svg.querySelector("path").getAttribute("d")).toBe("M0 0h24v24H0z");
  });

  it("does not ask the server for a catalog technology", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<TechPill name="React" />);
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("getIconColor", () => {
  it("keeps brand colors and swaps near-black or near-white marks for the ink", () => {
    expect(getIconColor("7952B3")).toBe("#7952B3");
    expect(getIconColor("010101")).toBe(INK_COLOR);
    expect(getIconColor("FFFFFF")).toBe(INK_COLOR);
    expect(getIconColor(undefined)).toBe(INK_COLOR);
  });
});

describe("TechStack", () => {
  it("lists the technologies", () => {
    render(<TechStack stack={["React", "Brainfuck"]} label="Stack" />);
    expect(screen.getByRole("list", { name: "Stack" })).toBeTruthy();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders nothing for an empty stack", () => {
    const { container } = render(<TechStack stack={[]} label="Stack" />);
    expect(container.firstChild).toBeNull();
  });
});
