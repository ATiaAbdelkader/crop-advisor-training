import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  assessmentAttempts,
  certificates,
  courseEnrollments,
  InsertUser,
  lessonCompletions,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

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
