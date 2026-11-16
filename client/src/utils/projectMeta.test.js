import { describe, it, expect } from "vitest";
import { getProjectMeta } from "./projectMeta";

describe("getProjectMeta", () => {
  it("returns no type for a project without one", () => {
    expect(getProjectMeta("unknown")).toEqual({ type: null });
  });

  it("never borrows the homepage's featured stack", () => {
    expect(getProjectMeta("nestwiki")).not.toHaveProperty("stack");
  });
});
