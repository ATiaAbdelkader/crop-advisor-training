export const fieldDiagnosisEvidenceBoardRequirements = {
  moduleId: "field-diagnosis-in-vegetable-crops",
  nonGatingBoundary: "The Field Diagnosis Evidence Board is voluntary practice. It does not change formal assessment scores, the 80% pass rule, sequential gates, competency scoring, certification, or owner alerts.",
  safetyBoundary: "Field observations do not confirm a pathogen, pest, nutrient, or water cause. Do not select a treatment, product, rate, disposal action, or report from this board. Use current authorised guidance, laboratory evidence, extension, or specialist referral for uncertain or consequential cases.",
} as const;

export function diagnosisBoardIsComplete(values: Record<string, string>) {
  return ["question", "pattern", "working", "alternative", "evidence", "referral"].every(key => Boolean(values[key]?.trim()));
}
