import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { cropAdvisorCourse, getAssessmentById, getLessonById } from "../shared/curriculum";
import { appliedScenarios, scoreAppliedScenario } from "../shared/appliedScenarios";
import {
  MAX_FIELD_RECORD_ENTRIES,
  MAX_FIELD_RECORD_TITLE_LENGTH,
  MAX_FIELD_RECORD_VALUE_LENGTH,
  type FieldRecordPayload,
} from "../shared/digitalFieldRecords";
import { fieldRecordTemplates } from "../shared/fieldRecordTemplates";
import {
  buildTrainingOverview,
  scoreAssessment,
  shouldIssueCertificate,
  shouldNotifyOwnerOfCertification,
} from "../shared/trainingLogic";
import {
  enrollLearner,
  deleteFieldRecord,
  createFieldRecordReviewShare,
  getActiveFieldRecordReviewShare,
  getFieldRecord,
  getFieldRecordsForOwner,
  getLearningRecords,
  issueCertificateIfNeeded,
  markLessonComplete,
  recordAssessmentAttempt,
  listFieldRecords,
  listAllFieldRecords,
  listFieldRecordReviewShares,
  listLearnerReflections,
  listScenarioAttempts,
  saveFieldRecord,
  recordScenarioAttempt,
  revokeFieldRecordReviewShare,
  submitFieldRecordReview,
  upsertLearnerReflection,
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

const fieldRecordPayloadInput = z.object({
  setup: z.record(z.string().max(160), z.string().max(MAX_FIELD_RECORD_VALUE_LENGTH)),
  entries: z.array(z.record(z.string().max(160), z.string().max(MAX_FIELD_RECORD_VALUE_LENGTH))).max(MAX_FIELD_RECORD_ENTRIES),
  review: z.array(z.string().max(MAX_FIELD_RECORD_VALUE_LENGTH)).max(2),
});

function requireFieldRecordTemplate(templateId: string) {
  const template = fieldRecordTemplates[templateId];
  if (!template) throw new TRPCError({ code: "NOT_FOUND", message: "Field record template not found." });
  return template;
}

function normaliseFieldRecordPayload(templateId: string, payload: z.infer<typeof fieldRecordPayloadInput>): FieldRecordPayload {
  const template = requireFieldRecordTemplate(templateId);
  return {
    setup: Object.fromEntries(template.setupFields.map(field => [field, payload.setup[field]?.trim() ?? ""])),
    entries: payload.entries.map(entry => Object.fromEntries(template.recordColumns.map(column => [column, entry[column]?.trim() ?? ""]))),
    review: template.reviewPrompts.map((_, index) => payload.review[index]?.trim() ?? ""),
  };
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
  fieldRecords: router({
    list: protectedProcedure
      .input(z.object({ templateId: z.string().min(1).max(96) }))
      .query(({ ctx, input }) => {
        requireFieldRecordTemplate(input.templateId);
        return listFieldRecords(ctx.user.id, input.templateId);
      }),
    get: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ ctx, input }) => {
        const record = await getFieldRecord(ctx.user.id, input.id);
        if (!record) throw new TRPCError({ code: "NOT_FOUND", message: "Field record not found." });
        return record;
      }),
    compare: protectedProcedure
      .input(z.object({ ids: z.array(z.number().int().positive()).length(2).refine(ids => new Set(ids).size === 2, "Choose two different records.") }))
      .query(async ({ ctx, input }) => {
        const records = await getFieldRecordsForOwner(ctx.user.id, input.ids);
        if (!records) throw new TRPCError({ code: "NOT_FOUND", message: "One or more selected field records are unavailable." });
        return records;
      }),
    save: protectedProcedure
      .input(z.object({
        id: z.number().int().positive().optional(),
        templateId: z.string().min(1).max(96),
        title: z.string().trim().max(MAX_FIELD_RECORD_TITLE_LENGTH).optional(),
        payload: fieldRecordPayloadInput,
      }))
      .mutation(async ({ ctx, input }) => {
        const template = requireFieldRecordTemplate(input.templateId);
        const record = await saveFieldRecord({
          id: input.id,
          userId: ctx.user.id,
          templateId: template.id,
          title: input.title?.trim() || template.shortTitle,
          payload: normaliseFieldRecordPayload(template.id, input.payload),
        });
        if (!record) throw new TRPCError({ code: "NOT_FOUND", message: "Field record not found." });
        return record;
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const deleted = await deleteFieldRecord(ctx.user.id, input.id);
        if (!deleted) throw new TRPCError({ code: "NOT_FOUND", message: "Field record not found." });
        return { success: true } as const;
      }),
  }),
  scenarios: router({
    list: publicProcedure.query(() => Object.values(appliedScenarios)),
    submit: protectedProcedure
      .input(z.object({ scenarioId: z.string().min(1).max(128), answers: z.record(z.string(), z.string()) }))
      .mutation(async ({ ctx, input }) => {
        const scenario = appliedScenarios[input.scenarioId];
        if (!scenario) throw new TRPCError({ code: "NOT_FOUND", message: "Scenario not found." });
        const result = scoreAppliedScenario(scenario, input.answers);
        await recordScenarioAttempt({
          userId: ctx.user.id,
          moduleId: scenario.moduleId,
          scenarioId: scenario.id,
          score: result.score,
          passed: result.passed,
          answers: input.answers,
        });
        return result;
      }),
  }),
  reviewShares: router({
    list: protectedProcedure
      .input(z.object({ recordId: z.number().int().positive() }))
      .query(async ({ ctx, input }) => {
        const shares = await listFieldRecordReviewShares(ctx.user.id, input.recordId);
        if (!shares) throw new TRPCError({ code: "NOT_FOUND", message: "Field record not found." });
        return shares;
      }),
    create: protectedProcedure
      .input(z.object({ recordId: z.number().int().positive(), reviewerName: z.string().trim().max(160).optional() }))
      .mutation(async ({ ctx, input }) => {
        const share = await createFieldRecordReviewShare({ ownerUserId: ctx.user.id, ...input });
        if (!share) throw new TRPCError({ code: "NOT_FOUND", message: "Field record not found." });
        return share;
      }),
    revoke: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const revoked = await revokeFieldRecordReviewShare(ctx.user.id, input.id);
        if (!revoked) throw new TRPCError({ code: "NOT_FOUND", message: "Active review share not found." });
        return { success: true } as const;
      }),
    open: publicProcedure
      .input(z.object({ shareToken: z.string().min(24).max(64) }))
      .query(async ({ input }) => {
        const share = await getActiveFieldRecordReviewShare(input.shareToken);
        if (!share) throw new TRPCError({ code: "NOT_FOUND", message: "This review link is unavailable." });
        return share;
      }),
    submitReview: publicProcedure
      .input(z.object({ shareToken: z.string().min(24).max(64), reviewerName: z.string().trim().min(2).max(160), reviewComment: z.string().trim().min(10).max(4000) }))
      .mutation(async ({ input }) => {
        const submitted = await submitFieldRecordReview(input);
        if (!submitted) throw new TRPCError({ code: "NOT_FOUND", message: "This review link is unavailable." });
        return { success: true } as const;
      }),
  }),
  reflections: router({
    list: protectedProcedure.query(({ ctx }) => listLearnerReflections(ctx.user.id)),
    save: protectedProcedure
      .input(z.object({ focus: z.string().trim().min(2).max(96), reflection: z.string().trim().min(20).max(4000) }))
      .mutation(({ ctx, input }) => upsertLearnerReflection({ userId: ctx.user.id, ...input })),
  }),
  portfolio: router({
    overview: protectedProcedure.query(async ({ ctx }) => {
      const [overview, records, attempts, reflections] = await Promise.all([
        getOverviewForLearner(ctx.user.id),
        listAllFieldRecords(ctx.user.id),
        listScenarioAttempts(ctx.user.id),
        listLearnerReflections(ctx.user.id),
      ]);
      return { overview, records, attempts, reflections };
    }),
  }),
});

export type AppRouter = typeof appRouter;
