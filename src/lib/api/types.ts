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

/** Call status from GET /voice/calls/{id} */
export type VoiceCallStatus =
  | "PENDING"
  | "COMPLETED"
  | "MISSED"
  | "FAILED"
  | string;

/** Full call record from GET /voice/calls/{id} */
export type CallDetail = {
  id: string;
  shop_id: string;
  caller_name?: string | null;
  caller_phone: string;
  retell_call_id?: string | null;
  started_at?: string | null;
  call_status: VoiceCallStatus;
  call_duration_seconds?: number | null;
  summary?: string | null;
  recording_url?: string | null;
  transcript?: string | null;
  created_at: string;
  updated_at: string;
};

/** Intake from GET /voice/calls/{id}/intake */
export type CallIntake = {
  customer_name: string;
  phone: string;
  email: string;
  service: string;
  city: string;
  preferred_date: string;
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
