import { describe, it, expect, vi, afterEach } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

import ProjectLivePreview from "./ProjectLivePreview";

const project = { name: "Demo", fileName: "demo" };

const setFullscreenElement = (element) => {
  Object.defineProperty(document, "fullscreenElement", {
    configurable: true,
    value: element,
  });
  act(() => {
    document.dispatchEvent(new Event("fullscreenchange"));
  });
};

afterEach(() => {
  cleanup();
  delete document.fullscreenEnabled;
  delete document.fullscreenElement;
  delete document.exitFullscreen;
  delete HTMLElement.prototype.requestFullscreen;
});

describe("ProjectLivePreview", () => {
  it("embeds the same-origin project in an unsandboxed iframe", () => {
    const { container } = render(<ProjectLivePreview project={project} />);
    const iframe = container.querySelector("iframe");
    expect(iframe.getAttribute("src")).toBe("/api/projects/demo");
    expect(iframe.hasAttribute("sandbox")).toBe(false);
  });

  it("remounts the iframe on reload", () => {
    const { container } = render(<ProjectLivePreview project={project} />);
    const before = container.querySelector("iframe");
    fireEvent.click(screen.getByRole("button", { name: "project.reload" }));
    expect(container.querySelector("iframe")).not.toBe(before);
  });

  it("enters and leaves fullscreen on the frame, following Escape", () => {
    const requestFullscreen = vi.fn(() => Promise.resolve());
    const exitFullscreen = vi.fn(() => Promise.resolve());
    document.fullscreenEnabled = true;
    document.exitFullscreen = exitFullscreen;
    HTMLElement.prototype.requestFullscreen = requestFullscreen;

    const { container } = render(<ProjectLivePreview project={project} />);
    const frame = container.querySelector(".project-frame");

    fireEvent.click(screen.getByRole("button", { name: "project.enterFullscreen" }));
    expect(requestFullscreen).toHaveBeenCalledTimes(1);
    expect(requestFullscreen.mock.contexts[0]).toBe(frame);

    setFullscreenElement(frame);
    const exit = screen.getByRole("button", { name: "project.exitFullscreen" });
    expect(exit.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(exit);
    expect(exitFullscreen).toHaveBeenCalledTimes(1);

    setFullscreenElement(null);
    expect(
      screen
        .getByRole("button", { name: "project.enterFullscreen" })
        .getAttribute("aria-pressed"),
    ).toBe("false");
  });

  it("toggles the 390px mobile view", () => {
    const { container } = render(<ProjectLivePreview project={project} />);
    const frame = container.querySelector(".project-frame");

    fireEvent.click(screen.getByRole("button", { name: "project.mobileView" }));
    expect(frame.classList.contains("is-mobile")).toBe(true);
    const back = screen.getByRole("button", { name: "project.desktopView" });
    expect(back.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(back);
    expect(frame.classList.contains("is-mobile")).toBe(false);
  });
});
