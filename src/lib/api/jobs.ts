import { apiFetch } from "@/lib/api/client";
import type { JobsListResponse } from "@/lib/api/types";

const DASHBOARD_BASE = "/api/v1/dashboard";

/** Fetch booked jobs and revenue captured for a shop. */
export async function fetchJobs(
  shopId: string,
  token?: string | null,
): Promise<JobsListResponse> {
  const params = new URLSearchParams({ shop_id: shopId });
  return apiFetch<JobsListResponse>(
    `${DASHBOARD_BASE}/jobs?${params.toString()}`,
    { token, cache: "no-store" },
  );
}
