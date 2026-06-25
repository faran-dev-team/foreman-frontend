"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

import { IntentBadge, OutcomeBadge } from "@/components/calls/call-badges";
import { fetchCalls } from "@/lib/api/calls";
import { ApiError } from "@/lib/api/client";
import { getDefaultShopId } from "@/lib/api/config";
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

function formatCaller(call: CallListItem): string {
  if (call.caller_name) {
    return call.caller_name;
  }
  return call.caller_number;
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

function CallsEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <p className="text-base font-medium text-slate-900">No calls yet</p>
      <p className="mt-2 text-sm text-slate-500">
        Inbound calls handled by Foreman will show up here with intent, outcome,
        and estimated value.
      </p>
    </div>
  );
}

export function CallsTable() {
  const { getToken } = useAuth();
  const shopId = getDefaultShopId();

  const [viewState, setViewState] = useState<ViewState>("loading");
  const [calls, setCalls] = useState<CallListItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCalls = useCallback(async () => {
    if (!shopId) {
      setViewState("error");
      setErrorMessage(
        "NEXT_PUBLIC_DEFAULT_SHOP_ID is not set. Add a test shop UUID to .env.local.",
      );
      return;
    }

    setViewState("loading");
    setErrorMessage(null);

    try {
      const token = await getToken();
      const response = await fetchCalls(shopId, token);
      setCalls(response.calls ?? []);
      setViewState("ready");
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setCalls([]);
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
  }, [getToken, shopId]);

  useEffect(() => {
    void loadCalls();
  }, [loadCalls]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {viewState === "ready"
            ? `${calls.length} call${calls.length === 1 ? "" : "s"}`
            : "Recent inbound calls"}
        </p>
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

      {viewState === "ready" && calls.length === 0 && <CallsEmptyState />}

      {viewState === "ready" && calls.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-600">Time</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Caller</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Intent</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Outcome</th>
                <th className="px-6 py-3 font-semibold text-slate-600 text-right">
                  Est. value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {calls.map((call) => (
                <tr
                  key={call.id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-slate-900">
                    {formatCallTime(call.started_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      {formatCaller(call)}
                    </div>
                    {call.caller_name && (
                      <div className="text-xs text-slate-500">
                        {call.caller_number}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <IntentBadge intent={call.intent} />
                  </td>
                  <td className="px-6 py-4">
                    <OutcomeBadge outcome={call.outcome} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-slate-900">
                    {formatCurrency(call.est_value_usd)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function CallsTableFallback() {
  return <CallsTableSkeleton />;
}
