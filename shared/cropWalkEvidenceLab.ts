export const cropWalkEvidenceLabRequirements = {
  moduleId: "crop-observation",
  observationZones: ["Reference healthy area", "Typical field area", "Unusual or affected area"] as const,
  routeOptions: ["Systematic transect through the field", "Zig-zag route across comparable zones", "Boundary-to-interior comparison route", "Locally agreed repeatable route"] as const,
  nextStepOptions: ["Recheck with additional observations", "Compare with field, weather, irrigation, or crop records", "Collect or request authorised laboratory / diagnostic evidence", "Seek extension, crop-health, or specialist support"] as const,
  nonGatingBoundary: "The Crop-Walk Evidence Lab is voluntary practice. It does not change formal assessment scores, the 80% pass rule, sequential gates, competency scoring, certification, or owner alerts.",
  safetyBoundary: "An observation is not a diagnosis or treatment instruction. Do not infer a cause, select a product, or set a rate from this activity. Use current labels, authorised local guidance, laboratory evidence, extension support, or specialist referral when an issue is uncertain or consequential.",
} as const;

export type CropWalkObservation = {
  zone: (typeof cropWalkEvidenceLabRequirements.observationZones)[number];
  location: string;
  cropAndSoilCondition: string;
  patternOrComparison: string;
};

export type CropWalkEvidenceDraft = {
  fieldQuestion: string;
  cropStage: string;
  route: (typeof cropWalkEvidenceLabRequirements.routeOptions)[number];
  observations: CropWalkObservation[];
  workingExplanation: string;
  competingExplanation: string;
  evidenceToCheck: string;
  safeNextStep: (typeof cropWalkEvidenceLabRequirements.nextStepOptions)[number];
  referralReason: string;
};

export function createEmptyCropWalkEvidenceDraft(): CropWalkEvidenceDraft {
  return {
    fieldQuestion: "",
    cropStage: "",
    route: cropWalkEvidenceLabRequirements.routeOptions[0],
    observations: cropWalkEvidenceLabRequirements.observationZones.map(zone => ({ zone, location: "", cropAndSoilCondition: "", patternOrComparison: "" })),
    workingExplanation: "",
    competingExplanation: "",
    evidenceToCheck: "",
    safeNextStep: cropWalkEvidenceLabRequirements.nextStepOptions[0],
    referralReason: "",
  };
}

export function hasComparableCropWalkEvidence(draft: CropWalkEvidenceDraft) {
  return Boolean(draft.fieldQuestion.trim() && draft.cropStage.trim() && draft.observations.every(observation => observation.location.trim() && observation.cropAndSoilCondition.trim() && observation.patternOrComparison.trim()));
}
