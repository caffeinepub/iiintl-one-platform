import { useActor } from "./useActor";

/**
 * Returns the backend actor directly for imperative calls (mutations, etc.)
 * For read-only data, prefer useQueries.ts patterns with React Query.
 */
export function useBackend() {
  const { actor } = useActor();
  return actor;
}
