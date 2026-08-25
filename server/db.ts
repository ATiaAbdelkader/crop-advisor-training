import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  assessmentAttempts,
  capstoneSubmissions,
  certificates,
  courseEnrollments,
  cropDiagnosisAnnotationReviews,
  fieldPracticumEntries,
  fieldRecords,
  fieldRecordReviewShares,
  InsertUser,
  learnerReflections,
  lessonCompletions,
  scenarioAttempts,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import type { FieldRecordPayload } from "../shared/digitalFieldRecords";
import type { CropDiagnosisAnnotationReviewPayload } from "../shared/cropDiagnosisAnnotation";
import type { CapstoneSubmissionPayload, FieldPracticumPayload } from "../shared/fieldReadiness";

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
    .set({ status: input.status, supervisorUserId: input.supervisorUserId, supervisorName: input.supervisorName, feedback: input.feedback, reviewedAt: new Date(), updatedAt: new Date() })
    .where(eq(cropDiagnosisAnnotationReviews.id, input.id));
  return result[0].affectedRows > 0;
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
