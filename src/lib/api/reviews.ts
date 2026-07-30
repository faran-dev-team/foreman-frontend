import { apiFetch } from "@/lib/api/client";

const REVIEWS_BASE = "/api/v1/reviews";

export type ReviewSummary = {
  id: string;
  shop_id: string;
  job_id: string;
  customer_id: string;
  status: string;
  delivery_channel: string;
  scheduled_at?: string | null;
  next_attempt_at?: string | null;
  sent_at?: string | null;
  retry_count: number;
  attempt_count: number;
  failure_reason?: string | null;
  customer_name?: string | null;
  job_type?: string | null;
  created_at: string;
  updated_at: string;
};

export type ReviewListResponse = {
  items: ReviewSummary[];
  total: number;
  skip: number;
  limit: number;
};

export type ReviewStatusSummary = {
  pending: number;
  scheduled: number;
  sent: number;
  delivered: number;
  failed: number;
  retrying: number;
  failed_permanent: number;
  total: number;
};

export type ReviewRequestDetail = {
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
    delivery_channel: string;
    review_url: string;
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
  created_at: string;
  updated_at: string;
};

/** GET /api/v1/reviews — list review requests for a shop. */
export async function fetchReviewRequests(
  shopId: string,
  token?: string | null,
  options?: { status?: string; skip?: number; limit?: number },
): Promise<ReviewListResponse> {
  const params = new URLSearchParams({ shop_id: shopId });
  if (options?.status) params.set("status", options.status);
  if (options?.skip != null) params.set("skip", String(options.skip));
  if (options?.limit != null) params.set("limit", String(options.limit));
  return apiFetch<ReviewListResponse>(`${REVIEWS_BASE}?${params.toString()}`, {
    token,
    cache: "no-store",
  });
}

/** GET /api/v1/reviews/summary — counts by lifecycle status. */
export async function fetchReviewStatusSummary(
  shopId: string,
  token?: string | null,
): Promise<ReviewStatusSummary> {
  const params = new URLSearchParams({ shop_id: shopId });
  return apiFetch<ReviewStatusSummary>(
    `${REVIEWS_BASE}/summary?${params.toString()}`,
    { token, cache: "no-store" },
  );
}

/** GET /api/v1/reviews/{id} — full review request detail. */
export async function fetchReviewRequest(
  shopId: string,
  reviewRequestId: string,
  token?: string | null,
): Promise<ReviewRequestDetail> {
  const params = new URLSearchParams({ shop_id: shopId });
  return apiFetch<ReviewRequestDetail>(
    `${REVIEWS_BASE}/${reviewRequestId}?${params.toString()}`,
    { token, cache: "no-store" },
  );
}

/** POST /api/v1/reviews/{id}/retry — queue another delivery attempt. */
export async function retryReviewRequest(
  shopId: string,
  reviewRequestId: string,
  token?: string | null,
  immediate = true,
): Promise<ReviewRequestDetail> {
  const params = new URLSearchParams({ shop_id: shopId });
  return apiFetch<ReviewRequestDetail>(
    `${REVIEWS_BASE}/${reviewRequestId}/retry?${params.toString()}`,
    {
      method: "POST",
      token,
      body: JSON.stringify({ immediate }),
      cache: "no-store",
    },
  );
}
