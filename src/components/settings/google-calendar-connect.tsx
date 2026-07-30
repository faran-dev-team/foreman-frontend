"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  disconnectCalendar,
  fetchCalendarConnectUrl,
  fetchCalendarStatus,
} from "@/lib/api/calendar";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";
import { ApiError } from "@/lib/api/client";
import type { CalendarStatus } from "@/lib/api/types";
import { useShop } from "@/components/dashboard/shop-provider";

type ViewState = "loading" | "ready" | "error";

function statusLabel(status: CalendarStatus): string {
  if (!status.connected) {
    return "Not connected";
  }
  if (status.verified === false) {
    return "Connected — verification pending";
  }
  return "Connected";
}

export function GoogleCalendarConnect() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { shopId, loading: shopLoading } = useShop();

  const [viewState, setViewState] = useState<ViewState>("loading");
  const [status, setStatus] = useState<CalendarStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [banner, setBanner] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadStatus = useCallback(async () => {
    if (!isLoaded) {
      setViewState("loading");
      return;
    }

    if (!isSignedIn) {
      setViewState("error");
      setErrorMessage("Sign in required to manage Google Calendar.");
      return;
    }

    if (!shopId) {
      if (shopLoading) {
        setViewState("loading");
        return;
      }
      setViewState("error");
      setErrorMessage(
        "No shop resolved for this account. Check Clerk auth / DEFAULT_SHOP_ID on the backend.",
      );
      return;
    }

    setViewState("loading");
    setErrorMessage(null);

    try {
      const result = await withClerkAuthRetry(getToken, (token) =>
        fetchCalendarStatus(shopId, token),
      );
      setStatus(result);
      setViewState("ready");
    } catch (error) {
      setViewState("error");
      if (error instanceof ApiError) {
        if (error.status === 401 || error.status === 403) {
          setErrorMessage(
            "Authentication failed. Sign out/in and confirm the backend accepts Clerk JWTs (Path B).",
          );
        } else if (error.status === 404) {
          setErrorMessage(
            error.message.includes("Shop")
              ? `${error.message} Update DEFAULT_SHOP_ID / membership mapping.`
              : "Calendar status endpoint is not available yet.",
          );
        } else {
          setErrorMessage(error.message);
        }
      } else if (error instanceof TypeError) {
        setErrorMessage(
          "Cannot reach the Foreman API. Is the backend running on NEXT_PUBLIC_API_URL?",
        );
      } else {
        setErrorMessage("Failed to load calendar connection status.");
      }
    }
  }, [getToken, shopId, shopLoading, isLoaded, isSignedIn]);

  useEffect(() => {
    const calendarParam = searchParams.get("calendar");

    if (calendarParam === "connected") {
      setBanner({
        type: "success",
        message: "Google Calendar connected successfully.",
      });
      router.replace("/settings", { scroll: false });
    } else if (calendarParam === "denied") {
      setBanner({
        type: "error",
        message: "Google Calendar access was denied. Please try again.",
      });
      router.replace("/settings", { scroll: false });
    } else if (calendarParam === "error") {
      setBanner({
        type: "error",
        message: "Something went wrong connecting Google Calendar.",
      });
      router.replace("/settings", { scroll: false });
    }
  }, [router, searchParams]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const handleConnect = async () => {
    if (!shopId) {
      return;
    }
    setActionLoading(true);
    setBanner(null);
    try {
      const connectUrl = await withClerkAuthRetry(getToken, (token) =>
        fetchCalendarConnectUrl(shopId, token),
      );
      window.location.href = connectUrl;
    } catch (error) {
      setActionLoading(false);
      setBanner({
        type: "error",
        message:
          error instanceof ApiError
            ? error.message
            : "Failed to start Google Calendar connect.",
      });
    }
  };

  const handleDisconnect = async () => {
    if (!shopId) {
      return;
    }

    setActionLoading(true);
    setBanner(null);

    try {
      await withClerkAuthRetry(getToken, (token) =>
        disconnectCalendar(shopId, token),
      );
      setBanner({
        type: "success",
        message: "Google Calendar disconnected.",
      });
      await loadStatus();
    } catch (error) {
      setBanner({
        type: "error",
        message:
          error instanceof ApiError
            ? error.message
            : "Failed to disconnect Google Calendar.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const isConnected = status?.connected === true;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Google Calendar
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Connect your shop calendar so Foreman can check availability and
            book jobs automatically.
          </p>
        </div>

        {viewState === "ready" && status && (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              isConnected
                ? "bg-emerald-100 text-emerald-800"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {statusLabel(status)}
          </span>
        )}
      </div>

      {banner && (
        <div
          className={`mt-4 rounded-lg px-4 py-3 text-sm ${
            banner.type === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-red-50 text-red-800"
          }`}
          role="alert"
        >
          {banner.message}
        </div>
      )}

      {viewState === "loading" && (
        <div className="mt-6 animate-pulse space-y-3">
          <div className="h-4 w-1/3 rounded bg-slate-200" />
          <div className="h-10 w-40 rounded bg-slate-200" />
        </div>
      )}

      {viewState === "error" && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-800">Unable to load status</p>
          <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void loadStatus()}
              className="rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => void handleConnect()}
              disabled={actionLoading || !shopId}
              className="rounded-lg bg-foreman-navy px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actionLoading ? "Redirecting…" : "Connect Google Calendar"}
            </button>
          </div>
        </div>
      )}

      {viewState === "ready" && status && (
        <div className="mt-6 space-y-4">
          {isConnected ? (
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {status.email && (
                <div className="min-w-0">
                  <dt className="font-medium text-slate-500">Google account</dt>
                  <dd className="break-all text-slate-900">{status.email}</dd>
                </div>
              )}
              {status.calendar_id && (
                <div className="min-w-0">
                  <dt className="font-medium text-slate-500">Calendar</dt>
                  <dd className="break-all text-slate-900">{status.calendar_id}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-sm text-slate-600">
              No calendar linked yet. Connect to enable real-time booking.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {!isConnected ? (
              <button
                type="button"
                onClick={() => void handleConnect()}
                disabled={actionLoading || !shopId}
                className="rounded-lg bg-foreman-navy px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading ? "Redirecting…" : "Connect Google Calendar"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleDisconnect()}
                disabled={actionLoading}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading ? "Disconnecting…" : "Disconnect"}
              </button>
            )}

            <button
              type="button"
              onClick={() => void loadStatus()}
              disabled={actionLoading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Refresh status
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function GoogleCalendarConnectSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="animate-pulse space-y-3">
        <div className="h-5 w-48 rounded bg-slate-200" />
        <div className="h-4 w-full max-w-md rounded bg-slate-200" />
        <div className="h-10 w-44 rounded bg-slate-200" />
      </div>
    </div>
  );
}
