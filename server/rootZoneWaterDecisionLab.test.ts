import { describe, expect, it } from "vitest";
import { createEmptyRootZoneWaterDecisionDraft, hasComparableRootZoneWaterEvidence, rootZoneWaterDecisionLabRequirements } from "../shared/rootZoneWaterDecisionLab";

describe("Root-Zone Water and Air Decision Lab", () => {
  it("requires water, air, crop-pattern, and system-context evidence without supplying an irrigation prescription", () => {
    expect(rootZoneWaterDecisionLabRequirements.evidenceChecks.map(check => check.id)).toEqual(["rootZone", "waterHistory", "cropPattern", "systemContext"]);
    expect(rootZoneWaterDecisionLabRequirements.safetyBoundary).toContain("does not set irrigation duration");
    expect(rootZoneWaterDecisionLabRequirements.nonGatingBoundary).toContain("80% pass rule");
  });

  it("only marks the comparison complete after both zones and every evidence check are recorded", () => {
    const draft = createEmptyRootZoneWaterDecisionDraft();
    expect(hasComparableRootZoneWaterEvidence(draft)).toBe(false);
    draft.fieldQuestion = "What evidence explains differing crop response between zones?";
    draft.cropStage = "Vegetative field observation";
    draft.recentWaterContext = "Recent rainfall and irrigation history recorded.";
    draft.observations.forEach((observation, index) => {
      observation.location = `Zone ${index + 1}`;
      observation.rootZoneAndAir = "Root-zone and drainage observations recorded.";
      observation.cropAndPattern = "Crop response and field pattern compared.";
    });
    Object.keys(draft.evidenceChecks).forEach(id => { draft.evidenceChecks[id as keyof typeof draft.evidenceChecks] = true; });
    expect(hasComparableRootZoneWaterEvidence(draft)).toBe(true);
  });
});
