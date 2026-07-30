"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

import { DashboardGettingStarted } from "@/components/dashboard/dashboard-getting-started";
import { useShop } from "@/components/dashboard/shop-provider";
import { JobStatusBadge } from "@/components/jobs/job-badges";
import { RevenueCapturedCard } from "@/components/jobs/revenue-captured-card";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";
import { ApiError } from "@/lib/api/client";
import { fetchJobs } from "@/lib/api/jobs";
import type { JobListItem } from "@/lib/api/types";

type ViewState = "loading" | "ready" | "error";

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

export function JobsPanel() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { shopId, loading: shopLoading } = useShop();

  const [viewState, setViewState] = useState<ViewState>("loading");
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [revenueCaptured, setRevenueCaptured] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const loadJobs = useCallback(async () => {
    if (!isLoaded) {
      setViewState("loading");
      return;
    }

    if (!isSignedIn) {
      setViewState("error");
      setErrorMessage("Sign in required to load jobs.");
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
        fetchJobs(shopId, token),
      );
      const nextJobs = response.jobs ?? [];
      setJobs(nextJobs);
      setTotal(response.total ?? nextJobs.length);
      setRevenueCaptured(response.revenue_captured_usd ?? 0);
      setLastUpdatedAt(new Date());
      setViewState("ready");
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setJobs([]);
        setTotal(0);
        setRevenueCaptured(0);
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
        setErrorMessage("Failed to load jobs.");
      }
    }
  }, [getToken, shopId, shopLoading, isLoaded, isSignedIn]);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  if ((!isLoaded || (!shopId && shopLoading)) && viewState === "loading") {
    return (
      <div className="space-y-6">
        <RevenueCapturedCard loading />
        <JobsTableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RevenueCapturedCard
        amount={revenueCaptured}
        jobCount={total}
        loading={viewState === "loading"}
      />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">
              {viewState === "ready"
                ? `${total} job${total === 1 ? "" : "s"} booked`
                : "Booked jobs"}
            </p>
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
            onClick={() => void loadJobs()}
            disabled={viewState === "loading"}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        {viewState === "loading" && <JobsTableSkeleton />}

        {viewState === "error" && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
            <p className="text-sm font-medium text-red-800">Unable to load jobs</p>
            <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
            <button
              type="button"
              onClick={() => void loadJobs()}
              className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {viewState === "ready" && jobs.length === 0 && (
          <DashboardGettingStarted variant="jobs" />
        )}

        {viewState === "ready" && jobs.length > 0 && (
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
