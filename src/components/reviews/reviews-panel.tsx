"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { useShop } from "@/components/dashboard/shop-provider";
import {
  resolveDashboardQueryError,
  useReviewsQuery,
} from "@/hooks/use-dashboard-queries";
import { ApiError } from "@/lib/api/client";
import { retryReviewRequest, type ReviewStatusSummary } from "@/lib/api/reviews";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";

const STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
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
  const key = status.toUpperCase();
  return key === "FAILED" || key === "FAILED_PERMANENT";
}

function SummaryCards({ summary }: { summary: ReviewStatusSummary }) {
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

function ReviewsSkeleton() {
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

export function ReviewsPanel() {
  const { getToken } = useAuth();
  const { shopId } = useShop();
  const reviewsQuery = useReviewsQuery();

  const items = reviewsQuery.data?.list.items ?? [];
  const total = reviewsQuery.data?.list.total ?? items.length;
  const summary = reviewsQuery.data?.summary ?? null;
  const lastUpdatedAt = reviewsQuery.dataUpdatedAt
    ? new Date(reviewsQuery.dataUpdatedAt)
    : null;

  const [statusFilter, setStatusFilter] = useState("all");
  const [actionError, setActionError] = useState<string | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const handleRetry = useCallback(
    async (reviewId: string) => {
      if (!shopId) return;
      setRetryingId(reviewId);
      try {
        await withClerkAuthRetry(getToken, (token) =>
          retryReviewRequest(shopId, reviewId, token, true),
        );
        await reviewsQuery.refetch();
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "Retry failed. Try again.";
        setActionError(message);
      } finally {
        setRetryingId(null);
      }
    },
    [getToken, shopId, reviewsQuery],
  );

  const filteredItems = useMemo(() => {
    if (statusFilter === "all") return items;
    return items.filter(
      (row) => (row.status || "").toUpperCase() === statusFilter,
    );
  }, [items, statusFilter]);

  const emptyHint =
    "No review requests yet. When a job is completed, Foreman schedules a Google review ask automatically.";

  if (reviewsQuery.isPending && !reviewsQuery.data) {
    return <ReviewsSkeleton />;
  }

  if (reviewsQuery.isError && !summary) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm font-medium text-red-800">
          Unable to load reviews
        </p>
        <p className="mt-1 text-sm text-red-700">
          {resolveDashboardQueryError(reviewsQuery.error)}
        </p>
        <button
          type="button"
          onClick={() => void reviewsQuery.refetch()}
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
            {total} review request{total === 1 ? "" : "s"}
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
          {actionError ? (
            <p className="mt-1 text-xs text-red-600">{actionError}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-medium text-slate-500" htmlFor="review-status">
            Status
          </label>
          <select
            id="review-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800"
          >
            {STATUS_FILTERS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {reviewsQuery.isFetching ? (
            <span className="text-xs text-slate-400">Refreshing…</span>
          ) : null}
          <button
            type="button"
            onClick={() => void reviewsQuery.refetch()}
            disabled={reviewsQuery.isFetching}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <p className="text-sm text-slate-600">{emptyHint}</p>
          <p className="mt-2 text-xs text-slate-500">
            Review asks are created after job completion (backend automation).
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
          <p className="text-sm font-medium text-slate-700">
            No review requests match your filters
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting or clearing the status filter.
          </p>
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Clear filters
          </button>
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
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">Scheduled</th>
                  <th className="px-4 py-3">Sent</th>
                  <th className="px-4 py-3">Attempts</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <Link
                        href={`/reviews/${row.id}`}
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
                      {row.delivery_channel || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatWhen(row.scheduled_at || row.next_attempt_at)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatWhen(row.sent_at)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.attempt_count}
                      {row.retry_count > 0 ? ` · ${row.retry_count} retries` : ""}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/reviews/${row.id}`}
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
    </div>
  );
}

export function ReviewsPanelFallback() {
  return <ReviewsSkeleton />;
}
