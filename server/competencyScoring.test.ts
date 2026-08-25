import type { TrpcContext } from "./_core/context";

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const competencyMocks = vi.hoisted(() => ({
  create: vi.fn(),
  mine: vi.fn(),
  queue: vi.fn(),
  score: vi.fn(),
}));

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    createCompetencyAssessmentSubmission: competencyMocks.create,
    listMyCompetencyAssessments: competencyMocks.mine,
    listCompetencyAssessmentsForSupervisor: competencyMocks.queue,
    submitSupervisorCompetencyScore: competencyMocks.score,
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
      },
    });
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
});
