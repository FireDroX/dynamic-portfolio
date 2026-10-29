import { describe, it, expect, beforeAll, vi } from "vitest";
import { registerDiscoveryTracker } from "./discoveryTracker";

let frame;

beforeAll(() => {
  registerDiscoveryTracker();
  frame = document.createElement("iframe");
  document.body.appendChild(frame);
});

// Records which window events the bridge re-dispatches for one message.
const forwardedTypes = (data, { origin, source } = {}) => {
  const seen = [];
  const original = window.dispatchEvent.bind(window);
  const spy = vi.spyOn(window, "dispatchEvent").mockImplementation((event) => {
    if (event instanceof CustomEvent) seen.push(event.type);
    return original(event);
  });

  try {
    window.dispatchEvent(
      new MessageEvent("message", {
        data,
        origin: origin ?? window.location.origin,
        source: source === undefined ? frame.contentWindow : source,
      }),
    );
  } finally {
    spy.mockRestore();
  }
  return seen;
};

describe("iframe achievement bridge", () => {
  it("forwards an achievement sent by a project iframe", () => {
    expect(forwardedTypes({ type: "portfolio:space-invader" })).toEqual([
      "portfolio:space-invader",
    ]);
  });

  it("accepts the opaque origin of the sandboxed panel preview", () => {
    expect(
      forwardedTypes({ type: "portfolio:space-invader" }, { origin: "null" }),
    ).toEqual(["portfolio:space-invader"]);
  });

  it("never forwards internal events", () => {
    expect(forwardedTypes({ type: "portfolio:cheater" })).toEqual([]);
    expect(forwardedTypes({ type: "portfolio:update" })).toEqual([]);
    expect(forwardedTypes({ type: "portfolio:achievement-hunter" })).toEqual(
      [],
    );
  });

  it("ignores messages that do not come from a child iframe", () => {
    expect(
      forwardedTypes({ type: "portfolio:space-invader" }, { source: null }),
    ).toEqual([]);
  });

  it("ignores other origins", () => {
    expect(
      forwardedTypes(
        { type: "portfolio:space-invader" },
        { origin: "https://evil.example" },
      ),
    ).toEqual([]);
  });
});
