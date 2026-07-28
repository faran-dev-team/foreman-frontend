"use client";

import { useAuth } from "@clerk/nextjs";
import { Bell, CheckCheck, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useNotification } from "@/components/providers/NotificationProvider";
import { ApiError } from "@/lib/api/client";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  type InAppNotification,
} from "@/lib/api/notifications";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";

const UNREAD_POLL_MS = 30_000;

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function NotificationBell() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { foregroundNotification } = useNotification();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState<InAppNotification[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const refreshUnread = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      setUnreadCount(0);
      return;
    }
    try {
      const data = await withClerkAuthRetry(getToken, (token) =>
        fetchUnreadNotificationCount(token),
      );
      setUnreadCount(data.unread_count ?? 0);
    } catch {
      // Keep last known count; drawer will surface errors.
    }
  }, [getToken, isLoaded, isSignedIn]);

  const loadList = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    setLoadingList(true);
    setError(null);
    try {
      const data = await withClerkAuthRetry(getToken, (token) =>
        fetchNotifications(token, { page: 1, size: 20 }),
      );
      setItems(data.items);
      await refreshUnread();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not load notifications.",
      );
    } finally {
      setLoadingList(false);
    }
  }, [getToken, isLoaded, isSignedIn, refreshUnread]);

  useEffect(() => {
    void refreshUnread();
    if (!isSignedIn) return;
    const id = window.setInterval(() => {
      void refreshUnread();
    }, UNREAD_POLL_MS);
    return () => window.clearInterval(id);
  }, [isSignedIn, refreshUnread]);

  useEffect(() => {
    if (foregroundNotification) {
      void refreshUnread();
    }
  }, [foregroundNotification, refreshUnread]);

  useEffect(() => {
    if (open) {
      void loadList();
    }
  }, [open, loadList]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleMarkOne = async (notification: InAppNotification) => {
    if (notification.is_read) return;
    try {
      const updated = await withClerkAuthRetry(getToken, (token) =>
        markNotificationRead(notification.id, token),
      );
      setItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not mark notification as read.",
      );
    }
  };

  const handleMarkAll = async () => {
    setMarkingAll(true);
    setError(null);
    try {
      await withClerkAuthRetry(getToken, (token) =>
        markAllNotificationsRead(token),
      );
      setItems((prev) => prev.map((item) => ({ ...item, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not mark all as read.",
      );
    } finally {
      setMarkingAll(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const badgeLabel =
    unreadCount > 99 ? "99+" : unreadCount > 0 ? String(unreadCount) : null;

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative inline-flex rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Bell className="h-5 w-5" />
        {badgeLabel ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-[1.1rem] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-4 text-white">
            {badgeLabel}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 z-50 mt-2 flex w-[min(100vw-1.5rem,22rem)] max-h-[min(70vh,28rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        >
          <div className="flex flex-col gap-2 border-b border-slate-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <div className="flex min-w-0 items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  Notifications
                </p>
                <p className="text-xs text-slate-500">
                  {unreadCount > 0
                    ? `${unreadCount} unread`
                    : "You're all caught up"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 sm:hidden"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => void handleMarkAll()}
                disabled={markingAll || unreadCount === 0}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 sm:flex-none"
              >
                {markingAll ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCheck className="h-3.5 w-3.5" />
                )}
                <span className="sm:hidden">Mark all</span>
                <span className="hidden sm:inline">Mark all read</span>
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 sm:inline-flex"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loadingList ? (
              <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading…
              </div>
            ) : error ? (
              <div className="px-4 py-6 text-sm text-red-700">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => void loadList()}
                  className="mt-2 font-semibold text-foreman-accent hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-slate-500">
                No notifications yet.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => void handleMarkOne(item)}
                      className={`w-full px-4 py-3 text-left transition hover:bg-slate-50 ${
                        item.is_read ? "bg-white" : "bg-orange-50/60"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {!item.is_read ? (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-foreman-accent" />
                        ) : (
                          <span className="mt-1.5 h-2 w-2 shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm ${
                              item.is_read
                                ? "font-medium text-slate-700"
                                : "font-semibold text-slate-900"
                            }`}
                          >
                            {item.title}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">
                            {item.body}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-400">
                            {formatWhen(item.created_at)}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
