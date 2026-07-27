import { apiFetch } from "@/lib/api/client";

export type AuthUserProfile = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  is_notification_enabled: boolean;
  last_login?: string | null;
};

/** GET /me — current user profile & notification preference. */
export async function fetchAuthMe(
  token?: string | null,
): Promise<AuthUserProfile> {
  return apiFetch<AuthUserProfile>("/me", {
    token,
    cache: "no-store",
  });
}

/** PATCH /me — update profile / is_notification_enabled. */
export async function updateAuthMe(
  body: {
    full_name?: string;
    is_notification_enabled?: boolean;
  },
  token?: string | null,
): Promise<AuthUserProfile> {
  return apiFetch<AuthUserProfile>("/me", {
    method: "PATCH",
    token,
    body: JSON.stringify(body),
    cache: "no-store",
  });
}
