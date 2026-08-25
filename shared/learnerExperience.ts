import { cropAdvisorCourse, getModuleForAssessment } from "./curriculum";
import { competencyDomains, moduleCompetencyByModuleId } from "./competencyFramework";
import type { CompetencyScorecard } from "./competencyScoring";

type AssessmentAttempt = { assessmentId: string; score: number; passed: "yes" | "no"; submittedAt: Date };
type ScenarioAttempt = { moduleId: string; scenarioId: string; score: number; passed: "yes" | "no"; submittedAt: Date };
type CompetencyAssessment = { id: number; moduleId: string; status: "submitted" | "scored" | "revision_requested"; scorecard: CompetencyScorecard | null; feedback: string | null; feedbackReadAt: Date | null; submittedAt: Date; reviewedAt: Date | null };
type EvidenceCount = { records: number; scenarios: number; practicum: number; capstones: number; annotations: number; competencySubmissions: number; competencyPhotos: number; reflections: number };

export type LearnerExperienceInput = {
  passedModuleIds: readonly string[];
  assessmentAttempts: readonly AssessmentAttempt[];
  scenarioAttempts: readonly ScenarioAttempt[];
  competencyAssessments: readonly CompetencyAssessment[];
  evidenceCount: EvidenceCount;
  now?: Date;
};

export type PersonalisedNextStep = {
  key: string;
  moduleId: string;
  title: string;
  reason: string;
  actionLabel: string;
  href: string;
  priority: "feedback" | "remediation" | "practice" | "review";
};

function newestByModule<T extends { moduleId: string; submittedAt: Date }>(entries: readonly T[]) {
  return new Map(Object.entries(entries.reduce<Record<string, T>>((latest, entry) => {
    if (!latest[entry.moduleId] || latest[entry.moduleId].submittedAt < entry.submittedAt) latest[entry.moduleId] = entry;
    return latest;
  }, {})));
}

function daysBetween(earlier: Date, later: Date) {
  return Math.max(0, Math.floor((later.getTime() - earlier.getTime()) / 86_400_000));
}

export function buildLearnerExperience(input: LearnerExperienceInput) {
  const now = input.now ?? new Date();
  const passedModuleIds = new Set(input.passedModuleIds);
  const latestCompetencyByModule = newestByModule(input.competencyAssessments);
  const latestScenarioByModule = newestByModule(input.scenarioAttempts);
  const moduleAttempts = input.assessmentAttempts
    .map(attempt => ({ attempt, module: getModuleForAssessment(attempt.assessmentId) }))
    .filter((item): item is { attempt: AssessmentAttempt; module: (typeof cropAdvisorCourse.modules)[number] } => Boolean(item.module));
  const latestAssessmentByModule = new Map<string, AssessmentAttempt>();
  moduleAttempts.forEach(({ attempt, module }) => {
    const current = latestAssessmentByModule.get(module.id);
    if (!current || current.submittedAt < attempt.submittedAt) latestAssessmentByModule.set(module.id, attempt);
  });

  const nextSteps: PersonalisedNextStep[] = [];
  latestCompetencyByModule.forEach((assessment, moduleId) => {
    const competency = moduleCompetencyByModuleId[moduleId];
    if (!competency) return;
    if (assessment.status === "revision_requested") {
      nextSteps.push({ key: `revision-${assessment.id}`, moduleId, title: `Revise evidence: ${competency.title}`, reason: "A supervisor requested a clearer or more complete evidence submission. Review the feedback, then submit a fresh field-performance record.", actionLabel: "Open scorecard", href: `/competency-review/${moduleId}`, priority: "feedback" });
      return;
    }
    if (assessment.scorecard && Object.values(assessment.scorecard).some(score => score !== "demonstrated")) {
      const levels = Object.entries(assessment.scorecard).filter(([, score]) => score !== "demonstrated").map(([level]) => level === "review-refer" ? "Review and refer" : level[0].toUpperCase() + level.slice(1));
      nextSteps.push({ key: `score-${assessment.id}`, moduleId, title: `Strengthen ${competency.title}`, reason: `${levels.join(" and ")} still needs stronger evidence. ${competency.remediationFocus}`, actionLabel: "Review scorecard", href: `/competency-review/${moduleId}`, priority: "remediation" });
    }
  });
  latestAssessmentByModule.forEach((attempt, moduleId) => {
    if (attempt.passed === "no") {
      const competency = moduleCompetencyByModuleId[moduleId];
      nextSteps.push({ key: `assessment-${moduleId}`, moduleId, title: `Rebuild evidence: ${competency?.title ?? "module assessment"}`, reason: `Your latest formal check was ${attempt.score}%. ${competency?.remediationFocus ?? "Revisit the module evidence before attempting the check again."}`, actionLabel: "Open module", href: `/course/${moduleId}`, priority: "remediation" });
    }
  });
  latestScenarioByModule.forEach((attempt, moduleId) => {
    if (attempt.passed === "no" && !nextSteps.some(step => step.moduleId === moduleId && step.priority !== "review")) {
      nextSteps.push({ key: `scenario-${attempt.scenarioId}`, moduleId, title: "Rehearse the field decision", reason: `Your latest applied scenario scored ${attempt.score}%. Revisit the evidence checklist and try the decision practice again.`, actionLabel: "Open practice", href: `/scenarios/${attempt.scenarioId}`, priority: "practice" });
    }
  });

  const spacedReviewPrompts = moduleAttempts
    .filter(({ attempt }) => attempt.passed === "yes")
    .sort((a, b) => b.attempt.submittedAt.getTime() - a.attempt.submittedAt.getTime())
    .filter(({ module }, index, entries) => entries.findIndex(entry => entry.module.id === module.id) === index)
    .slice(0, 4)
    .map(({ attempt, module }) => {
      const elapsed = daysBetween(attempt.submittedAt, now);
      const targetDays = elapsed < 7 ? 7 : elapsed < 30 ? 30 : 60;
      const due = elapsed >= targetDays;
      return {
        moduleId: module.id,
        title: due ? `Revisit ${module.title}` : `Schedule a ${targetDays}-day review: ${module.title}`,
        detail: due ? "Use the field brief, scenario, or record prompt for a short retrieval review: retrieve the method from memory, then compare it with a current field decision." : `Your last successful formal check was ${elapsed} day${elapsed === 1 ? "" : "s"} ago. A short in-app retrieval review will be useful in ${Math.max(0, targetDays - elapsed)} day${Math.max(0, targetDays - elapsed) === 1 ? "" : "s"}.`,
        due,
        href: `/course/${module.id}`,
      };
    });

  const transcript = competencyDomains.map(domain => {
    const moduleIds = cropAdvisorCourse.modules.filter(module => moduleCompetencyByModuleId[module.id]?.domainId === domain.id).map(module => module.id);
    const assessed = moduleIds.map(moduleId => latestCompetencyByModule.get(moduleId)).filter(Boolean) as CompetencyAssessment[];
    const scoreCounts = assessed.reduce((counts, assessment) => {
      Object.values(assessment.scorecard ?? {}).forEach(score => { counts[score] = (counts[score] ?? 0) + 1; });
      return counts;
    }, {} as Record<string, number>);
    return {
      ...domain,
      moduleCount: moduleIds.length,
      formalPassedCount: moduleIds.filter(moduleId => passedModuleIds.has(moduleId)).length,
      supervisorEvidenceCount: assessed.length,
      demonstratedCount: scoreCounts.demonstrated ?? 0,
      developingCount: scoreCounts.developing ?? 0,
      notYetCount: scoreCounts.not_yet ?? 0,
    };
  });

  const evidenceLibrary = [
    { id: "field-records", title: "Field records", count: input.evidenceCount.records, description: "Water, fertilisation, IPM, and other saved decision records.", href: "/records" },
    { id: "decision-practice", title: "Decision practice", count: input.evidenceCount.scenarios, description: "Completed applied field-scenario attempts.", href: "/scenarios" },
    { id: "competency-evidence", title: "Competency evidence", count: input.evidenceCount.competencySubmissions, description: "Private evidence submitted for supervisor scoring.", href: "/competencies" },
    { id: "competency-photos", title: "Field photo evidence", count: input.evidenceCount.competencyPhotos, description: "Learner-owned photos attached to module competency evidence.", href: "/competencies" },
    { id: "field-readiness", title: "Field readiness", count: input.evidenceCount.practicum + input.evidenceCount.capstones, description: "Practicum visits and integrated capstone evidence.", href: "/field-readiness" },
    { id: "reflections", title: "Competency reflections", count: input.evidenceCount.reflections, description: "Private scorecard and field-readiness reflections connected to competency development.", href: "/competency-reflections" },
    { id: "diagnosis-annotation", title: "Visual diagnosis reasoning", count: input.evidenceCount.annotations, description: "Completed photo-annotation evidence and feedback.", href: "/diagnosis-annotation" },
  ];

  const priorityOrder = { feedback: 0, remediation: 1, practice: 2, review: 3 } as const;
  return {
    nextSteps: nextSteps.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]).slice(0, 5),
    transcript,
    spacedReviewPrompts,
    evidenceLibrary,
  };
}
