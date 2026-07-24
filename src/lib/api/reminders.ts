import { apiFetch } from "@/lib/api/client";

const REMINDERS_BASE = "/api/v1/appointment-reminders";

export type ReminderSummary = {
  id: string;
  shop_id: string;
  appointment_id: string;
  job_id: string;
  customer_id: string;
  reminder_type: string;
  status: string;
  scheduled_at: string;
  next_attempt_at?: string | null;
  sent_at?: string | null;
  retry_count: number;
  attempt_count: number;
  failure_reason?: string | null;
  customer_name?: string | null;
  appointment_service?: string | null;
  created_at: string;
  updated_at: string;
};

export type ReminderListResponse = {
  items: ReminderSummary[];
  total: number;
  skip: number;
  limit: number;
};

export type ReminderStatusSummary = {
  pending: number;
  scheduled: number;
  sent: number;
  delivered: number;
  failed: number;
  retrying: number;
  failed_permanent: number;
  total: number;
};

export type ReminderDetail = {
  id: string;
  shop_id: string;
  reminder_type: string;
  status: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
  };
  appointment: {
    id: string;
    service: string;
    status: string;
    scheduled_at: string;
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
  created_at: string;
  updated_at: string;
};

/** GET /api/v1/appointment-reminders — list reminders for a shop. */
export async function fetchAppointmentReminders(
  shopId: string,
  token?: string | null,
  options?: { status?: string; skip?: number; limit?: number },
): Promise<ReminderListResponse> {
  const params = new URLSearchParams({ shop_id: shopId });
  if (options?.status) params.set("status", options.status);
  if (options?.skip != null) params.set("skip", String(options.skip));
  if (options?.limit != null) params.set("limit", String(options.limit));
  return apiFetch<ReminderListResponse>(`${REMINDERS_BASE}?${params.toString()}`, {
    token,
    cache: "no-store",
  });
}

/** GET /api/v1/appointment-reminders/summary — counts by lifecycle status. */
export async function fetchReminderStatusSummary(
  shopId: string,
  token?: string | null,
): Promise<ReminderStatusSummary> {
  const params = new URLSearchParams({ shop_id: shopId });
  return apiFetch<ReminderStatusSummary>(
    `${REMINDERS_BASE}/summary?${params.toString()}`,
    { token, cache: "no-store" },
  );
}

/** GET /api/v1/appointment-reminders/{id} — full reminder detail. */
export async function fetchAppointmentReminder(
  shopId: string,
  reminderId: string,
  token?: string | null,
): Promise<ReminderDetail> {
  const params = new URLSearchParams({ shop_id: shopId });
  return apiFetch<ReminderDetail>(
    `${REMINDERS_BASE}/${reminderId}?${params.toString()}`,
    { token, cache: "no-store" },
  );
}

/** POST /api/v1/appointment-reminders/{id}/retry — queue another delivery attempt. */
export async function retryAppointmentReminder(
  shopId: string,
  reminderId: string,
  token?: string | null,
  immediate = true,
): Promise<ReminderDetail> {
  const params = new URLSearchParams({ shop_id: shopId });
  return apiFetch<ReminderDetail>(
    `${REMINDERS_BASE}/${reminderId}/retry?${params.toString()}`,
    {
      method: "POST",
      token,
      body: JSON.stringify({ immediate }),
      cache: "no-store",
    },
  );
}

/** POST /api/v1/appointment-reminders/schedule — backfill reminders for an appointment. */
export async function scheduleAppointmentReminders(
  shopId: string,
  appointmentId: string,
  token?: string | null,
): Promise<ReminderListResponse> {
  const params = new URLSearchParams({ shop_id: shopId });
  return apiFetch<ReminderListResponse>(
    `${REMINDERS_BASE}/schedule?${params.toString()}`,
    {
      method: "POST",
      token,
      body: JSON.stringify({ appointment_id: appointmentId }),
      cache: "no-store",
    },
  );
}
