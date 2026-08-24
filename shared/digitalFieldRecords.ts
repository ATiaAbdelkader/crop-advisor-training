import { type FieldRecordTemplate } from "./fieldRecordTemplates";

export const MAX_FIELD_RECORD_ENTRIES = 12;
export const MAX_FIELD_RECORD_VALUE_LENGTH = 2000;
export const MAX_FIELD_RECORD_TITLE_LENGTH = 160;

export type FieldRecordPayload = {
  setup: Record<string, string>;
  entries: Array<Record<string, string>>;
  review: string[];
};

export function createEmptyFieldRecordPayload(template: FieldRecordTemplate): FieldRecordPayload {
  return {
    setup: Object.fromEntries(template.setupFields.map(field => [field, ""])),
    entries: Array.from({ length: 3 }, () => Object.fromEntries(template.recordColumns.map(column => [column, ""]))),
    review: template.reviewPrompts.map(() => ""),
  };
}

export function getFieldRecordTitle(template: FieldRecordTemplate, title?: string) {
  return title?.trim() || `${template.shortTitle} — ${new Date().toLocaleDateString()}`;
}
