import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import { cropAdvisorCourse, getAssessmentById } from "../shared/curriculum";
import { getTimedQuizLimitSeconds, minimumTimedQuizSeconds, secondsPerTimedQuizQuestion, timedQuizBoundary } from "../shared/timedAssessments";

const mocks = vi.hoisted(() => ({ enroll: vi.fn(), records: vi.fn(), start: vi.fn(), consume: vi.fn(), recordAttempt: vi.fn(), getOverride: vi.fn(), listOverrides: vi.fn(), saveOverride: vi.fn(), clearOverride: vi.fn() }));

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    enrollLearner: mocks.enroll,
    getLearningRecords: mocks.records,
    startTimedAssessmentSession: mocks.start,
    consumeUnexpiredTimedAssessmentSession: mocks.consume,
    recordAssessmentAttempt: mocks.recordAttempt,
    getAssessmentTimeLimitOverride: mocks.getOverride,
    listAssessmentTimeLimitOverrides: mocks.listOverrides,
    saveAssessmentTimeLimitOverride: mocks.saveOverride,
    clearAssessmentTimeLimitOverride: mocks.clearOverride,
  };
});

import { appRouter } from "./routers";

function createCaller(role: "user" | "admin" = "user") {
  const ctx: TrpcContext = {
    user: { id: role === "admin" ? 9 : 73, openId: `${role}-user`, email: `${role}@example.com`, name: role === "admin" ? "Course Admin" : "Learner", loginMethod: "manus", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
  return appRouter.createCaller(ctx);
}

const assessment = getAssessmentById("advisory-practice-check")!;
const completedFoundationLessons = cropAdvisorCourse.modules[0].lessons.map(lesson => ({ lessonId: lesson.id }));

describe("timed formal quizzes", () => {
  beforeEach(() => {
    Object.values(mocks).forEach(mock => mock.mockReset());
    mocks.records.mockResolvedValue({ enrollment: { id: 1 }, completions: completedFoundationLessons, attempts: [], certificate: null });
    mocks.start.mockResolvedValue({ id: 41, startedAt: new Date("2026-08-26T08:00:00Z"), expiresAt: new Date("2026-08-26T08:06:00Z"), timeLimitSeconds: 360 });
    mocks.consume.mockResolvedValue(true);
    mocks.recordAttempt.mockResolvedValue(undefined);
    mocks.getOverride.mockResolvedValue(null);
    mocks.listOverrides.mockResolvedValue([]);
    mocks.saveOverride.mockResolvedValue({ assessmentId: assessment.id, timeLimitSeconds: 720, updatedByUserId: 9 });
    mocks.clearOverride.mockResolvedValue(true);
  });

  it("uses a transparent question-scaled limit while preserving the 80% formal threshold", () => {
    expect(getTimedQuizLimitSeconds(assessment)).toBe(Math.max(minimumTimedQuizSeconds, assessment.questions.length * secondsPerTimedQuizQuestion));
    expect(assessment.passMark).toBe(80);
    expect(timedQuizBoundary).toContain("80% pass mark");
    expect(timedQuizBoundary).toContain("sequential gates");
  });

  it("starts an owner-scoped timed session only after the normal lesson gate is met", async () => {
    const result = await createCaller().training.startTimedAssessment({ assessmentId: assessment.id });
    expect(mocks.start).toHaveBeenCalledWith({ userId: 73, courseSlug: cropAdvisorCourse.id, assessmentId: assessment.id, timeLimitSeconds: getTimedQuizLimitSeconds(assessment) });
    expect(result).toMatchObject({ id: 41, timeLimitSeconds: 360 });
  });

  it("uses an administrator-configured module limit for future learner sessions", async () => {
    mocks.getOverride.mockResolvedValue({ assessmentId: assessment.id, timeLimitSeconds: 720 });
    await createCaller().training.startTimedAssessment({ assessmentId: assessment.id });
    expect(mocks.start).toHaveBeenCalledWith(expect.objectContaining({ assessmentId: assessment.id, timeLimitSeconds: 720 }));
  });

  it("returns the resolved configured time before an eligible learner starts the quiz", async () => {
    mocks.getOverride.mockResolvedValue({ assessmentId: assessment.id, timeLimitSeconds: 720 });
    await expect(createCaller().training.assessmentTimeLimit({ assessmentId: assessment.id })).resolves.toEqual({ timeLimitSeconds: 720 });
  });

  it("scores an assessment only after consuming its authenticated, unexpired timed session", async () => {
    const answers = Object.fromEntries(assessment.questions.map(question => [question.id, question.correctOptionId]));
    const result = await createCaller().training.submitAssessment({ assessmentId: assessment.id, timedSessionId: 41, answers });
    expect(mocks.consume).toHaveBeenCalledWith({ id: 41, userId: 73, courseSlug: cropAdvisorCourse.id, assessmentId: assessment.id });
    expect(mocks.recordAttempt).toHaveBeenCalledWith(expect.objectContaining({ userId: 73, assessmentId: assessment.id, score: 100, passed: true, answers }));
    expect(result).toMatchObject({ score: 100, passed: true });
  });

  it("rejects expired or previously consumed sessions without recording a formal attempt", async () => {
    mocks.consume.mockResolvedValue(false);
    const answers = Object.fromEntries(assessment.questions.map(question => [question.id, question.correctOptionId]));
    await expect(createCaller().training.submitAssessment({ assessmentId: assessment.id, timedSessionId: 41, answers })).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
    expect(mocks.recordAttempt).not.toHaveBeenCalled();
  });

  it("restricts module limit configuration to administrators and supports saving or clearing an override", async () => {
    await expect(createCaller().assessmentTiming.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await createCaller("admin").assessmentTiming.list();
    expect(mocks.listOverrides).toHaveBeenCalledTimes(1);
    await createCaller("admin").assessmentTiming.set({ assessmentId: assessment.id, timeLimitSeconds: 720 });
    expect(mocks.saveOverride).toHaveBeenCalledWith({ assessmentId: assessment.id, timeLimitSeconds: 720, updatedByUserId: 9 });
    await createCaller("admin").assessmentTiming.set({ assessmentId: assessment.id, timeLimitSeconds: null });
    expect(mocks.clearOverride).toHaveBeenCalledWith(assessment.id);
  });
});
