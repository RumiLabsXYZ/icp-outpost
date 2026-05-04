import { useQuery } from "@tanstack/react-query";
import { getBff } from "@/lib/bff";
import { toBffCursor, toBffFilter, type ActivityFilters } from "@/lib/activityFilters";

export function useOverview() {
  return useQuery({
    queryKey: ["overview"],
    queryFn: async () => {
      const bff = getBff();
      return bff.get_overview();
    },
    staleTime: 10_000,
  });
}

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const bff = getBff();
      return bff.get_health();
    },
    staleTime: 5_000,
    refetchInterval: 10_000,
  });
}

export function useActivity(filters: ActivityFilters) {
  return useQuery({
    queryKey: ["activity", JSON.stringify(filters, (_k, v) => typeof v === "bigint" ? v.toString() : v)],
    queryFn: async () => {
      const bff = getBff();
      return bff.get_activity(toBffFilter(filters), toBffCursor(filters));
    },
    staleTime: 5_000,
  });
}

export function useEntity(kind: string, id: string) {
  return useQuery({
    queryKey: ["entity", kind, id],
    queryFn: async () => {
      const bff = getBff();
      return bff.get_entity(kind, id);
    },
    staleTime: 30_000,
    retry: false,
  });
}

export function useEvent(globalId: string) {
  return useQuery({
    queryKey: ["event", globalId],
    queryFn: async () => getBff().get_event(globalId),
    staleTime: Infinity,
  });
}
