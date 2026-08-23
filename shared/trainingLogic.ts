import {
  cropAdvisorCourse,
  getAssessmentById,
  getModuleForAssessment,
  getModuleForLesson,
  type Assessment,
} from "./curriculum";

export type AttemptRecord = {
  assessmentId: string;
  score: number;
  passed: boolean;
  submittedAt: Date | string;
};

export type CertificateRecord = {
  credentialId: string;
  recipientName: string;
  finalScore: number;
  issuedAt: Date | string;
};

export type LearningRecords = {
  enrolled: boolean;
  completedLessonIds: readonly string[];
  attempts: readonly AttemptRecord[];
  certificate: CertificateRecord | null;
};

export type NextAction =
  | { type: "enroll"; id: string; title: string; description: string; href: string }
  | { type: "lesson"; id: string; title: string; description: string; href: string }
  | { type: "assessment"; id: string; title: string; description: string; href: string }
  | { type: "certificate"; id: string; title: string; description: string; href: string }
  | { type: "complete"; id: string; title: string; description: string; href: string };

function hasPassedAssessment(assessmentId: string, attempts: readonly AttemptRecord[]) {
  return attempts.some(attempt => attempt.assessmentId === assessmentId && attempt.passed);
}

function allModuleLessonsCompleted(
  moduleId: string,
  completedLessons: ReadonlySet<string>
) {
  const module = cropAdvisorCourse.modules.find(item => item.id === moduleId);
  return Boolean(module && module.lessons.every(lesson => completedLessons.has(lesson.id)));
}

export function isLessonAccessible(
  lessonId: string,
  completedLessonIds: readonly string[],
  attempts: readonly AttemptRecord[]
) {
  const module = getModuleForLesson(lessonId);
  if (!module) return false;
  const lessonIndex = module.lessons.findIndex(lesson => lesson.id === lessonId);
  if (lessonIndex < 0) return false;

  const completedLessons = new Set(completedLessonIds);
  if (module.index === 1 && lessonIndex === 0) return true;

  if (lessonIndex > 0) {
    return completedLessons.has(module.lessons[lessonIndex - 1].id);
  }

  const previousModule = cropAdvisorCourse.modules[module.index - 2];
  return Boolean(
    previousModule && hasPassedAssessment(previousModule.assessment.id, attempts)
  );
}

export function isAssessmentAccessible(
  assessmentId: string,
  completedLessonIds: readonly string[],
  attempts: readonly AttemptRecord[]
) {
  const assessment = getAssessmentById(assessmentId);
  if (!assessment) return false;

  const completedLessons = new Set(completedLessonIds);
  if (assessment.kind === "final") {
    return cropAdvisorCourse.modules.every(module =>
      hasPassedAssessment(module.assessment.id, attempts)
    );
  }

  const module = getModuleForAssessment(assessmentId);
  return Boolean(
    module && allModuleLessonsCompleted(module.id, completedLessons)
  );
}

export function scoreAssessment(
  assessment: Assessment,
  answers: Record<string, string>
) {
  const results = assessment.questions.map(question => {
    const selectedOptionId = answers[question.id] ?? null;
    const correct = selectedOptionId === question.correctOptionId;
    return {
      questionId: question.id,
      selectedOptionId,
      correctOptionId: question.correctOptionId,
      correct,
      feedback: correct ? question.feedback.correct : question.feedback.incorrect,
    };
  });
  const correctCount = results.filter(result => result.correct).length;
  const score = Math.round((correctCount / assessment.questions.length) * 100);
  return {
    score,
    passed: score >= assessment.passMark,
    correctCount,
    totalQuestions: assessment.questions.length,
    results,
  };
}

export function shouldIssueCertificate(assessmentId: string, passed: boolean) {
  return assessmentId === cropAdvisorCourse.finalAssessment.id && passed;
}

export function shouldNotifyOwnerOfCertification(
  assessmentId: string,
  passed: boolean,
  newlyIssued: boolean
) {
  return shouldIssueCertificate(assessmentId, passed) && newlyIssued;
}

export function buildTrainingOverview(records: LearningRecords) {
  const completedLessons = new Set(records.completedLessonIds);
  const availableLessonIds = cropAdvisorCourse.modules
    .flatMap(module => module.lessons)
    .filter(lesson => isLessonAccessible(lesson.id, records.completedLessonIds, records.attempts))
    .map(lesson => lesson.id);
  const availableAssessmentIds = [
    ...cropAdvisorCourse.modules.map(module => module.assessment.id),
    cropAdvisorCourse.finalAssessment.id,
  ].filter(assessmentId =>
    isAssessmentAccessible(assessmentId, records.completedLessonIds, records.attempts)
  );
  const passedAssessmentIds = [
    ...cropAdvisorCourse.modules.map(module => module.assessment.id),
    cropAdvisorCourse.finalAssessment.id,
  ].filter(assessmentId => hasPassedAssessment(assessmentId, records.attempts));
  const latestScores: Record<string, number> = {};
  for (const attempt of records.attempts) {
    if (latestScores[attempt.assessmentId] === undefined) {
      latestScores[attempt.assessmentId] = attempt.score;
    }
  }

  const moduleStates = cropAdvisorCourse.modules.map(module => {
    const completed = allModuleLessonsCompleted(module.id, completedLessons);
    const passed = hasPassedAssessment(module.assessment.id, records.attempts);
    const firstLessonAvailable = availableLessonIds.includes(module.lessons[0].id);
    return {
      id: module.id,
      title: module.title,
      eyebrow: module.eyebrow,
      description: module.description,
      completedLessons: module.lessons.filter(lesson => completedLessons.has(lesson.id)).length,
      lessonCount: module.lessons.length,
      assessmentId: module.assessment.id,
      assessmentPassed: passed,
      assessmentReady: completed,
      locked: !firstLessonAvailable && !completed && !passed,
    };
  });

  const totalSteps =
    cropAdvisorCourse.modules.flatMap(module => module.lessons).length +
    cropAdvisorCourse.modules.length +
    1;
  const completedSteps =
    completedLessons.size +
    cropAdvisorCourse.modules.filter(module =>
      hasPassedAssessment(module.assessment.id, records.attempts)
    ).length +
    (hasPassedAssessment(cropAdvisorCourse.finalAssessment.id, records.attempts) ? 1 : 0);
  const progressPercent = Math.min(
    100,
    Math.round((completedSteps / totalSteps) * 100)
  );

  let nextAction: NextAction;
  if (!records.enrolled) {
    nextAction = {
      type: "enroll",
      id: cropAdvisorCourse.id,
      title: "Enroll in Crop Advisor Foundations",
      description: "Activate the pathway to begin the first field-based lesson.",
      href: "/course/advisory-practice",
    };
  } else {
    const nextLesson = cropAdvisorCourse.modules
      .flatMap(module => module.lessons)
      .find(
        lesson =>
          !completedLessons.has(lesson.id) && availableLessonIds.includes(lesson.id)
      );
    const nextModuleAssessment = cropAdvisorCourse.modules
      .map(module => module.assessment)
      .find(
        assessment =>
          !hasPassedAssessment(assessment.id, records.attempts) &&
          availableAssessmentIds.includes(assessment.id)
      );

    if (nextLesson) {
      nextAction = {
        type: "lesson",
        id: nextLesson.id,
        title: nextLesson.title,
        description: "Continue the required learning sequence.",
        href: `/course/${getModuleForLesson(nextLesson.id)?.id}`,
      };
    } else if (nextModuleAssessment) {
      nextAction = {
        type: "assessment",
        id: nextModuleAssessment.id,
        title: nextModuleAssessment.title,
        description: `Score ${nextModuleAssessment.passMark}% or higher to unlock the next requirement.`,
        href: `/assessment/${nextModuleAssessment.id}`,
      };
    } else if (
      !hasPassedAssessment(cropAdvisorCourse.finalAssessment.id, records.attempts) &&
      availableAssessmentIds.includes(cropAdvisorCourse.finalAssessment.id)
    ) {
      nextAction = {
        type: "assessment",
        id: cropAdvisorCourse.finalAssessment.id,
        title: cropAdvisorCourse.finalAssessment.title,
        description: "Pass the final integrated assessment to qualify for certification.",
        href: `/assessment/${cropAdvisorCourse.finalAssessment.id}`,
      };
    } else if (records.certificate) {
      nextAction = {
        type: "certificate",
        id: records.certificate.credentialId,
        title: "Your credential is ready",
        description: "Download your verification-ready Crop Advisor Foundations Certificate.",
        href: "/certificate",
      };
    } else {
      nextAction = {
        type: "complete",
        id: "course-complete",
        title: "Curriculum complete",
        description: "Your final assessment record is being prepared for certification.",
        href: "/dashboard",
      };
    }
  }

  return {
    course: {
      id: cropAdvisorCourse.id,
      title: cropAdvisorCourse.title,
      credentialName: cropAdvisorCourse.credentialName,
      duration: cropAdvisorCourse.duration,
      passMark: cropAdvisorCourse.passMark,
    },
    enrolled: records.enrolled,
    completedLessonIds: Array.from(completedLessons),
    availableLessonIds,
    availableAssessmentIds,
    passedAssessmentIds,
    latestScores,
    moduleStates,
    progressPercent,
    completedSteps,
    totalSteps,
    nextAction,
    certificate: records.certificate,
  };
}
