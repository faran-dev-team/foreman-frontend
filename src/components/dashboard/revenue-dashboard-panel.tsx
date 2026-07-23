"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useShop } from "@/components/dashboard/shop-provider";
import { JobStatusBadge } from "@/components/jobs/job-badges";
import {
  fetchDashboardAnalytics,
  type DashboardAnalytics,
} from "@/lib/api/analytics";
import { ApiError } from "@/lib/api/client";
import { fetchJobs } from "@/lib/api/jobs";
import type { JobListItem } from "@/lib/api/types";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";

type ViewState = "loading" | "ready" | "error";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe.toFixed(safe % 1 === 0 ? 0 : 1)}%`;
}

function formatDuration(seconds: number): string {
  const safe = Math.max(0, Math.round(Number.isFinite(seconds) ? seconds : 0));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
}

function formatJobTime(iso?: string | null): string {
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

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

function RevenueBarChart({
  today,
  week,
  month,
}: {
  today: number;
  week: number;
  month: number;
}) {
  const bars = [
    { label: "Today", value: today, fill: "#38bdf8" },
    { label: "Week", value: week, fill: "#f59e0b" },
    { label: "Month", value: month, fill: "#0f172a" },
  ];
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h3 className="text-sm font-semibold text-slate-900">Revenue by period</h3>
      <p className="mt-1 text-xs text-slate-500">
        Estimated value from completed jobs (shop-local periods).
      </p>
      <div className="mt-6 flex h-48 items-end justify-around gap-4 sm:gap-8">
        {bars.map((bar) => {
          const heightPct = Math.max((bar.value / max) * 100, bar.value > 0 ? 6 : 2);
          return (
            <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-medium text-slate-700">
                {formatCurrency(bar.value)}
              </span>
              <div className="flex h-36 w-full max-w-[4.5rem] items-end rounded-md bg-slate-100">
                <div
                  className="w-full rounded-md transition-all"
                  style={{ height: `${heightPct}%`, backgroundColor: bar.fill }}
                  title={`${bar.label}: ${formatCurrency(bar.value)}`}
                />
              </div>
              <span className="text-xs font-medium text-slate-500">{bar.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function JobsTodayChart({
  completed,
  pending,
  cancelled,
  today,
}: {
  completed: number;
  pending: number;
  cancelled: number;
  today: number;
}) {
  const rows = [
    { label: "Completed", value: completed, color: "bg-emerald-500" },
    { label: "Pending", value: pending, color: "bg-amber-500" },
    { label: "Cancelled", value: cancelled, color: "bg-slate-400" },
  ];
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h3 className="text-sm font-semibold text-slate-900">Jobs scheduled today</h3>
      <p className="mt-1 text-xs text-slate-500">
        {today} job{today === 1 ? "" : "s"} on the calendar for today.
      </p>
      <div className="mt-5 space-y-4">
        {rows.map((row) => {
          const widthPct = Math.max((row.value / max) * 100, row.value > 0 ? 8 : 0);
          return (
            <div key={row.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">{row.label}</span>
                <span className="font-semibold text-slate-900">{row.value}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${row.color}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MissedVsCapturedChart({
  captured,
  missed,
  captureRate,
}: {
  captured: number;
  missed: number;
  captureRate: number;
}) {
  const total = Math.max(captured + missed, 1);
  const capturedPct = (captured / total) * 100;
  const missedPct = (missed / total) * 100;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h3 className="text-sm font-semibold text-slate-900">Missed vs captured</h3>
      <p className="mt-1 text-xs text-slate-500">
        Capture rate {formatPercent(captureRate)} · {captured} captured · {missed}{" "}
        missed
      </p>
      <div className="mt-5 flex h-4 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-emerald-500"
          style={{ width: `${capturedPct}%` }}
          title={`Captured: ${captured}`}
        />
        <div
          className="h-full bg-red-400"
          style={{ width: `${missedPct}%` }}
          title={`Missed: ${missed}`}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Captured
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          Missed
        </span>
      </div>
    </div>
  );
}

function LeadSourcesChart({
  sources,
}: {
  sources: DashboardAnalytics["lead_sources"];
}) {
  const rows = sources.length > 0 ? sources : [{ source: "Unknown", count: 0, percentage: 0 }];
  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h3 className="text-sm font-semibold text-slate-900">Lead sources</h3>
      <p className="mt-1 text-xs text-slate-500">
        Where calls are coming from (normalized labels).
      </p>
      <div className="mt-5 space-y-3">
        {rows.map((row) => {
          const widthPct = Math.max((row.count / max) * 100, row.count > 0 ? 8 : 0);
          return (
            <div key={row.source}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-slate-700">{row.source}</span>
                <span className="shrink-0 text-slate-500">
                  {row.count} · {formatPercent(row.percentage)}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-foreman-navy"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LiveBookingFeed({ jobs }: { jobs: JobListItem[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Live booking feed
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Recent jobs booked for this shop.
          </p>
        </div>
        <Link
          href="/jobs"
          className="text-xs font-medium text-foreman-navy hover:underline"
        >
          View all jobs
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="mt-5 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
          No booked jobs yet. When the voice agent books an appointment, it will
          show up here.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {jobs.slice(0, 8).map((job) => (
            <li
              key={job.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                  {job.customer_name || "Unknown customer"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {job.service || "Service"} · {formatJobTime(job.scheduled_at)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-900">
                  {job.est_value_usd != null
                    ? formatCurrency(job.est_value_usd)
                    : "—"}
                </span>
                <JobStatusBadge status={job.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-36 animate-pulse rounded-xl bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}

export function RevenueDashboardPanel() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { shopId, loading: shopLoading, resolvingMe } = useShop();

  const [viewState, setViewState] = useState<ViewState>("loading");
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [recentJobs, setRecentJobs] = useState<JobListItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!isLoaded) {
      setViewState("loading");
      return;
    }
    if (!isSignedIn) {
      setViewState("error");
      setErrorMessage("Sign in required to view revenue analytics.");
      return;
    }
    // Wait for /dashboard/me so shop membership is ready — avoids a 403 flash
    // when analytics fires with env shopId before Clerk→shop mapping settles.
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
      const data = await withClerkAuthRetry(getToken, (token) =>
        fetchDashboardAnalytics(shopId, token),
      );

      let jobs: JobListItem[] = [];
      try {
        const jobsResponse = await withClerkAuthRetry(getToken, (token) =>
          fetchJobs(shopId, token),
        );
        jobs = jobsResponse.jobs ?? [];
      } catch {
        // Analytics can still render if jobs feed fails.
        jobs = [];
      }

      setAnalytics(data);
      setRecentJobs(jobs);
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
        setErrorMessage("Failed to load revenue analytics.");
      }
    }
  }, [getToken, isLoaded, isSignedIn, shopId, shopLoading, resolvingMe]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const heroHint = useMemo(() => {
    if (!analytics) return "";
    const jobsToday = analytics.jobs.today;
    if (analytics.revenue.month <= 0 && jobsToday === 0) {
      return "No completed jobs with estimated value this month yet.";
    }
    return `Conversion ${formatPercent(analytics.conversion_rate)} · Capture ${formatPercent(analytics.calls.capture_rate)} · ${jobsToday} job${jobsToday === 1 ? "" : "s"} today`;
  }, [analytics]);

  if (
    !isLoaded ||
    resolvingMe ||
    shopLoading ||
    viewState === "loading" ||
    (!analytics && viewState !== "error")
  ) {
    return <DashboardSkeleton />;
  }

  if (viewState === "error" || !analytics) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm font-medium text-red-800">Unable to load analytics</p>
        <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
        <button
          type="button"
          onClick={() => void loadDashboard()}
          className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {lastUpdatedAt && (
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
          onClick={() => void loadDashboard()}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-xl bg-foreman-navy px-5 py-6 text-white shadow-sm sm:px-8 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 sm:text-sm">
          Revenue Captured this month
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight sm:mt-3 sm:text-5xl">
          {formatCurrency(analytics.revenue.month)}
        </p>
        <p className="mt-2 text-sm text-slate-300">{heroHint}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Revenue today"
          value={formatCurrency(analytics.revenue.today)}
          hint="Completed jobs today"
        />
        <KpiCard
          label="Revenue this week"
          value={formatCurrency(analytics.revenue.week)}
          hint="Shop-local ISO week"
        />
        <KpiCard
          label="Jobs today"
          value={String(analytics.jobs.today)}
          hint={`${analytics.jobs.completed} completed · ${analytics.jobs.pending} pending`}
        />
        <KpiCard
          label="Conversion rate"
          value={formatPercent(analytics.conversion_rate)}
          hint="Booked jobs / eligible calls"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Capture rate"
          value={formatPercent(analytics.calls.capture_rate)}
          hint={`${analytics.calls.captured} captured · ${analytics.calls.missed} missed`}
        />
        <KpiCard
          label="Avg call duration"
          value={formatDuration(analytics.calls.average_duration_seconds)}
          hint="Completed calls with duration"
        />
        <KpiCard
          label="AI booking success"
          value={formatPercent(analytics.ai_booking.success_rate)}
          hint={`${analytics.ai_booking.successful_bookings} of ${analytics.ai_booking.eligible_calls} eligible`}
        />
        <KpiCard
          label="Lead sources"
          value={String(analytics.lead_sources?.length ?? 0)}
          hint="Distinct sources tracked"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueBarChart
          today={analytics.revenue.today}
          week={analytics.revenue.week}
          month={analytics.revenue.month}
        />
        <JobsTodayChart
          today={analytics.jobs.today}
          completed={analytics.jobs.completed}
          pending={analytics.jobs.pending}
          cancelled={analytics.jobs.cancelled}
        />
        <MissedVsCapturedChart
          captured={analytics.calls.captured}
          missed={analytics.calls.missed}
          captureRate={analytics.calls.capture_rate}
        />
        <LeadSourcesChart sources={analytics.lead_sources ?? []} />
      </div>

      <LiveBookingFeed jobs={recentJobs} />
    </div>
  );
}

export function RevenueDashboardPanelFallback() {
  return <DashboardSkeleton />;
}
