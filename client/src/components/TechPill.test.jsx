import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import TechPill, { TechStack } from "./TechPill";

afterEach(cleanup);

describe("TechPill", () => {
  it("shows the icon of a known technology", () => {
    const { container } = render(<TechPill name="React" />);
    expect(screen.getByText("React")).toBeTruthy();
    const svg = container.querySelector("svg.tech-pill__icon");
    expect(svg).toBeTruthy();
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("color")).toBe("#61DAFB");
  });

  it("falls back to text only for an unknown technology", () => {
    const { container } = render(<TechPill name="Brainfuck" />);
    expect(screen.getByText("Brainfuck")).toBeTruthy();
    expect(container.querySelector("svg")).toBeNull();
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
