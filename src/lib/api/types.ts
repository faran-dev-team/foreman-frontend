/** Response from GET /api/v1/integrations/google/status */
export type CalendarStatus = {
  connected: boolean;
  calendar_id?: string | null;
  verified?: boolean;
  email?: string | null;
};
