"use client";

import { useAuth } from "@clerk/nextjs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useShopQueryEnabled } from "@/hooks/use-shop-query-enabled";
import {
  fetchDashboardAnalytics,
  type DashboardAnalytics,
} from "@/lib/api/analytics";
import { fetchCalls } from "@/lib/api/calls";
import { ApiError } from "@/lib/api/client";
import {
  fetchFollowUps,
  fetchFollowUpStatusSummary,
  type FollowUpListResponse,
  type FollowUpStatusSummary,
} from "@/lib/api/follow-ups";
import { fetchJobs } from "@/lib/api/jobs";
import {
  fetchAppointmentReminders,
  fetchReminderStatusSummary,
  type ReminderListResponse,
  type ReminderStatusSummary,
} from "@/lib/api/reminders";
import {
  fetchReviewRequests,
  fetchReviewStatusSummary,
  type ReviewListResponse,
  type ReviewStatusSummary,
} from "@/lib/api/reviews";
import type { CallsListResponse, JobsListResponse } from "@/lib/api/types";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";
import { QUERY_STALE_MS } from "@/lib/query/config";
import { queryKeys } from "@/lib/query/keys";

const LIST_LIMIT = 100;

const listQueryOptions = {
  staleTime: QUERY_STALE_MS,
  placeholderData: keepPreviousData,
  refetchOnWindowFocus: false,
} as const;

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
    ...listQueryOptions,
  });
}

export function useJobsListQuery() {
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
    ...listQueryOptions,
  });
}

export function useCallsListQuery() {
  const { getToken } = useAuth();
  const { enabled, shopId } = useShopQueryEnabled();

  return useQuery({
    queryKey: queryKeys.dashboard.calls(shopId ?? ""),
    queryFn: async () => {
      try {
        return await withClerkAuthRetry(getToken, (token) =>
          fetchCalls(shopId!, token),
        );
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return { calls: [], total: 0 };
        }
        throw error;
      }
    },
    enabled: enabled && Boolean(shopId),
    ...listQueryOptions,
  });
}

export type RemindersPageData = {
  list: ReminderListResponse;
  summary: ReminderStatusSummary;
};

export function useRemindersQuery() {
  const { getToken } = useAuth();
  const { enabled, shopId } = useShopQueryEnabled();

  return useQuery({
    queryKey: queryKeys.reminders(shopId ?? ""),
    queryFn: async (): Promise<RemindersPageData> => {
      const [list, summary] = await Promise.all([
        withClerkAuthRetry(getToken, (token) =>
          fetchAppointmentReminders(shopId!, token, { limit: LIST_LIMIT }),
        ),
        withClerkAuthRetry(getToken, (token) =>
          fetchReminderStatusSummary(shopId!, token),
        ),
      ]);
      return { list, summary };
    },
    enabled: enabled && Boolean(shopId),
    ...listQueryOptions,
  });
}

export type ReviewsPageData = {
  list: ReviewListResponse;
  summary: ReviewStatusSummary;
};

export function useReviewsQuery() {
  const { getToken } = useAuth();
  const { enabled, shopId } = useShopQueryEnabled();

  return useQuery({
    queryKey: queryKeys.reviews(shopId ?? ""),
    queryFn: async (): Promise<ReviewsPageData> => {
      const [list, summary] = await Promise.all([
        withClerkAuthRetry(getToken, (token) =>
          fetchReviewRequests(shopId!, token, { limit: LIST_LIMIT }),
        ),
        withClerkAuthRetry(getToken, (token) =>
          fetchReviewStatusSummary(shopId!, token),
        ),
      ]);
      return { list, summary };
    },
    enabled: enabled && Boolean(shopId),
    ...listQueryOptions,
  });
}

export type FollowUpsPageData = {
  list: FollowUpListResponse;
  summary: FollowUpStatusSummary;
};

export function useFollowUpsQuery() {
  const { getToken } = useAuth();
  const { enabled, shopId } = useShopQueryEnabled();

  return useQuery({
    queryKey: queryKeys.followUps(shopId ?? ""),
    queryFn: async (): Promise<FollowUpsPageData> => {
      const [list, summary] = await Promise.all([
        withClerkAuthRetry(getToken, (token) =>
          fetchFollowUps(shopId!, token, { limit: LIST_LIMIT }),
        ),
        withClerkAuthRetry(getToken, (token) =>
          fetchFollowUpStatusSummary(shopId!, token),
        ),
      ]);
      return { list, summary };
    },
    enabled: enabled && Boolean(shopId),
    ...listQueryOptions,
  });
}

export function resolveDashboardQueryError(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof TypeError) {
    return "Cannot reach the Foreman API. Is the backend running on NEXT_PUBLIC_API_URL?";
  }
  return "Failed to load data.";
}

export type {
  CallsListResponse,
  DashboardAnalytics,
  JobsListResponse,
};
