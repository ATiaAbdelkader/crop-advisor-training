import type { FieldRecordPayload } from "@shared/digitalFieldRecords";

export function toggleComparisonSelection(selectedIds: number[], id: number) {
  if (selectedIds.includes(id)) return selectedIds.filter(selectedId => selectedId !== id);
  return selectedIds.length < 2 ? [...selectedIds, id] : selectedIds;
}

export function comparisonSetupFields(records: Array<{ payload: FieldRecordPayload }>) {
  return Array.from(new Set(records.flatMap(record => Object.keys(record.payload.setup))));
}
