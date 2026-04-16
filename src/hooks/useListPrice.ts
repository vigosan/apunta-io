import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { ListPrice } from "@/services/lists.service";
import { listsService } from "@/services/lists.service";

export function useListPrice(listId: string, enabled: boolean) {
  return useQuery<ListPrice | null>({
    queryKey: queryKeys.listPrice(listId),
    queryFn: () => listsService.getPrice(listId),
    enabled,
  });
}

export function useSetPrice(listId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (priceInCents: number) =>
      listsService.setPrice(listId, priceInCents),
    onSuccess: (price) => qc.setQueryData(queryKeys.listPrice(listId), price),
  });
}

export function useRemovePrice(listId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => listsService.removePrice(listId),
    onSuccess: () => qc.setQueryData(queryKeys.listPrice(listId), null),
  });
}
