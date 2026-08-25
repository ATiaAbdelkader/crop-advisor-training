import { competencyPerformanceLevels } from "./competencyFramework";

export const competencyScoreOptions = [
  { id: "not_yet", label: "Not yet evidenced", description: "The submitted evidence does not yet show this level consistently enough for the supervisor to confirm it." },
  { id: "developing", label: "Developing", description: "The learner shows a relevant start but needs more complete, clearer, or more reliable evidence." },
  { id: "demonstrated", label: "Demonstrated", description: "The submitted evidence meets the module criterion for this level in the stated context." },
] as const;

export type CompetencyScoreRating = (typeof competencyScoreOptions)[number]["id"];
export type CompetencyScoreLevelId = (typeof competencyPerformanceLevels)[number]["id"];

export type CompetencyEvidenceSubmissionPayload = {
  evidenceSummary: string;
  taskContext: string;
  reviewOrReferral: string;
  attachments: readonly CompetencyEvidenceAttachment[];
};

export type CompetencyEvidenceAttachment = {
  name: string;
  key: string;
  url: string;
};

export type CompetencyScorecard = Record<CompetencyScoreLevelId, CompetencyScoreRating>;

export const competencyScoringRequirements = {
  minimumEvidenceSummaryLength: 80,
  minimumTaskContextLength: 30,
  minimumReviewBoundaryLength: 30,
  minimumSupervisorFeedbackLength: 40,
  maximumEvidencePhotos: 4,
  maximumEvidencePhotoBytes: 1_500_000,
  acceptedEvidencePhotoTypes: ["image/jpeg", "image/png", "image/webp"],
  nonGatingBoundary: "Supervisor competency scoring supports developmental field-readiness review. It does not change module assessment scores, sequential gates, certification, or owner alerts.",
} as const;

export function createEmptyCompetencyScorecard(): CompetencyScorecard {
  return Object.fromEntries(competencyPerformanceLevels.map(level => [level.id, "not_yet"])) as CompetencyScorecard;
}
