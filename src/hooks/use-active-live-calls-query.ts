"use client";

import { useAuth } from "@clerk/nextjs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useShopQueryEnabled } from "@/hooks/use-shop-query-enabled";
import { fetchActiveLiveCalls } from "@/lib/api/live-listen";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";
import { QUERY_STALE_MS } from "@/lib/query/config";
import { queryKeys } from "@/lib/query/keys";

const LIVE_LIST_POLL_MS = 30_000;

export function useActiveLiveCallsQuery(options?: { poll?: boolean }) {
  const poll = options?.poll ?? false;
  const { getToken } = useAuth();
  const { enabled, shopId } = useShopQueryEnabled();

  return useQuery({
    queryKey: queryKeys.liveTranscript(shopId ?? ""),
    queryFn: () =>
      withClerkAuthRetry(getToken, (token) =>
        fetchActiveLiveCalls(shopId!, token),
      ),
    enabled: enabled && Boolean(shopId),
    staleTime: QUERY_STALE_MS,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: poll ? LIVE_LIST_POLL_MS : false,
    refetchIntervalInBackground: false,
  });
}
