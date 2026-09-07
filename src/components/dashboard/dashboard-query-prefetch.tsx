"use client";

import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useShopQueryEnabled } from "@/hooks/use-shop-query-enabled";
import { fetchDashboardAnalytics } from "@/lib/api/analytics";
import { fetchCalls } from "@/lib/api/calls";
import { ApiError } from "@/lib/api/client";
import { fetchJobs } from "@/lib/api/jobs";
import { fetchActiveLiveCalls } from "@/lib/api/live-listen";
import {
  fetchAppointmentReminders,
  fetchReminderStatusSummary,
} from "@/lib/api/reminders";
import {
  fetchReviewRequests,
  fetchReviewStatusSummary,
} from "@/lib/api/reviews";
import {
  fetchFollowUps,
  fetchFollowUpStatusSummary,
} from "@/lib/api/follow-ups";
import { fetchOnboardingStatus } from "@/lib/api/onboarding";
import { fetchShopSettings } from "@/lib/api/settings";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";
import { QUERY_STALE_MS } from "@/lib/query/config";
import { queryKeys } from "@/lib/query/keys";

/**
 * Warm the owner-dashboard cache after /me resolves so switching pages
 * shows cached data instead of skeletons.
 */
export function DashboardQueryPrefetch() {
  const { getToken } = useAuth();
  const { enabled, shopId } = useShopQueryEnabled();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !shopId) return;

    const options = { staleTime: QUERY_STALE_MS };

    void queryClient.prefetchQuery({
      queryKey: queryKeys.dashboard.analytics(shopId),
      queryFn: () =>
        withClerkAuthRetry(getToken, (token) =>
          fetchDashboardAnalytics(shopId, token),
        ),
      ...options,
    });
    void queryClient.prefetchQuery({
      queryKey: queryKeys.dashboard.jobs(shopId),
      queryFn: async () => {
        try {
          return await withClerkAuthRetry(getToken, (token) =>
            fetchJobs(shopId, token),
          );
        } catch (error) {
          if (error instanceof ApiError && error.status === 404) {
            return { jobs: [], total: 0, revenue_captured_usd: 0 };
          }
          throw error;
        }
      },
      ...options,
    });
    void queryClient.prefetchQuery({
      queryKey: queryKeys.dashboard.calls(shopId),
      queryFn: async () => {
        try {
          return await withClerkAuthRetry(getToken, (token) =>
            fetchCalls(shopId, token),
          );
        } catch (error) {
          if (error instanceof ApiError && error.status === 404) {
            return { calls: [], total: 0 };
          }
          throw error;
        }
      },
      ...options,
    });
    void queryClient.prefetchQuery({
      queryKey: queryKeys.liveTranscript(shopId),
      queryFn: () =>
        withClerkAuthRetry(getToken, (token) =>
          fetchActiveLiveCalls(shopId, token),
        ),
      ...options,
    });

    const idleId = window.setTimeout(() => {
      void queryClient.prefetchQuery({
        queryKey: queryKeys.reminders(shopId),
        queryFn: async () => {
          const [list, summary] = await Promise.all([
            withClerkAuthRetry(getToken, (token) =>
              fetchAppointmentReminders(shopId, token, { limit: 100 }),
            ),
            withClerkAuthRetry(getToken, (token) =>
              fetchReminderStatusSummary(shopId, token),
            ),
          ]);
          return { list, summary };
        },
        ...options,
      });
      void queryClient.prefetchQuery({
        queryKey: queryKeys.reviews(shopId),
        queryFn: async () => {
          const [list, summary] = await Promise.all([
            withClerkAuthRetry(getToken, (token) =>
              fetchReviewRequests(shopId, token, { limit: 100 }),
            ),
            withClerkAuthRetry(getToken, (token) =>
              fetchReviewStatusSummary(shopId, token),
            ),
          ]);
          return { list, summary };
        },
        ...options,
      });
      void queryClient.prefetchQuery({
        queryKey: queryKeys.followUps(shopId),
        queryFn: async () => {
          const [list, summary] = await Promise.all([
            withClerkAuthRetry(getToken, (token) =>
              fetchFollowUps(shopId, token, { limit: 100 }),
            ),
            withClerkAuthRetry(getToken, (token) =>
              fetchFollowUpStatusSummary(shopId, token),
            ),
          ]);
          return { list, summary };
        },
        ...options,
      });
      void queryClient.prefetchQuery({
        queryKey: queryKeys.onboarding(shopId),
        queryFn: () =>
          withClerkAuthRetry(getToken, async (token) => {
            const [status, settings] = await Promise.all([
              fetchOnboardingStatus(shopId, token),
              fetchShopSettings(shopId, token),
            ]);
            return { status, settings };
          }),
        ...options,
      });
    }, 1500);

    return () => window.clearTimeout(idleId);
  }, [enabled, getToken, queryClient, shopId]);

  return null;
}
