/**
 * Shared API configuration for Foreman backend requests.
 */

const DEFAULT_API_URL = "http://localhost:8000";

/** Base URL for the Foreman FastAPI backend (no trailing slash). */
export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim() || DEFAULT_API_URL;
  const resolved = url.replace(/\/$/, "");

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console -- intentional dev-only API URL visibility
    console.info("[Foreman API] NEXT_PUBLIC_API_URL →", resolved);
  }

  return resolved;
}

/**
 * Fallback shop ID when /dashboard/me is unavailable.
 * Prefer ShopProvider + GET /api/v1/dashboard/me (Path B).
 */
export function getDefaultShopId(): string | undefined {
  const shopId = process.env.NEXT_PUBLIC_DEFAULT_SHOP_ID?.trim();
  return shopId || undefined;
}
