import { useQuery } from "@tanstack/react-query";
import { stripeService } from "@/services/lists.service";
import { queryKeys } from "@/lib/query-keys";
import type { StripeAccountStatus } from "@/services/lists.service";

export function useStripeAccountStatus(enabled = true) {
  return useQuery<StripeAccountStatus>({
    queryKey: queryKeys.stripeAccountStatus(),
    queryFn: () => stripeService.getAccountStatus(),
    enabled,
  });
}
