"use client";

import { DashboardGettingStarted } from "@/components/dashboard/dashboard-getting-started";
import { JobStatusBadge } from "@/components/jobs/job-badges";
import { RevenueCapturedCard } from "@/components/jobs/revenue-captured-card";
import { useJobsListQuery } from "@/hooks/use-dashboard-queries";
import { ApiError } from "@/lib/api/client";
import type { JobListItem } from "@/lib/api/types";

function formatScheduledTime(iso?: string | null): string {
  if (!iso) {
    return "—";
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
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

function formatServiceLabel(service: string): string {
  const trimmed = service.trim();
  if (!trimmed) {
    return "—";
  }

  return trimmed
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bAc\b/g, "AC");
}

function formatCustomer(job: JobListItem): { primary: string; secondary?: string } {
  const name = job.customer_name?.trim();
  const phone = job.customer_phone?.trim();

  if (name) {
    return { primary: name, secondary: phone || undefined };
  }

  if (phone) {
    return { primary: phone };
  }

  return { primary: "Unknown customer" };
}

function formatUpdatedAt(ms: number | undefined): string | null {
  if (!ms) return null;
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(ms));
}

function JobsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="animate-pulse border-b border-slate-200 bg-slate-50 px-6 py-3">
        <div className="h-4 w-full rounded bg-slate-200" />
      </div>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex gap-4 border-b border-slate-100 px-6 py-4 last:border-b-0"
        >
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-4 w-20 rounded bg-slate-200" />
          <div className="h-4 w-16 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

function resolveErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof TypeError) {
    return "Cannot reach the Foreman API. Is the backend running on NEXT_PUBLIC_API_URL?";
  }
  return "Failed to load jobs.";
}

export function JobsPanel() {
  const jobsQuery = useJobsListQuery({ poll: true });

  const jobs = jobsQuery.data?.jobs ?? [];
  const total = jobsQuery.data?.total ?? jobs.length;
  const revenueCaptured = jobsQuery.data?.revenue_captured_usd ?? 0;

  const showInitialSkeleton = jobsQuery.isPending && !jobsQuery.data;
  const isRefreshing = jobsQuery.isFetching && !jobsQuery.isPending;
  const lastUpdatedLabel = formatUpdatedAt(jobsQuery.dataUpdatedAt);

  if (showInitialSkeleton) {
    return (
      <div className="space-y-6">
        <RevenueCapturedCard loading />
        <JobsTableSkeleton />
      </div>
    );
  }

  if (jobsQuery.isError && !jobsQuery.data) {
    return (
      <div className="space-y-6">
        <RevenueCapturedCard amount={0} jobCount={0} />
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="text-sm font-medium text-red-800">Unable to load jobs</p>
          <p className="mt-1 text-sm text-red-700">
            {resolveErrorMessage(jobsQuery.error)}
          </p>
          <button
            type="button"
            onClick={() => void jobsQuery.refetch()}
            className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RevenueCapturedCard amount={revenueCaptured} jobCount={total} />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">
              {total} job{total === 1 ? "" : "s"} booked · auto-refresh every 15s
            </p>
            {lastUpdatedLabel ? (
              <p className="text-xs text-slate-400">Updated {lastUpdatedLabel}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {isRefreshing ? (
              <span className="text-xs text-slate-400">Refreshing…</span>
            ) : null}
            <button
              type="button"
              onClick={() => void jobsQuery.refetch()}
              disabled={jobsQuery.isFetching}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Refresh
            </button>
          </div>
        </div>

        {jobs.length === 0 && <DashboardGettingStarted variant="jobs" />}

        {jobs.length > 0 && (
          <>
            <ul className="space-y-3 sm:hidden">
              {jobs.map((job) => {
                const customer = formatCustomer(job);
                return (
                  <li
                    key={job.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {customer.primary}
                        </p>
                        {customer.secondary ? (
                          <p className="truncate text-xs text-slate-500">
                            {customer.secondary}
                          </p>
                        ) : null}
                        <p className="mt-1 truncate text-sm text-slate-700">
                          {formatServiceLabel(job.service)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatScheduledTime(job.scheduled_at)}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-slate-900">
                        {formatCurrency(job.est_value_usd)}
                      </p>
                    </div>
                    <div className="mt-3">
                      <JobStatusBadge status={job.status} />
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm sm:block">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2.5 font-semibold text-slate-600 sm:px-6 sm:py-3">
                      Scheduled
                    </th>
                    <th className="px-3 py-2.5 font-semibold text-slate-600 sm:px-6 sm:py-3">
                      Customer
                    </th>
                    <th className="px-3 py-2.5 font-semibold text-slate-600 sm:px-6 sm:py-3">
                      Service
                    </th>
                    <th className="px-3 py-2.5 font-semibold text-slate-600 sm:px-6 sm:py-3">
                      Status
                    </th>
                    <th className="px-3 py-2.5 font-semibold text-slate-600 text-right sm:px-6 sm:py-3">
                      Est. value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => {
                    const customer = formatCustomer(job);
                    return (
                      <tr
                        key={job.id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="whitespace-nowrap px-3 py-3 text-slate-900 sm:px-6 sm:py-4">
                          {formatScheduledTime(job.scheduled_at)}
                        </td>
                        <td className="min-w-0 px-3 py-3 sm:px-6 sm:py-4">
                          <div className="truncate font-medium text-slate-900">
                            {customer.primary}
                          </div>
                          {customer.secondary && (
                            <div className="truncate text-xs text-slate-500">
                              {customer.secondary}
                            </div>
                          )}
                        </td>
                        <td className="min-w-0 px-3 py-3 text-slate-900 sm:px-6 sm:py-4">
                          <span className="line-clamp-2">
                            {formatServiceLabel(job.service)}
                          </span>
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4">
                          <JobStatusBadge status={job.status} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-right font-medium text-slate-900 sm:px-6 sm:py-4">
                          {formatCurrency(job.est_value_usd)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function JobsPanelFallback() {
  return (
    <div className="space-y-6">
      <RevenueCapturedCard loading />
      <JobsTableSkeleton />
    </div>
  );
}
