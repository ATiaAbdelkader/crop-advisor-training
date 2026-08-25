import type { TrpcContext } from "./_core/context";

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const competencyMocks = vi.hoisted(() => ({
  create: vi.fn(),
  mine: vi.fn(),
  queue: vi.fn(),
  score: vi.fn(),
  reflection: vi.fn(),
  saveReflection: vi.fn(),
  supervisorReflection: vi.fn(),
}));

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    createCompetencyAssessmentSubmission: competencyMocks.create,
    listMyCompetencyAssessments: competencyMocks.mine,
    listCompetencyAssessmentsForSupervisor: competencyMocks.queue,
    submitSupervisorCompetencyScore: competencyMocks.score,
    getScorecardReflectionForLearner: competencyMocks.reflection,
    saveScorecardReflectionForLearner: competencyMocks.saveReflection,
    getScorecardReflectionForSupervisor: competencyMocks.supervisorReflection,
  };
});

import { appRouter } from "./routers";

function createCaller(id = 73, role: "user" | "admin" = "user") {
  const ctx: TrpcContext = {
    user: {
      id,
      openId: `${role}-${id}`,
      email: `${role}@example.com`,
      name: role === "admin" ? "Course Admin" : "Learner",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
  return appRouter.createCaller(ctx);
}

const evidencePayload = {
  moduleId: "advisory-practice",
  evidenceSummary: "I framed the grower question, compared affected and unaffected areas, documented evidence and constraints, then named a timed follow-up observation.",
  taskContext: "Vegetable field at early crop stage with patchy crop performance.",
  reviewOrReferral: "I will recheck the same zones after the next irrigation cycle and refer if the evidence remains inconclusive.",
};

describe("supervisor competency scoring access", () => {
  beforeEach(() => {
    Object.values(competencyMocks).forEach(mock => mock.mockReset());
    competencyMocks.create.mockResolvedValue({ id: 15, moduleId: "advisory-practice" });
    competencyMocks.mine.mockResolvedValue([]);
    competencyMocks.queue.mockResolvedValue([]);
    competencyMocks.score.mockResolvedValue(true);
    competencyMocks.reflection.mockResolvedValue({ assessment: { id: 15, status: "scored", scorecard: { prepare: "demonstrated", perform: "developing", "review-refer": "demonstrated" }, feedback: "Compare another representative zone and document the recheck trigger." }, reflection: null });
    competencyMocks.saveReflection.mockResolvedValue({ feedbackObservation: "The scorecard shows strong preparation but a gap in the practical comparison evidence.", revisedAction: "I will add a second comparable observation before deciding whether the field pattern is consistent.", nextEvidence: "I will record the second-zone comparison and seek authorised support if conditions remain uncertain." });
    competencyMocks.supervisorReflection.mockResolvedValue(null);
  });

  it("stores competency evidence under the authenticated learner identity and validates the module competency", async () => {
    await createCaller(73).competencyAssessments.submit(evidencePayload);
    expect(competencyMocks.create).toHaveBeenCalledWith({
      userId: 73,
      moduleId: "advisory-practice",
      payload: {
        evidenceSummary: evidencePayload.evidenceSummary,
        taskContext: evidencePayload.taskContext,
        reviewOrReferral: evidencePayload.reviewOrReferral,
        attachments: [],
      },
    });
  });

  it("rejects photo evidence outside the authenticated learner and module storage path", async () => {
    await expect(createCaller(73).competencyAssessments.submit({
      ...evidencePayload,
      attachments: [{ name: "field.jpg", key: "competency-evidence/9/advisory-practice/field.jpg", url: "/manus-storage/competency-evidence/9/advisory-practice/field.jpg" }],
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(competencyMocks.create).not.toHaveBeenCalled();
  });

  it("lists only the authenticated learner's competency assessments", async () => {
    await createCaller(73).competencyAssessments.mine();
    expect(competencyMocks.mine).toHaveBeenCalledWith(73);
  });

  it("restricts the supervisor queue to administrators", async () => {
    await expect(createCaller(73).competencyAssessments.queue()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await createCaller(9, "admin").competencyAssessments.queue();
    expect(competencyMocks.queue).toHaveBeenCalledTimes(1);
  });

  it("attributes all three competency-level scores and feedback to the authenticated administrator", async () => {
    const scorecard = { prepare: "demonstrated", perform: "developing", "review-refer": "demonstrated" } as const;
    await createCaller(9, "admin").competencyAssessments.score({ id: 15, status: "scored", scorecard, feedback: "Strong field framing and review boundary. Add one more comparable observation to strengthen the performed evidence." });
    expect(competencyMocks.score).toHaveBeenCalledWith({
      id: 15,
      supervisorUserId: 9,
      supervisorName: "Course Admin",
      status: "scored",
      scorecard,
      feedback: "Strong field framing and review boundary. Add one more comparable observation to strengthen the performed evidence.",
    });
  });

  it("returns and saves scorecard reflection only through the authenticated learner ownership path", async () => {
    const reflection = { feedbackObservation: "The scorecard shows strong preparation but a gap in the practical comparison evidence.", revisedAction: "I will add a second comparable observation before deciding whether the field pattern is consistent.", nextEvidence: "I will record the second-zone comparison and seek authorised support if conditions remain uncertain." };
    await createCaller(73).competencyAssessments.reflection({ assessmentId: 15 });
    await createCaller(73).competencyAssessments.saveReflection({ assessmentId: 15, reflection });
    expect(competencyMocks.reflection).toHaveBeenCalledWith(73, 15);
    expect(competencyMocks.saveReflection).toHaveBeenCalledWith({ userId: 73, assessmentId: 15, reflection });
  });

  it("restricts scorecard reflection context to administrators", async () => {
    await expect(createCaller(73).competencyAssessments.supervisorReflection({ assessmentId: 15 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await createCaller(9, "admin").competencyAssessments.supervisorReflection({ assessmentId: 15 });
    expect(competencyMocks.supervisorReflection).toHaveBeenCalledWith(15);
  });

  it("propagates a protected supervisor reflection lookup failure for the workspace retry state", async () => {
    competencyMocks.supervisorReflection.mockRejectedValueOnce(new Error("Private reflection lookup failed"));
    await expect(createCaller(9, "admin").competencyAssessments.supervisorReflection({ assessmentId: 15 })).rejects.toThrow("Private reflection lookup failed");
  });
});
