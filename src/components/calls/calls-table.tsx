"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { IntentBadge, OutcomeBadge } from "@/components/calls/call-badges";
import { DashboardGettingStarted } from "@/components/dashboard/dashboard-getting-started";
import { useShop } from "@/components/dashboard/shop-provider";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";
import { fetchCalls } from "@/lib/api/calls";
import { ApiError } from "@/lib/api/client";
import type { CallListItem } from "@/lib/api/types";

type ViewState = "loading" | "ready" | "error";

function formatCallTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatCurrency(value?: number | null): string {
  if (value == null) {
    return "—";
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCaller(call: CallListItem): { primary: string; secondary?: string } {
  const rawNumber = (call.caller_number || "").trim();
  const isUnknownNumber =
    !rawNumber || rawNumber.toLowerCase() === "unknown" || rawNumber === "n/a";

  if (call.caller_name?.trim()) {
    return {
      primary: call.caller_name.trim(),
      secondary: isUnknownNumber ? undefined : rawNumber,
    };
  }

  if (isUnknownNumber) {
    return { primary: "Unknown caller" };
  }

  return { primary: rawNumber };
}

function CallsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="animate-pulse border-b border-slate-200 bg-slate-50 px-6 py-3">
        <div className="h-4 w-full rounded bg-slate-200" />
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex gap-4 border-b border-slate-100 px-6 py-4 last:border-b-0"
        >
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-4 w-20 rounded bg-slate-200" />
          <div className="h-4 w-20 rounded bg-slate-200" />
          <div className="h-4 w-16 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export function CallsTable() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { shopId, loading: shopLoading } = useShop();

  const [viewState, setViewState] = useState<ViewState>("loading");
  const [calls, setCalls] = useState<CallListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const loadCalls = useCallback(async () => {
    if (!isLoaded) {
      setViewState("loading");
      return;
    }

    if (!isSignedIn) {
      setViewState("error");
      setErrorMessage("Sign in required to load calls.");
      return;
    }

    if (!shopId) {
      if (shopLoading) {
        setViewState("loading");
        return;
      }
      setViewState("error");
      setErrorMessage(
        "No shop resolved for this account. Confirm Clerk sign-in and backend DEFAULT_SHOP_ID.",
      );
      return;
    }

    setViewState("loading");
    setErrorMessage(null);

    try {
      const response = await withClerkAuthRetry(getToken, (token) =>
        fetchCalls(shopId, token),
      );
      const nextCalls = response.calls ?? [];
      setCalls(nextCalls);
      setTotal(response.total ?? nextCalls.length);
      setLastUpdatedAt(new Date());
      setViewState("ready");
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setCalls([]);
        setTotal(0);
        setLastUpdatedAt(new Date());
        setViewState("ready");
        return;
      }

      setViewState("error");
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else if (error instanceof TypeError) {
        setErrorMessage(
          "Cannot reach the Foreman API. Is the backend running on NEXT_PUBLIC_API_URL?",
        );
      } else {
        setErrorMessage("Failed to load calls.");
      }
    }
  }, [getToken, shopId, shopLoading, isLoaded, isSignedIn]);

  useEffect(() => {
    void loadCalls();
  }, [loadCalls]);

  const outcomeCounts = useMemo(() => {
    const counts = {
      booked: 0,
      not_booked: 0,
      escalated: 0,
      missed: 0,
      other: 0,
    };

    for (const call of calls) {
      const key = (call.outcome || "").toLowerCase();
      if (key === "booked") counts.booked += 1;
      else if (key === "not_booked") counts.not_booked += 1;
      else if (key === "escalated") counts.escalated += 1;
      else if (key === "missed") counts.missed += 1;
      else counts.other += 1;
    }

    return counts;
  }, [calls]);

  // Keep skeleton while Clerk/shop settle — never flash auth error early.
  if ((!isLoaded || (!shopId && shopLoading)) && viewState === "loading") {
    return (
      <div className="space-y-4">
        <CallsTableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-slate-500">
            {viewState === "ready"
              ? `${total} call${total === 1 ? "" : "s"}`
              : "Recent inbound calls"}
          </p>
          {viewState === "ready" && calls.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs">
              {outcomeCounts.booked > 0 && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-800">
                  {outcomeCounts.booked} booked
                </span>
              )}
              {outcomeCounts.not_booked > 0 && (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-800">
                  {outcomeCounts.not_booked} not booked
                </span>
              )}
              {outcomeCounts.escalated > 0 && (
                <span className="rounded-full bg-orange-50 px-2.5 py-1 font-medium text-orange-800">
                  {outcomeCounts.escalated} escalated
                </span>
              )}
              {outcomeCounts.missed > 0 && (
                <span className="rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-800">
                  {outcomeCounts.missed} missed
                </span>
              )}
              {outcomeCounts.other > 0 && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                  {outcomeCounts.other} in progress
                </span>
              )}
            </div>
          )}
          {lastUpdatedAt && viewState === "ready" && (
            <p className="text-xs text-slate-400">
              Updated{" "}
              {new Intl.DateTimeFormat(undefined, {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
              }).format(lastUpdatedAt)}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => void loadCalls()}
          disabled={viewState === "loading"}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Refresh
        </button>
      </div>

      {viewState === "loading" && <CallsTableSkeleton />}

      {viewState === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="text-sm font-medium text-red-800">Unable to load calls</p>
          <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
          <button
            type="button"
            onClick={() => void loadCalls()}
            className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {viewState === "ready" && calls.length === 0 && (
        <DashboardGettingStarted variant="calls" />
      )}

      {viewState === "ready" && calls.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2.5 font-semibold text-slate-600 sm:px-6 sm:py-3">Time</th>
                <th className="px-3 py-2.5 font-semibold text-slate-600 sm:px-6 sm:py-3">Caller</th>
                <th className="px-3 py-2.5 font-semibold text-slate-600 sm:px-6 sm:py-3">Intent</th>
                <th className="px-3 py-2.5 font-semibold text-slate-600 sm:px-6 sm:py-3">Outcome</th>
                <th className="px-3 py-2.5 font-semibold text-slate-600 text-right sm:px-6 sm:py-3">
                  Est. value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {calls.map((call) => {
                const caller = formatCaller(call);
                return (
                  <tr
                    key={call.id}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="whitespace-nowrap px-3 py-3 text-slate-900 sm:px-6 sm:py-4">
                      <Link
                        href={`/calls/${call.id}`}
                        className="block hover:text-foreman-navy hover:underline"
                      >
                        {formatCallTime(call.started_at)}
                      </Link>
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                      <Link href={`/calls/${call.id}`} className="block">
                        <div className="font-medium text-slate-900 hover:text-foreman-navy">
                          {caller.primary}
                        </div>
                        {caller.secondary && (
                          <div className="text-xs text-slate-500">
                            {caller.secondary}
                          </div>
                        )}
                      </Link>
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                      <Link href={`/calls/${call.id}`} className="block">
                        <IntentBadge intent={call.intent} />
                      </Link>
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                      <Link href={`/calls/${call.id}`} className="block">
                        <OutcomeBadge outcome={call.outcome} />
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-medium text-slate-900 sm:px-6 sm:py-4">
                      <Link
                        href={`/calls/${call.id}`}
                        className="block hover:text-foreman-navy hover:underline"
                      >
                        {formatCurrency(call.est_value_usd)}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="border-t border-slate-100 px-3 py-2 text-xs text-slate-400 sm:px-6">
            Click a call to open details, recording, intake, and transcript.
            Intent and value fill in when intake is saved or a job is booked.
          </p>
        </div>
      )}
    </div>
  );
}

export function CallsTableFallback() {
  return <CallsTableSkeleton />;
}
