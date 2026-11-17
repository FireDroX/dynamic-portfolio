import { describe, it, expect, vi, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import useCountUp from "./useCountUp";

afterEach(() => vi.unstubAllGlobals());

describe("useCountUp", () => {
  it("returns the target at once under reduced motion", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const { result } = renderHook(() => useCountUp(7));
    expect(result.current).toBe(7);
  });

  it("returns the target when matchMedia is missing", () => {
    vi.stubGlobal("matchMedia", undefined);
    const { result } = renderHook(() => useCountUp(5));
    expect(result.current).toBe(5);
  });

  it("counts up from 0 to the target when motion is allowed", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const frames = [];
    vi.stubGlobal("requestAnimationFrame", (cb) => frames.push(cb));
    vi.stubGlobal("cancelAnimationFrame", () => {});
    const { result } = renderHook(() => useCountUp(10, { duration: 100 }));

    // No flash of the final value before the first frame.
    expect(result.current).toBe(0);
    act(() => frames.shift()(0));
    expect(result.current).toBe(0);
    act(() => frames.shift()(100));
    expect(result.current).toBe(10);
  });
});
