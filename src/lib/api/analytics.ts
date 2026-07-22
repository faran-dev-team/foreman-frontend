import { apiFetch } from "@/lib/api/client";

const DASHBOARD_BASE = "/api/v1/dashboard";

/** Response from GET /api/v1/dashboard/analytics (Day 1 + Day 2). */
export type DashboardAnalytics = {
  revenue: {
    today: number;
    week: number;
    month: number;
  };
  jobs: {
    today: number;
    completed: number;
    pending: number;
    cancelled: number;
  };
  conversion_rate: number;
  calls: {
    captured: number;
    missed: number;
    capture_rate: number;
    average_duration_seconds: number;
  };
  ai_booking: {
    successful_bookings: number;
    eligible_calls: number;
    success_rate: number;
  };
  lead_sources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
};

/** Launch+ revenue / call performance / lead-source analytics for a shop. */
export async function fetchDashboardAnalytics(
  shopId: string,
  token?: string | null,
): Promise<DashboardAnalytics> {
  const params = new URLSearchParams({ shop_id: shopId });
  return apiFetch<DashboardAnalytics>(
    `${DASHBOARD_BASE}/analytics?${params.toString()}`,
    { token, cache: "no-store" },
  );
}
