import { apiFetch } from "@/lib/api/client";

export interface RegisterDeviceResponse {
  success: boolean;
  message: string;
}

/**
 * Registers an FCM push notification device token for the current authenticated user.
 */
export async function registerDeviceToken(
  token: string,
  clerkToken?: string | null,
): Promise<RegisterDeviceResponse> {
  return apiFetch<RegisterDeviceResponse>("/api/v1/dashboard/register-device", {
    method: "POST",
    body: JSON.stringify({ token }),
    token: clerkToken,
  });
}
