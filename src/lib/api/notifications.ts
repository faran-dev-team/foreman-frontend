import { apiFetch } from "@/lib/api/client";

const NOTIFICATIONS_BASE = "/api/v1/notifications";

export type InAppNotification = {
  id: string;
  user_id: string;
  shop_id?: string | null;
  title: string;
  body: string;
  data_json?: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
};

export type NotificationListResponse = {
  items: InAppNotification[];
  total: number;
  page: number;
  size: number;
};

export type UnreadCountResponse = {
  unread_count: number;
};

export type DeviceTokenResponse = {
  id: string;
  user_id: string;
  token: string;
  platform?: string | null;
  created_at: string;
};

export type MarkAllReadResponse = {
  marked_read_count: number;
};

/** GET /api/v1/notifications/unread-count */
export async function fetchUnreadNotificationCount(
  token?: string | null,
): Promise<UnreadCountResponse> {
  return apiFetch<UnreadCountResponse>(`${NOTIFICATIONS_BASE}/unread-count`, {
    token,
    cache: "no-store",
  });
}

/** GET /api/v1/notifications */
export async function fetchNotifications(
  token?: string | null,
  options?: { page?: number; size?: number; isRead?: boolean },
): Promise<NotificationListResponse> {
  const params = new URLSearchParams();
  params.set("page", String(options?.page ?? 1));
  params.set("size", String(options?.size ?? 20));
  if (typeof options?.isRead === "boolean") {
    params.set("is_read", String(options.isRead));
  }
  return apiFetch<NotificationListResponse>(
    `${NOTIFICATIONS_BASE}?${params.toString()}`,
    { token, cache: "no-store" },
  );
}

/** PATCH /api/v1/notifications/{id}/read */
export async function markNotificationRead(
  notificationId: string,
  token?: string | null,
): Promise<InAppNotification> {
  return apiFetch<InAppNotification>(
    `${NOTIFICATIONS_BASE}/${notificationId}/read`,
    { method: "PATCH", token, cache: "no-store" },
  );
}

/** PATCH /api/v1/notifications/read-all */
export async function markAllNotificationsRead(
  token?: string | null,
): Promise<MarkAllReadResponse> {
  return apiFetch<MarkAllReadResponse>(`${NOTIFICATIONS_BASE}/read-all`, {
    method: "PATCH",
    token,
    cache: "no-store",
  });
}

/** POST /api/v1/notifications/device-token */
export async function registerNotificationDeviceToken(
  fcmToken: string,
  clerkToken?: string | null,
  platform: "web" | "ios" | "android" = "web",
): Promise<DeviceTokenResponse> {
  return apiFetch<DeviceTokenResponse>(`${NOTIFICATIONS_BASE}/device-token`, {
    method: "POST",
    token: clerkToken,
    body: JSON.stringify({ token: fcmToken, platform }),
    cache: "no-store",
  });
}

/** DELETE /api/v1/notifications/device-token */
export async function unregisterNotificationDeviceToken(
  fcmToken: string,
  clerkToken?: string | null,
): Promise<void> {
  return apiFetch<void>(`${NOTIFICATIONS_BASE}/device-token`, {
    method: "DELETE",
    token: clerkToken,
    body: JSON.stringify({ token: fcmToken }),
    cache: "no-store",
  });
}
