import { apiFetch } from "@/lib/api/client";
import { getApiBaseUrl } from "@/lib/api/config";
import type { CalendarStatus } from "@/lib/api/types";

const INTEGRATIONS_BASE = "/api/v1/integrations/google";

/** Full URL to start Google OAuth (backend redirects to Google). */
export function getCalendarConnectUrl(shopId: string): string {
  const params = new URLSearchParams({ shop_id: shopId });
  return `${getApiBaseUrl()}${INTEGRATIONS_BASE}/connect?${params.toString()}`;
}

/** Check whether a shop has connected Google Calendar. */
export async function fetchCalendarStatus(
  shopId: string,
  token?: string | null,
): Promise<CalendarStatus> {
  const params = new URLSearchParams({ shop_id: shopId });
  return apiFetch<CalendarStatus>(
    `${INTEGRATIONS_BASE}/status?${params.toString()}`,
    { token, cache: "no-store" },
  );
}

/** Disconnect Google Calendar for a shop. */
export async function disconnectCalendar(
  shopId: string,
  token?: string | null,
): Promise<void> {
  const params = new URLSearchParams({ shop_id: shopId });
  await apiFetch<void>(`${INTEGRATIONS_BASE}/disconnect?${params.toString()}`, {
    method: "POST",
    token,
  });
}
