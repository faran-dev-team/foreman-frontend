import { apiFetch } from "@/lib/api/client";

const DASHBOARD_BASE = "/api/v1/dashboard";

/** Response from GET /api/v1/dashboard/analytics */
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
};

/** Launch+ revenue / jobs / conversion analytics for a shop. */
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
