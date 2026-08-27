export const soilSamplingQualityAuditRequirements = {
  moduleId: "collect-soil-samples-for-soil-testing",
  auditChecks: [
    { id: "zone", label: "The field or management zone is clearly defined and unlike areas are kept separate." },
    { id: "tools", label: "Sampling tools and the mixing container are clean and suitable for the laboratory method." },
    { id: "method", label: "The planned sample points and depth follow the current receiving laboratory or authorised local instructions." },
    { id: "identity", label: "The sample bag, field record, and laboratory form use the same unique sample identity." },
    { id: "context", label: "Crop, management history, question, and any relevant field differences are recorded for interpretation." },
  ] as const,
  nonGatingBoundary: "The Soil Sampling Quality Audit is voluntary practice. It does not change formal assessment scores, the 80% pass rule, sequential gates, competency scoring, certification, or owner alerts.",
  safetyBoundary: "This audit checks sample quality; it does not interpret a soil result or prescribe fertiliser, amendments, rates, depths, or treatments. Follow the current receiving laboratory instructions and authorised local guidance, and seek laboratory or extension support when sampling context or results are uncertain.",
} as const;

export type SoilSamplingAuditCheckId = (typeof soilSamplingQualityAuditRequirements.auditChecks)[number]["id"];

export type SoilSamplingAuditDraft = {
  sampleId: string;
  fieldZone: string;
  cropAndQuestion: string;
  labInstructions: string;
  checks: Record<SoilSamplingAuditCheckId, boolean>;
  pauseOrReferral: string;
};

export function createEmptySoilSamplingAuditDraft(): SoilSamplingAuditDraft {
  return {
    sampleId: "",
    fieldZone: "",
    cropAndQuestion: "",
    labInstructions: "",
    checks: Object.fromEntries(soilSamplingQualityAuditRequirements.auditChecks.map(check => [check.id, false])) as Record<SoilSamplingAuditCheckId, boolean>,
    pauseOrReferral: "",
  };
}

export function getMissingSoilSamplingAuditChecks(draft: SoilSamplingAuditDraft) {
  return soilSamplingQualityAuditRequirements.auditChecks.filter(check => !draft.checks[check.id]).map(check => check.id);
}

export function isSoilSamplingAuditReady(draft: SoilSamplingAuditDraft) {
  return Boolean(draft.sampleId.trim() && draft.fieldZone.trim() && draft.cropAndQuestion.trim() && draft.labInstructions.trim() && getMissingSoilSamplingAuditChecks(draft).length === 0);
}
