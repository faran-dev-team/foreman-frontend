import { apiFetch } from "@/lib/api/client";
import type { CallsListResponse } from "@/lib/api/types";

const DASHBOARD_BASE = "/api/v1/dashboard";

/** Fetch recent calls for a shop. */
export async function fetchCalls(
  shopId: string,
  token?: string | null,
): Promise<CallsListResponse> {
  const params = new URLSearchParams({ shop_id: shopId });
  return apiFetch<CallsListResponse>(
    `${DASHBOARD_BASE}/calls?${params.toString()}`,
    { token, cache: "no-store" },
  );
}
