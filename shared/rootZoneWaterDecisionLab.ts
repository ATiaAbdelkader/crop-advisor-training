export const rootZoneWaterDecisionLabRequirements = {
  moduleId: "water-management",
  comparisonZones: ["Reference or better-performing zone", "Zone needing investigation"] as const,
  evidenceChecks: [
    { id: "rootZone", label: "Root-zone moisture and soil-air or drainage observations are recorded for both zones." },
    { id: "waterHistory", label: "Recent rainfall, irrigation, or water-source context is recorded without assuming it explains the crop response." },
    { id: "cropPattern", label: "Crop stage, plant response, and the field pattern are compared across both zones." },
    { id: "systemContext", label: "Irrigation layout, application uniformity, and relevant field conditions are checked before changing an operating setting." },
  ] as const,
  nextStepOptions: ["Monitor and recheck a comparable route", "Review field, rainfall, irrigation, and maintenance records", "Verify water-quality, soil, drainage, or system evidence through authorised channels", "Seek irrigation, extension, laboratory, or specialist support"] as const,
  nonGatingBoundary: "The Root-Zone Water and Air Decision Lab is voluntary practice. It does not change formal assessment scores, the 80% pass rule, sequential gates, competency scoring, certification, or owner alerts.",
  safetyBoundary: "This lab does not set irrigation duration, volume, pressure, or nutrient application. Do not infer water quality, salinity, contamination, or a crop diagnosis from one observation. Use current local guidance and seek laboratory, irrigation, extension, or specialist support for uncertain or high-consequence conditions.",
} as const;

export type RootZoneWaterEvidenceCheckId = (typeof rootZoneWaterDecisionLabRequirements.evidenceChecks)[number]["id"];

export type RootZoneWaterObservation = {
  zone: (typeof rootZoneWaterDecisionLabRequirements.comparisonZones)[number];
  location: string;
  rootZoneAndAir: string;
  cropAndPattern: string;
};

export type RootZoneWaterDecisionDraft = {
  fieldQuestion: string;
  cropStage: string;
  recentWaterContext: string;
  observations: RootZoneWaterObservation[];
  evidenceChecks: Record<RootZoneWaterEvidenceCheckId, boolean>;
  nextStep: (typeof rootZoneWaterDecisionLabRequirements.nextStepOptions)[number];
  pauseOrReferral: string;
};

export function createEmptyRootZoneWaterDecisionDraft(): RootZoneWaterDecisionDraft {
  return {
    fieldQuestion: "",
    cropStage: "",
    recentWaterContext: "",
    observations: rootZoneWaterDecisionLabRequirements.comparisonZones.map(zone => ({ zone, location: "", rootZoneAndAir: "", cropAndPattern: "" })),
    evidenceChecks: Object.fromEntries(rootZoneWaterDecisionLabRequirements.evidenceChecks.map(check => [check.id, false])) as Record<RootZoneWaterEvidenceCheckId, boolean>,
    nextStep: rootZoneWaterDecisionLabRequirements.nextStepOptions[0],
    pauseOrReferral: "",
  };
}

export function hasComparableRootZoneWaterEvidence(draft: RootZoneWaterDecisionDraft) {
  return Boolean(draft.fieldQuestion.trim() && draft.cropStage.trim() && draft.recentWaterContext.trim() && draft.observations.every(observation => observation.location.trim() && observation.rootZoneAndAir.trim() && observation.cropAndPattern.trim()) && rootZoneWaterDecisionLabRequirements.evidenceChecks.every(check => draft.evidenceChecks[check.id]));
}
