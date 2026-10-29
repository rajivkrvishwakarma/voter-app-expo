/**
 * Truly global application types.
 *
 * Rules (from AGENTS.md):
 * - Only domain-agnostic global types belong here.
 * - Feature-specific types belong inside their respective feature folders.
 */

export type Nullable<T> = T | null;
export type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};
