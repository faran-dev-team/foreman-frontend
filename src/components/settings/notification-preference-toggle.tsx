"use client";

import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api/client";
import { fetchAuthMe, updateAuthMe } from "@/lib/api/auth-profile";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";

/**
 * Account-level notification preference (users.is_notification_enabled via GET/PATCH /me).
 * Separate from browser push permission / FCM token registration.
 */
export function NotificationPreferenceToggle() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      setEnabled(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const profile = await withClerkAuthRetry(getToken, (token) =>
        fetchAuthMe(token),
      );
      setEnabled(Boolean(profile.is_notification_enabled));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not load notification preference.",
      );
    } finally {
      setLoading(false);
    }
  }, [getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleToggle = async () => {
    if (enabled == null || saving) return;
    const next = !enabled;
    setSaving(true);
    setError(null);
    try {
      const updated = await withClerkAuthRetry(getToken, (token) =>
        updateAuthMe({ is_notification_enabled: next }, token),
      );
      setEnabled(Boolean(updated.is_notification_enabled));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not update notification preference.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Notification preference
          </h3>
          <p className="mt-1 max-w-xl text-sm text-slate-600">
            When off, the backend skips push delivery for your account. In-app
            notifications in the bell may still appear.
          </p>
          {error ? (
            <p className="mt-2 text-sm text-red-700">{error}</p>
          ) : null}
        </div>

        {loading || enabled == null ? (
          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </div>
        ) : (
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            disabled={saving}
            onClick={() => void handleToggle()}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:opacity-50 ${
              enabled ? "bg-emerald-600" : "bg-slate-200"
            }`}
            aria-label="Toggle notification preference"
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                enabled ? "translate-x-5" : "translate-x-0"
              }`}
            >
              {saving ? (
                <Loader2 className="h-3 w-3 animate-spin text-slate-600" />
              ) : null}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
