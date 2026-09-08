import { apiFetch } from "@/lib/api/client";

export type DashboardMe = {
  shop_id?: string | null;
  shop_name?: string | null;
  role: string;
  user_id: string;
  email: string;
  account_status?: "pending" | "active" | "rejected" | string;
  message?: string | null;
};

/** Resolve the authenticated owner's shop from Clerk JWT. */
export async function fetchDashboardMe(
  token?: string | null,
): Promise<DashboardMe> {
  return apiFetch<DashboardMe>("/api/v1/dashboard/me", {
    token,
    cache: "no-store",
  });
}
