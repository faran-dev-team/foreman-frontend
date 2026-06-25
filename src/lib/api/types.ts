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
