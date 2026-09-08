import { apiFetch } from "@/lib/api/client";

export type OwnerSignupItem = {
  user_id: string;
  email: string;
  full_name: string;
  account_status: string;
  created_at: string;
  shop_id?: string | null;
};

export type OwnerSignupListResponse = {
  items: OwnerSignupItem[];
  total: number;
};

export type ActivateOwnerResponse = {
  user_id: string;
  email: string;
  account_status: string;
  shop_id?: string | null;
  shop_name?: string | null;
  activation_source?: string | null;
  message: string;
};

export async function fetchOwnerSignups(
  token: string,
  status: string = "pending",
): Promise<OwnerSignupListResponse> {
  const query = new URLSearchParams({ status });
  return apiFetch<OwnerSignupListResponse>(
    `/api/v1/admin/owner-signups?${query.toString()}`,
    { token, cache: "no-store" },
  );
}

export async function approveOwnerSignup(
  token: string,
  userId: string,
): Promise<ActivateOwnerResponse> {
  return apiFetch<ActivateOwnerResponse>(
    `/api/v1/admin/owner-signups/${userId}/approve`,
    { method: "POST", token },
  );
}

export async function rejectOwnerSignup(
  token: string,
  userId: string,
): Promise<ActivateOwnerResponse> {
  return apiFetch<ActivateOwnerResponse>(
    `/api/v1/admin/owner-signups/${userId}/reject`,
    { method: "POST", token, body: JSON.stringify({}) },
  );
}
