import { MySqlDialect } from "drizzle-orm/mysql-core";
import { describe, expect, it } from "vitest";
import { buildCropDiagnosisAnnotationFeedbackReadFilter } from "./db";

describe("annotation feedback read query", () => {
  it("updates only learner-owned feedback rows that are unread, including only requested IDs", () => {
    const query = new MySqlDialect().sqlToQuery(buildCropDiagnosisAnnotationFeedbackReadFilter(73, [11, 19]));

    expect(query.sql).toContain("`cropDiagnosisAnnotationReviews`.`userId` = ?");
    expect(query.sql).toContain("`cropDiagnosisAnnotationReviews`.`feedback` is not null");
    expect(query.sql).toContain("`cropDiagnosisAnnotationReviews`.`feedbackReadAt` is null");
    expect(query.sql).toContain("`cropDiagnosisAnnotationReviews`.`id` in (?, ?)");
    expect(query.params).toEqual([73, 11, 19]);
  });
});
