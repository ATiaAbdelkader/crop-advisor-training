import { describe, expect, it } from "vitest";
import { capstoneCaseConferenceGuide, learningEnhancementBoundary, multilingualFieldCues, offlineFieldCardPack, supervisorCalibrationCases, visualCaptionTranslations } from "../shared/learningEnhancements";
import { appliedScenarios } from "../shared/appliedScenarios";

describe("integrated field learning tools", () => {
  it("provides printable low-bandwidth field aids and plain-language cues without changing formal progression", () => {
    expect(offlineFieldCardPack).toHaveLength(6);
    expect(multilingualFieldCues.french.phrases).toHaveLength(5);
    expect(multilingualFieldCues.arabic.direction).toBe("rtl");
    expect(Object.keys(visualCaptionTranslations)).toHaveLength(10);
    expect(learningEnhancementBoundary).toContain("80% pass rule");
    expect(learningEnhancementBoundary).toContain("sequential gates");
    expect(learningEnhancementBoundary).toContain("authorised channels");
  });

  it("includes case-conference and calibration prompts that preserve uncertainty and evidence-based review", () => {
    expect(capstoneCaseConferenceGuide.map(item => item.title)).toEqual(["Show the field evidence", "Explain the decision and uncertainty", "Connect people and enterprise", "Agree a recheck or referral"]);
    expect(supervisorCalibrationCases).toHaveLength(3);
    expect(supervisorCalibrationCases.map(item => item.detail).join(" ")).toContain("product");
  });

  it("adds safe branching simulations for soil protection and nursery readiness", () => {
    expect(appliedScenarios["soil-protection-runoff-decision"]?.questions).toHaveLength(3);
    expect(appliedScenarios["nursery-batch-readiness-decision"]?.questions).toHaveLength(3);
    expect(appliedScenarios["soil-protection-runoff-decision"]?.reflectionPrompt).toContain("authorised support");
    expect(appliedScenarios["nursery-batch-readiness-decision"]?.decisionPrompt).toContain("released, held, or referred");
  });
});
