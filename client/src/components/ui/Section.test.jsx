import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import Section from "./Section";

afterEach(cleanup);

describe("Section", () => {
  it("wraps children in a .wrap and sets id and default height", () => {
    const { container } = render(<Section id="intro">hi</Section>);
    const section = container.querySelector("section");
    expect(section.id).toBe("intro");
    expect(section.style.getPropertyValue("--h")).toBe("1");
    expect(section.querySelector(".wrap").textContent).toBe("hi");
    expect(section.hasAttribute("class")).toBe(false);
  });

  it("applies the ground class, custom class and height", () => {
    const { container } = render(
      <Section ground="inverse" className="extra" height={2}>
        x
      </Section>,
    );
    const section = container.querySelector("section");
    expect(section.className).toBe("ground-inverse extra");
    expect(section.style.getPropertyValue("--h")).toBe("2");
  });

  it("ignores an unknown ground", () => {
    const { container } = render(<Section ground="nope">x</Section>);
    expect(container.querySelector("section").hasAttribute("class")).toBe(false);
  });
});
