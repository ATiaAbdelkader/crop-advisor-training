import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { cropAdvisorCourse, getAssessmentById, getLessonById } from "../shared/curriculum";
import {
  buildTrainingOverview,
  scoreAssessment,
  shouldIssueCertificate,
  shouldNotifyOwnerOfCertification,
} from "../shared/trainingLogic";
import {
  enrollLearner,
  getLearningRecords,
  issueCertificateIfNeeded,
  markLessonComplete,
  recordAssessmentAttempt,
} from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { COOKIE_NAME } from "@shared/const";

async function getOverviewForLearner(userId: number) {
  const records = await getLearningRecords(userId, cropAdvisorCourse.id);
  return buildTrainingOverview({
    enrolled: Boolean(records.enrollment),
    completedLessonIds: records.completions.map(completion => completion.lessonId),
    attempts: records.attempts.map(attempt => ({
      assessmentId: attempt.assessmentId,
      score: attempt.score,
      passed: attempt.passed === "yes",
      submittedAt: attempt.submittedAt,
    })),
    certificate: records.certificate
      ? {
          credentialId: records.certificate.credentialId,
          recipientName: records.certificate.recipientName,
          finalScore: records.certificate.finalScore,
          issuedAt: records.certificate.issuedAt,
        }
      : null,
  });
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  training: router({
    overview: protectedProcedure.query(({ ctx }) => getOverviewForLearner(ctx.user.id)),
    enroll: protectedProcedure.mutation(async ({ ctx }) => {
      await enrollLearner(ctx.user.id, cropAdvisorCourse.id);
      return getOverviewForLearner(ctx.user.id);
    }),
    completeLesson: protectedProcedure
      .input(z.object({ lessonId: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        if (!getLessonById(input.lessonId)) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found." });
        }
        await enrollLearner(ctx.user.id, cropAdvisorCourse.id);
        const overview = await getOverviewForLearner(ctx.user.id);
        if (!overview.availableLessonIds.includes(input.lessonId)) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Complete the required prerequisite before opening this lesson.",
          });
        }
        await markLessonComplete(ctx.user.id, cropAdvisorCourse.id, input.lessonId);
        return getOverviewForLearner(ctx.user.id);
      }),
    submitAssessment: protectedProcedure
      .input(
        z.object({
          assessmentId: z.string().min(1),
          answers: z.record(z.string(), z.string()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const assessment = getAssessmentById(input.assessmentId);
        if (!assessment) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Assessment not found." });
        }
        await enrollLearner(ctx.user.id, cropAdvisorCourse.id);
        const beforeSubmission = await getOverviewForLearner(ctx.user.id);
        if (!beforeSubmission.availableAssessmentIds.includes(assessment.id)) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "This assessment is not yet unlocked.",
          });
        }

        const result = scoreAssessment(assessment, input.answers);
        await recordAssessmentAttempt({
          userId: ctx.user.id,
          courseSlug: cropAdvisorCourse.id,
          assessmentId: assessment.id,
          score: result.score,
          passed: result.passed,
          answers: input.answers,
        });

        let certificate = null;
        let ownerNotified = false;
        if (shouldIssueCertificate(assessment.id, result.passed)) {
          const issuance = await issueCertificateIfNeeded({
            userId: ctx.user.id,
            courseSlug: cropAdvisorCourse.id,
            recipientName: ctx.user.name ?? "Crop Advisor Learner",
            finalScore: result.score,
          });
          certificate = issuance.certificate;
          if (
            certificate &&
            shouldNotifyOwnerOfCertification(
              assessment.id,
              result.passed,
              issuance.newlyIssued
            )
          ) {
            ownerNotified = await notifyOwner({
              title: "Crop Advisor certification earned",
              content: `${certificate.recipientName} earned the Crop Advisor Foundations Certificate with a final assessment score of ${certificate.finalScore}%. Credential ID: ${certificate.credentialId}.`,
            });
          }
        }

        return {
          ...result,
          certificate,
          ownerNotified,
          overview: await getOverviewForLearner(ctx.user.id),
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
