import { apiFetch } from "@/lib/api/client";

const LIVE_LISTEN_BASE = "/api/v1/dashboard/live-transcript";

export type LiveListenCapabilities = {
  live_transcript: boolean;
  live_audio: boolean;
  whisper: boolean;
  take_over: boolean;
};

export type LiveListenAudioInfo = {
  mode: "unavailable";
  reason: string;
};

export type ActiveLiveCallItem = {
  call_id: string;
  retell_call_id: string;
  caller_name?: string | null;
  caller_phone: string;
  started_at?: string | null;
  duration_seconds?: number | null;
  priority: string;
  capabilities: LiveListenCapabilities;
};

export type ActiveLiveCallsResponse = {
  shop_id: string;
  active_calls: ActiveLiveCallItem[];
  total: number;
};

export type LiveListenStartResponse = {
  session_id: string;
  call_id: string;
  retell_call_id: string;
  status: "listening";
  started_at: string;
  poll_url: string;
  poll_interval_ms: number;
  capabilities: LiveListenCapabilities;
  audio: LiveListenAudioInfo;
  transcript: string;
  call_status: string;
};

export type LiveListenSessionResponse = {
  session_id: string;
  call_id: string;
  status: "listening" | "ended" | "stopped";
  call_status: string;
  is_active: boolean;
  transcript: string;
  transcript_updated_at?: string | null;
  ended_reason?: string | null;
};

export type LiveListenStopResponse = {
  session_id: string;
  status: "stopped";
};

export type LiveListenTakeOverResponse = {
  status: "taken_over";
  call_id: string;
  retell_call_id: string;
  escalation_id: string;
  customer_phone: string;
  customer_name?: string | null;
  ai_stopped: boolean;
  message: string;
};

function shopParams(shopId: string): string {
  return new URLSearchParams({ shop_id: shopId }).toString();
}

/** GET /api/v1/dashboard/live-listen/active */
export async function fetchActiveLiveCalls(
  shopId: string,
  token?: string | null,
): Promise<ActiveLiveCallsResponse> {
  return apiFetch<ActiveLiveCallsResponse>(
    `${LIVE_LISTEN_BASE}/active?${shopParams(shopId)}`,
    { token, cache: "no-store" },
  );
}

/** POST /api/v1/dashboard/live-listen/{call_id}/start */
export async function startLiveListen(
  shopId: string,
  callId: string,
  token?: string | null,
): Promise<LiveListenStartResponse> {
  return apiFetch<LiveListenStartResponse>(
    `${LIVE_LISTEN_BASE}/${callId}/start?${shopParams(shopId)}`,
    { method: "POST", token, cache: "no-store" },
  );
}

/** GET /api/v1/dashboard/live-listen/{call_id}/session/{session_id} */
export async function pollLiveListenSession(
  shopId: string,
  callId: string,
  sessionId: string,
  token?: string | null,
): Promise<LiveListenSessionResponse> {
  return apiFetch<LiveListenSessionResponse>(
    `${LIVE_LISTEN_BASE}/${callId}/session/${sessionId}?${shopParams(shopId)}`,
    { token, cache: "no-store" },
  );
}

/** POST /api/v1/dashboard/live-listen/{call_id}/stop */
export async function stopLiveListen(
  shopId: string,
  callId: string,
  sessionId: string,
  token?: string | null,
): Promise<LiveListenStopResponse> {
  return apiFetch<LiveListenStopResponse>(
    `${LIVE_LISTEN_BASE}/${callId}/stop?${shopParams(shopId)}`,
    {
      method: "POST",
      token,
      body: JSON.stringify({ session_id: sessionId }),
      cache: "no-store",
    },
  );
}

/** POST /api/v1/dashboard/live-listen/{call_id}/take-over */
export async function takeOverLiveCall(
  shopId: string,
  callId: string,
  token?: string | null,
  options?: { sessionId?: string | null; reason?: string | null },
): Promise<LiveListenTakeOverResponse> {
  return apiFetch<LiveListenTakeOverResponse>(
    `${LIVE_LISTEN_BASE}/${callId}/take-over?${shopParams(shopId)}`,
    {
      method: "POST",
      token,
      body: JSON.stringify({
        session_id: options?.sessionId ?? null,
        reason: options?.reason ?? null,
      }),
      cache: "no-store",
    },
  );
}
