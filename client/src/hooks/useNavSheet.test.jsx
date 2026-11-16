import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Link } from "react-router";
import useNavSheet from "./useNavSheet";

let mediaListener;

beforeEach(() => {
  mediaListener = undefined;
  window.matchMedia = vi.fn(() => ({
    matches: false,
    addEventListener: (_, fn) => {
      mediaListener = fn;
    },
    removeEventListener: vi.fn(),
  }));
});

afterEach(cleanup);

const Harness = () => {
  const { open, toggle } = useNavSheet();
  return (
    <>
      <span data-testid="state">{open ? "open" : "closed"}</span>
      <button onClick={toggle}>toggle</button>
      <Link to="/about">go</Link>
    </>
  );
};

const setup = () => {
  render(
    <MemoryRouter>
      <Harness />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByText("toggle"));
  expect(screen.getByTestId("state").textContent).toBe("open");
};

const state = () => screen.getByTestId("state").textContent;

describe("useNavSheet", () => {
  it("locks body scroll while open", () => {
    setup();
    expect(document.body.classList.contains("nav-locked")).toBe(true);
  });

  it("closes on Escape", () => {
    setup();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(state()).toBe("closed");
  });

  it("closes on route navigation", () => {
    setup();
    fireEvent.click(screen.getByText("go"));
    expect(state()).toBe("closed");
  });

  it("closes when crossing to the desktop breakpoint", () => {
    setup();
    act(() => mediaListener({ matches: true }));
    expect(state()).toBe("closed");
  });
});
