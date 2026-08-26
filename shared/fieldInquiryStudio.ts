import { moduleCompetencyByModuleId } from "./competencyFramework";
import { documentModuleFieldBriefs } from "./moduleFieldBriefs";

export type FieldInquiryStage = {
  id: "frame" | "observe" | "interpret" | "decide" | "recheck";
  label: string;
  purpose: string;
  learnerPrompt: string;
};

export type FieldInquiryStudio = {
  moduleId: string;
  title: string;
  fieldSignal: string;
  stages: readonly FieldInquiryStage[];
  rehearsalQuestions: readonly string[];
  evidenceStandard: string;
  safetyBoundary: string;
  nonGatingBoundary: string;
};

const sharedStagePurpose = {
  frame: "Turn a broad field concern into a decision that can be supported by evidence.",
  observe: "Use direct observation and a meaningful comparison before explaining a cause.",
  interpret: "Connect field evidence to the module concept while naming what remains uncertain.",
  decide: "Choose a bounded next action that fits the evidence, constraints, and safety conditions.",
  recheck: "Define the observation, timeframe, or referral condition that will test the decision.",
} as const;

export function getFieldInquiryStudio(moduleId: string): FieldInquiryStudio | undefined {
  const brief = documentModuleFieldBriefs[moduleId];
  const competency = moduleCompetencyByModuleId[moduleId];
  if (!brief || !competency) return undefined;

  return {
    moduleId,
    title: `Field Inquiry Studio: ${brief.title}`,
    fieldSignal: brief.context,
    stages: [
      { id: "frame", label: "Frame the field decision", purpose: sharedStagePurpose.frame, learnerPrompt: `State the field question behind this situation: ${brief.task}` },
      { id: "observe", label: "Observe and compare", purpose: sharedStagePurpose.observe, learnerPrompt: `Plan the minimum observations and comparison needed before acting. Record: ${brief.evidence}` },
      { id: "interpret", label: "Interpret without overclaiming", purpose: sharedStagePurpose.interpret, learnerPrompt: `Explain how the evidence could support or challenge the module competency: ${competency.competencyStatement}` },
      { id: "decide", label: "Choose a bounded next action", purpose: sharedStagePurpose.decide, learnerPrompt: `Set out the next action or investigation, keeping this quality standard visible: ${brief.standard}` },
      { id: "recheck", label: "Recheck or refer", purpose: sharedStagePurpose.recheck, learnerPrompt: `Name the review point, evidence gap, or referral trigger that would cause you to reconsider the decision.` },
    ],
    rehearsalQuestions: [
      "Which fact must be observed rather than assumed?",
      "What meaningful comparison would challenge your first explanation?",
      "What would make your next step reviewable by a grower, peer, or supervisor?",
    ],
    evidenceStandard: competency.evidence,
    safetyBoundary: competency.safetyBoundary,
    nonGatingBoundary: "This voluntary field inquiry rehearsal builds applied judgement. It does not change lesson completion, the 80% formal assessment rule, sequential gates, competency scoring, certification, or owner alerts.",
  };
}

export const fieldInquirySourceBasis = "The sequence adapts FAO Farmer Field School principles of direct observation, discussion, decision-making, local-context analysis, and field-based experimentation, together with work-based learning’s emphasis on practical participation and guided competence development." as const;
