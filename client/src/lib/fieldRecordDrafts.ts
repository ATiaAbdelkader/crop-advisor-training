import type { FieldRecordPayload } from "@shared/digitalFieldRecords";

export type FieldRecordDraft = { title?: string; payload: FieldRecordPayload };

export function fieldRecordDraftStorageKey(templateId: string) {
  return `crop-advisor-field-record-draft:${templateId}`;
}

export function parseFieldRecordDraft(rawDraft: string | null): FieldRecordDraft | null {
  if (!rawDraft) return null;
  try {
    const draft = JSON.parse(rawDraft) as Partial<FieldRecordDraft>;
    if (!draft.payload?.setup || !Array.isArray(draft.payload.entries) || !Array.isArray(draft.payload.review)) return null;
    return { title: typeof draft.title === "string" ? draft.title : undefined, payload: draft.payload };
  } catch {
    return null;
  }
}
