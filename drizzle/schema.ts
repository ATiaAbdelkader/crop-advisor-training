import {
  int,
  index,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
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

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
