export const competencyEvidenceComparisonBoundary = "This comparison supports feedback-informed revision of learner-owned evidence. It does not replace formal assessment or authorise a diagnosis or intervention. It does not change sequential gates, certification, or authorised referral boundaries." as const;

export const competencyEvidenceComparisonSections = [
  { id: "evidenceSummary", label: "Evidence summary" },
  { id: "taskContext", label: "Task context" },
  { id: "reviewOrReferral", label: "Review, uncertainty, or referral boundary" },
] as const;
