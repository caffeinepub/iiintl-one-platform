import { createActor } from "@/backend";
import { useActor as useCaffeineActor } from "@caffeineai/core-infrastructure";

/**
 * Wraps the caffeineai useActor hook with this project's createActor function.
 * Returns { actor: Backend | null, isFetching: boolean }
 */
export function useActor() {
  return useCaffeineActor(createActor);
}
