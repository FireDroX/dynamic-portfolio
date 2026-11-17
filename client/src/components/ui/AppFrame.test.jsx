import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import AppFrame from "./AppFrame";

afterEach(cleanup);

describe("AppFrame", () => {
  it("renders the title, actions and children", () => {
    render(
      <AppFrame title="terminal" actions={<button>copy</button>}>
        <p>body</p>
      </AppFrame>,
    );
    expect(screen.getByText("terminal")).toBeTruthy();
    expect(screen.getByRole("button", { name: "copy" })).toBeTruthy();
    expect(screen.getByText("body")).toBeTruthy();
  });

  it("hides the decorative dots from assistive tech", () => {
    const { container } = render(<AppFrame title="t">x</AppFrame>);
    const dots = container.querySelector(".app-frame__dots");
    expect(dots.getAttribute("aria-hidden")).toBe("true");
  });

  it("omits the actions slot when none is given", () => {
    const { container } = render(<AppFrame title="t">x</AppFrame>);
    expect(container.querySelector(".app-frame__actions")).toBeNull();
  });
});
