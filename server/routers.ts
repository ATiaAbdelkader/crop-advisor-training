import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { cropAdvisorCourse, getAssessmentById, getLessonById } from "../shared/curriculum";
import { appliedScenarios, scoreAppliedScenario } from "../shared/appliedScenarios";
import { annotationLabelOptions, annotationSupervisorReviewRequirements, cropDiagnosisAnnotationCases, type AnnotationLabel, type CropDiagnosisAnnotationReviewPayload } from "../shared/cropDiagnosisAnnotation";
import {
  MAX_FIELD_RECORD_ENTRIES,
  MAX_FIELD_RECORD_TITLE_LENGTH,
  MAX_FIELD_RECORD_VALUE_LENGTH,
  type FieldRecordPayload,
} from "../shared/digitalFieldRecords";
import { fieldRecordTemplates } from "../shared/fieldRecordTemplates";
import {
  capstoneCases,
  fieldPracticumFields,
  fieldReadinessRubric,
  type CapstoneSubmissionPayload,
  type FieldPracticumPayload,
} from "../shared/fieldReadiness";
import {
  buildTrainingOverview,
  scoreAssessment,
  shouldIssueCertificate,
  shouldNotifyOwnerOfCertification,
} from "../shared/trainingLogic";
import {
  enrollLearner,
  deleteFieldRecord,
  deleteFieldPracticumEntry,
  createFieldRecordReviewShare,
  createCropDiagnosisAnnotationReviewSubmission,
  getActiveFieldRecordReviewShare,
  getFieldRecord,
  getFieldPracticumEntry,
  getFieldRecordsForOwner,
  getLearningRecords,
  issueCertificateIfNeeded,
  markLessonComplete,
  recordAssessmentAttempt,
  listFieldRecords,
  listFieldPracticumEntries,
  listAllFieldRecords,
  listFieldRecordReviewShares,
  listLearnerReflections,
  listScenarioAttempts,
  saveFieldRecord,
  saveFieldPracticumEntry,
  saveCapstoneSubmission,
  listCapstoneSubmissions,
  listCropDiagnosisAnnotationReviewsForSupervisor,
  listMyCropDiagnosisAnnotationReviews,
  recordScenarioAttempt,
  revokeFieldRecordReviewShare,
  submitFieldRecordReview,
  submitCropDiagnosisAnnotationSupervisorFeedback,
  upsertLearnerReflection,
} from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
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

const fieldPracticumPayloadInput = z.object({
  visitDate: z.string().trim().max(32),
  visitVerification: z.string().trim().max(2400),
  localityAndProductionContext: z.string().trim().max(4000),
  growerQuestion: z.string().trim().max(2400),
  growerInterviewNotes: z.string().trim().max(4000),
  observationAndEvidence: z.string().trim().max(5000),
  competingExplanations: z.string().trim().max(4000),
  provisionalDiagnosis: z.string().trim().max(4000),
  recommendationAndRationale: z.string().trim().max(5000),
  communicationPlan: z.string().trim().max(3200),
  economicsAndRiskCheck: z.string().trim().max(3200),
  followUpTrigger: z.string().trim().max(2400),
  followUpOutcome: z.string().trim().max(3200),
  referralOrEscalationBoundary: z.string().trim().max(2400),
  localSourcesChecked: z.string().trim().max(3200),
  rubric: z.record(z.string().max(96), z.number().int().min(0).max(4)),
});

function normaliseFieldPracticumPayload(payload: z.infer<typeof fieldPracticumPayloadInput>): FieldPracticumPayload {
  return {
    ...Object.fromEntries(fieldPracticumFields.map(field => [field.key, payload[field.key]?.trim() ?? ""])),
    rubric: Object.fromEntries(fieldReadinessRubric.map(criterion => [criterion.id, payload.rubric[criterion.id] ?? 0])),
  } as FieldPracticumPayload;
}

const capstonePayloadInput = z.object({
  responses: z.array(z.string().trim().max(4000)).max(5),
  selfReview: z.string().trim().max(4000),
  rubric: z.record(z.string().max(96), z.number().int().min(0).max(4)),
});

function normaliseCapstonePayload(capstoneId: string, payload: z.infer<typeof capstonePayloadInput>): CapstoneSubmissionPayload {
  const capstone = capstoneCases[capstoneId];
  if (!capstone) throw new TRPCError({ code: "NOT_FOUND", message: "Capstone case not found." });
  return {
    responses: capstone.responsePrompts.map((_, index) => payload.responses[index]?.trim() ?? ""),
    selfReview: payload.selfReview.trim(),
    rubric: Object.fromEntries(fieldReadinessRubric.map(criterion => [criterion.id, payload.rubric[criterion.id] ?? 0])),
  };
}

const annotationPinInput = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  label: z.enum(annotationLabelOptions.map(option => option.id) as [string, ...string[]]),
});

const annotationReviewPayloadInput = z.object({
  rationale: z.string().trim().min(annotationSupervisorReviewRequirements.minimumRationaleLength).max(4000),
  cases: z.array(z.object({ caseId: z.string().min(1).max(128), answer: z.string().min(1).max(64), pins: z.array(annotationPinInput).min(1).max(24) })).length(cropDiagnosisAnnotationCases.length),
});

function normaliseAnnotationReviewPayload(payload: z.infer<typeof annotationReviewPayloadInput>): CropDiagnosisAnnotationReviewPayload {
  const submittedByCaseId = new Map(payload.cases.map(caseItem => [caseItem.caseId, caseItem]));
  if (submittedByCaseId.size !== cropDiagnosisAnnotationCases.length) throw new TRPCError({ code: "BAD_REQUEST", message: "Include one completed response for every visual case." });
  return {
    rationale: payload.rationale.trim(),
    cases: cropDiagnosisAnnotationCases.map(caseDefinition => {
      const submitted = submittedByCaseId.get(caseDefinition.id);
      if (!submitted) throw new TRPCError({ code: "BAD_REQUEST", message: "A visual case is missing from this submission." });
      if (!caseDefinition.options.some(option => option.id === submitted.answer)) throw new TRPCError({ code: "BAD_REQUEST", message: "An annotation answer is invalid." });
      const labels = new Set(submitted.pins.map(pin => pin.label));
      if (caseDefinition.requiredLabels.some(label => !labels.has(label))) throw new TRPCError({ code: "BAD_REQUEST", message: "Mark every required evidence category before requesting review." });
      return { caseId: caseDefinition.id, answer: submitted.answer, pins: submitted.pins.map(pin => ({ x: pin.x, y: pin.y, label: pin.label as AnnotationLabel })) };
    }),
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
  annotationReviews: router({
    mine: protectedProcedure.query(({ ctx }) => listMyCropDiagnosisAnnotationReviews(ctx.user.id)),
    submit: protectedProcedure
      .input(annotationReviewPayloadInput)
      .mutation(async ({ ctx, input }) => {
        const review = await createCropDiagnosisAnnotationReviewSubmission({ userId: ctx.user.id, payload: normaliseAnnotationReviewPayload(input) });
        if (!review) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to save this review request." });
        return review;
      }),
    queue: adminProcedure.query(() => listCropDiagnosisAnnotationReviewsForSupervisor()),
    provideFeedback: adminProcedure
      .input(z.object({ id: z.number().int().positive(), status: z.enum(["reviewed", "revision_requested"]), feedback: z.string().trim().min(annotationSupervisorReviewRequirements.minimumFeedbackLength).max(4000) }))
      .mutation(async ({ ctx, input }) => {
        const saved = await submitCropDiagnosisAnnotationSupervisorFeedback({ id: input.id, supervisorUserId: ctx.user.id, supervisorName: ctx.user.name?.trim() || "Course supervisor", status: input.status, feedback: input.feedback.trim() });
        if (!saved) throw new TRPCError({ code: "NOT_FOUND", message: "Annotation review request not found." });
        return { success: true } as const;
      }),
  }),
  fieldReadiness: router({
    practicum: router({
      list: protectedProcedure.query(({ ctx }) => listFieldPracticumEntries(ctx.user.id)),
      get: protectedProcedure
        .input(z.object({ id: z.number().int().positive() }))
        .query(async ({ ctx, input }) => {
          const entry = await getFieldPracticumEntry(ctx.user.id, input.id);
          if (!entry) throw new TRPCError({ code: "NOT_FOUND", message: "Practicum entry not found." });
          return entry;
        }),
      save: protectedProcedure
        .input(z.object({ id: z.number().int().positive().optional(), title: z.string().trim().min(3).max(160), payload: fieldPracticumPayloadInput }))
        .mutation(async ({ ctx, input }) => {
          const entry = await saveFieldPracticumEntry({ id: input.id, userId: ctx.user.id, title: input.title, payload: normaliseFieldPracticumPayload(input.payload) });
          if (!entry) throw new TRPCError({ code: "NOT_FOUND", message: "Practicum entry not found." });
          return entry;
        }),
      delete: protectedProcedure
        .input(z.object({ id: z.number().int().positive() }))
        .mutation(async ({ ctx, input }) => {
          const deleted = await deleteFieldPracticumEntry(ctx.user.id, input.id);
          if (!deleted) throw new TRPCError({ code: "NOT_FOUND", message: "Practicum entry not found." });
          return { success: true } as const;
        }),
    }),
    capstones: router({
      list: protectedProcedure.query(({ ctx }) => listCapstoneSubmissions(ctx.user.id)),
      save: protectedProcedure
        .input(z.object({ capstoneId: z.string().min(1).max(128), payload: capstonePayloadInput }))
        .mutation(({ ctx, input }) => saveCapstoneSubmission({ userId: ctx.user.id, capstoneId: input.capstoneId, payload: normaliseCapstonePayload(input.capstoneId, input.payload) })),
    }),
    overview: protectedProcedure.query(async ({ ctx }) => {
      const [practicums, capstones] = await Promise.all([listFieldPracticumEntries(ctx.user.id), listCapstoneSubmissions(ctx.user.id)]);
      return { practicums, capstones };
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
