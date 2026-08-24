export type SavedRecordListState = "loading" | "error" | "ready" | "empty";

export function getSavedRecordListState(input: {
  isLoading: boolean;
  isError: boolean;
  recordCount: number;
}): SavedRecordListState {
  if (input.isLoading) return "loading";
  if (input.isError) return "error";
  return input.recordCount > 0 ? "ready" : "empty";
}
