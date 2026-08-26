export const fieldInquiryPeerReflectionRequirements = {
  minimumResponseLength: 30,
  maximumResponseLength: 1200,
} as const;

export type FieldInquiryPeerReflectionPayload = {
  learningTaken: string;
  revisedAction: string;
  nextEvidence: string;
};

export const fieldInquiryPeerReflectionPrompts = [
  { key: "learningTaken", label: "What I took from the peer feedback", helper: "Identify a useful insight, question, or evidence gap you noticed after reading the feedback." },
  { key: "revisedAction", label: "What I will revise or test", helper: "Describe the change you will make to your inquiry, interpretation, or safe next step." },
  { key: "nextEvidence", label: "Evidence I will gather next", helper: "Name the observation, comparison, record, or authorised source check that will strengthen your next review." },
] as const;

export const fieldInquiryPeerReflectionBoundary = "This private reflection supports learner sense-making after peer feedback. It does not change lesson completion, formal assessment scores, the 80% pass rule, sequential gates, competency scoring, certification, or owner alerts. It must not be used to create product, rate, threshold, medical, cleanup, disposal, legal-reporting, or unverified local-requirement advice; use current labels, authorised channels, laboratory, extension, or specialist referral where needed." as const;
