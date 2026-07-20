import { apiFetch } from "@/lib/api/client";
import type { CalendarStatus } from "@/lib/api/types";

const INTEGRATIONS_BASE = "/api/v1/integrations/google";

/** Fetch Google OAuth URL (requires Clerk/Foreman Bearer token). */
export async function fetchCalendarConnectUrl(
  shopId: string,
  token?: string | null,
): Promise<string> {
  const params = new URLSearchParams({ shop_id: shopId });
  const response = await apiFetch<{ connect_url: string }>(
    `${INTEGRATIONS_BASE}/connect?${params.toString()}`,
    { token, cache: "no-store" },
  );
  return response.connect_url;
}

/** @deprecated Use fetchCalendarConnectUrl with a Bearer token (Path B). */
export function getCalendarConnectUrl(shopId: string): string {
  const params = new URLSearchParams({ shop_id: shopId });
  return `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000"}${INTEGRATIONS_BASE}/connect?${params.toString()}`;
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
