/** Default cache timings (ms). */

/** Fresh window: page switches reuse cache instead of refetching. */
export const QUERY_STALE_MS = 10 * 60_000;
/** Keep unused list data in memory for fast back-navigation. */
export const QUERY_GC_MS = 30 * 60_000;
