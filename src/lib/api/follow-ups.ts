import { apiFetch } from "@/lib/api/client";

const FOLLOW_UPS_BASE = "/api/v1/follow-ups";

export type FollowUpSummary = {
  id: string;
  shop_id: string;
  job_id: string;
  customer_id: string;
  status: string;
  scheduled_at?: string | null;
  next_attempt_at?: string | null;
  sent_at?: string | null;
  retry_count: number;
  attempt_count: number;
  failure_reason?: string | null;
  rating?: number | null;
  owner_notified: boolean;
  customer_name?: string | null;
  job_type?: string | null;
  created_at: string;
  updated_at: string;
};

export type FollowUpListResponse = {
  items: FollowUpSummary[];
  total: number;
  skip: number;
  limit: number;
};

export type FollowUpStatusSummary = {
  pending: number;
  scheduled: number;
  sent: number;
  delivered: number;
  failed: number;
  retrying: number;
  failed_permanent: number;
  total: number;
};

export type FollowUpDetail = {
  id: string;
  shop_id: string;
  status: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
  };
  job: {
    id: string;
    job_type: string;
    status: string;
    completed_at?: string | null;
  };
  delivery: {
    provider_message_id?: string | null;
    sent_at?: string | null;
    last_attempt_at?: string | null;
    failure_reason?: string | null;
  };
  retry: {
    retry_count: number;
    attempt_count: number;
    scheduled_at?: string | null;
    next_attempt_at?: string | null;
  };
  feedback: {
    rating?: number | null;
    feedback?: string | null;
    submitted_at?: string | null;
    owner_notified: boolean;
    owner_notified_at?: string | null;
    owner_notification_provider_message_id?: string | null;
    owner_notification_failure_reason?: string | null;
  };
  created_at: string;
  updated_at: string;
};

/** GET /api/v1/follow-ups — list follow-ups for a shop. */
export async function fetchFollowUps(
  shopId: string,
  token?: string | null,
  options?: { status?: string; skip?: number; limit?: number },
): Promise<FollowUpListResponse> {
  const params = new URLSearchParams({ shop_id: shopId });
  if (options?.status) params.set("status", options.status);
  if (options?.skip != null) params.set("skip", String(options.skip));
  if (options?.limit != null) params.set("limit", String(options.limit));
  return apiFetch<FollowUpListResponse>(`${FOLLOW_UPS_BASE}?${params.toString()}`, {
    token,
    cache: "no-store",
  });
}

/** GET /api/v1/follow-ups/summary — counts by lifecycle status. */
export async function fetchFollowUpStatusSummary(
  shopId: string,
  token?: string | null,
): Promise<FollowUpStatusSummary> {
  const params = new URLSearchParams({ shop_id: shopId });
  return apiFetch<FollowUpStatusSummary>(
    `${FOLLOW_UPS_BASE}/summary?${params.toString()}`,
    { token, cache: "no-store" },
  );
}

/** GET /api/v1/follow-ups/{id} — full follow-up detail. */
export async function fetchFollowUp(
  shopId: string,
  followUpId: string,
  token?: string | null,
): Promise<FollowUpDetail> {
  const params = new URLSearchParams({ shop_id: shopId });
  return apiFetch<FollowUpDetail>(
    `${FOLLOW_UPS_BASE}/${followUpId}?${params.toString()}`,
    { token, cache: "no-store" },
  );
}

/** POST /api/v1/follow-ups/{id}/retry — queue another delivery attempt. */
export async function retryFollowUp(
  shopId: string,
  followUpId: string,
  token?: string | null,
  immediate = true,
): Promise<FollowUpDetail> {
  const params = new URLSearchParams({ shop_id: shopId });
  return apiFetch<FollowUpDetail>(
    `${FOLLOW_UPS_BASE}/${followUpId}/retry?${params.toString()}`,
    {
      method: "POST",
      token,
      body: JSON.stringify({ immediate }),
      cache: "no-store",
    },
  );
}

/** POST /api/v1/follow-ups/schedule — backfill follow-up for a completed job. */
export async function scheduleFollowUp(
  shopId: string,
  jobId: string,
  token?: string | null,
): Promise<FollowUpDetail> {
  const params = new URLSearchParams({ shop_id: shopId });
  return apiFetch<FollowUpDetail>(
    `${FOLLOW_UPS_BASE}/schedule?${params.toString()}`,
    {
      method: "POST",
      token,
      body: JSON.stringify({ job_id: jobId }),
      cache: "no-store",
    },
  );
}

/** POST /api/v1/follow-ups/{id}/feedback — record rating (staff) + notify owner. */
export async function submitFollowUpFeedback(
  shopId: string,
  followUpId: string,
  rating: number,
  token?: string | null,
  feedback?: string | null,
): Promise<FollowUpDetail> {
  const params = new URLSearchParams({ shop_id: shopId });
  return apiFetch<FollowUpDetail>(
    `${FOLLOW_UPS_BASE}/${followUpId}/feedback?${params.toString()}`,
    {
      method: "POST",
      token,
      body: JSON.stringify({
        rating,
        feedback: feedback?.trim() ? feedback.trim() : null,
      }),
      cache: "no-store",
    },
  );
}
