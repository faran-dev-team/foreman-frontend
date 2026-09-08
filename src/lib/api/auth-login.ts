import { apiFetch } from "@/lib/api/client";

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};

export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
};

export async function loginWithPassword(
  email: string,
  password: string,
): Promise<TokenResponse> {
  return apiFetch<TokenResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchAuthMe(token: string): Promise<AuthUser> {
  return apiFetch<AuthUser>("/me", { token, cache: "no-store" });
}
