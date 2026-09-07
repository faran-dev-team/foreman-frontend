"use client";

import { useAuth } from "@clerk/nextjs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useShopQueryEnabled } from "@/hooks/use-shop-query-enabled";
import {
  fetchMonthlyReport,
  fetchWeeklyReport,
  type MonthlyReportPeriod,
  type WeeklyReportPeriod,
} from "@/lib/api/reports";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";
import { QUERY_STALE_MS } from "@/lib/query/config";
import { queryKeys } from "@/lib/query/keys";

export function useReportQuery(
  kind: "weekly" | "monthly",
  weeklyPeriod: WeeklyReportPeriod,
  monthlyPeriod: MonthlyReportPeriod,
) {
  const { getToken } = useAuth();
  const { enabled, shopId } = useShopQueryEnabled();
  const period = kind === "weekly" ? weeklyPeriod : monthlyPeriod;

  return useQuery({
    queryKey: queryKeys.reports(shopId ?? "", kind, period),
    queryFn: () =>
      withClerkAuthRetry(getToken, (token) =>
        kind === "weekly"
          ? fetchWeeklyReport(shopId!, weeklyPeriod, token)
          : fetchMonthlyReport(shopId!, monthlyPeriod, token),
      ),
    enabled: enabled && Boolean(shopId),
    staleTime: QUERY_STALE_MS,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}
