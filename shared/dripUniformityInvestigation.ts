export const dripUniformityInvestigationRequirements = {
  moduleId: "drip-irrigation-system",
  checkpoints: ["Source-near checkpoint", "Middle checkpoint", "Far-end checkpoint"] as const,
  evidenceChecks: [
    { id: "filter", label: "Source, filtration, and visible connections are observed using the current system and safety guidance." },
    { id: "distribution", label: "Near, middle, and far-end delivery and visible wetting patterns are compared while the system operates." },
    { id: "crop", label: "Crop response and root-zone context are compared without assuming a system cause from one plant symptom." },
    { id: "records", label: "Recent operation, maintenance, water-source, and field-condition records are checked before changing a setting." },
  ] as const,
  nextStepOptions: ["Repeat the comparison on the next planned monitoring pass", "Review filters, records, and manufacturer instructions with the responsible operator", "Request an authorised water, system, or field-evidence check", "Seek qualified irrigation, extension, or specialist support before changing the system"],
  nonGatingBoundary: "The Drip Uniformity Investigation Lab is voluntary practice. It does not change formal assessment scores, the 80% pass rule, sequential gates, competency scoring, certification, or owner alerts.",
  safetyBoundary: "This lab does not prescribe runtime, pressure, repair, flushing, chemical treatment, or fertigation settings. Do not alter electrical, pump, pressurised, or water-source equipment from this exercise. Use current manufacturer guidance and qualified support for uncertain or consequential system conditions.",
} as const;

export type DripUniformityEvidenceCheckId = (typeof dripUniformityInvestigationRequirements.evidenceChecks)[number]["id"];

export type DripUniformityCheckpoint = {
  checkpoint: (typeof dripUniformityInvestigationRequirements.checkpoints)[number];
  location: string;
  deliveryAndWetting: string;
  cropAndHardwareContext: string;
};

export type DripUniformityInvestigationDraft = {
  systemQuestion: string;
  recentSystemContext: string;
  checkpoints: DripUniformityCheckpoint[];
  evidenceChecks: Record<DripUniformityEvidenceCheckId, boolean>;
  nextStep: (typeof dripUniformityInvestigationRequirements.nextStepOptions)[number];
  pauseOrReferral: string;
};

export function createEmptyDripUniformityInvestigationDraft(): DripUniformityInvestigationDraft {
  return {
    systemQuestion: "",
    recentSystemContext: "",
    checkpoints: dripUniformityInvestigationRequirements.checkpoints.map(checkpoint => ({ checkpoint, location: "", deliveryAndWetting: "", cropAndHardwareContext: "" })),
    evidenceChecks: Object.fromEntries(dripUniformityInvestigationRequirements.evidenceChecks.map(check => [check.id, false])) as Record<DripUniformityEvidenceCheckId, boolean>,
    nextStep: dripUniformityInvestigationRequirements.nextStepOptions[0],
    pauseOrReferral: "",
  };
}

export function hasCompleteDripUniformityEvidence(draft: DripUniformityInvestigationDraft) {
  return Boolean(draft.systemQuestion.trim() && draft.recentSystemContext.trim() && draft.checkpoints.every(checkpoint => checkpoint.location.trim() && checkpoint.deliveryAndWetting.trim() && checkpoint.cropAndHardwareContext.trim()) && dripUniformityInvestigationRequirements.evidenceChecks.every(check => draft.evidenceChecks[check.id]));
}
