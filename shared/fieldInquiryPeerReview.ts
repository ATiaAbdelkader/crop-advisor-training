export const fieldInquiryPeerReviewRequirements = {
  minimumDecisionLength: 40,
  maximumDecisionLength: 1800,
  minimumReviewLength: 30,
  maximumReviewLength: 1200,
  maximumPairLabelLength: 80,
} as const;

export type FieldInquiryDecisionPayload = {
  decisionQuestion: string;
  observationPlan: string;
  interpretation: string;
  boundedNextAction: string;
  recheckOrReferral: string;
};

export type FieldInquiryPeerReviewPayload = {
  evidenceSeen: string;
  questionToTest: string;
  nextEvidenceSuggestion: string;
};

export const fieldInquiryPeerReviewPrompts = [
  { key: "evidenceSeen", label: "Evidence you can see", helper: "Identify one observation or comparison that makes the inquiry stronger. Avoid judging the person." },
  { key: "questionToTest", label: "Question to test", helper: "Ask one constructive question that could challenge or refine the interpretation." },
  { key: "nextEvidenceSuggestion", label: "Next evidence to strengthen", helper: "Suggest one safe, reviewable observation, record, or authorised source check before the next action." },
] as const;

export const fieldInquiryPeerReviewBoundary = "Peer review is learner-controlled developmental dialogue. It does not change lesson completion, formal assessment scores, the 80% pass rule, sequential gates, competency scoring, certification, or owner alerts. Peer reviewers must not prescribe products, rates, thresholds, medical actions, disposal, legal reporting, or unverified local requirements; use current labels, authorised channels, laboratory, extension, or specialist referral where those checks are needed." as const;
