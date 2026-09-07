"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { JobStatusBadge } from "@/components/jobs/job-badges";
import {
  useDashboardAnalyticsQuery,
  useJobsListQuery,
} from "@/hooks/use-dashboard-queries";
import { ApiError } from "@/lib/api/client";
import type { DashboardAnalytics } from "@/lib/api/analytics";
import type { JobListItem } from "@/lib/api/types";
import { brand } from "@/lib/brand";

const CHART = {
  orange: brand.orange,
  carbon: brand.carbon,
  green: brand.green,
  sky: "#38BDF8",
  red: "#F87171",
  slate: "#94A3B8",
  amber: "#FBBF24",
} as const;

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

function formatUpdatedAt(ms: number | undefined): string | null {
  if (!ms) return null;
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(ms));
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
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-foreman-accent/30 hover:shadow-md sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-foreman-navy">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
      <h3 className="text-sm font-semibold text-foreman-navy">{title}</h3>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
      <div className="mt-4 h-52 w-full min-w-0">{children}</div>
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
  const data = [
    { label: "Today", value: today, fill: CHART.sky },
    { label: "Week", value: week, fill: CHART.orange },
    { label: "Month", value: month, fill: CHART.carbon },
  ];

  return (
    <ChartCard
      title="Revenue by period"
      description="Estimated value from completed jobs (shop-local periods)."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E2E8F0"
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "#64748B", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#94A3B8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
            width={48}
          />
          <Tooltip
            cursor={{ fill: "rgba(249,122,53,0.06)" }}
            formatter={(value: number) => [formatCurrency(value), "Revenue"]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              boxShadow: "0 8px 24px rgba(10,15,28,0.08)",
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 4, 4]} maxBarSize={56}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
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
  const data = [
    { label: "Completed", value: completed, fill: CHART.green },
    { label: "Pending", value: pending, fill: CHART.amber },
    { label: "Cancelled", value: cancelled, fill: CHART.slate },
  ];

  return (
    <ChartCard
      title="Jobs scheduled today"
      description={`${today} job${today === 1 ? "" : "s"} on the calendar for today.`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="#E2E8F0"
          />
          <XAxis type="number" allowDecimals={false} hide />
          <YAxis
            type="category"
            dataKey="label"
            width={64}
            tick={{ fill: "#64748B", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => [value, "Jobs"]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #E2E8F0",
            }}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={22}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
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
  const data = [
    { name: "Captured", value: captured, fill: CHART.green },
    { name: "Missed", value: missed, fill: CHART.red },
  ];
  const total = captured + missed;

  return (
    <ChartCard
      title="Missed vs captured"
      description={`Capture rate ${formatPercent(captureRate)} · ${captured} captured · ${missed} missed`}
    >
      {total === 0 ? (
        <div className="flex h-full items-center justify-center text-sm text-slate-500">
          No call volume in this period yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={40}
              outerRadius={68}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [value, name]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E2E8F0",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

function LeadSourcesChart({
  sources,
}: {
  sources: DashboardAnalytics["lead_sources"];
}) {
  const data =
    sources.length > 0
      ? sources.map((s) => ({
          source: s.source,
          count: s.count,
          percentage: s.percentage,
        }))
      : [{ source: "Unknown", count: 0, percentage: 0 }];

  return (
    <ChartCard
      title="Lead sources"
      description="Where calls are coming from (normalized labels)."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="#E2E8F0"
          />
          <XAxis type="number" allowDecimals={false} hide />
          <YAxis
            type="category"
            dataKey="source"
            width={72}
            tick={{ fill: "#64748B", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number, _name, item) => [
              `${value} (${formatPercent(Number(item?.payload?.percentage ?? 0))})`,
              "Calls",
            ]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #E2E8F0",
            }}
          />
          <Bar
            dataKey="count"
            fill={CHART.carbon}
            radius={[0, 8, 8, 0]}
            maxBarSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function LiveBookingFeed({
  jobs,
  loading,
}: {
  jobs: JobListItem[];
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Live booking feed
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Recent jobs booked for this shop · refreshes every 15s
          </p>
        </div>
        <Link
          href="/jobs"
          className="text-xs font-medium text-foreman-navy hover:underline"
        >
          View all jobs
        </Link>
      </div>

      {loading && jobs.length === 0 ? (
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
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
                  {job.customer_name?.trim() ||
                    job.customer_phone ||
                    "Unknown customer"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {job.customer_name?.trim() && job.customer_phone
                    ? job.customer_phone
                    : job.service || "Service"}{" "}
                  · {formatJobTime(job.scheduled_at)}
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

function resolveErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof TypeError) {
    return "Cannot reach the Foreman API. Is the backend running on NEXT_PUBLIC_API_URL?";
  }
  return "Failed to load revenue analytics.";
}

export function RevenueDashboardPanel() {
  const analyticsQuery = useDashboardAnalyticsQuery();
  const jobsQuery = useJobsListQuery();

  const analytics = analyticsQuery.data;
  const recentJobs = jobsQuery.data?.jobs ?? [];

  const showInitialSkeleton = analyticsQuery.isPending && !analyticsQuery.data;

  const isRefreshing = analyticsQuery.isFetching || jobsQuery.isFetching;

  const lastUpdatedLabel = formatUpdatedAt(
    Math.max(analyticsQuery.dataUpdatedAt, jobsQuery.dataUpdatedAt),
  );

  const heroHint = useMemo(() => {
    if (!analytics) return "";
    const jobsToday = analytics.jobs.today;
    if (analytics.revenue.month <= 0 && jobsToday === 0) {
      return "No completed jobs with estimated value this month yet.";
    }
    return `Conversion ${formatPercent(analytics.conversion_rate)} · Capture ${formatPercent(analytics.calls.capture_rate)} · ${jobsToday} job${jobsToday === 1 ? "" : "s"} today`;
  }, [analytics]);

  const handleRefresh = () => {
    void analyticsQuery.refetch();
    void jobsQuery.refetch();
  };

  if (showInitialSkeleton) {
    return <DashboardSkeleton />;
  }

  if (analyticsQuery.isError && !analytics) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm font-medium text-red-800">
          Unable to load analytics
        </p>
        <p className="mt-1 text-sm text-red-700">
          {resolveErrorMessage(analyticsQuery.error)}
        </p>
        <button
          type="button"
          onClick={handleRefresh}
          className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {lastUpdatedLabel ? (
            <p className="text-xs text-slate-400">Updated {lastUpdatedLabel}</p>
          ) : null}
          {isRefreshing ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
              Refreshing…
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-foreman-navy via-foreman-slate to-foreman-navy px-5 py-6 text-white shadow-lg shadow-foreman-navy/20 sm:px-8 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-foreman-accent sm:text-sm">
          Revenue Captured this month
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight sm:mt-3 sm:text-5xl">
          {formatCurrency(analytics.revenue.month)}
        </p>
        <p className="mt-2 text-sm text-foreman-muted">{heroHint}</p>
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

      <LiveBookingFeed
        jobs={recentJobs}
        loading={jobsQuery.isPending && recentJobs.length === 0}
      />
    </div>
  );
}

export function RevenueDashboardPanelFallback() {
  return <DashboardSkeleton />;
}
