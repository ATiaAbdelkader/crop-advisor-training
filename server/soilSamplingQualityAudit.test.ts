import { describe, expect, it } from "vitest";
import { createEmptySoilSamplingAuditDraft, getMissingSoilSamplingAuditChecks, isSoilSamplingAuditReady, soilSamplingQualityAuditRequirements } from "../shared/soilSamplingQualityAudit";

describe("Soil Sampling Quality Audit", () => {
  it("keeps separate zones, clean handling, identity, context, and current laboratory instructions in the sampling chain", () => {
    expect(soilSamplingQualityAuditRequirements.auditChecks.map(check => check.id)).toEqual(["zone", "tools", "method", "identity", "context"]);
    expect(soilSamplingQualityAuditRequirements.safetyBoundary).toContain("does not interpret a soil result");
    expect(soilSamplingQualityAuditRequirements.nonGatingBoundary).toContain("80% pass rule");
  });

  it("does not mark a sample ready until its traceability fields and every quality control are verified", () => {
    const draft = createEmptySoilSamplingAuditDraft();
    expect(getMissingSoilSamplingAuditChecks(draft)).toHaveLength(5);
    expect(isSoilSamplingAuditReady(draft)).toBe(false);
    draft.sampleId = "VEG-A-01";
    draft.fieldZone = "Central uniform vegetable beds";
    draft.cropAndQuestion = "Vegetable crop history and a soil-nutrient evidence question.";
    draft.labInstructions = "Current receiving laboratory form and collection instructions checked.";
    Object.keys(draft.checks).forEach(id => { draft.checks[id as keyof typeof draft.checks] = true; });
    expect(getMissingSoilSamplingAuditChecks(draft)).toEqual([]);
    expect(isSoilSamplingAuditReady(draft)).toBe(true);
  });
});
