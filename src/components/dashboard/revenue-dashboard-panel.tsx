"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useShop } from "@/components/dashboard/shop-provider";
import {
  fetchDashboardAnalytics,
  type DashboardAnalytics,
} from "@/lib/api/analytics";
import { ApiError } from "@/lib/api/client";
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

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-36 animate-pulse rounded-xl bg-slate-200" />
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
  const { shopId, loading: shopLoading } = useShop();

  const [viewState, setViewState] = useState<ViewState>("loading");
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const loadAnalytics = useCallback(async () => {
    if (!isLoaded) {
      setViewState("loading");
      return;
    }
    if (!isSignedIn) {
      setViewState("error");
      setErrorMessage("Sign in required to view revenue analytics.");
      return;
    }
    if (!shopId) {
      if (shopLoading) {
        setViewState("loading");
        return;
      }
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
      setAnalytics(data);
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
  }, [getToken, isLoaded, isSignedIn, shopId, shopLoading]);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const heroHint = useMemo(() => {
    if (!analytics) return "";
    const jobsToday = analytics.jobs.today;
    if (analytics.revenue.month <= 0 && jobsToday === 0) {
      return "No completed jobs with estimated value this month yet.";
    }
    return `Conversion ${formatPercent(analytics.conversion_rate)} · ${jobsToday} job${jobsToday === 1 ? "" : "s"} scheduled today`;
  }, [analytics]);

  if ((!isLoaded || (!shopId && shopLoading) || viewState === "loading") &&
    viewState !== "error") {
    return <DashboardSkeleton />;
  }

  if (viewState === "error" || !analytics) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm font-medium text-red-800">Unable to load analytics</p>
        <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
        <button
          type="button"
          onClick={() => void loadAnalytics()}
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
          onClick={() => void loadAnalytics()}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {/* Hero — Revenue Captured (Launch+ standout) */}
      <div className="rounded-xl bg-foreman-navy px-5 py-6 text-white shadow-sm sm:px-8 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 sm:text-sm">
          Revenue Captured this month
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight sm:mt-3 sm:text-5xl">
          {formatCurrency(analytics.revenue.month)}
        </p>
        <p className="mt-2 text-sm text-slate-300">{heroHint}</p>
      </div>

      {/* KPI cards */}
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

      {/* Charts */}
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
      </div>
    </div>
  );
}

export function RevenueDashboardPanelFallback() {
  return <DashboardSkeleton />;
}
