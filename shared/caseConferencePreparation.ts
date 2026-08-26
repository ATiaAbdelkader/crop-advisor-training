export const caseConferencePreparationRequirements = {
  maximumNoteLength: 2_500,
  maximumMaterials: 3,
  maximumMaterialBytes: 3 * 1024 * 1024,
  acceptedMaterialTypes: [
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ] as const,
  boundary: "Facilitator preparation notes and materials support voluntary case-conference preparation only. They do not change formal assessment scores, the 80% pass rule, sequential gates, competency scoring, certification, or owner alerts.",
} as const;

export type CaseConferencePreparationMaterial = {
  name: string;
  key: string;
  url: string;
  contentType: (typeof caseConferencePreparationRequirements.acceptedMaterialTypes)[number];
  sizeBytes: number;
};
