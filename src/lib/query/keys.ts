/** Stable TanStack Query keys for dashboard data. */
export const queryKeys = {
  dashboard: {
    analytics: (shopId: string) => ["dashboard", "analytics", shopId] as const,
    jobs: (shopId: string) => ["dashboard", "jobs", shopId] as const,
    calls: (shopId: string) => ["dashboard", "calls", shopId] as const,
  },
  reminders: (shopId: string) => ["reminders", shopId] as const,
  reviews: (shopId: string) => ["reviews", shopId] as const,
  followUps: (shopId: string) => ["follow-ups", shopId] as const,
  reports: (
    shopId: string,
    kind: "weekly" | "monthly",
    period: string,
  ) => ["reports", shopId, kind, period] as const,
  onboarding: (shopId: string) => ["onboarding", shopId] as const,
  liveTranscript: (shopId: string) => ["live-transcript", shopId] as const,
} as const;
