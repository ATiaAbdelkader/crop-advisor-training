import { describe, expect, it } from "vitest";
import { createEmptyScorecardReflection, parseScorecardReflection, scorecardReflectionFocus, scorecardReflectionPrompts, scorecardReflectionRequirements } from "../shared/scorecardReflections";

describe("scorecard reflection design", () => {
  it("uses three feedback-to-evidence prompts with a non-gating boundary", () => {
    expect(scorecardReflectionPrompts.map(prompt => prompt.id)).toEqual(["feedbackObservation", "revisedAction", "nextEvidence"]);
    expect(scorecardReflectionRequirements.minimumResponseLength).toBeGreaterThanOrEqual(30);
    expect(scorecardReflectionRequirements.nonGatingBoundary).toContain("does not change formal assessment scores");
  });

  it("creates a stable scorecard focus and safely rejects malformed stored content", () => {
    expect(scorecardReflectionFocus(15)).toBe("scorecard-reflection:15");
    expect(createEmptyScorecardReflection()).toEqual({ feedbackObservation: "", revisedAction: "", nextEvidence: "" });
    expect(parseScorecardReflection("not json")).toBeNull();
  });
});
