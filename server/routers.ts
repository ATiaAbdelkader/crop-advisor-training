import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { cropAdvisorCourse, getAssessmentById, getLessonById } from "../shared/curriculum";
import { appliedScenarios, scoreAppliedScenario } from "../shared/appliedScenarios";
import { annotationLabelOptions, annotationSupervisorReviewRequirements, cropDiagnosisAnnotationCases, type AnnotationLabel, type CropDiagnosisAnnotationReviewPayload } from "../shared/cropDiagnosisAnnotation";
import { competencyPerformanceLevels, moduleCompetencyByModuleId } from "../shared/competencyFramework";
import { competencyScoreOptions, competencyScoringRequirements, type CompetencyEvidenceAttachment, type CompetencyEvidenceSubmissionPayload, type CompetencyScorecard } from "../shared/competencyScoring";
import { scorecardReflectionRequirements, type ScorecardReflectionPayload } from "../shared/scorecardReflections";
import { fieldInquiryPeerReviewRequirements, type FieldInquiryDecisionPayload, type FieldInquiryPeerReviewPayload } from "../shared/fieldInquiryPeerReview";
import { fieldInquiryPeerReflectionRequirements, type FieldInquiryPeerReflectionPayload } from "../shared/fieldInquiryPeerReflections";
import { caseConferencePreparationRequirements, type CaseConferencePreparationMaterial } from "../shared/caseConferencePreparation";
import { buildLearnerExperience } from "../shared/learnerExperience";
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
  clearAssessmentTimeLimitOverride,
  assertCaseConferenceSlotFacilitator,
  acknowledgeLearnerExerciseSummaryShare,
  cancelCaseConferenceReservation,
  cancelCaseConferenceSlot,
  createCaseConferenceSlot,
  createFieldInquiryPeerShare,
  consumeUnexpiredTimedAssessmentSession,
  enrollLearner,
  deleteFieldRecord,
  deleteFieldPracticumEntry,
  createFieldRecordReviewShare,
  createCropDiagnosisAnnotationReviewSubmission,
  createCompetencyAssessmentSubmission,
  getActiveFieldRecordReviewShare,
  getActiveFieldInquiryPeerShare,
  getFieldInquiryPeerReflectionForOwner,
  getFieldRecord,
  getFieldInquiryDecisionForOwner,
  getAssessmentTimeLimitOverride,
  getCompetencyEvidenceComparisonForLearner,
  getCompetencyEvidenceComparisonForSupervisor,
  getScorecardReflectionForLearner,
  getScorecardReflectionForSupervisor,
  getFieldPracticumEntry,
  getFieldRecordsForOwner,
  getLearningRecords,
  issueCertificateIfNeeded,
  markCropDiagnosisAnnotationFeedbackRead,
  markReviewedLearnerExerciseSummariesRead,
  markCompetencyAssessmentFeedbackRead,
  markLessonComplete,
  listActiveLearnerExerciseSummarySharesForFacilitator,
  mergeLearnerExerciseProgress,
  recordAssessmentAttempt,
  listFieldRecords,
  listFieldPracticumEntries,
  listAllFieldRecords,
  listAssessmentTimeLimitOverrides,
  listCaseConferenceSlotsForAdmin,
  listCaseConferenceSlotsForLearner,
  listFieldRecordReviewShares,
  listFieldInquiryPeerSharesForOwner,
  listLearnerExerciseProgress,
  listLearnerExerciseSummaryShares,
  listUnreadReviewedLearnerExerciseSummaries,
  listLearnerReflections,
  listScenarioAttempts,
  saveFieldRecord,
  saveFieldInquiryPeerReflectionForOwner,
  saveScorecardReflectionForLearner,
  shareLearnerExerciseSummary,
  saveFieldPracticumEntry,
  saveCapstoneSubmission,
  saveAssessmentTimeLimitOverride,
  saveCaseConferencePreparation,
  listCapstoneSubmissions,
  listCropDiagnosisAnnotationNotificationStates,
  listCropDiagnosisAnnotationReviewsForSupervisor,
  listCompetencyAssessmentsForSupervisor,
  listCompetencyAssessmentNotificationStates,
  listMyCompetencyAssessments,
  listMyCropDiagnosisAnnotationReviews,
  recordScenarioAttempt,
  reserveCaseConferenceSlot,
  revokeFieldRecordReviewShare,
  revokeLearnerExerciseSummaryShare,
  revokeFieldInquiryPeerShare,
  submitFieldRecordReview,
  submitFieldInquiryPeerReview,
  submitCropDiagnosisAnnotationSupervisorFeedback,
  submitSupervisorCompetencyScore,
  startTimedAssessmentSession,
  upsertLearnerReflection,
  upsertFieldInquiryDecision,
} from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { storagePut } from "./storage";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { COOKIE_NAME } from "@shared/const";
import { maximumAdministratorTimedQuizSeconds, minimumAdministratorTimedQuizSeconds, resolveTimedQuizLimitSeconds } from "../shared/timedAssessments";
import { isFieldExerciseRoute, maximumExercisePromptCount } from "../shared/exerciseProgress";

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
  entries: z.array(z.record(z.string().max(160), z.string().max(MAX_FIELD_RECORD_ENTRIES))).max(MAX_FIELD_RECORD_ENTRIES),
  review: z.array(z.string().max(MAX_FIELD_RECORD_VALUE_LENGTH)).max(2),
});

const exerciseProgressEntryInput = z
  .object({
    exerciseRoute: z.string().min(1).max(160).refine(isFieldExerciseRoute, "Exercise route is not recognised."),
    completedPrompts: z.number().int().min(0).max(maximumExercisePromptCount),
    totalPrompts: z.number().int().min(1).max(maximumExercisePromptCount),
  })
  .refine(entry => entry.completedPrompts <= entry.totalPrompts, "Completed prompt count cannot exceed the prompt total.");

const fieldInquiryDecisionPayloadInput = z.object({
  decisionQuestion: z.string().trim().min(fieldInquiryPeerReviewRequirements.minimumDecisionLength).max(fieldInquiryPeerReviewRequirements.maximumDecisionLength),
  observationPlan: z.string().trim().min(fieldInquiryPeerReviewRequirements.minimumDecisionLength).max(fieldInquiryPeerReviewRequirements.maximumDecisionLength),
  interpretation: z.string().trim().min(fieldInquiryPeerReviewRequirements.minimumDecisionLength).max(fieldInquiryPeerReviewRequirements.maximumDecisionLength),
  boundedNextAction: z.string().trim().min(fieldInquiryPeerReviewRequirements.minimumDecisionLength).max(fieldInquiryPeerReviewRequirements.maximumDecisionLength),
  recheckOrReferral: z.string().trim().min(fieldInquiryPeerReviewRequirements.minimumDecisionLength).max(fieldInquiryPeerReviewRequirements.maximumDecisionLength),
});

const fieldInquiryPeerReviewPayloadInput = z.object({
  evidenceSeen: z.string().trim().min(fieldInquiryPeerReviewRequirements.minimumReviewLength).max(fieldInquiryPeerReviewRequirements.maximumReviewLength),
  questionToTest: z.string().trim().min(fieldInquiryPeerReviewRequirements.minimumReviewLength).max(fieldInquiryPeerReviewRequirements.maximumReviewLength),
  nextEvidenceSuggestion: z.string().trim().min(fieldInquiryPeerReviewRequirements.minimumReviewLength).max(fieldInquiryPeerReviewRequirements.maximumReviewLength),
});

const fieldInquiryPeerReflectionPayloadInput = z.object({
  learningTaken: z.string().trim().min(fieldInquiryPeerReflectionRequirements.minimumResponseLength).max(fieldInquiryPeerReflectionRequirements.maximumResponseLength),
  revisedAction: z.string().trim().min(fieldInquiryPeerReflectionRequirements.minimumResponseLength).max(fieldInquiryPeerReflectionRequirements.maximumResponseLength),
  nextEvidence: z.string().trim().min(fieldInquiryPeerReflectionRequirements.minimumResponseLength).max(fieldInquiryPeerReflectionRequirements.maximumResponseLength),
});

function requireCourseModule(moduleId: string) {
  const module = cropAdvisorCourse.modules.find(item => item.id === moduleId);
  if (!module) throw new TRPCError({ code: "NOT_FOUND", message: "Course module not found." });
  return module;
}

function normaliseFieldInquiryDecisionPayload(payload: z.infer<typeof fieldInquiryDecisionPayloadInput>): FieldInquiryDecisionPayload {
  return Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, value.trim()])) as FieldInquiryDecisionPayload;
}

function normaliseFieldInquiryPeerReviewPayload(payload: z.infer<typeof fieldInquiryPeerReviewPayloadInput>): FieldInquiryPeerReviewPayload {
  return Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, value.trim()])) as FieldInquiryPeerReviewPayload;
}

function normaliseFieldInquiryPeerReflectionPayload(payload: z.infer<typeof fieldInquiryPeerReflectionPayloadInput>): FieldInquiryPeerReflectionPayload {
  return Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, value.trim()])) as FieldInquiryPeerReflectionPayload;
}

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

const competencyEvidenceSubmissionInput = z.object({
  moduleId: z.string().min(1).max(128),
  revisionOfAssessmentId: z.number().int().positive().optional(),
  evidenceSummary: z.string().trim().min(competencyScoringRequirements.minimumEvidenceSummaryLength).max(5000),
  taskContext: z.string().trim().min(competencyScoringRequirements.minimumTaskContextLength).max(3000),
  reviewOrReferral: z.string().trim().min(competencyScoringRequirements.minimumReviewBoundaryLength).max(3000),
  attachments: z.array(z.object({ name: z.string().trim().min(1).max(120), key: z.string().min(1).max(320), url: z.string().startsWith("/manus-storage/").max(400) })).max(competencyScoringRequirements.maximumEvidencePhotos).default([]),
});

const competencyScorecardInput = z.object(Object.fromEntries(competencyPerformanceLevels.map(level => [level.id, z.enum(competencyScoreOptions.map(option => option.id) as [string, ...string[]])])) as Record<string, z.ZodTypeAny>);

function requireModuleCompetency(moduleId: string) {
  const competency = moduleCompetencyByModuleId[moduleId];
  if (!competency) throw new TRPCError({ code: "NOT_FOUND", message: "Module competency not found." });
  return competency;
}

function normaliseCompetencyEvidenceSubmission(userId: number, payload: z.infer<typeof competencyEvidenceSubmissionInput>): CompetencyEvidenceSubmissionPayload {
  requireModuleCompetency(payload.moduleId);
  const requiredPrefix = `competency-evidence/${userId}/${payload.moduleId}/`;
  const attachments = payload.attachments.map(attachment => {
    if (!attachment.key.startsWith(requiredPrefix) || attachment.url !== `/manus-storage/${attachment.key}`) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Evidence photos must belong to your current module submission." });
    }
    return { name: attachment.name.trim(), key: attachment.key, url: attachment.url };
  });
  return { evidenceSummary: payload.evidenceSummary.trim(), taskContext: payload.taskContext.trim(), reviewOrReferral: payload.reviewOrReferral.trim(), attachments };
}

const competencyPhotoUploadInput = z.object({
  moduleId: z.string().min(1).max(128),
  name: z.string().trim().min(1).max(120),
  contentType: z.enum(competencyScoringRequirements.acceptedEvidencePhotoTypes),
  dataUrl: z.string().min(32).max(Math.ceil(competencyScoringRequirements.maximumEvidencePhotoBytes * 1.4) + 128),
});

const caseConferenceMaterialInput = z.object({
  name: z.string().trim().min(1).max(120),
  key: z.string().trim().min(1).max(360),
  url: z.string().trim().min(1).max(480),
  contentType: z.enum(caseConferencePreparationRequirements.acceptedMaterialTypes),
  sizeBytes: z.number().int().positive().max(caseConferencePreparationRequirements.maximumMaterialBytes),
});

const caseConferenceMaterialUploadInput = z.object({
  slotId: z.number().int().positive(),
  name: z.string().trim().min(1).max(120),
  contentType: z.enum(caseConferencePreparationRequirements.acceptedMaterialTypes),
  dataUrl: z.string().min(32).max(Math.ceil(caseConferencePreparationRequirements.maximumMaterialBytes * 1.4) + 128),
});

const scorecardReflectionInput = z.object({
  feedbackObservation: z.string().trim().min(scorecardReflectionRequirements.minimumResponseLength).max(scorecardReflectionRequirements.maximumResponseLength),
  revisedAction: z.string().trim().min(scorecardReflectionRequirements.minimumResponseLength).max(scorecardReflectionRequirements.maximumResponseLength),
  nextEvidence: z.string().trim().min(scorecardReflectionRequirements.minimumResponseLength).max(scorecardReflectionRequirements.maximumResponseLength),
});

function normaliseScorecardReflection(input: z.infer<typeof scorecardReflectionInput>): ScorecardReflectionPayload {
  return { feedbackObservation: input.feedbackObservation.trim(), revisedAction: input.revisedAction.trim(), nextEvidence: input.nextEvidence.trim() };
}

function decodeCompetencyPhoto(input: z.infer<typeof competencyPhotoUploadInput>) {
  const match = input.dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match || match[1] !== input.contentType) throw new TRPCError({ code: "BAD_REQUEST", message: "Upload a JPEG, PNG, or WEBP image." });
  const bytes = Buffer.from(match[2], "base64");
  if (!bytes.length || bytes.length > competencyScoringRequirements.maximumEvidencePhotoBytes) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Each evidence photo must be 1.5 MB or smaller." });
  return bytes;
}

function decodeCaseConferenceMaterial(input: z.infer<typeof caseConferenceMaterialUploadInput>) {
  const match = input.dataUrl.match(/^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!match || match[1] !== input.contentType) throw new TRPCError({ code: "BAD_REQUEST", message: "Upload a PDF, text file, or DOCX preparation material." });
  const bytes = Buffer.from(match[2], "base64");
  if (!bytes.length || bytes.length > caseConferencePreparationRequirements.maximumMaterialBytes) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Each preparation material must be 3 MB or smaller." });
  return bytes;
}

function normaliseCompetencyScorecard(scorecard: z.infer<typeof competencyScorecardInput>): CompetencyScorecard {
  return Object.fromEntries(competencyPerformanceLevels.map(level => [level.id, scorecard[level.id]])) as CompetencyScorecard;
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
    assessmentTimeLimit: protectedProcedure
      .input(z.object({ assessmentId: z.string().min(1) }))
      .query(async ({ ctx, input }) => {
        const assessment = getAssessmentById(input.assessmentId);
        if (!assessment) throw new TRPCError({ code: "NOT_FOUND", message: "Assessment not found." });
        const overview = await getOverviewForLearner(ctx.user.id);
        if (!overview.availableAssessmentIds.includes(assessment.id)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "This assessment is not yet unlocked." });
        }
        const configuredLimit = await getAssessmentTimeLimitOverride(assessment.id);
        return { timeLimitSeconds: resolveTimedQuizLimitSeconds(assessment, configuredLimit?.timeLimitSeconds) };
      }),
    startTimedAssessment: protectedProcedure
      .input(z.object({ assessmentId: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const assessment = getAssessmentById(input.assessmentId);
        if (!assessment) throw new TRPCError({ code: "NOT_FOUND", message: "Assessment not found." });
        await enrollLearner(ctx.user.id, cropAdvisorCourse.id);
        const overview = await getOverviewForLearner(ctx.user.id);
        if (!overview.availableAssessmentIds.includes(assessment.id)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "This assessment is not yet unlocked." });
        }
        const configuredLimit = await getAssessmentTimeLimitOverride(assessment.id);
        const session = await startTimedAssessmentSession({
          userId: ctx.user.id,
          courseSlug: cropAdvisorCourse.id,
          assessmentId: assessment.id,
          timeLimitSeconds: resolveTimedQuizLimitSeconds(assessment, configuredLimit?.timeLimitSeconds),
        });
        return {
          id: session.id,
          startedAt: session.startedAt,
          expiresAt: session.expiresAt,
          timeLimitSeconds: session.timeLimitSeconds,
        };
      }),
    submitAssessment: protectedProcedure
      .input(
        z.object({
          assessmentId: z.string().min(1),
          timedSessionId: z.number().int().positive(),
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

        const validSession = await consumeUnexpiredTimedAssessmentSession({
          id: input.timedSessionId,
          userId: ctx.user.id,
          courseSlug: cropAdvisorCourse.id,
          assessmentId: assessment.id,
        });
        if (!validSession) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "This timed quiz session has expired or was already submitted. Begin a new attempt to continue.",
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
  exerciseProgress: router({
    mine: protectedProcedure.query(({ ctx }) => listLearnerExerciseProgress(ctx.user.id)),
    sync: protectedProcedure
      .input(z.object({ progress: z.array(exerciseProgressEntryInput).max(14).refine(progress => new Set(progress.map(entry => entry.exerciseRoute)).size === progress.length, "Include each exercise only once.") }))
      .mutation(({ ctx, input }) => mergeLearnerExerciseProgress({ userId: ctx.user.id, progress: input.progress })),
  }),
  exerciseSummaryShares: router({
    mine: protectedProcedure.query(({ ctx }) => listLearnerExerciseSummaryShares(ctx.user.id)),
    unread: protectedProcedure.query(({ ctx }) => listUnreadReviewedLearnerExerciseSummaries(ctx.user.id)),
    markReviewedRead: protectedProcedure
      .input(z.object({ ids: z.array(z.number().int().positive()).max(14).optional() }))
      .mutation(({ ctx, input }) => markReviewedLearnerExerciseSummariesRead(ctx.user.id, input.ids)),
    share: protectedProcedure
      .input(z.object({ exerciseRoute: z.string().min(1).max(160).refine(isFieldExerciseRoute, "Exercise route is not recognised.") }))
      .mutation(async ({ ctx, input }) => {
        const share = await shareLearnerExerciseSummary(ctx.user.id, input.exerciseRoute);
        if (!share) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Open and begin this voluntary exercise before sharing its completion summary." });
        return share;
      }),
    revoke: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const revoked = await revokeLearnerExerciseSummaryShare(ctx.user.id, input.id);
        if (!revoked) throw new TRPCError({ code: "NOT_FOUND", message: "Active voluntary exercise share not found." });
        return { revoked: true } as const;
      }),
    facilitatorQueue: adminProcedure.query(() => listActiveLearnerExerciseSummarySharesForFacilitator()),
    acknowledge: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const acknowledged = await acknowledgeLearnerExerciseSummaryShare(ctx.user.id, input.id);
        if (!acknowledged) throw new TRPCError({ code: "NOT_FOUND", message: "Active learner-selected exercise summary not found." });
        return { acknowledged: true } as const;
      }),
  }),
  fieldInquiryPeerReview: router({
    mine: protectedProcedure
      .input(z.object({ moduleId: z.string().min(1).max(128) }))
      .query(async ({ ctx, input }) => {
        requireCourseModule(input.moduleId);
        const decision = await getFieldInquiryDecisionForOwner(ctx.user.id, input.moduleId);
        if (!decision) return { decision: null, shares: [] };
        const shares = await listFieldInquiryPeerSharesForOwner(ctx.user.id, decision.id);
        return { decision, shares: shares ?? [] };
      }),
    saveDecision: protectedProcedure
      .input(z.object({ moduleId: z.string().min(1).max(128), payload: fieldInquiryDecisionPayloadInput }))
      .mutation(async ({ ctx, input }) => {
        requireCourseModule(input.moduleId);
        const decision = await upsertFieldInquiryDecision({ userId: ctx.user.id, moduleId: input.moduleId, payload: normaliseFieldInquiryDecisionPayload(input.payload) });
        if (!decision) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Field Inquiry decision could not be saved." });
        return decision;
      }),
    createPair: protectedProcedure
      .input(z.object({ decisionId: z.number().int().positive(), pairLabel: z.string().trim().max(fieldInquiryPeerReviewRequirements.maximumPairLabelLength).optional() }))
      .mutation(async ({ ctx, input }) => {
        const share = await createFieldInquiryPeerShare({ ownerUserId: ctx.user.id, decisionId: input.decisionId, pairLabel: input.pairLabel });
        if (!share) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "This Field Inquiry is unavailable or already has an active paired peer-review link. Revoke the existing link before creating another." });
        return share;
      }),
    revokePair: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const revoked = await revokeFieldInquiryPeerShare(ctx.user.id, input.id);
        if (!revoked) throw new TRPCError({ code: "NOT_FOUND", message: "Active peer pair not found." });
        return { revoked: true } as const;
      }),
    peerView: protectedProcedure
      .input(z.object({ shareToken: z.string().min(16).max(64) }))
      .query(async ({ ctx, input }) => {
        const active = await getActiveFieldInquiryPeerShare(input.shareToken);
        if (!active) throw new TRPCError({ code: "NOT_FOUND", message: "This peer-review link is unavailable or has been revoked." });
        if (active.share.ownerUserId === ctx.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "Open your own Field Inquiry from the module page instead of reviewing it as a peer." });
        if (active.share.reviewedAt && active.share.reviewerUserId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "This paired review has already been completed." });
        const module = requireCourseModule(active.decision.moduleId);
        return { module: { id: module.id, title: module.title, eyebrow: module.eyebrow }, decision: { id: active.decision.id, moduleId: active.decision.moduleId, payload: active.decision.payload, createdAt: active.decision.createdAt, updatedAt: active.decision.updatedAt }, share: { id: active.share.id, pairLabel: active.share.pairLabel, reviewedAt: active.share.reviewedAt, reviewerUserId: active.share.reviewerUserId } };
      }),
    submitPeerFeedback: protectedProcedure
      .input(z.object({ shareToken: z.string().min(16).max(64), feedback: fieldInquiryPeerReviewPayloadInput }))
      .mutation(async ({ ctx, input }) => {
        const submitted = await submitFieldInquiryPeerReview({ shareToken: input.shareToken, reviewerUserId: ctx.user.id, reviewerName: ctx.user.name ?? "Paired learner", feedback: normaliseFieldInquiryPeerReviewPayload(input.feedback) });
        if (!submitted) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "This paired review is unavailable, already completed, or cannot be submitted by the decision owner." });
        return { submitted: true } as const;
      }),
    reflection: protectedProcedure
      .input(z.object({ shareId: z.number().int().positive() }))
      .query(async ({ ctx, input }) => ({ reflection: await getFieldInquiryPeerReflectionForOwner({ ownerUserId: ctx.user.id, shareId: input.shareId }) })),
    saveReflection: protectedProcedure
      .input(z.object({ shareId: z.number().int().positive(), payload: fieldInquiryPeerReflectionPayloadInput }))
      .mutation(async ({ ctx, input }) => {
        const reflection = await saveFieldInquiryPeerReflectionForOwner({ ownerUserId: ctx.user.id, shareId: input.shareId, payload: normaliseFieldInquiryPeerReflectionPayload(input.payload) });
        if (!reflection) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "A reflection can be saved only by the decision owner after completed peer feedback." });
        return reflection;
      }),
  }),
  assessmentTiming: router({
    list: adminProcedure.query(() => listAssessmentTimeLimitOverrides()),
    set: adminProcedure
      .input(z.object({ assessmentId: z.string().min(1).max(128), timeLimitSeconds: z.number().int().min(minimumAdministratorTimedQuizSeconds).max(maximumAdministratorTimedQuizSeconds).nullable() }))
      .mutation(async ({ ctx, input }) => {
        const assessment = getAssessmentById(input.assessmentId);
        if (!assessment || assessment.kind !== "module") {
          throw new TRPCError({ code: "NOT_FOUND", message: "Module assessment not found." });
        }
        if (input.timeLimitSeconds === null) {
          await clearAssessmentTimeLimitOverride(assessment.id);
          return { assessmentId: assessment.id, timeLimitSeconds: null };
        }
        const saved = await saveAssessmentTimeLimitOverride({ assessmentId: assessment.id, timeLimitSeconds: input.timeLimitSeconds, updatedByUserId: ctx.user.id });
        if (!saved) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Time limit could not be saved." });
        return saved;
      }),
  }),
  caseConferences: router({
    list: protectedProcedure.query(({ ctx }) => listCaseConferenceSlotsForLearner(ctx.user.id)),
    reserve: protectedProcedure
      .input(z.object({ slotId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        await reserveCaseConferenceSlot(ctx.user.id, input.slotId);
        return { reserved: true } as const;
      }),
    cancelReservation: protectedProcedure
      .input(z.object({ slotId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        await cancelCaseConferenceReservation(ctx.user.id, input.slotId);
        return { cancelled: true } as const;
      }),
    adminList: adminProcedure.query(() => listCaseConferenceSlotsForAdmin()),
    createSlot: adminProcedure
      .input(z.object({ title: z.string().trim().min(3).max(160), startsAt: z.coerce.date(), endsAt: z.coerce.date(), capacity: z.number().int().min(1).max(24) }))
      .mutation(async ({ ctx, input }) => ({ id: await createCaseConferenceSlot({ ...input, facilitatorUserId: ctx.user.id }) })),
    cancelSlot: adminProcedure
      .input(z.object({ slotId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        await cancelCaseConferenceSlot(ctx.user.id, input.slotId);
        return { cancelled: true } as const;
      }),
    uploadPreparationMaterial: adminProcedure
      .input(caseConferenceMaterialUploadInput)
      .mutation(async ({ ctx, input }) => {
        await assertCaseConferenceSlotFacilitator(ctx.user.id, input.slotId);
        const safeName = input.name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(0, 96) || "conference-material";
        const bytes = decodeCaseConferenceMaterial(input);
        const stored = await storagePut(`case-conference-materials/${ctx.user.id}/${input.slotId}/${safeName}`, bytes, input.contentType);
        return { name: input.name, key: stored.key, url: stored.url, contentType: input.contentType, sizeBytes: bytes.length } satisfies CaseConferencePreparationMaterial;
      }),
    savePreparation: adminProcedure
      .input(z.object({ slotId: z.number().int().positive(), notes: z.string().trim().max(caseConferencePreparationRequirements.maximumNoteLength).nullable(), materials: z.array(caseConferenceMaterialInput).max(caseConferencePreparationRequirements.maximumMaterials) }))
      .mutation(async ({ ctx, input }) => {
        const prefix = `case-conference-materials/${ctx.user.id}/${input.slotId}/`;
        if (input.materials.some(material => !material.key.startsWith(prefix) || material.url !== `/manus-storage/${material.key}`)) throw new TRPCError({ code: "BAD_REQUEST", message: "Preparation materials must be uploaded by this facilitator for this conference slot." });
        await saveCaseConferencePreparation({ facilitatorUserId: ctx.user.id, slotId: input.slotId, notes: input.notes?.trim() || null, materials: input.materials });
        return { saved: true } as const;
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
  annotationNotifications: router({
    list: protectedProcedure.query(({ ctx }) => listCropDiagnosisAnnotationNotificationStates(ctx.user.id)),
    markRead: protectedProcedure
      .input(z.object({ ids: z.array(z.number().int().positive()).min(1).max(50).optional() }).optional())
      .mutation(async ({ ctx, input }) => ({ updated: await markCropDiagnosisAnnotationFeedbackRead(ctx.user.id, input?.ids) })),
  }),
  competencyAssessments: router({
    mine: protectedProcedure.query(({ ctx }) => listMyCompetencyAssessments(ctx.user.id)),
    submit: protectedProcedure
      .input(competencyEvidenceSubmissionInput)
      .mutation(async ({ ctx, input }) => {
        const assessment = await createCompetencyAssessmentSubmission({ userId: ctx.user.id, moduleId: input.moduleId, revisionOfAssessmentId: input.revisionOfAssessmentId, payload: normaliseCompetencyEvidenceSubmission(ctx.user.id, input) });
        if (!assessment) throw new TRPCError({ code: input.revisionOfAssessmentId ? "BAD_REQUEST" : "INTERNAL_SERVER_ERROR", message: input.revisionOfAssessmentId ? "This revision request is not available or already has revised evidence." : "Unable to save this competency evidence request." });
        return assessment;
      }),
    uploadPhoto: protectedProcedure
      .input(competencyPhotoUploadInput)
      .mutation(async ({ ctx, input }) => {
        requireModuleCompetency(input.moduleId);
        const safeName = input.name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(0, 96) || "field-evidence";
        const stored = await storagePut(`competency-evidence/${ctx.user.id}/${input.moduleId}/${safeName}`, decodeCompetencyPhoto(input), input.contentType);
        return { name: input.name.trim(), key: stored.key, url: stored.url } satisfies CompetencyEvidenceAttachment;
      }),
    queue: adminProcedure.query(() => listCompetencyAssessmentsForSupervisor()),
    comparison: protectedProcedure.input(z.object({ assessmentId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const comparison = await getCompetencyEvidenceComparisonForLearner(ctx.user.id, input.assessmentId);
      if (!comparison) throw new TRPCError({ code: "NOT_FOUND", message: "This private revision comparison is not available." });
      return comparison;
    }),
    supervisorComparison: adminProcedure.input(z.object({ assessmentId: z.number().int().positive() })).query(async ({ input }) => getCompetencyEvidenceComparisonForSupervisor(input.assessmentId)),
    score: adminProcedure
      .input(z.object({ id: z.number().int().positive(), status: z.enum(["scored", "revision_requested"]), scorecard: competencyScorecardInput, feedback: z.string().trim().min(competencyScoringRequirements.minimumSupervisorFeedbackLength).max(5000) }))
      .mutation(async ({ ctx, input }) => {
        const saved = await submitSupervisorCompetencyScore({ id: input.id, supervisorUserId: ctx.user.id, supervisorName: ctx.user.name?.trim() || "Course supervisor", status: input.status, scorecard: normaliseCompetencyScorecard(input.scorecard), feedback: input.feedback.trim() });
        if (!saved) throw new TRPCError({ code: "NOT_FOUND", message: "Competency evidence request not found." });
        return { success: true } as const;
      }),
    reflection: protectedProcedure
      .input(z.object({ assessmentId: z.number().int().positive() }))
      .query(async ({ ctx, input }) => {
        const result = await getScorecardReflectionForLearner(ctx.user.id, input.assessmentId);
        if (!result) throw new TRPCError({ code: "NOT_FOUND", message: "This private scorecard was not found." });
        return result;
      }),
    saveReflection: protectedProcedure
      .input(z.object({ assessmentId: z.number().int().positive(), reflection: scorecardReflectionInput }))
      .mutation(async ({ ctx, input }) => {
        const reflection = await saveScorecardReflectionForLearner({ userId: ctx.user.id, assessmentId: input.assessmentId, reflection: normaliseScorecardReflection(input.reflection) });
        if (!reflection) throw new TRPCError({ code: "NOT_FOUND", message: "A scored private scorecard is required before saving this reflection." });
        return reflection;
      }),
    supervisorReflection: adminProcedure
      .input(z.object({ assessmentId: z.number().int().positive() }))
      .query(({ input }) => getScorecardReflectionForSupervisor(input.assessmentId)),
  }),
  competencyNotifications: router({
    list: protectedProcedure.query(({ ctx }) => listCompetencyAssessmentNotificationStates(ctx.user.id)),
    markRead: protectedProcedure
      .input(z.object({ ids: z.array(z.number().int().positive()).min(1).max(50).optional() }).optional())
      .mutation(async ({ ctx, input }) => ({ updated: await markCompetencyAssessmentFeedbackRead(ctx.user.id, input?.ids) })),
  }),
  learnerExperience: router({
    overview: protectedProcedure.query(async ({ ctx }) => {
      const [learningRecords, scenarioAttempts, competencyAssessments, fieldRecords, practicumEntries, capstoneEntries, annotationReviews, reflections] = await Promise.all([
        getLearningRecords(ctx.user.id, cropAdvisorCourse.id),
        listScenarioAttempts(ctx.user.id),
        listMyCompetencyAssessments(ctx.user.id),
        listAllFieldRecords(ctx.user.id),
        listFieldPracticumEntries(ctx.user.id),
        listCapstoneSubmissions(ctx.user.id),
        listMyCropDiagnosisAnnotationReviews(ctx.user.id),
        listLearnerReflections(ctx.user.id),
      ]);
      const overview = await getOverviewForLearner(ctx.user.id);
      return buildLearnerExperience({
        passedModuleIds: overview.moduleStates.filter(state => state.assessmentPassed).map(state => state.id),
        assessmentAttempts: learningRecords.attempts,
        scenarioAttempts,
        competencyAssessments,
        evidenceCount: {
          records: fieldRecords.length,
          scenarios: scenarioAttempts.length,
          practicum: practicumEntries.length,
          capstones: capstoneEntries.length,
          annotations: annotationReviews.length,
          competencySubmissions: competencyAssessments.length,
          competencyPhotos: competencyAssessments.reduce((count, assessment) => count + assessment.payload.attachments.length, 0),
          reflections: reflections.length,
        },
      });
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
