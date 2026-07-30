/** Stable TanStack Query keys for dashboard data. */
export const queryKeys = {
  dashboard: {
    analytics: (shopId: string) => ["dashboard", "analytics", shopId] as const,
    jobs: (shopId: string) => ["dashboard", "jobs", shopId] as const,
  },
} as const;
