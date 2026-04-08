import type { ExtendedBackend } from "@/types/appTypes";
import { useActor } from "./useActor";

/**
 * Returns the backend actor directly for imperative calls (mutations, etc.)
 * For read-only data, prefer useQueries.ts patterns with React Query.
 * Cast to ExtendedBackend to expose Tenant, MLM, and Events methods.
 */
export function useBackend(): ExtendedBackend | null {
  const { actor } = useActor();
  return actor as unknown as ExtendedBackend | null;
}
