import { describe, expect, it } from "vitest";
import { buildLearnerExperience } from "../shared/learnerExperience";

describe("learner experience insight rules", () => {
  const now = new Date("2026-08-25T12:00:00.000Z");
  const input = {
    passedModuleIds: ["advisory-practice"],
    assessmentAttempts: [
      { assessmentId: "advisory-practice-check", score: 84, passed: "yes" as const, submittedAt: new Date("2026-06-01T12:00:00.000Z") },
      { assessmentId: "soil-and-nutrition-check", score: 50, passed: "no" as const, submittedAt: new Date("2026-08-22T12:00:00.000Z") },
    ],
    scenarioAttempts: [{ moduleId: "crop-observation", scenarioId: "diagnosis-pattern-triage", score: 33, passed: "no" as const, submittedAt: new Date("2026-08-22T12:00:00.000Z") }],
    competencyAssessments: [{ id: 9, moduleId: "water-management", status: "scored" as const, scorecard: { prepare: "demonstrated" as const, perform: "developing" as const, "review-refer": "not_yet" as const }, feedback: "Compare a second zone and state the recheck trigger.", feedbackReadAt: null, submittedAt: new Date("2026-08-18T12:00:00.000Z"), reviewedAt: new Date("2026-08-20T12:00:00.000Z") }],
    evidenceCount: { records: 2, scenarios: 1, practicum: 1, capstones: 1, annotations: 1, competencySubmissions: 1, competencyPhotos: 2, reflections: 1 },
    now,
  };

  it("prioritises scored evidence gaps and failed formal checks without changing those checks", () => {
    const experience = buildLearnerExperience(input);
    expect(experience.nextSteps.some(step => step.moduleId === "water-management" && step.priority === "remediation")).toBe(true);
    expect(experience.nextSteps.some(step => step.moduleId === "soil-and-nutrition" && step.priority === "remediation")).toBe(true);
    expect(experience.nextSteps.some(step => step.moduleId === "crop-observation" && step.priority === "practice")).toBe(true);
  });

  it("shows transparent domain transcript and evidence-library counts from learner-owned activity", () => {
    const experience = buildLearnerExperience(input);
    const water = experience.transcript.find(domain => domain.id === "water-irrigation");
    expect(water?.supervisorEvidenceCount).toBe(1);
    expect(water?.demonstratedCount).toBe(1);
    expect(water?.developingCount).toBe(1);
    expect(experience.evidenceLibrary.find(item => item.id === "competency-photos")?.count).toBe(2);
    expect(experience.evidenceLibrary.find(item => item.id === "reflections")?.count).toBe(1);
    expect(experience.evidenceLibrary.find(item => item.id === "reflections")?.href).toBe("/competency-reflections");
  });

  it("creates in-app spaced retrieval prompts from passed checks rather than a scheduled gate", () => {
    const experience = buildLearnerExperience(input);
    const advisoryReview = experience.spacedReviewPrompts.find(prompt => prompt.moduleId === "advisory-practice");
    expect(advisoryReview?.due).toBe(true);
    expect(advisoryReview?.detail).toContain("retrieval review");
  });
});
