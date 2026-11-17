import { describe, it, expect } from "vitest";
import { PROJECT_TYPE_IDS, getProjectTypeLabelKey } from "./projectTypes";

describe("getProjectTypeLabelKey", () => {
  it("returns the label key of each known type", () => {
    for (const id of PROJECT_TYPE_IDS) {
      expect(getProjectTypeLabelKey(id)).toBe(`projectTypes.${id}`);
    }
  });

  it("returns null for a missing or unknown type", () => {
    expect(getProjectTypeLabelKey(null)).toBeNull();
    expect(getProjectTypeLabelKey(undefined)).toBeNull();
    expect(getProjectTypeLabelKey("")).toBeNull();
    expect(getProjectTypeLabelKey("podcast")).toBeNull();
  });
});
