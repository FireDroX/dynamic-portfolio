import { describe, it, expect } from "vitest";
import { getProjectMeta } from "./projectMeta";

describe("getProjectMeta", () => {
  it("returns the stack of a featured project", () => {
    expect(getProjectMeta("nestwiki").stack).toContain("NestJS");
  });

  it("returns no type and an empty stack for an unknown project", () => {
    expect(getProjectMeta("unknown")).toEqual({ type: null, stack: [] });
  });
});
