import { apiFetch } from "@/lib/api/client";
import type {
  CallDetail,
  CallIntake,
  CallsListResponse,
} from "@/lib/api/types";

const DASHBOARD_BASE = "/api/v1/dashboard";
const VOICE_CALLS_BASE = "/voice/calls";

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

/** Fetch a single call (transcript, summary, recording_url). */
export async function fetchCallDetail(
  callId: string,
  token?: string | null,
): Promise<CallDetail> {
  return apiFetch<CallDetail>(`${VOICE_CALLS_BASE}/${callId}`, {
    token,
    cache: "no-store",
  });
}

/** Fetch customer intake saved during the call. */
export async function fetchCallIntake(
  callId: string,
  token?: string | null,
): Promise<CallIntake> {
  return apiFetch<CallIntake>(`${VOICE_CALLS_BASE}/${callId}/intake`, {
    token,
    cache: "no-store",
  });
}
