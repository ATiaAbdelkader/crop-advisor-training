export const scorecardReflectionPrompts = [
  { id: "feedbackObservation", label: "What did you notice in the scorecard or feedback?", helper: "Name one strength or evidence gap in the supervisor feedback. Do not restate a diagnosis or unsupported conclusion." },
  { id: "revisedAction", label: "What will you preserve or revise in your next field action?", helper: "Describe a low-risk, evidence-led adjustment that fits the module competency and its boundaries." },
  { id: "nextEvidence", label: "What evidence will you collect, recheck, or seek before the next review?", helper: "State a practical observation, record, comparison, or authorised referral trigger." },
] as const;

export type ScorecardReflectionPayload = Record<(typeof scorecardReflectionPrompts)[number]["id"], string>;

export const scorecardReflectionRequirements = {
  minimumResponseLength: 30,
  maximumResponseLength: 1800,
  nonGatingBoundary: "This reflection supports developmental learning from a supervisor scorecard. It does not change formal assessment scores, sequential gates, certification, or any authorised referral boundary.",
} as const;

export function scorecardReflectionFocus(assessmentId: number) { return `scorecard-reflection:${assessmentId}`; }

export function createEmptyScorecardReflection(): ScorecardReflectionPayload {
  return { feedbackObservation: "", revisedAction: "", nextEvidence: "" };
}

export function parseScorecardReflection(value: string | null | undefined): ScorecardReflectionPayload | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<ScorecardReflectionPayload>;
    if (typeof parsed.feedbackObservation !== "string" || typeof parsed.revisedAction !== "string" || typeof parsed.nextEvidence !== "string") return null;
    return { feedbackObservation: parsed.feedbackObservation, revisedAction: parsed.revisedAction, nextEvidence: parsed.nextEvidence };
  } catch { return null; }
}
