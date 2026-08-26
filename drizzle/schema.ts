import {
  int,
  index,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  type AnyMySqlColumn,
} from "drizzle-orm/mysql-core";

/** Core user table backing the Manus OAuth flow. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/** Content models make future document-driven curriculum updates persistence-ready. */
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 240 }).notNull(),
  description: text("description").notNull(),
  credentialName: varchar("credentialName", { length: 240 }).notNull(),
  passMark: int("passMark").notNull(),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const courseModules = mysqlTable(
  "courseModules",
  {
    id: int("id").autoincrement().primaryKey(),
    courseId: int("courseId")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 128 }).notNull(),
    title: varchar("title", { length: 240 }).notNull(),
    description: text("description").notNull(),
    sortOrder: int("sortOrder").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("course_module_slug_unique").on(table.courseId, table.slug)]
);

export const lessons = mysqlTable(
  "lessons",
  {
    id: int("id").autoincrement().primaryKey(),
    moduleId: int("moduleId")
      .notNull()
      .references(() => courseModules.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 128 }).notNull(),
    title: varchar("title", { length: 240 }).notNull(),
    summary: text("summary").notNull(),
    contentMarkdown: text("contentMarkdown").notNull(),
    durationMinutes: int("durationMinutes").notNull(),
    sortOrder: int("sortOrder").notNull(),
    publishedAt: timestamp("publishedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("module_lesson_slug_unique").on(table.moduleId, table.slug)]
);

export const assessments = mysqlTable("assessments", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  moduleId: int("moduleId").references(() => courseModules.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  kind: mysqlEnum("kind", ["module", "final"]).notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  description: text("description").notNull(),
  passMark: int("passMark").notNull(),
  questionsJson: text("questionsJson").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const courseEnrollments = mysqlTable(
  "courseEnrollments",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseSlug: varchar("courseSlug", { length: 128 }).notNull(),
    status: mysqlEnum("status", ["active", "completed"]).default("active").notNull(),
    enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("course_enrollment_unique").on(table.userId, table.courseSlug)]
);

export const lessonCompletions = mysqlTable(
  "lessonCompletions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseSlug: varchar("courseSlug", { length: 128 }).notNull(),
    lessonId: varchar("lessonId", { length: 128 }).notNull(),
    completedAt: timestamp("completedAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("lesson_completion_unique").on(
      table.userId,
      table.courseSlug,
      table.lessonId
    ),
  ]
);

export const assessmentAttempts = mysqlTable("assessmentAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseSlug: varchar("courseSlug", { length: 128 }).notNull(),
  assessmentId: varchar("assessmentId", { length: 128 }).notNull(),
  score: int("score").notNull(),
  passed: mysqlEnum("passed", ["yes", "no"]).notNull(),
  answersJson: text("answersJson").notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

/** Server-issued quiz sessions prevent browser clocks or refreshes from extending a formal assessment time limit. */
export const timedAssessmentSessions = mysqlTable(
  "timedAssessmentSessions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseSlug: varchar("courseSlug", { length: 128 }).notNull(),
    assessmentId: varchar("assessmentId", { length: 128 }).notNull(),
    timeLimitSeconds: int("timeLimitSeconds").notNull(),
    startedAt: timestamp("startedAt").defaultNow().notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    submittedAt: timestamp("submittedAt"),
  },
  table => [index("timed_assessment_session_owner_idx").on(table.userId, table.assessmentId, table.submittedAt, table.expiresAt)]
);

export const certificates = mysqlTable(
  "certificates",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseSlug: varchar("courseSlug", { length: 128 }).notNull(),
    credentialId: varchar("credentialId", { length: 96 }).notNull().unique(),
    recipientName: varchar("recipientName", { length: 240 }).notNull(),
    finalScore: int("finalScore").notNull(),
    issuedAt: timestamp("issuedAt").defaultNow().notNull(),
  },
  table => [uniqueIndex("certificate_course_user_unique").on(table.userId, table.courseSlug)]
);

/** Private digital field records are visible only to their owning learner. */
export const fieldRecords = mysqlTable(
  "fieldRecords",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    templateId: varchar("templateId", { length: 96 }).notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    payloadJson: text("payloadJson").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("field_record_owner_template_updated_idx").on(table.userId, table.templateId, table.updatedAt)]
);

/** Applied scenario attempts provide additional practice without changing the formal 80% progression gate. */
export const scenarioAttempts = mysqlTable(
  "scenarioAttempts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    moduleId: varchar("moduleId", { length: 128 }).notNull(),
    scenarioId: varchar("scenarioId", { length: 128 }).notNull(),
    score: int("score").notNull(),
    passed: mysqlEnum("passed", ["yes", "no"]).notNull(),
    answersJson: text("answersJson").notNull(),
    submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  },
  table => [index("scenario_attempt_owner_scenario_idx").on(table.userId, table.scenarioId, table.submittedAt)]
);

/** A learner can maintain one private reflection for each named competency focus. */
export const learnerReflections = mysqlTable(
  "learnerReflections",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    focus: varchar("focus", { length: 96 }).notNull(),
    reflection: text("reflection").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("learner_reflection_owner_focus_unique").on(table.userId, table.focus)]
);

/** Learners create and revoke opaque share links for a single saved field record. */
export const fieldRecordReviewShares = mysqlTable(
  "fieldRecordReviewShares",
  {
    id: int("id").autoincrement().primaryKey(),
    recordId: int("recordId")
      .notNull()
      .references(() => fieldRecords.id, { onDelete: "cascade" }),
    ownerUserId: int("ownerUserId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    shareToken: varchar("shareToken", { length: 64 }).notNull().unique(),
    reviewerName: varchar("reviewerName", { length: 160 }),
    reviewComment: text("reviewComment"),
    reviewedAt: timestamp("reviewedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    revokedAt: timestamp("revokedAt"),
  },
  table => [index("field_record_share_owner_record_idx").on(table.ownerUserId, table.recordId, table.revokedAt)]
);

/** A completed photo-annotation attempt remains private to the learner and assigned course administrators. */
export const cropDiagnosisAnnotationReviews = mysqlTable(
  "cropDiagnosisAnnotationReviews",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    payloadJson: text("payloadJson").notNull(),
    status: mysqlEnum("status", ["submitted", "reviewed", "revision_requested"]).default("submitted").notNull(),
    supervisorUserId: int("supervisorUserId").references(() => users.id, { onDelete: "set null" }),
    supervisorName: varchar("supervisorName", { length: 160 }),
    feedback: text("feedback"),
    feedbackReadAt: timestamp("feedbackReadAt"),
    submittedAt: timestamp("submittedAt").defaultNow().notNull(),
    reviewedAt: timestamp("reviewedAt"),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    index("annotation_review_learner_submitted_idx").on(table.userId, table.submittedAt),
    index("annotation_review_status_submitted_idx").on(table.status, table.submittedAt),
  ]
);

/** Learner-owned module competency evidence is privately scored by course administrators without changing formal assessment progression. */
export const competencyAssessments = mysqlTable(
  "competencyAssessments",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    moduleId: varchar("moduleId", { length: 128 }).notNull(),
    revisionOfAssessmentId: int("revisionOfAssessmentId").references((): AnyMySqlColumn => competencyAssessments.id, { onDelete: "set null" }),
    payloadJson: text("payloadJson").notNull(),
    status: mysqlEnum("status", ["submitted", "scored", "revision_requested"]).default("submitted").notNull(),
    scorecardJson: text("scorecardJson"),
    supervisorUserId: int("supervisorUserId").references(() => users.id, { onDelete: "set null" }),
    supervisorName: varchar("supervisorName", { length: 160 }),
    feedback: text("feedback"),
    feedbackReadAt: timestamp("feedbackReadAt"),
    submittedAt: timestamp("submittedAt").defaultNow().notNull(),
    reviewedAt: timestamp("reviewedAt"),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    index("competency_assessment_learner_module_idx").on(table.userId, table.moduleId, table.submittedAt),
    index("competency_assessment_status_submitted_idx").on(table.status, table.submittedAt),
    uniqueIndex("competency_assessment_learner_revision_unique").on(table.userId, table.revisionOfAssessmentId),
  ]
);

/** Private field-visit evidence supports field-readiness self-review without altering formal course certification. */
export const fieldPracticumEntries = mysqlTable(
  "fieldPracticumEntries",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 160 }).notNull(),
    payloadJson: text("payloadJson").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("field_practicum_owner_updated_idx").on(table.userId, table.updatedAt)]
);

/** One learner-owned response per integrated capstone preserves the latest field-readiness self-review. */
export const capstoneSubmissions = mysqlTable(
  "capstoneSubmissions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    capstoneId: varchar("capstoneId", { length: 128 }).notNull(),
    payloadJson: text("payloadJson").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("capstone_submission_owner_case_unique").on(table.userId, table.capstoneId)]
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
