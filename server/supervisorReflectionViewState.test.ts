import { describe, expect, it } from "vitest";
import { getSupervisorReflectionViewState } from "../shared/supervisorReflectionViewState";

describe("supervisor scorecard reflection context states", () => {
  it("keeps protected loading, error, empty, and ready outcomes distinct", () => {
    expect(getSupervisorReflectionViewState({ isLoading: true, isError: false, hasReflection: false })).toBe("loading");
    expect(getSupervisorReflectionViewState({ isLoading: false, isError: true, hasReflection: false })).toBe("error");
    expect(getSupervisorReflectionViewState({ isLoading: false, isError: false, hasReflection: false })).toBe("empty");
    expect(getSupervisorReflectionViewState({ isLoading: false, isError: false, hasReflection: true })).toBe("ready");
  });
});
