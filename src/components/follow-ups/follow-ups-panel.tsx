"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useShop } from "@/components/dashboard/shop-provider";
import { ApiError } from "@/lib/api/client";
import {
  fetchFollowUps,
  fetchFollowUpStatusSummary,
  retryFollowUp,
  scheduleFollowUp,
  type FollowUpStatusSummary,
  type FollowUpSummary,
} from "@/lib/api/follow-ups";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";

type ViewState = "loading" | "ready" | "error";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "SENT", label: "Sent" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "FAILED", label: "Failed" },
  { value: "RETRYING", label: "Retrying" },
  { value: "FAILED_PERMANENT", label: "Failed permanent" },
] as const;

function formatWhen(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatService(jobType?: string | null): string {
  if (!jobType?.trim()) return "—";
  return jobType
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bAc\b/g, "AC");
}

function statusBadgeClass(status: string): string {
  const key = status.toUpperCase();
  if (key === "SENT" || key === "DELIVERED") {
    return "bg-emerald-100 text-emerald-800";
  }
  if (key === "FAILED" || key === "FAILED_PERMANENT") {
    return "bg-red-100 text-red-800";
  }
  if (key === "RETRYING") {
    return "bg-amber-100 text-amber-900";
  }
  if (key === "SCHEDULED" || key === "PENDING") {
    return "bg-sky-100 text-sky-900";
  }
  return "bg-slate-100 text-slate-700";
}

function canRetry(status: string): boolean {
  return status.toUpperCase() === "FAILED";
}

function SummaryCards({ summary }: { summary: FollowUpStatusSummary }) {
  const cards = [
    { label: "Total", value: summary.total },
    { label: "Scheduled", value: summary.scheduled },
    { label: "Sent", value: summary.sent },
    { label: "Delivered", value: summary.delivered },
    { label: "Failed", value: summary.failed },
    { label: "Retrying", value: summary.retrying },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {card.label}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

function FollowUpsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
    </div>
  );
}

export function FollowUpsPanel() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { shopId, loading: shopLoading, resolvingMe } = useShop();

  const [viewState, setViewState] = useState<ViewState>("loading");
  const [items, setItems] = useState<FollowUpSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<FollowUpStatusSummary | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [jobIdInput, setJobIdInput] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState<string | null>(null);

  const loadFollowUps = useCallback(async () => {
    if (!isLoaded) {
      setViewState("loading");
      return;
    }
    if (!isSignedIn) {
      setViewState("error");
      setErrorMessage("Sign in required to view follow-ups.");
      return;
    }
    if (resolvingMe || shopLoading) {
      setViewState("loading");
      return;
    }
    if (!shopId) {
      setViewState("error");
      setErrorMessage("No shop resolved for this account.");
      return;
    }

    setViewState("loading");
    setErrorMessage(null);

    try {
      const [list, statusSummary] = await Promise.all([
        withClerkAuthRetry(getToken, (token) =>
          fetchFollowUps(shopId, token, {
            status: statusFilter || undefined,
            limit: 100,
          }),
        ),
        withClerkAuthRetry(getToken, (token) =>
          fetchFollowUpStatusSummary(shopId, token),
        ),
      ]);

      setItems(list.items ?? []);
      setTotal(list.total ?? 0);
      setSummary(statusSummary);
      setLastUpdatedAt(new Date());
      setViewState("ready");
    } catch (error) {
      setViewState("error");
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else if (error instanceof TypeError) {
        setErrorMessage(
          "Cannot reach the Foreman API. Is the backend running on NEXT_PUBLIC_API_URL?",
        );
      } else {
        setErrorMessage("Failed to load follow-ups.");
      }
    }
  }, [
    getToken,
    isLoaded,
    isSignedIn,
    shopId,
    shopLoading,
    resolvingMe,
    statusFilter,
  ]);

  useEffect(() => {
    void loadFollowUps();
  }, [loadFollowUps]);

  const handleRetry = useCallback(
    async (followUpId: string) => {
      if (!shopId) return;
      setRetryingId(followUpId);
      try {
        await withClerkAuthRetry(getToken, (token) =>
          retryFollowUp(shopId, followUpId, token, true),
        );
        await loadFollowUps();
      } catch (error) {
        setErrorMessage(
          error instanceof ApiError
            ? error.message
            : "Retry failed. Try again.",
        );
      } finally {
        setRetryingId(null);
      }
    },
    [getToken, shopId, loadFollowUps],
  );

  const handleSchedule = useCallback(async () => {
    if (!shopId) return;
    const jobId = jobIdInput.trim();
    if (!jobId) {
      setScheduleMessage("Enter a completed job UUID to schedule a follow-up.");
      return;
    }

    setScheduling(true);
    setScheduleMessage(null);
    setErrorMessage(null);
    try {
      const result = await withClerkAuthRetry(getToken, (token) =>
        scheduleFollowUp(shopId, jobId, token),
      );
      setScheduleMessage(
        `Follow-up ready (${result.status}) for this job. Open Details to track delivery and feedback.`,
      );
      setJobIdInput("");
      await loadFollowUps();
    } catch (error) {
      setScheduleMessage(
        error instanceof ApiError
          ? error.message
          : "Could not schedule a follow-up for that job.",
      );
    } finally {
      setScheduling(false);
    }
  }, [jobIdInput, getToken, shopId, loadFollowUps]);

  const emptyHint = useMemo(() => {
    if (statusFilter) {
      return `No follow-ups with status “${statusFilter}”.`;
    }
    return "No follow-ups yet. After a job is completed (and follow-up automation is enabled), Foreman schedules a post-service feedback email.";
  }, [statusFilter]);

  if (
    !isLoaded ||
    resolvingMe ||
    shopLoading ||
    viewState === "loading" ||
    (!summary && viewState !== "error")
  ) {
    return <FollowUpsSkeleton />;
  }

  if (viewState === "error" && !summary) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm font-medium text-red-800">
          Unable to load follow-ups
        </p>
        <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
        <button
          type="button"
          onClick={() => void loadFollowUps()}
          className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {summary ? <SummaryCards summary={summary} /> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-700">
            {total} follow-up{total === 1 ? "" : "s"}
          </p>
          {lastUpdatedAt ? (
            <p className="text-xs text-slate-400">
              Updated{" "}
              {new Intl.DateTimeFormat(undefined, {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
              }).format(lastUpdatedAt)}
            </p>
          ) : null}
          {errorMessage ? (
            <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label
            className="text-xs font-medium text-slate-500"
            htmlFor="follow-up-status"
          >
            Status
          </label>
          <select
            id="follow-up-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800"
          >
            {STATUS_FILTERS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void loadFollowUps()}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <p className="text-sm text-slate-600">{emptyHint}</p>
          <p className="mt-2 text-xs text-slate-500">
            Emails are sent by the backend worker (process_service_follow_ups.py).
            Automation may be off by default in shop settings.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Job</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Scheduled</th>
                  <th className="px-4 py-3">Sent</th>
                  <th className="px-4 py-3">Owner notified</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <Link
                        href={`/follow-ups/${row.id}`}
                        className="font-medium text-foreman-navy hover:underline"
                      >
                        {row.customer_name || "Customer"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatService(row.job_type)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.rating != null ? `${row.rating}/5` : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatWhen(row.scheduled_at || row.next_attempt_at)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatWhen(row.sent_at)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.owner_notified ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/follow-ups/${row.id}`}
                          className="text-xs font-medium text-foreman-navy hover:underline"
                        >
                          Details
                        </Link>
                        {canRetry(row.status) ? (
                          <button
                            type="button"
                            disabled={retryingId === row.id}
                            onClick={() => void handleRetry(row.id)}
                            className="text-xs font-medium text-amber-800 hover:underline disabled:opacity-50"
                          >
                            {retryingId === row.id ? "Retrying…" : "Retry"}
                          </button>
                        ) : null}
                      </div>
                      {row.failure_reason ? (
                        <p className="mt-1 max-w-[14rem] truncate text-xs text-red-600">
                          {row.failure_reason}
                        </p>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">
          Manual schedule / backfill
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Idempotently create (or return) a follow-up for a completed job UUID
          in this shop.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={jobIdInput}
            onChange={(e) => setJobIdInput(e.target.value)}
            placeholder="Job UUID"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 sm:max-w-md"
          />
          <button
            type="button"
            disabled={scheduling}
            onClick={() => void handleSchedule()}
            className="rounded-lg bg-foreman-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {scheduling ? "Scheduling…" : "Schedule"}
          </button>
        </div>
        {scheduleMessage ? (
          <p className="mt-2 text-xs text-slate-600">{scheduleMessage}</p>
        ) : null}
      </div>
    </div>
  );
}

export function FollowUpsPanelFallback() {
  return <FollowUpsSkeleton />;
}
