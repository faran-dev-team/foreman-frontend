/** Response from GET /api/v1/integrations/google/status */
export type CalendarStatus = {
  connected: boolean;
  calendar_id?: string | null;
  verified?: boolean;
  email?: string | null;
};

export type CallIntent =
  | "booking"
  | "quote"
  | "question"
  | "wrong_number"
  | "other";

export type CallOutcome = "booked" | "not_booked" | "escalated" | "missed";

/** Row returned by GET /api/v1/dashboard/calls */
export type CallListItem = {
  id: string;
  started_at: string;
  caller_number: string;
  caller_name?: string | null;
  intent?: CallIntent | string | null;
  outcome?: CallOutcome | string | null;
  est_value_usd?: number | null;
};

export type CallsListResponse = {
  calls: CallListItem[];
  total?: number;
};

export type JobStatus =
  | "booked"
  | "completed"
  | "cancelled"
  | "no_show"
  | "pending"
  | "confirmed"
  | "in_progress";

/** Row returned by GET /api/v1/dashboard/jobs */
export type JobListItem = {
  id: string;
  customer_name: string;
  customer_phone: string;
  service: string;
  scheduled_at?: string | null;
  status?: JobStatus | string | null;
  est_value_usd?: number | null;
};

export type JobsListResponse = {
  jobs: JobListItem[];
  revenue_captured_usd?: number;
  total?: number;
};
