import { useQuery } from "@tanstack/react-query";
import { searchPlaces } from "@/services/geocoding.service";
import { useDebouncedValue } from "./useDebouncedValue";

export function useGeocodingSearch(query: string) {
  const debouncedQuery = useDebouncedValue(query, 300);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["geocoding", debouncedQuery],
    queryFn: () => searchPlaces(debouncedQuery),
    enabled: debouncedQuery.length >= 3,
    staleTime: 60_000,
  });

  return { results, isLoading };
}
