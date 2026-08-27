import { and, desc, eq, gt, inArray, isNotNull, isNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  assessmentTimeLimitOverrides,
  assessmentAttempts,
  caseConferenceReservations,
  caseConferenceSlots,
  capstoneSubmissions,
  certificates,
  competencyAssessments,
  courseEnrollments,
  cropDiagnosisAnnotationReviews,
  fieldInquiryDecisions,
  fieldInquiryPeerReflections,
  fieldInquiryPeerShares,
  fieldPracticumEntries,
  fieldRecords,
  fieldRecordReviewShares,
  InsertUser,
  learnerReflections,
  learnerExerciseProgress,
  learnerExerciseSummaryShares,
  lessonCompletions,
  scenarioAttempts,
  timedAssessmentSessions,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import type { FieldRecordPayload } from "../shared/digitalFieldRecords";
import type { FieldInquiryDecisionPayload, FieldInquiryPeerReviewPayload } from "../shared/fieldInquiryPeerReview";
import type { FieldInquiryPeerReflectionPayload } from "../shared/fieldInquiryPeerReflections";
import type { CropDiagnosisAnnotationReviewPayload } from "../shared/cropDiagnosisAnnotation";
import type { CompetencyEvidenceSubmissionPayload, CompetencyScorecard } from "../shared/competencyScoring";
import { parseScorecardReflection, scorecardReflectionFocus, type ScorecardReflectionPayload } from "../shared/scorecardReflections";
import type { CapstoneSubmissionPayload, FieldPracticumPayload } from "../shared/fieldReadiness";
import type { CaseConferencePreparationMaterial } from "../shared/caseConferencePreparation";

export type CaseConferenceSlotView = {
  id: number;
  title: string;
  startsAt: Date;
  endsAt: Date;
  capacity: number;
  reservedCount: number;
  status: "open" | "cancelled";
  isBooked: boolean;
  preparation?: { notes: string | null; materials: readonly CaseConferencePreparationMaterial[] };
};

export type AdminCaseConferenceSlotView = CaseConferenceSlotView & {
  facilitatorUserId: number;
  reservations: readonly { id: number; learnerName: string; learnerEmail: string | null; status: "booked" | "cancelled"; createdAt: Date; cancelledAt: Date | null }[];
};

function parseCaseConferenceMaterials(value: string | null): readonly CaseConferencePreparationMaterial[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(item => item && typeof item.name === "string" && typeof item.key === "string" && typeof item.url === "string" && typeof item.contentType === "string" && typeof item.sizeBytes === "number") as CaseConferencePreparationMaterial[];
  } catch {
    return [];
  }
}

export function projectCaseConferenceSlotForLearner(
  slot: Pick<typeof caseConferenceSlots.$inferSelect, "id" | "title" | "startsAt" | "endsAt" | "capacity" | "reservedCount" | "status" | "preparationNotes" | "preparationMaterialsJson">,
  isBooked: boolean,
): CaseConferenceSlotView {
  return {
    id: slot.id,
    title: slot.title,
    startsAt: slot.startsAt,
    endsAt: slot.endsAt,
    capacity: slot.capacity,
    reservedCount: slot.reservedCount,
    status: slot.status,
    isBooked,
    ...(isBooked ? { preparation: { notes: slot.preparationNotes, materials: parseCaseConferenceMaterials(slot.preparationMaterialsJson) } } : {}),
  };
}

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available.");
  return db;
}

export async function listCaseConferenceSlotsForLearner(userId: number): Promise<CaseConferenceSlotView[]> {
  const db = await requireDb();
  const slots = await db.select().from(caseConferenceSlots).where(and(eq(caseConferenceSlots.status, "open"), gt(caseConferenceSlots.startsAt, new Date()))).orderBy(caseConferenceSlots.startsAt);
  if (!slots.length) return [];
  const reservations = await db.select().from(caseConferenceReservations).where(and(eq(caseConferenceReservations.userId, userId), inArray(caseConferenceReservations.slotId, slots.map(slot => slot.id))));
  const bookedIds = new Set(reservations.filter(reservation => reservation.status === "booked").map(reservation => reservation.slotId));
  return slots.map(slot => projectCaseConferenceSlotForLearner(slot, bookedIds.has(slot.id)));
}

export async function listCaseConferenceSlotsForAdmin(): Promise<AdminCaseConferenceSlotView[]> {
  const db = await requireDb();
  const slots = await db.select().from(caseConferenceSlots).orderBy(desc(caseConferenceSlots.startsAt));
  if (!slots.length) return [];
  const reservations = await db.select({ id: caseConferenceReservations.id, slotId: caseConferenceReservations.slotId, status: caseConferenceReservations.status, createdAt: caseConferenceReservations.createdAt, cancelledAt: caseConferenceReservations.cancelledAt, learnerName: users.name, learnerEmail: users.email }).from(caseConferenceReservations).innerJoin(users, eq(caseConferenceReservations.userId, users.id)).where(inArray(caseConferenceReservations.slotId, slots.map(slot => slot.id)));
  return slots.map(slot => ({
    id: slot.id,
    facilitatorUserId: slot.facilitatorUserId,
    title: slot.title,
    startsAt: slot.startsAt,
    endsAt: slot.endsAt,
    capacity: slot.capacity,
    reservedCount: slot.reservedCount,
    status: slot.status,
    isBooked: false,
    preparation: { notes: slot.preparationNotes, materials: parseCaseConferenceMaterials(slot.preparationMaterialsJson) },
    reservations: reservations.filter(reservation => reservation.slotId === slot.id).map(({ slotId: _slotId, ...reservation }) => ({ ...reservation, learnerName: reservation.learnerName || "Learner" })),
  }));
}

export async function createCaseConferenceSlot(input: { facilitatorUserId: number; title: string; startsAt: Date; endsAt: Date; capacity: number }) {
  const db = await requireDb();
  if (input.startsAt <= new Date() || input.endsAt <= input.startsAt) throw new Error("Choose a future start time and an end time after the start.");
  if (input.capacity < 1 || input.capacity > 24) throw new Error("Conference capacity must be between 1 and 24 learners.");
  const result = await db.insert(caseConferenceSlots).values({ ...input, status: "open", reservedCount: 0 });
  return Number(result[0].insertId);
}

export async function cancelCaseConferenceSlot(adminUserId: number, slotId: number) {
  const db = await requireDb();
  const slot = (await db.select().from(caseConferenceSlots).where(eq(caseConferenceSlots.id, slotId)).limit(1))[0];
  if (!slot) throw new Error("Conference slot not found.");
  if (slot.facilitatorUserId !== adminUserId) throw new Error("Only the facilitator who created this slot can cancel it.");
  await db.update(caseConferenceSlots).set({ status: "cancelled" }).where(eq(caseConferenceSlots.id, slotId));
}

export async function saveCaseConferencePreparation(input: { facilitatorUserId: number; slotId: number; notes: string | null; materials: readonly CaseConferencePreparationMaterial[] }) {
  const db = await requireDb();
  const slot = (await db.select().from(caseConferenceSlots).where(eq(caseConferenceSlots.id, input.slotId)).limit(1))[0];
  if (!slot) throw new Error("Conference slot not found.");
  if (slot.facilitatorUserId !== input.facilitatorUserId) throw new Error("Only the facilitator who created this slot can edit its preparation content.");
  await db.update(caseConferenceSlots).set({ preparationNotes: input.notes, preparationMaterialsJson: JSON.stringify(input.materials) }).where(eq(caseConferenceSlots.id, input.slotId));
}

export async function assertCaseConferenceSlotFacilitator(facilitatorUserId: number, slotId: number) {
  const db = await requireDb();
  const slot = (await db.select().from(caseConferenceSlots).where(eq(caseConferenceSlots.id, slotId)).limit(1))[0];
  if (!slot || slot.facilitatorUserId !== facilitatorUserId) throw new Error("Only the facilitator who created this slot can add preparation materials.");
  return slot;
}

export async function reserveCaseConferenceSlot(userId: number, slotId: number) {
  const db = await requireDb();
  const slot = (await db.select().from(caseConferenceSlots).where(eq(caseConferenceSlots.id, slotId)).limit(1))[0];
  if (!slot || slot.status !== "open" || slot.startsAt <= new Date()) throw new Error("This conference slot is no longer available.");
  const existing = (await db.select().from(caseConferenceReservations).where(and(eq(caseConferenceReservations.slotId, slotId), eq(caseConferenceReservations.userId, userId))).limit(1))[0];
  if (existing?.status === "booked") throw new Error("You already reserved this conference slot.");
  if (slot.reservedCount >= slot.capacity) throw new Error("This conference is fully booked.");
  if (existing) {
    await db.update(caseConferenceReservations).set({ status: "booked", cancelledAt: null }).where(eq(caseConferenceReservations.id, existing.id));
  } else {
    await db.insert(caseConferenceReservations).values({ slotId, userId, status: "booked" });
  }
  await db.update(caseConferenceSlots).set({ reservedCount: sql`${caseConferenceSlots.reservedCount} + 1` }).where(eq(caseConferenceSlots.id, slotId));
}

export async function cancelCaseConferenceReservation(userId: number, slotId: number) {
  const db = await requireDb();
  const slot = (await db.select().from(caseConferenceSlots).where(eq(caseConferenceSlots.id, slotId)).limit(1))[0];
  if (!slot || slot.startsAt <= new Date()) throw new Error("This conference can no longer be cancelled online.");
  const reservation = (await db.select().from(caseConferenceReservations).where(and(eq(caseConferenceReservations.slotId, slotId), eq(caseConferenceReservations.userId, userId), eq(caseConferenceReservations.status, "booked"))).limit(1))[0];
  if (!reservation) throw new Error("You do not have an active reservation for this conference.");
  await db.update(caseConferenceReservations).set({ status: "cancelled", cancelledAt: new Date() }).where(eq(caseConferenceReservations.id, reservation.id));
  await db.update(caseConferenceSlots).set({ reservedCount: sql`GREATEST(0, ${caseConferenceSlots.reservedCount} - 1)` }).where(eq(caseConferenceSlots.id, slotId));
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  textFields.forEach(field => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function enrollLearner(userId: number, courseSlug: string) {
  const db = await requireDb();
  await db
    .insert(courseEnrollments)
    .values({ userId, courseSlug })
    .onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
}

export async function getLearningRecords(userId: number, courseSlug: string) {
  const db = await requireDb();
  const [enrollmentRows, completionRows, attemptRows, certificateRows] = await Promise.all([
    db
      .select()
      .from(courseEnrollments)
      .where(and(eq(courseEnrollments.userId, userId), eq(courseEnrollments.courseSlug, courseSlug)))
      .limit(1),
    db
      .select()
      .from(lessonCompletions)
      .where(and(eq(lessonCompletions.userId, userId), eq(lessonCompletions.courseSlug, courseSlug))),
    db
      .select()
      .from(assessmentAttempts)
      .where(and(eq(assessmentAttempts.userId, userId), eq(assessmentAttempts.courseSlug, courseSlug)))
      .orderBy(desc(assessmentAttempts.submittedAt)),
    db
      .select()
      .from(certificates)
      .where(and(eq(certificates.userId, userId), eq(certificates.courseSlug, courseSlug)))
      .limit(1),
  ]);
  return {
    enrollment: enrollmentRows[0] ?? null,
    completions: completionRows,
    attempts: attemptRows,
    certificate: certificateRows[0] ?? null,
  };
}

export async function markLessonComplete(
  userId: number,
  courseSlug: string,
  lessonId: string
) {
  const db = await requireDb();
  await db
    .insert(lessonCompletions)
    .values({ userId, courseSlug, lessonId })
    .onDuplicateKeyUpdate({ set: { completedAt: new Date() } });
}

/** Returns only the signed-in learner's voluntary aggregate exercise completion; prompt content is never stored here. */
export async function listLearnerExerciseProgress(userId: number) {
  const db = await requireDb();
  return db
    .select()
    .from(learnerExerciseProgress)
    .where(eq(learnerExerciseProgress.userId, userId))
    .orderBy(desc(learnerExerciseProgress.updatedAt));
}

/** Merges a device's voluntary completion counts without allowing an older device to erase completed practice. */
export async function mergeLearnerExerciseProgress(input: {
  userId: number;
  progress: readonly { exerciseRoute: string; completedPrompts: number; totalPrompts: number }[];
}) {
  const db = await requireDb();
  for (const entry of input.progress) {
    const existing = await db
      .select()
      .from(learnerExerciseProgress)
      .where(and(eq(learnerExerciseProgress.userId, input.userId), eq(learnerExerciseProgress.exerciseRoute, entry.exerciseRoute)))
      .limit(1);
    const current = existing[0];
    const completedPrompts = Math.min(entry.totalPrompts, Math.max(entry.completedPrompts, current?.completedPrompts ?? 0));
    const changed = !current || current.completedPrompts !== completedPrompts || current.totalPrompts !== entry.totalPrompts;
    if (!current) {
      await db.insert(learnerExerciseProgress).values({ userId: input.userId, exerciseRoute: entry.exerciseRoute, completedPrompts, totalPrompts: entry.totalPrompts });
    } else if (changed) {
      await db.update(learnerExerciseProgress).set({ completedPrompts, totalPrompts: entry.totalPrompts, updatedAt: new Date() }).where(eq(learnerExerciseProgress.id, current.id));
    }
    if (changed) {
      await db.update(learnerExerciseSummaryShares).set({ reviewedAt: null, reviewedByUserId: null, reviewedReadAt: null }).where(and(
        eq(learnerExerciseSummaryShares.ownerUserId, input.userId),
        eq(learnerExerciseSummaryShares.exerciseRoute, entry.exerciseRoute),
        isNull(learnerExerciseSummaryShares.revokedAt),
      ));
    }
  }
  return listLearnerExerciseProgress(input.userId);
}

export type LearnerExerciseSummaryShare = {
  id: number;
  exerciseRoute: string;
  sharedAt: Date;
  reviewedAt: Date | null;
  reviewedReadAt: Date | null;
  revokedAt: Date | null;
  completedPrompts: number | null;
  totalPrompts: number | null;
};

/** Shows a learner only the voluntary exercise summaries they have personally shared or revoked. */
export async function listLearnerExerciseSummaryShares(ownerUserId: number): Promise<LearnerExerciseSummaryShare[]> {
  const db = await requireDb();
  return db
    .select({
      id: learnerExerciseSummaryShares.id,
      exerciseRoute: learnerExerciseSummaryShares.exerciseRoute,
      sharedAt: learnerExerciseSummaryShares.sharedAt,
      reviewedAt: learnerExerciseSummaryShares.reviewedAt,
      reviewedReadAt: learnerExerciseSummaryShares.reviewedReadAt,
      revokedAt: learnerExerciseSummaryShares.revokedAt,
      completedPrompts: learnerExerciseProgress.completedPrompts,
      totalPrompts: learnerExerciseProgress.totalPrompts,
    })
    .from(learnerExerciseSummaryShares)
    .leftJoin(learnerExerciseProgress, and(
      eq(learnerExerciseProgress.userId, learnerExerciseSummaryShares.ownerUserId),
      eq(learnerExerciseProgress.exerciseRoute, learnerExerciseSummaryShares.exerciseRoute),
    ))
    .where(eq(learnerExerciseSummaryShares.ownerUserId, ownerUserId))
    .orderBy(desc(learnerExerciseSummaryShares.sharedAt));
}

/** Shares the latest aggregate completion summary only after the learner has started that exercise. */
export async function shareLearnerExerciseSummary(ownerUserId: number, exerciseRoute: string) {
  const db = await requireDb();
  const progress = await db
    .select()
    .from(learnerExerciseProgress)
    .where(and(eq(learnerExerciseProgress.userId, ownerUserId), eq(learnerExerciseProgress.exerciseRoute, exerciseRoute)))
    .limit(1);
  if (!progress[0]) return null;
  await db
    .insert(learnerExerciseSummaryShares)
    .values({ ownerUserId, exerciseRoute })
    .onDuplicateKeyUpdate({ set: { sharedAt: new Date(), revokedAt: null, reviewedAt: null, reviewedByUserId: null, reviewedReadAt: null } });
  const shares = await listLearnerExerciseSummaryShares(ownerUserId);
  return shares.find(share => share.exerciseRoute === exerciseRoute && !share.revokedAt) ?? null;
}

/** Revoking immediately removes the aggregate exercise status from all facilitator views. */
export async function revokeLearnerExerciseSummaryShare(ownerUserId: number, id: number) {
  const db = await requireDb();
  const result = await db
    .update(learnerExerciseSummaryShares)
    .set({ revokedAt: new Date() })
    .where(and(
      eq(learnerExerciseSummaryShares.id, id),
      eq(learnerExerciseSummaryShares.ownerUserId, ownerUserId),
      isNull(learnerExerciseSummaryShares.revokedAt),
    ));
  return result[0].affectedRows > 0;
}

/** An authorised facilitator can acknowledge one active learner-selected summary; this is not a score or assessment. */
export async function acknowledgeLearnerExerciseSummaryShare(facilitatorUserId: number, id: number) {
  const db = await requireDb();
  const result = await db
    .update(learnerExerciseSummaryShares)
    .set({ reviewedByUserId: facilitatorUserId, reviewedAt: new Date(), reviewedReadAt: null })
    .where(and(eq(learnerExerciseSummaryShares.id, id), isNull(learnerExerciseSummaryShares.revokedAt)));
  return result[0].affectedRows > 0;
}

/** Returns only the signed-in learner's active, facilitator-reviewed summaries that have not yet been seen. */
export async function listUnreadReviewedLearnerExerciseSummaries(ownerUserId: number) {
  const db = await requireDb();
  return db
    .select({ id: learnerExerciseSummaryShares.id, exerciseRoute: learnerExerciseSummaryShares.exerciseRoute, reviewedAt: learnerExerciseSummaryShares.reviewedAt })
    .from(learnerExerciseSummaryShares)
    .where(and(
      eq(learnerExerciseSummaryShares.ownerUserId, ownerUserId),
      isNull(learnerExerciseSummaryShares.revokedAt),
      isNotNull(learnerExerciseSummaryShares.reviewedAt),
      isNull(learnerExerciseSummaryShares.reviewedReadAt),
    ))
    .orderBy(desc(learnerExerciseSummaryShares.reviewedAt));
}

/** Marks only the current learner's active reviewed-summary notifications as seen. */
export async function markReviewedLearnerExerciseSummariesRead(ownerUserId: number, ids?: number[]) {
  const conditions = [
    eq(learnerExerciseSummaryShares.ownerUserId, ownerUserId),
    isNull(learnerExerciseSummaryShares.revokedAt),
    isNotNull(learnerExerciseSummaryShares.reviewedAt),
    isNull(learnerExerciseSummaryShares.reviewedReadAt),
  ];
  if (ids?.length) conditions.push(inArray(learnerExerciseSummaryShares.id, ids));
  const db = await requireDb();
  const result = await db.update(learnerExerciseSummaryShares).set({ reviewedReadAt: new Date() }).where(and(...conditions));
  return result[0].affectedRows;
}

/** Course administrators can review only actively shared aggregate completion summaries. */
export async function listActiveLearnerExerciseSummarySharesForFacilitator() {
  const db = await requireDb();
  return db
    .select({
      id: learnerExerciseSummaryShares.id,
      learnerId: learnerExerciseSummaryShares.ownerUserId,
      learnerName: users.name,
      learnerEmail: users.email,
      exerciseRoute: learnerExerciseSummaryShares.exerciseRoute,
      sharedAt: learnerExerciseSummaryShares.sharedAt,
      reviewedAt: learnerExerciseSummaryShares.reviewedAt,
      completedPrompts: learnerExerciseProgress.completedPrompts,
      totalPrompts: learnerExerciseProgress.totalPrompts,
    })
    .from(learnerExerciseSummaryShares)
    .innerJoin(users, eq(users.id, learnerExerciseSummaryShares.ownerUserId))
    .innerJoin(learnerExerciseProgress, and(
      eq(learnerExerciseProgress.userId, learnerExerciseSummaryShares.ownerUserId),
      eq(learnerExerciseProgress.exerciseRoute, learnerExerciseSummaryShares.exerciseRoute),
    ))
    .where(isNull(learnerExerciseSummaryShares.revokedAt))
    .orderBy(desc(learnerExerciseSummaryShares.sharedAt));
}

export async function recordAssessmentAttempt(input: {
  userId: number;
  courseSlug: string;
  assessmentId: string;
  score: number;
  passed: boolean;
  answers: Record<string, string>;
}) {
  const db = await requireDb();
  await db.insert(assessmentAttempts).values({
    userId: input.userId,
    courseSlug: input.courseSlug,
    assessmentId: input.assessmentId,
    score: input.score,
    passed: input.passed ? "yes" : "no",
    answersJson: JSON.stringify(input.answers),
  });
}

export async function startTimedAssessmentSession(input: {
  userId: number;
  courseSlug: string;
  assessmentId: string;
  timeLimitSeconds: number;
}) {
  const db = await requireDb();
  const activeRows = await db
    .select()
    .from(timedAssessmentSessions)
    .where(and(
      eq(timedAssessmentSessions.userId, input.userId),
      eq(timedAssessmentSessions.courseSlug, input.courseSlug),
      eq(timedAssessmentSessions.assessmentId, input.assessmentId),
      isNull(timedAssessmentSessions.submittedAt),
    ))
    .orderBy(desc(timedAssessmentSessions.startedAt))
    .limit(1);
  const active = activeRows[0];
  if (active && active.expiresAt.getTime() > Date.now()) return active;

  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + input.timeLimitSeconds * 1000);
  const result = await db.insert(timedAssessmentSessions).values({
    userId: input.userId,
    courseSlug: input.courseSlug,
    assessmentId: input.assessmentId,
    timeLimitSeconds: input.timeLimitSeconds,
    startedAt,
    expiresAt,
  });
  const rows = await db.select().from(timedAssessmentSessions).where(eq(timedAssessmentSessions.id, Number(result[0].insertId))).limit(1);
  if (!rows[0]) throw new Error("Timed assessment session could not be created.");
  return rows[0];
}

export async function consumeUnexpiredTimedAssessmentSession(input: {
  id: number;
  userId: number;
  courseSlug: string;
  assessmentId: string;
}) {
  const db = await requireDb();
  const now = new Date();
  const result = await db
    .update(timedAssessmentSessions)
    .set({ submittedAt: now })
    .where(and(
      eq(timedAssessmentSessions.id, input.id),
      eq(timedAssessmentSessions.userId, input.userId),
      eq(timedAssessmentSessions.courseSlug, input.courseSlug),
      eq(timedAssessmentSessions.assessmentId, input.assessmentId),
      isNull(timedAssessmentSessions.submittedAt),
      gt(timedAssessmentSessions.expiresAt, now),
    ));
  return result[0].affectedRows > 0;
}

export async function getAssessmentTimeLimitOverride(assessmentId: string) {
  const db = await requireDb();
  const rows = await db.select().from(assessmentTimeLimitOverrides).where(eq(assessmentTimeLimitOverrides.assessmentId, assessmentId)).limit(1);
  return rows[0] ?? null;
}

export async function listAssessmentTimeLimitOverrides() {
  const db = await requireDb();
  return db.select().from(assessmentTimeLimitOverrides).orderBy(assessmentTimeLimitOverrides.assessmentId);
}

export async function saveAssessmentTimeLimitOverride(input: { assessmentId: string; timeLimitSeconds: number; updatedByUserId: number }) {
  const db = await requireDb();
  await db
    .insert(assessmentTimeLimitOverrides)
    .values(input)
    .onDuplicateKeyUpdate({ set: { timeLimitSeconds: input.timeLimitSeconds, updatedByUserId: input.updatedByUserId, updatedAt: new Date() } });
  const rows = await db.select().from(assessmentTimeLimitOverrides).where(eq(assessmentTimeLimitOverrides.assessmentId, input.assessmentId)).limit(1);
  return rows[0] ?? null;
}

export async function clearAssessmentTimeLimitOverride(assessmentId: string) {
  const db = await requireDb();
  const result = await db.delete(assessmentTimeLimitOverrides).where(eq(assessmentTimeLimitOverrides.assessmentId, assessmentId));
  return result[0].affectedRows > 0;
}

export async function issueCertificateIfNeeded(input: {
  userId: number;
  courseSlug: string;
  recipientName: string;
  finalScore: number;
}) {
  const db = await requireDb();
  const existing = await db
    .select()
    .from(certificates)
    .where(and(eq(certificates.userId, input.userId), eq(certificates.courseSlug, input.courseSlug)))
    .limit(1);
  if (existing[0]) return { certificate: existing[0], newlyIssued: false };

  const credentialId = `CCA-${new Date().getFullYear()}-${input.userId
    .toString()
    .padStart(4, "0")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const certificate = {
    userId: input.userId,
    courseSlug: input.courseSlug,
    credentialId,
    recipientName: input.recipientName.trim() || "Crop Advisor Learner",
    finalScore: input.finalScore,
  };
  await db.insert(certificates).values(certificate);
  await db
    .update(courseEnrollments)
    .set({ status: "completed", updatedAt: new Date() })
    .where(and(eq(courseEnrollments.userId, input.userId), eq(courseEnrollments.courseSlug, input.courseSlug)));
  const issued = await db
    .select()
    .from(certificates)
    .where(eq(certificates.credentialId, credentialId))
    .limit(1);
  return { certificate: issued[0], newlyIssued: true };
}

type StoredFieldRecord = Omit<typeof fieldRecords.$inferSelect, "payloadJson"> & {
  payload: FieldRecordPayload;
};

function toStoredFieldRecord(record: typeof fieldRecords.$inferSelect): StoredFieldRecord {
  return { ...record, payload: JSON.parse(record.payloadJson) as FieldRecordPayload };
}

export async function listFieldRecords(userId: number, templateId: string) {
  const db = await requireDb();
  return db
    .select({
      id: fieldRecords.id,
      title: fieldRecords.title,
      templateId: fieldRecords.templateId,
      createdAt: fieldRecords.createdAt,
      updatedAt: fieldRecords.updatedAt,
    })
    .from(fieldRecords)
    .where(and(eq(fieldRecords.userId, userId), eq(fieldRecords.templateId, templateId)))
    .orderBy(desc(fieldRecords.updatedAt));
}

export async function getFieldRecord(userId: number, id: number) {
  const db = await requireDb();
  const rows = await db
    .select()
    .from(fieldRecords)
    .where(and(eq(fieldRecords.id, id), eq(fieldRecords.userId, userId)))
    .limit(1);
  return rows[0] ? toStoredFieldRecord(rows[0]) : null;
}

export async function getFieldRecordsForOwner(userId: number, ids: number[]) {
  const uniqueIds = Array.from(new Set(ids));
  if (uniqueIds.length !== 2) return null;
  const db = await requireDb();
  const rows = await db
    .select()
    .from(fieldRecords)
    .where(and(eq(fieldRecords.userId, userId), inArray(fieldRecords.id, uniqueIds)));
  if (rows.length !== uniqueIds.length) return null;
  const recordsById = new Map(rows.map(record => [record.id, toStoredFieldRecord(record)]));
  return uniqueIds.map(id => recordsById.get(id)!);
}

export async function saveFieldRecord(input: {
  id?: number;
  userId: number;
  templateId: string;
  title: string;
  payload: FieldRecordPayload;
}) {
  const db = await requireDb();
  const values = {
    templateId: input.templateId,
    title: input.title,
    payloadJson: JSON.stringify(input.payload),
    updatedAt: new Date(),
  };

  if (input.id) {
    const result = await db
      .update(fieldRecords)
      .set(values)
      .where(and(eq(fieldRecords.id, input.id), eq(fieldRecords.userId, input.userId)));
    if (result[0].affectedRows === 0) return null;
    return getFieldRecord(input.userId, input.id);
  }

  const result = await db.insert(fieldRecords).values({ userId: input.userId, ...values });
  return getFieldRecord(input.userId, Number(result[0].insertId));
}

export async function deleteFieldRecord(userId: number, id: number) {
  const db = await requireDb();
  const result = await db
    .delete(fieldRecords)
    .where(and(eq(fieldRecords.id, id), eq(fieldRecords.userId, userId)));
  return result[0].affectedRows > 0;
}

export async function listAllFieldRecords(userId: number) {
  const db = await requireDb();
  return db
    .select({
      id: fieldRecords.id,
      title: fieldRecords.title,
      templateId: fieldRecords.templateId,
      createdAt: fieldRecords.createdAt,
      updatedAt: fieldRecords.updatedAt,
    })
    .from(fieldRecords)
    .where(eq(fieldRecords.userId, userId))
    .orderBy(desc(fieldRecords.updatedAt));
}

export async function recordScenarioAttempt(input: {
  userId: number;
  moduleId: string;
  scenarioId: string;
  score: number;
  passed: boolean;
  answers: Record<string, string>;
}) {
  const db = await requireDb();
  await db.insert(scenarioAttempts).values({
    userId: input.userId,
    moduleId: input.moduleId,
    scenarioId: input.scenarioId,
    score: input.score,
    passed: input.passed ? "yes" : "no",
    answersJson: JSON.stringify(input.answers),
  });
}

export async function listScenarioAttempts(userId: number) {
  const db = await requireDb();
  return db
    .select()
    .from(scenarioAttempts)
    .where(eq(scenarioAttempts.userId, userId))
    .orderBy(desc(scenarioAttempts.submittedAt));
}

export async function listLearnerReflections(userId: number) {
  const db = await requireDb();
  return db
    .select()
    .from(learnerReflections)
    .where(eq(learnerReflections.userId, userId))
    .orderBy(desc(learnerReflections.updatedAt));
}

export async function upsertLearnerReflection(input: { userId: number; focus: string; reflection: string }) {
  const db = await requireDb();
  await db
    .insert(learnerReflections)
    .values(input)
    .onDuplicateKeyUpdate({ set: { reflection: input.reflection, updatedAt: new Date() } });
  const rows = await db
    .select()
    .from(learnerReflections)
    .where(and(eq(learnerReflections.userId, input.userId), eq(learnerReflections.focus, input.focus)))
    .limit(1);
  return rows[0];
}

export async function createFieldRecordReviewShare(input: { ownerUserId: number; recordId: number; reviewerName?: string }) {
  const record = await getFieldRecord(input.ownerUserId, input.recordId);
  if (!record) return null;
  const db = await requireDb();
  const shareToken = crypto.randomUUID().replace(/-/g, "");
  const result = await db.insert(fieldRecordReviewShares).values({
    recordId: input.recordId,
    ownerUserId: input.ownerUserId,
    shareToken,
    reviewerName: input.reviewerName?.trim() || null,
  });
  const rows = await db.select().from(fieldRecordReviewShares).where(eq(fieldRecordReviewShares.id, Number(result[0].insertId))).limit(1);
  return rows[0] ?? null;
}

export async function listFieldRecordReviewShares(ownerUserId: number, recordId: number) {
  const record = await getFieldRecord(ownerUserId, recordId);
  if (!record) return null;
  const db = await requireDb();
  return db
    .select()
    .from(fieldRecordReviewShares)
    .where(and(eq(fieldRecordReviewShares.ownerUserId, ownerUserId), eq(fieldRecordReviewShares.recordId, recordId)))
    .orderBy(desc(fieldRecordReviewShares.createdAt));
}

export async function revokeFieldRecordReviewShare(ownerUserId: number, id: number) {
  const db = await requireDb();
  const result = await db
    .update(fieldRecordReviewShares)
    .set({ revokedAt: new Date() })
    .where(and(eq(fieldRecordReviewShares.id, id), eq(fieldRecordReviewShares.ownerUserId, ownerUserId), isNull(fieldRecordReviewShares.revokedAt)));
  return result[0].affectedRows > 0;
}

export async function getActiveFieldRecordReviewShare(shareToken: string) {
  const db = await requireDb();
  const shares = await db
    .select()
    .from(fieldRecordReviewShares)
    .where(and(eq(fieldRecordReviewShares.shareToken, shareToken), isNull(fieldRecordReviewShares.revokedAt)))
    .limit(1);
  const share = shares[0];
  if (!share) return null;
  const record = await getFieldRecord(share.ownerUserId, share.recordId);
  return record ? { share, record } : null;
}

export async function submitFieldRecordReview(input: { shareToken: string; reviewerName: string; reviewComment: string }) {
  const db = await requireDb();
  const result = await db
    .update(fieldRecordReviewShares)
    .set({ reviewerName: input.reviewerName, reviewComment: input.reviewComment, reviewedAt: new Date() })
    .where(and(eq(fieldRecordReviewShares.shareToken, input.shareToken), isNull(fieldRecordReviewShares.revokedAt)));
  return result[0].affectedRows > 0;
}

type StoredFieldInquiryDecision = Omit<typeof fieldInquiryDecisions.$inferSelect, "payloadJson"> & { payload: FieldInquiryDecisionPayload };
type StoredFieldInquiryPeerShare = Omit<typeof fieldInquiryPeerShares.$inferSelect, "feedbackJson"> & { feedback: FieldInquiryPeerReviewPayload | null };
type StoredFieldInquiryPeerReflection = Omit<typeof fieldInquiryPeerReflections.$inferSelect, "payloadJson"> & { payload: FieldInquiryPeerReflectionPayload };

function toStoredFieldInquiryDecision(entry: typeof fieldInquiryDecisions.$inferSelect): StoredFieldInquiryDecision {
  return { ...entry, payload: JSON.parse(entry.payloadJson) as FieldInquiryDecisionPayload };
}

function toStoredFieldInquiryPeerShare(entry: typeof fieldInquiryPeerShares.$inferSelect): StoredFieldInquiryPeerShare {
  return { ...entry, feedback: entry.feedbackJson ? JSON.parse(entry.feedbackJson) as FieldInquiryPeerReviewPayload : null };
}

function toStoredFieldInquiryPeerReflection(entry: typeof fieldInquiryPeerReflections.$inferSelect): StoredFieldInquiryPeerReflection {
  return { ...entry, payload: JSON.parse(entry.payloadJson) as FieldInquiryPeerReflectionPayload };
}

export async function upsertFieldInquiryDecision(input: { userId: number; moduleId: string; payload: FieldInquiryDecisionPayload }) {
  const db = await requireDb();
  const existingRows = await db.select().from(fieldInquiryDecisions).where(and(eq(fieldInquiryDecisions.userId, input.userId), eq(fieldInquiryDecisions.moduleId, input.moduleId))).limit(1);
  await db
    .insert(fieldInquiryDecisions)
    .values({ userId: input.userId, moduleId: input.moduleId, payloadJson: JSON.stringify(input.payload) })
    .onDuplicateKeyUpdate({ set: { payloadJson: JSON.stringify(input.payload), updatedAt: new Date() } });
  if (existingRows[0]) {
    await db.update(fieldInquiryPeerShares).set({ revokedAt: new Date() }).where(and(eq(fieldInquiryPeerShares.ownerUserId, input.userId), eq(fieldInquiryPeerShares.decisionId, existingRows[0].id), isNull(fieldInquiryPeerShares.revokedAt), isNull(fieldInquiryPeerShares.reviewedAt)));
  }
  const rows = await db.select().from(fieldInquiryDecisions).where(and(eq(fieldInquiryDecisions.userId, input.userId), eq(fieldInquiryDecisions.moduleId, input.moduleId))).limit(1);
  return rows[0] ? toStoredFieldInquiryDecision(rows[0]) : null;
}

export async function getFieldInquiryDecisionForOwner(userId: number, moduleId: string) {
  const db = await requireDb();
  const rows = await db.select().from(fieldInquiryDecisions).where(and(eq(fieldInquiryDecisions.userId, userId), eq(fieldInquiryDecisions.moduleId, moduleId))).limit(1);
  return rows[0] ? toStoredFieldInquiryDecision(rows[0]) : null;
}

export async function listFieldInquiryPeerSharesForOwner(ownerUserId: number, decisionId: number) {
  const db = await requireDb();
  const decisionRows = await db.select().from(fieldInquiryDecisions).where(and(eq(fieldInquiryDecisions.id, decisionId), eq(fieldInquiryDecisions.userId, ownerUserId))).limit(1);
  if (!decisionRows[0]) return null;
  const shares = await db.select().from(fieldInquiryPeerShares).where(and(eq(fieldInquiryPeerShares.ownerUserId, ownerUserId), eq(fieldInquiryPeerShares.decisionId, decisionId))).orderBy(desc(fieldInquiryPeerShares.createdAt));
  return shares.map(toStoredFieldInquiryPeerShare);
}

export async function createFieldInquiryPeerShare(input: { ownerUserId: number; decisionId: number; pairLabel?: string }) {
  const db = await requireDb();
  const decisionRows = await db.select().from(fieldInquiryDecisions).where(and(eq(fieldInquiryDecisions.id, input.decisionId), eq(fieldInquiryDecisions.userId, input.ownerUserId))).limit(1);
  if (!decisionRows[0]) return null;
  const activeShares = await db.select().from(fieldInquiryPeerShares).where(and(eq(fieldInquiryPeerShares.ownerUserId, input.ownerUserId), eq(fieldInquiryPeerShares.decisionId, input.decisionId), isNull(fieldInquiryPeerShares.revokedAt))).limit(1);
  if (activeShares[0]) return null;
  const shareToken = crypto.randomUUID().replace(/-/g, "");
  const result = await db.insert(fieldInquiryPeerShares).values({ decisionId: input.decisionId, ownerUserId: input.ownerUserId, shareToken, pairLabel: input.pairLabel?.trim() || null });
  const shares = await db.select().from(fieldInquiryPeerShares).where(eq(fieldInquiryPeerShares.id, Number(result[0].insertId))).limit(1);
  return shares[0] ? toStoredFieldInquiryPeerShare(shares[0]) : null;
}

export async function revokeFieldInquiryPeerShare(ownerUserId: number, id: number) {
  const db = await requireDb();
  const result = await db.update(fieldInquiryPeerShares).set({ revokedAt: new Date() }).where(and(eq(fieldInquiryPeerShares.id, id), eq(fieldInquiryPeerShares.ownerUserId, ownerUserId), isNull(fieldInquiryPeerShares.revokedAt)));
  return result[0].affectedRows > 0;
}

export async function getActiveFieldInquiryPeerShare(shareToken: string) {
  const db = await requireDb();
  const shareRows = await db.select().from(fieldInquiryPeerShares).where(and(eq(fieldInquiryPeerShares.shareToken, shareToken), isNull(fieldInquiryPeerShares.revokedAt))).limit(1);
  const share = shareRows[0];
  if (!share) return null;
  const decisionRows = await db.select().from(fieldInquiryDecisions).where(eq(fieldInquiryDecisions.id, share.decisionId)).limit(1);
  const decision = decisionRows[0];
  return decision ? { share: toStoredFieldInquiryPeerShare(share), decision: toStoredFieldInquiryDecision(decision) } : null;
}

export async function submitFieldInquiryPeerReview(input: { shareToken: string; reviewerUserId: number; reviewerName: string; feedback: FieldInquiryPeerReviewPayload }) {
  const db = await requireDb();
  const shareRows = await db.select().from(fieldInquiryPeerShares).where(and(eq(fieldInquiryPeerShares.shareToken, input.shareToken), isNull(fieldInquiryPeerShares.revokedAt))).limit(1);
  const share = shareRows[0];
  if (!share || share.ownerUserId === input.reviewerUserId) return false;
  const result = await db.update(fieldInquiryPeerShares).set({ reviewerUserId: input.reviewerUserId, reviewerName: input.reviewerName, feedbackJson: JSON.stringify(input.feedback), reviewedAt: new Date() }).where(and(eq(fieldInquiryPeerShares.id, share.id), isNull(fieldInquiryPeerShares.revokedAt), isNull(fieldInquiryPeerShares.reviewedAt)));
  return result[0].affectedRows > 0;
}

export async function getFieldInquiryPeerReflectionForOwner(input: { ownerUserId: number; shareId: number }) {
  const db = await requireDb();
  const shares = await db.select().from(fieldInquiryPeerShares).where(and(eq(fieldInquiryPeerShares.id, input.shareId), eq(fieldInquiryPeerShares.ownerUserId, input.ownerUserId), isNotNull(fieldInquiryPeerShares.reviewedAt))).limit(1);
  if (!shares[0]) return null;
  const reflections = await db.select().from(fieldInquiryPeerReflections).where(and(eq(fieldInquiryPeerReflections.shareId, input.shareId), eq(fieldInquiryPeerReflections.userId, input.ownerUserId))).limit(1);
  return reflections[0] ? toStoredFieldInquiryPeerReflection(reflections[0]) : null;
}

export async function saveFieldInquiryPeerReflectionForOwner(input: { ownerUserId: number; shareId: number; payload: FieldInquiryPeerReflectionPayload }) {
  const db = await requireDb();
  const shares = await db.select().from(fieldInquiryPeerShares).where(and(eq(fieldInquiryPeerShares.id, input.shareId), eq(fieldInquiryPeerShares.ownerUserId, input.ownerUserId), isNotNull(fieldInquiryPeerShares.reviewedAt))).limit(1);
  if (!shares[0]) return null;
  await db.insert(fieldInquiryPeerReflections).values({ userId: input.ownerUserId, shareId: input.shareId, payloadJson: JSON.stringify(input.payload) }).onDuplicateKeyUpdate({ set: { payloadJson: JSON.stringify(input.payload), updatedAt: new Date() } });
  const reflections = await db.select().from(fieldInquiryPeerReflections).where(and(eq(fieldInquiryPeerReflections.shareId, input.shareId), eq(fieldInquiryPeerReflections.userId, input.ownerUserId))).limit(1);
  return reflections[0] ? toStoredFieldInquiryPeerReflection(reflections[0]) : null;
}

type StoredCropDiagnosisAnnotationReview = Omit<typeof cropDiagnosisAnnotationReviews.$inferSelect, "payloadJson"> & {
  payload: CropDiagnosisAnnotationReviewPayload;
};

function toStoredCropDiagnosisAnnotationReview(entry: typeof cropDiagnosisAnnotationReviews.$inferSelect): StoredCropDiagnosisAnnotationReview {
  return { ...entry, payload: JSON.parse(entry.payloadJson) as CropDiagnosisAnnotationReviewPayload };
}

export async function createCropDiagnosisAnnotationReviewSubmission(input: { userId: number; payload: CropDiagnosisAnnotationReviewPayload }) {
  const db = await requireDb();
  const result = await db.insert(cropDiagnosisAnnotationReviews).values({ userId: input.userId, payloadJson: JSON.stringify(input.payload) });
  const rows = await db.select().from(cropDiagnosisAnnotationReviews).where(eq(cropDiagnosisAnnotationReviews.id, Number(result[0].insertId))).limit(1);
  return rows[0] ? toStoredCropDiagnosisAnnotationReview(rows[0]) : null;
}

export async function listMyCropDiagnosisAnnotationReviews(userId: number) {
  const db = await requireDb();
  const entries = await db.select().from(cropDiagnosisAnnotationReviews).where(eq(cropDiagnosisAnnotationReviews.userId, userId)).orderBy(desc(cropDiagnosisAnnotationReviews.submittedAt));
  return entries.map(toStoredCropDiagnosisAnnotationReview);
}

export async function listCropDiagnosisAnnotationNotificationStates(userId: number) {
  const db = await requireDb();
  return db
    .select({
      id: cropDiagnosisAnnotationReviews.id,
      status: cropDiagnosisAnnotationReviews.status,
      supervisorName: cropDiagnosisAnnotationReviews.supervisorName,
      feedback: cropDiagnosisAnnotationReviews.feedback,
      feedbackReadAt: cropDiagnosisAnnotationReviews.feedbackReadAt,
      submittedAt: cropDiagnosisAnnotationReviews.submittedAt,
      reviewedAt: cropDiagnosisAnnotationReviews.reviewedAt,
    })
    .from(cropDiagnosisAnnotationReviews)
    .where(eq(cropDiagnosisAnnotationReviews.userId, userId))
    .orderBy(desc(sql`COALESCE(${cropDiagnosisAnnotationReviews.reviewedAt}, ${cropDiagnosisAnnotationReviews.submittedAt})`));
}

export function buildCropDiagnosisAnnotationFeedbackReadFilter(userId: number, ids?: number[]) {
  const conditions = [
    eq(cropDiagnosisAnnotationReviews.userId, userId),
    isNotNull(cropDiagnosisAnnotationReviews.feedback),
    isNull(cropDiagnosisAnnotationReviews.feedbackReadAt),
  ];
  if (ids?.length) conditions.push(inArray(cropDiagnosisAnnotationReviews.id, ids));
  return and(...conditions);
}

export async function markCropDiagnosisAnnotationFeedbackRead(userId: number, ids?: number[]) {
  const db = await requireDb();
  const result = await db
    .update(cropDiagnosisAnnotationReviews)
    .set({ feedbackReadAt: new Date(), updatedAt: new Date() })
    .where(buildCropDiagnosisAnnotationFeedbackReadFilter(userId, ids));
  return result[0].affectedRows;
}

export async function listCropDiagnosisAnnotationReviewsForSupervisor() {
  const db = await requireDb();
  const rows = await db
    .select({ review: cropDiagnosisAnnotationReviews, learnerName: users.name, learnerEmail: users.email })
    .from(cropDiagnosisAnnotationReviews)
    .innerJoin(users, eq(cropDiagnosisAnnotationReviews.userId, users.id))
    .orderBy(desc(cropDiagnosisAnnotationReviews.submittedAt));
  return rows.map(row => ({ ...toStoredCropDiagnosisAnnotationReview(row.review), learnerName: row.learnerName, learnerEmail: row.learnerEmail }));
}

export async function submitCropDiagnosisAnnotationSupervisorFeedback(input: { id: number; supervisorUserId: number; supervisorName: string; status: "reviewed" | "revision_requested"; feedback: string }) {
  const db = await requireDb();
  const result = await db
    .update(cropDiagnosisAnnotationReviews)
    .set({ status: input.status, supervisorUserId: input.supervisorUserId, supervisorName: input.supervisorName, feedback: input.feedback, feedbackReadAt: null, reviewedAt: new Date(), updatedAt: new Date() })
    .where(eq(cropDiagnosisAnnotationReviews.id, input.id));
  return result[0].affectedRows > 0;
}

type StoredCompetencyAssessment = Omit<typeof competencyAssessments.$inferSelect, "payloadJson" | "scorecardJson"> & {
  payload: CompetencyEvidenceSubmissionPayload;
  scorecard: CompetencyScorecard | null;
};

function toStoredCompetencyAssessment(entry: typeof competencyAssessments.$inferSelect): StoredCompetencyAssessment {
  const payload = JSON.parse(entry.payloadJson) as Partial<CompetencyEvidenceSubmissionPayload>;
  return {
    ...entry,
    payload: { evidenceSummary: payload.evidenceSummary ?? "", taskContext: payload.taskContext ?? "", reviewOrReferral: payload.reviewOrReferral ?? "", attachments: payload.attachments ?? [] },
    scorecard: entry.scorecardJson ? JSON.parse(entry.scorecardJson) as CompetencyScorecard : null,
  };
}

export async function createCompetencyAssessmentSubmission(input: { userId: number; moduleId: string; payload: CompetencyEvidenceSubmissionPayload; revisionOfAssessmentId?: number }) {
  const db = await requireDb();
  if (input.revisionOfAssessmentId) {
    const originals = await db.select({ id: competencyAssessments.id }).from(competencyAssessments).where(and(eq(competencyAssessments.id, input.revisionOfAssessmentId), eq(competencyAssessments.userId, input.userId), eq(competencyAssessments.moduleId, input.moduleId), eq(competencyAssessments.status, "revision_requested"))).limit(1);
    if (!originals[0]) return null;
    const existing = await db.select({ id: competencyAssessments.id }).from(competencyAssessments).where(and(eq(competencyAssessments.userId, input.userId), eq(competencyAssessments.revisionOfAssessmentId, input.revisionOfAssessmentId))).limit(1);
    if (existing[0]) return null;
  }
  const result = await db.insert(competencyAssessments).values({ userId: input.userId, moduleId: input.moduleId, revisionOfAssessmentId: input.revisionOfAssessmentId, payloadJson: JSON.stringify(input.payload) });
  const rows = await db.select().from(competencyAssessments).where(eq(competencyAssessments.id, Number(result[0].insertId))).limit(1);
  return rows[0] ? toStoredCompetencyAssessment(rows[0]) : null;
}

export async function getCompetencyEvidenceComparisonForLearner(userId: number, assessmentId: number) {
  const db = await requireDb();
  const requested = await db.select().from(competencyAssessments).where(and(eq(competencyAssessments.id, assessmentId), eq(competencyAssessments.userId, userId))).limit(1);
  const candidate = requested[0];
  if (!candidate) return null;
  const originalId = candidate.revisionOfAssessmentId ?? candidate.id;
  const originalRows = await db.select().from(competencyAssessments).where(and(eq(competencyAssessments.id, originalId), eq(competencyAssessments.userId, userId), eq(competencyAssessments.status, "revision_requested"))).limit(1);
  const original = originalRows[0];
  if (!original) return null;
  const revisedRows = await db.select().from(competencyAssessments).where(and(eq(competencyAssessments.userId, userId), eq(competencyAssessments.revisionOfAssessmentId, original.id))).limit(1);
  const reflectionRows = await db.select().from(learnerReflections).where(and(eq(learnerReflections.userId, userId), eq(learnerReflections.focus, scorecardReflectionFocus(original.id)))).limit(1);
  return { original: toStoredCompetencyAssessment(original), revised: revisedRows[0] ? toStoredCompetencyAssessment(revisedRows[0]) : null, reflection: parseScorecardReflection(reflectionRows[0]?.reflection) };
}

export async function getCompetencyEvidenceComparisonForSupervisor(assessmentId: number) {
  const db = await requireDb();
  const requested = await db.select().from(competencyAssessments).where(eq(competencyAssessments.id, assessmentId)).limit(1);
  const candidate = requested[0];
  if (!candidate) return null;
  const originalId = candidate.revisionOfAssessmentId ?? candidate.id;
  const originalRows = await db.select().from(competencyAssessments).where(and(eq(competencyAssessments.id, originalId), eq(competencyAssessments.status, "revision_requested"))).limit(1);
  const original = originalRows[0];
  if (!original) return null;
  const revisedRows = await db.select().from(competencyAssessments).where(eq(competencyAssessments.revisionOfAssessmentId, original.id)).limit(1);
  const reflectionRows = await db.select().from(learnerReflections).where(and(eq(learnerReflections.userId, original.userId), eq(learnerReflections.focus, scorecardReflectionFocus(original.id)))).limit(1);
  return { original: toStoredCompetencyAssessment(original), revised: revisedRows[0] ? toStoredCompetencyAssessment(revisedRows[0]) : null, reflection: parseScorecardReflection(reflectionRows[0]?.reflection) };
}

export async function listMyCompetencyAssessments(userId: number) {
  const db = await requireDb();
  const entries = await db.select().from(competencyAssessments).where(eq(competencyAssessments.userId, userId)).orderBy(desc(competencyAssessments.submittedAt));
  return entries.map(toStoredCompetencyAssessment);
}

export async function listCompetencyAssessmentsForSupervisor() {
  const db = await requireDb();
  const rows = await db
    .select({ assessment: competencyAssessments, learnerName: users.name, learnerEmail: users.email })
    .from(competencyAssessments)
    .innerJoin(users, eq(competencyAssessments.userId, users.id))
    .orderBy(desc(competencyAssessments.submittedAt));
  return rows.map(row => ({ ...toStoredCompetencyAssessment(row.assessment), learnerName: row.learnerName, learnerEmail: row.learnerEmail }));
}

export async function submitSupervisorCompetencyScore(input: { id: number; supervisorUserId: number; supervisorName: string; status: "scored" | "revision_requested"; scorecard: CompetencyScorecard; feedback: string }) {
  const db = await requireDb();
  const result = await db
    .update(competencyAssessments)
    .set({ status: input.status, scorecardJson: JSON.stringify(input.scorecard), supervisorUserId: input.supervisorUserId, supervisorName: input.supervisorName, feedback: input.feedback, feedbackReadAt: null, reviewedAt: new Date(), updatedAt: new Date() })
    .where(eq(competencyAssessments.id, input.id));
  return result[0].affectedRows > 0;
}

export async function listCompetencyAssessmentNotificationStates(userId: number) {
  const db = await requireDb();
  return db
    .select({
      id: competencyAssessments.id,
      moduleId: competencyAssessments.moduleId,
      status: competencyAssessments.status,
      supervisorName: competencyAssessments.supervisorName,
      feedback: competencyAssessments.feedback,
      feedbackReadAt: competencyAssessments.feedbackReadAt,
      submittedAt: competencyAssessments.submittedAt,
      reviewedAt: competencyAssessments.reviewedAt,
    })
    .from(competencyAssessments)
    .where(eq(competencyAssessments.userId, userId))
    .orderBy(desc(sql`COALESCE(${competencyAssessments.reviewedAt}, ${competencyAssessments.submittedAt})`));
}

export function buildCompetencyAssessmentFeedbackReadFilter(userId: number, ids?: number[]) {
  const conditions = [
    eq(competencyAssessments.userId, userId),
    isNotNull(competencyAssessments.feedback),
    isNull(competencyAssessments.feedbackReadAt),
  ];
  if (ids?.length) conditions.push(inArray(competencyAssessments.id, ids));
  return and(...conditions);
}

export async function markCompetencyAssessmentFeedbackRead(userId: number, ids?: number[]) {
  const db = await requireDb();
  const result = await db
    .update(competencyAssessments)
    .set({ feedbackReadAt: new Date(), updatedAt: new Date() })
    .where(buildCompetencyAssessmentFeedbackReadFilter(userId, ids));
  return result[0].affectedRows;
}

export async function getScorecardReflectionForLearner(userId: number, assessmentId: number) {
  const db = await requireDb();
  const assessmentRows = await db.select().from(competencyAssessments).where(and(eq(competencyAssessments.id, assessmentId), eq(competencyAssessments.userId, userId))).limit(1);
  const assessment = assessmentRows[0];
  if (!assessment) return null;
  const reflectionRows = await db.select().from(learnerReflections).where(and(eq(learnerReflections.userId, userId), eq(learnerReflections.focus, scorecardReflectionFocus(assessmentId)))).limit(1);
  return { assessment: toStoredCompetencyAssessment(assessment), reflection: parseScorecardReflection(reflectionRows[0]?.reflection) };
}

export async function saveScorecardReflectionForLearner(input: { userId: number; assessmentId: number; reflection: ScorecardReflectionPayload }) {
  const db = await requireDb();
  const assessmentRows = await db.select({ id: competencyAssessments.id, scorecardJson: competencyAssessments.scorecardJson, feedback: competencyAssessments.feedback }).from(competencyAssessments).where(and(eq(competencyAssessments.id, input.assessmentId), eq(competencyAssessments.userId, input.userId))).limit(1);
  const assessment = assessmentRows[0];
  if (!assessment || !assessment.scorecardJson || !assessment.feedback) return null;
  const focus = scorecardReflectionFocus(input.assessmentId);
  await db.insert(learnerReflections).values({ userId: input.userId, focus, reflection: JSON.stringify(input.reflection) }).onDuplicateKeyUpdate({ set: { reflection: JSON.stringify(input.reflection), updatedAt: new Date() } });
  const rows = await db.select().from(learnerReflections).where(and(eq(learnerReflections.userId, input.userId), eq(learnerReflections.focus, focus))).limit(1);
  return rows[0] ? parseScorecardReflection(rows[0].reflection) : null;
}

export async function getScorecardReflectionForSupervisor(assessmentId: number) {
  const db = await requireDb();
  const assessmentRows = await db.select({ userId: competencyAssessments.userId }).from(competencyAssessments).where(eq(competencyAssessments.id, assessmentId)).limit(1);
  const assessment = assessmentRows[0];
  if (!assessment) return null;
  const rows = await db.select().from(learnerReflections).where(and(eq(learnerReflections.userId, assessment.userId), eq(learnerReflections.focus, scorecardReflectionFocus(assessmentId)))).limit(1);
  return rows[0] ? parseScorecardReflection(rows[0].reflection) : null;
}

type StoredFieldPracticum = Omit<typeof fieldPracticumEntries.$inferSelect, "payloadJson"> & {
  payload: FieldPracticumPayload;
};

function toStoredFieldPracticum(entry: typeof fieldPracticumEntries.$inferSelect): StoredFieldPracticum {
  return { ...entry, payload: JSON.parse(entry.payloadJson) as FieldPracticumPayload };
}

export async function listFieldPracticumEntries(userId: number) {
  const db = await requireDb();
  const entries = await db
    .select()
    .from(fieldPracticumEntries)
    .where(eq(fieldPracticumEntries.userId, userId))
    .orderBy(desc(fieldPracticumEntries.updatedAt));
  return entries.map(toStoredFieldPracticum);
}

export async function getFieldPracticumEntry(userId: number, id: number) {
  const db = await requireDb();
  const entries = await db
    .select()
    .from(fieldPracticumEntries)
    .where(and(eq(fieldPracticumEntries.id, id), eq(fieldPracticumEntries.userId, userId)))
    .limit(1);
  return entries[0] ? toStoredFieldPracticum(entries[0]) : null;
}

export async function saveFieldPracticumEntry(input: { id?: number; userId: number; title: string; payload: FieldPracticumPayload }) {
  const db = await requireDb();
  const values = { title: input.title, payloadJson: JSON.stringify(input.payload), updatedAt: new Date() };
  if (input.id) {
    const result = await db
      .update(fieldPracticumEntries)
      .set(values)
      .where(and(eq(fieldPracticumEntries.id, input.id), eq(fieldPracticumEntries.userId, input.userId)));
    if (result[0].affectedRows === 0) return null;
    return getFieldPracticumEntry(input.userId, input.id);
  }
  const result = await db.insert(fieldPracticumEntries).values({ userId: input.userId, ...values });
  return getFieldPracticumEntry(input.userId, Number(result[0].insertId));
}

export async function deleteFieldPracticumEntry(userId: number, id: number) {
  const db = await requireDb();
  const result = await db
    .delete(fieldPracticumEntries)
    .where(and(eq(fieldPracticumEntries.id, id), eq(fieldPracticumEntries.userId, userId)));
  return result[0].affectedRows > 0;
}

type StoredCapstoneSubmission = Omit<typeof capstoneSubmissions.$inferSelect, "payloadJson"> & {
  payload: CapstoneSubmissionPayload;
};

function toStoredCapstoneSubmission(submission: typeof capstoneSubmissions.$inferSelect): StoredCapstoneSubmission {
  return { ...submission, payload: JSON.parse(submission.payloadJson) as CapstoneSubmissionPayload };
}

export async function listCapstoneSubmissions(userId: number) {
  const db = await requireDb();
  const submissions = await db
    .select()
    .from(capstoneSubmissions)
    .where(eq(capstoneSubmissions.userId, userId))
    .orderBy(desc(capstoneSubmissions.updatedAt));
  return submissions.map(toStoredCapstoneSubmission);
}

export async function saveCapstoneSubmission(input: { userId: number; capstoneId: string; payload: CapstoneSubmissionPayload }) {
  const db = await requireDb();
  await db
    .insert(capstoneSubmissions)
    .values({ userId: input.userId, capstoneId: input.capstoneId, payloadJson: JSON.stringify(input.payload) })
    .onDuplicateKeyUpdate({ set: { payloadJson: JSON.stringify(input.payload), updatedAt: new Date() } });
  const rows = await db
    .select()
    .from(capstoneSubmissions)
    .where(and(eq(capstoneSubmissions.userId, input.userId), eq(capstoneSubmissions.capstoneId, input.capstoneId)))
    .limit(1);
  return toStoredCapstoneSubmission(rows[0]!);
}
