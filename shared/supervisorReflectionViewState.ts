export type SupervisorReflectionViewState = "loading" | "error" | "empty" | "ready";

export function getSupervisorReflectionViewState(input: { isLoading: boolean; isError: boolean; hasReflection: boolean }): SupervisorReflectionViewState {
  if (input.isLoading) return "loading";
  if (input.isError) return "error";
  return input.hasReflection ? "ready" : "empty";
}
