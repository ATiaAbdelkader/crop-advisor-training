import { describe, expect, it } from "vitest";
import { competencyEvidenceComparisonBoundary, competencyEvidenceComparisonSections } from "../shared/competencyEvidenceComparison";

describe("competency evidence comparison design", () => {
  it("compares the three revision-relevant evidence areas without changing formal progression", () => {
    expect(competencyEvidenceComparisonSections.map(section => section.id)).toEqual(["evidenceSummary", "taskContext", "reviewOrReferral"]);
    expect(competencyEvidenceComparisonBoundary).toContain("does not replace formal assessment");
    expect(competencyEvidenceComparisonBoundary).toContain("does not change sequential gates");
  });
});
