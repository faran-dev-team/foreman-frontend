import {
  registerNotificationDeviceToken,
  unregisterNotificationDeviceToken,
} from "@/lib/api/notifications";

export interface RegisterDeviceResponse {
  success: boolean;
  message: string;
}

/**
 * Registers an FCM device token via POST /api/v1/notifications/device-token.
 */
export async function registerDeviceToken(
  token: string,
  clerkToken?: string | null,
): Promise<RegisterDeviceResponse> {
  await registerNotificationDeviceToken(token, clerkToken, "web");
  return {
    success: true,
    message: "Device token registered.",
  };
}

/**
 * Unregisters an FCM device token via DELETE /api/v1/notifications/device-token.
 */
export async function unregisterDeviceToken(
  token: string,
  clerkToken?: string | null,
): Promise<void> {
  await unregisterNotificationDeviceToken(token, clerkToken);
}
