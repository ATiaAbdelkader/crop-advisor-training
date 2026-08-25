export type AnnotationLabel = "field-pattern" | "affected-unaffected" | "symptom-sign" | "pest-beneficial" | "contributing-condition" | "uncertainty";

export const annotationLabelOptions: Array<{ id: AnnotationLabel; label: string; description: string }> = [
  { id: "field-pattern", label: "Field pattern", description: "Distribution, patch edge, or affected zone" },
  { id: "affected-unaffected", label: "Affected / unaffected comparison", description: "A useful comparison point" },
  { id: "symptom-sign", label: "Symptom / sign", description: "Visible plant response or possible sign" },
  { id: "pest-beneficial", label: "Pest / beneficial evidence", description: "Injury, pest stage, trap, or beneficial organism" },
  { id: "contributing-condition", label: "Contributing condition", description: "Soil, water, crop stage, weather, sanitation, or history clue" },
  { id: "uncertainty", label: "Uncertainty", description: "Evidence that needs another field check" },
];

export interface CropDiagnosisAnnotationCase {
  id: string;
  moduleIds: string[];
  title: string;
  focus: string;
  imageSrc: string;
  alt: string;
  visualWarning: string;
  requiredLabels: AnnotationLabel[];
  prompt: string;
  options: Array<{ id: string; label: string }>;
  correctOptionId: string;
  feedback: string;
  safeNextStep: string;
}

export const cropDiagnosisAnnotationCases: CropDiagnosisAnnotationCase[] = [
  {
    id: "pattern-and-water-context",
    moduleIds: ["field-diagnosis-in-vegetable-crops", "water-management", "integrated-pest-management"],
    title: "Case 1 · Pattern before cause",
    focus: "An uneven patch sits beside plants that appear less affected. Annotate the distribution and any water or soil context you can see.",
    imageSrc: "/manus-storage/diagnosis-case-field-pattern_7250bab6.jpg",
    alt: "Simulated training photo of an uneven patch of pale and wilted tomato plants beside healthier plants with visible soil and drip-line context.",
    visualWarning: "This simulated image contains field clues only. It does not establish why plants are affected.",
    requiredLabels: ["field-pattern", "affected-unaffected", "contributing-condition", "uncertainty"],
    prompt: "Which next step best protects against mistaking a visible patch for a confirmed cause?",
    options: [
      { id: "a", label: "Describe the affected and unaffected zones, inspect root-zone and irrigation evidence, record field history, and retain uncertainty before selecting an action." },
      { id: "b", label: "Treat every pale plant as one confirmed disease because the patch is visible in the image." },
      { id: "c", label: "Ignore the healthier plants because the affected patch is the only evidence that matters." },
    ],
    correctOptionId: "a",
    feedback: "A pattern can direct investigation, but it does not confirm a disease, water problem, nutrient issue, or other cause. Compare zones and collect related field evidence.",
    safeNextStep: "Recheck a defined affected and unaffected sample with root-zone, irrigation, crop-history, and plant-condition evidence; seek qualified support when the cause or risk remains uncertain.",
  },
  {
    id: "leaf-symptoms-and-uncertainty",
    moduleIds: ["field-diagnosis-in-vegetable-crops", "disease-identification-and-management", "vegetable-fertilisation"],
    title: "Case 2 · Describe before diagnosing",
    focus: "Annotate visible yellowing, lesions, leaf position, healthier comparison foliage, and any evidence that the image cannot provide.",
    imageSrc: "/manus-storage/diagnosis-case-leaf-symptoms_f1abd158.jpg",
    alt: "Simulated training photo of tomato foliage showing yellowing and small brown lesions alongside healthier green leaves.",
    visualWarning: "Leaf symptoms have multiple possible explanations. The image is not a confirmed diagnosis or nutrient recommendation.",
    requiredLabels: ["symptom-sign", "affected-unaffected", "uncertainty"],
    prompt: "What is the most defensible annotation-based conclusion from the photograph alone?",
    options: [
      { id: "a", label: "Leaves show visible yellowing and lesions; plant part, pattern, signs, roots, water, history, and distribution still need field checking before a cause is named." },
      { id: "b", label: "The exact pathogen is confirmed because a brown lesion can be seen." },
      { id: "c", label: "A fertiliser product and application rate can be selected from leaf colour alone." },
    ],
    correctOptionId: "a",
    feedback: "Good diagnosis begins with accurate symptom description and comparison, then tests competing explanations with field and plant evidence. A photograph alone is insufficient for a confirmed cause or prescription.",
    safeNextStep: "Record the symptom distribution and plant part, compare affected/unaffected plants, inspect for signs and root context where appropriate, then use current qualified diagnostic support when uncertainty persists.",
  },
  {
    id: "injury-pests-and-beneficials",
    moduleIds: ["insect-pests-and-mites-identification-and-management", "integrated-pest-management", "field-diagnosis-in-vegetable-crops"],
    title: "Case 3 · Separate injury, pests, and beneficials",
    focus: "Annotate injury, any observed pest evidence, beneficial-organism evidence, the sampled plant part, and what would need counting or rechecking.",
    imageSrc: "/manus-storage/diagnosis-case-pest-beneficial_dd9bfecb.jpg",
    alt: "Simulated training photo of a leafy vegetable with modest chewing injury, small insects under a leaf, and a visible beneficial predatory insect.",
    visualWarning: "Visible injury and insects are evidence to record, not automatic authority for a control action.",
    requiredLabels: ["pest-beneficial", "symptom-sign", "uncertainty"],
    prompt: "Which record would best support an IPM decision after this visual observation?",
    options: [
      { id: "a", label: "Record plant part, injury pattern, sampled and affected units, pest stage/count, beneficial observations, crop stage, field pattern, and a repeatable recheck route." },
      { id: "b", label: "Record only that insects are visible, then choose a product without counting or checking beneficials." },
      { id: "c", label: "Treat chewing injury and every insect as the same evidence category." },
    ],
    correctOptionId: "a",
    feedback: "IPM evidence keeps injury, pest stage/count, beneficial organisms, crop context, and field distribution distinct. A visible insect is not a whole-field density estimate or a treatment decision.",
    safeNextStep: "Use a repeatable scouting unit and route, retain pest and beneficial observations separately, verify any current threshold and legal/product fit, and seek authorised crop-protection support for uncertain or high-consequence decisions.",
  },
];

export const cropDiagnosisAnnotationByModuleId = Object.fromEntries(
  cropDiagnosisAnnotationCases.flatMap(caseItem => caseItem.moduleIds.map(moduleId => [moduleId, caseItem]))
) as Record<string, CropDiagnosisAnnotationCase>;

export type CropDiagnosisAnnotationPin = {
  x: number;
  y: number;
  label: AnnotationLabel;
};

export type CropDiagnosisAnnotationReviewPayload = {
  rationale: string;
  cases: Array<{
    caseId: string;
    answer: string;
    pins: CropDiagnosisAnnotationPin[];
  }>;
};

export const annotationSupervisorReviewCriteria = [
  "Pins distinguish field pattern, symptom or sign, pest or beneficial evidence, contributing conditions, and uncertainty where the case requires them.",
  "The learner’s rationale separates visible evidence from a confirmed cause and identifies an appropriate recheck or referral boundary.",
  "The next-step judgement protects evidence quality and does not introduce an unsupported treatment, product, rate, threshold, or legal claim.",
] as const;

export const annotationSupervisorReviewRequirements = {
  supervisorRole: "admin",
  minimumRationaleLength: 80,
  minimumFeedbackLength: 20,
  statuses: ["submitted", "reviewed", "revision_requested"] as const,
  formalGateBoundary: "Supervisor review is private developmental feedback and does not alter lesson progression, formal assessment scores, certificate issuance, or owner-alert rules.",
} as const;

export const annotationDashboardNotificationRequirements = {
  visibleStatuses: ["submitted", "reviewed", "revision_requested"] as const,
  notifyStatuses: ["reviewed", "revision_requested"] as const,
  readState: "feedbackReadAt",
  ordering: "reviewedAt-or-submittedAt",
  ownershipBoundary: "A learner can retrieve or mark read only feedback records attached to their authenticated account.",
  formalGateBoundary: "Dashboard review status and in-app feedback notifications are developmental only and do not alter lesson progression, formal assessment scores, certificate issuance, or owner-alert rules.",
} as const;

export type AnnotationReviewNotificationTimelineItem = {
  submittedAt: Date;
  reviewedAt: Date | null;
};

export function sortAnnotationReviewNotifications<T extends AnnotationReviewNotificationTimelineItem>(notifications: T[]): T[] {
  return [...notifications].sort((left, right) => {
    const leftTimestamp = (left.reviewedAt ?? left.submittedAt).getTime();
    const rightTimestamp = (right.reviewedAt ?? right.submittedAt).getTime();
    return rightTimestamp - leftTimestamp;
  });
}

export type AnnotationFeedbackReadCandidate = {
  id: number;
  userId: number;
  feedback: string | null;
  feedbackReadAt: Date | null;
};

export function isUnreadAnnotationFeedbackForLearner(candidate: AnnotationFeedbackReadCandidate, learnerId: number, requestedIds?: number[]): boolean {
  return candidate.userId === learnerId && Boolean(candidate.feedback) && candidate.feedbackReadAt === null && (!requestedIds?.length || requestedIds.includes(candidate.id));
}
