"use client";

import { useAuth } from "@clerk/nextjs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useShop } from "@/components/dashboard/shop-provider";
import {
  fetchDashboardAnalytics,
  type DashboardAnalytics,
} from "@/lib/api/analytics";
import { ApiError } from "@/lib/api/client";
import { fetchJobs } from "@/lib/api/jobs";
import type { JobsListResponse } from "@/lib/api/types";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";
import { JOBS_POLL_MS, QUERY_STALE_MS } from "@/lib/query/config";
import { queryKeys } from "@/lib/query/keys";

function useShopQueryEnabled(): {
  enabled: boolean;
  shopId: string | undefined;
} {
  const { isLoaded, isSignedIn } = useAuth();
  const { shopId, loading, resolvingMe } = useShop();

  const enabled =
    isLoaded &&
    isSignedIn === true &&
    !loading &&
    !resolvingMe &&
    Boolean(shopId);

  return { enabled, shopId };
}

export function useDashboardAnalyticsQuery() {
  const { getToken } = useAuth();
  const { enabled, shopId } = useShopQueryEnabled();

  return useQuery({
    queryKey: queryKeys.dashboard.analytics(shopId ?? ""),
    queryFn: () =>
      withClerkAuthRetry(getToken, (token) =>
        fetchDashboardAnalytics(shopId!, token),
      ),
    enabled: enabled && Boolean(shopId),
    staleTime: QUERY_STALE_MS,
    placeholderData: keepPreviousData,
  });
}

type UseJobsListQueryOptions = {
  /** Poll for new bookings (dashboard feed + jobs page). */
  poll?: boolean;
};

export function useJobsListQuery(options: UseJobsListQueryOptions = {}) {
  const { poll = false } = options;
  const { getToken } = useAuth();
  const { enabled, shopId } = useShopQueryEnabled();

  return useQuery({
    queryKey: queryKeys.dashboard.jobs(shopId ?? ""),
    queryFn: async () => {
      try {
        return await withClerkAuthRetry(getToken, (token) =>
          fetchJobs(shopId!, token),
        );
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return { jobs: [], total: 0, revenue_captured_usd: 0 };
        }
        throw error;
      }
    },
    enabled: enabled && Boolean(shopId),
    staleTime: poll ? JOBS_POLL_MS / 2 : QUERY_STALE_MS,
    refetchInterval: poll ? JOBS_POLL_MS : false,
    refetchIntervalInBackground: false,
    placeholderData: keepPreviousData,
  });
}

export type { DashboardAnalytics, JobsListResponse };
