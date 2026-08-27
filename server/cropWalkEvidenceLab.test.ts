import { describe, expect, it } from "vitest";
import { createEmptyCropWalkEvidenceDraft, cropWalkEvidenceLabRequirements, hasComparableCropWalkEvidence } from "../shared/cropWalkEvidenceLab";

describe("Crop-Walk Evidence Lab", () => {
  it("starts with three deliberate comparison zones and an evidence-first boundary", () => {
    const draft = createEmptyCropWalkEvidenceDraft();
    expect(draft.observations.map(observation => observation.zone)).toEqual(["Reference healthy area", "Typical field area", "Unusual or affected area"]);
    expect(cropWalkEvidenceLabRequirements.safetyBoundary).toContain("not a diagnosis");
    expect(cropWalkEvidenceLabRequirements.nonGatingBoundary).toContain("80% pass rule");
  });

  it("requires a field question, crop-stage context, and all comparable observations before marking evidence complete", () => {
    const draft = createEmptyCropWalkEvidenceDraft();
    expect(hasComparableCropWalkEvidence(draft)).toBe(false);
    draft.fieldQuestion = "What explains a pattern of uneven crop vigour?";
    draft.cropStage = "Vegetative stage, field visit 1";
    draft.observations.forEach((observation, index) => {
      observation.location = `Transect point ${index + 1}`;
      observation.cropAndSoilCondition = "Observed crop condition and root-zone context recorded.";
      observation.patternOrComparison = "Compared with the other planned observation zones.";
    });
    expect(hasComparableCropWalkEvidence(draft)).toBe(true);
  });
});
