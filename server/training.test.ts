import { describe, expect, it } from "vitest";
import { cropAdvisorCourse } from "../shared/curriculum";
import {
  buildTrainingOverview,
  isAssessmentAccessible,
  isLessonAccessible,
  scoreAssessment,
  shouldIssueCertificate,
  shouldNotifyOwnerOfCertification,
} from "../shared/trainingLogic";

describe("crop-advisor progression", () => {
  it("keeps the next module locked until the prior module assessment is passed", () => {
    const firstModule = cropAdvisorCourse.modules[0];
    const secondModule = cropAdvisorCourse.modules[1];
    const completed = firstModule.lessons.map(lesson => lesson.id);

    expect(isAssessmentAccessible(firstModule.assessment.id, completed, [])).toBe(true);
    expect(isLessonAccessible(secondModule.lessons[0].id, completed, [])).toBe(false);
    expect(
      isLessonAccessible(secondModule.lessons[0].id, completed, [
        {
          assessmentId: firstModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("unlocks the final only after every module assessment has been passed", () => {
    const allLessons = cropAdvisorCourse.modules.flatMap(module =>
      module.lessons.map(lesson => lesson.id)
    );
    const passedAllModules = cropAdvisorCourse.modules.map(module => ({
      assessmentId: module.assessment.id,
      score: 100,
      passed: true,
      submittedAt: new Date(),
    }));

    expect(
      isAssessmentAccessible(
        cropAdvisorCourse.finalAssessment.id,
        allLessons,
        passedAllModules
      )
    ).toBe(true);
  });

  it("scores answers and returns focused feedback", () => {
    const assessment = cropAdvisorCourse.modules[0].assessment;
    const perfectAnswers = Object.fromEntries(
      assessment.questions.map(question => [question.id, question.correctOptionId])
    );
    const result = scoreAssessment(assessment, perfectAnswers);

    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.results.every(item => item.correct)).toBe(true);
  });

  it("surfaces enrollment as the first required activity before learning begins", () => {
    const overview = buildTrainingOverview({
      enrolled: false,
      completedLessonIds: [],
      attempts: [],
      certificate: null,
    });

    expect(overview.nextAction.type).toBe("enroll");
    expect(overview.progressPercent).toBe(0);
  });

  it("only authorizes certificate issuance for a passed final assessment", () => {
    expect(shouldIssueCertificate(cropAdvisorCourse.finalAssessment.id, true)).toBe(true);
    expect(shouldIssueCertificate(cropAdvisorCourse.finalAssessment.id, false)).toBe(false);
    expect(shouldIssueCertificate(cropAdvisorCourse.modules[0].assessment.id, true)).toBe(false);
  });

  it("only authorizes the owner alert when certification has just been issued", () => {
    expect(
      shouldNotifyOwnerOfCertification(
        cropAdvisorCourse.finalAssessment.id,
        true,
        true
      )
    ).toBe(true);
    expect(
      shouldNotifyOwnerOfCertification(
        cropAdvisorCourse.finalAssessment.id,
        true,
        false
      )
    ).toBe(false);
  });
});
