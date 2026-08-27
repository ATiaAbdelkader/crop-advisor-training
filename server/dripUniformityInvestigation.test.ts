import { describe, expect, it } from "vitest";
import { createEmptyDripUniformityInvestigationDraft, dripUniformityInvestigationRequirements, hasCompleteDripUniformityEvidence } from "../shared/dripUniformityInvestigation";

describe("Drip Uniformity Investigation Lab", () => {
  it("uses source-near, middle, and far-end checkpoints without prescribing an operating setting", () => {
    expect(dripUniformityInvestigationRequirements.checkpoints).toEqual(["Source-near checkpoint", "Middle checkpoint", "Far-end checkpoint"]);
    expect(dripUniformityInvestigationRequirements.safetyBoundary).toContain("does not prescribe runtime");
    expect(dripUniformityInvestigationRequirements.nonGatingBoundary).toContain("80% pass rule");
  });

  it("requires a complete route comparison and every evidence control before reporting an investigation ready", () => {
    const draft = createEmptyDripUniformityInvestigationDraft();
    expect(hasCompleteDripUniformityEvidence(draft)).toBe(false);
    draft.systemQuestion = "What evidence explains different wetting across this zone?";
    draft.recentSystemContext = "Current source, operation, and maintenance context recorded.";
    draft.checkpoints.forEach((checkpoint, index) => {
      checkpoint.location = `Lateral check ${index + 1}`;
      checkpoint.deliveryAndWetting = "Delivery and wetting observations recorded.";
      checkpoint.cropAndHardwareContext = "Crop and hardware context compared.";
    });
    Object.keys(draft.evidenceChecks).forEach(id => { draft.evidenceChecks[id as keyof typeof draft.evidenceChecks] = true; });
    expect(hasCompleteDripUniformityEvidence(draft)).toBe(true);
  });
});
