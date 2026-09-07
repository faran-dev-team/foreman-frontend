"use client";

import { useAuth } from "@clerk/nextjs";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

import { useShop } from "@/components/dashboard/shop-provider";
import {
  resolveDashboardQueryError,
} from "@/hooks/use-dashboard-queries";
import { useReportQuery } from "@/hooks/use-report-query";
import { ApiError } from "@/lib/api/client";
import {
  downloadMonthlyCsv,
  downloadMonthlyPdf,
  downloadWeeklyCsv,
  downloadWeeklyPdf,
  type MonthlyReportPeriod,
  type WeeklyReportPeriod,
} from "@/lib/api/reports";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";

type ReportKind = "weekly" | "monthly";
type ExportKind = "csv" | "pdf";

const WEEKLY_PERIODS: Array<{ value: WeeklyReportPeriod; label: string }> = [
  { value: "current_week", label: "Current week" },
  { value: "last_7_days", label: "Last 7 days" },
];

const MONTHLY_PERIODS: Array<{ value: MonthlyReportPeriod; label: string }> = [
  { value: "current_month", label: "Current month" },
  { value: "previous_month", label: "Previous month" },
];

function formatWhen(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatPercent(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe.toFixed(safe % 1 === 0 ? 0 : 1)}%`;
}

function formatSeconds(seconds: number): string {
  const safe = Math.max(0, Math.round(Number.isFinite(seconds) ? seconds : 0));
  if (safe === 0) return "0s";
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return mins === 0 ? `${secs}s` : `${mins}m ${secs.toString().padStart(2, "0")}s`;
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
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

function ReportsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-20 animate-pulse rounded-xl bg-slate-200" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
    </div>
  );
}

export function ReportsPanel() {
  const { getToken } = useAuth();
  const { shopId } = useShop();

  const [reportType, setReportType] = useState<ReportKind>("weekly");
  const [weeklyPeriod, setWeeklyPeriod] =
    useState<WeeklyReportPeriod>("current_week");
  const [monthlyPeriod, setMonthlyPeriod] =
    useState<MonthlyReportPeriod>("current_month");
  const [exportError, setExportError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<ExportKind | null>(null);

  const selectedPeriod = reportType === "weekly" ? weeklyPeriod : monthlyPeriod;
  const reportQuery = useReportQuery(reportType, weeklyPeriod, monthlyPeriod);
  const report = reportQuery.data ?? null;

  const handleExport = async (kind: ExportKind) => {
    if (!shopId) return;
    setExporting(kind);
    setExportError(null);
    try {
      await withClerkAuthRetry(getToken, (token) => {
        if (reportType === "weekly") {
          return kind === "csv"
            ? downloadWeeklyCsv(shopId, weeklyPeriod, token)
            : downloadWeeklyPdf(shopId, weeklyPeriod, token);
        }
        return kind === "csv"
          ? downloadMonthlyCsv(shopId, monthlyPeriod, token)
          : downloadMonthlyPdf(shopId, monthlyPeriod, token);
      });
    } catch (err) {
      setExportError(
        err instanceof ApiError ? err.message : "Failed to download export.",
      );
    } finally {
      setExporting(null);
    }
  };

  const dateRangeLabel = useMemo(() => {
    if (!report) return "—";
    return `${formatWhen(report.metadata.start_utc)} → ${formatWhen(report.metadata.end_utc)}`;
  }, [report]);

  if (reportQuery.isPending && !reportQuery.data) {
    return <ReportsSkeleton />;
  }

  if (reportQuery.isError && !report) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-800">
        <p className="font-medium">Could not load reports</p>
        <p className="mt-1">{resolveDashboardQueryError(reportQuery.error)}</p>
        <button
          type="button"
          onClick={() => void reportQuery.refetch()}
          className="mt-3 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-800"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!report) {
    return <ReportsSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Report controls
            </p>
            <p className="mt-1 break-words text-sm text-slate-600">
              {report.metadata.shop_name} · {report.metadata.timezone}
            </p>
            <p className="mt-1 break-words text-xs text-slate-500">
              Range: {dateRangeLabel} · Generated {formatWhen(report.metadata.generated_at)}
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-2">
            <label className="text-xs text-slate-600">
              Type
              <select
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                value={reportType}
                onChange={(event) => setReportType(event.target.value as ReportKind)}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
            <label className="text-xs text-slate-600">
              Period
              <select
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                value={selectedPeriod}
                onChange={(event) => {
                  if (reportType === "weekly") {
                    setWeeklyPeriod(event.target.value as WeeklyReportPeriod);
                  } else {
                    setMonthlyPeriod(event.target.value as MonthlyReportPeriod);
                  }
                }}
              >
                {(reportType === "weekly" ? WEEKLY_PERIODS : MONTHLY_PERIODS).map(
                  (period) => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ),
                )}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => void reportQuery.refetch()}
            className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Refresh report
          </button>
          <button
            type="button"
            onClick={() => void handleExport("csv")}
            disabled={exporting !== null}
            className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-foreman-accent px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60 sm:w-auto"
          >
            {exporting === "csv" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4" />
            )}
            Download CSV
          </button>
          <button
            type="button"
            onClick={() => void handleExport("pdf")}
            disabled={exporting !== null}
            className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 sm:w-auto"
          >
            {exporting === "pdf" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            Download PDF
          </button>
        </div>
      </div>

      {exportError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {exportError}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Revenue"
          value={formatCurrency(report.revenue.total)}
          hint={`${report.jobs.completed} completed jobs`}
        />
        <KpiCard
          label="Conversion"
          value={formatPercent(report.conversion.conversion_rate)}
          hint={`${report.conversion.booked_jobs}/${report.conversion.eligible_calls} booked`}
        />
        <KpiCard
          label="Call capture"
          value={formatPercent(report.calls.capture_rate)}
          hint={`${report.calls.captured} captured · ${report.calls.missed} missed`}
        />
        <KpiCard
          label="AI booking success"
          value={formatPercent(report.ai_booking.success_rate)}
          hint={`${report.ai_booking.successful_bookings} successful`}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Jobs total" value={String(report.jobs.total)} />
        <KpiCard label="Pending jobs" value={String(report.jobs.pending)} />
        <KpiCard label="Cancelled jobs" value={String(report.jobs.cancelled)} />
        <KpiCard
          label="Avg call duration"
          value={formatSeconds(report.calls.average_duration_seconds)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Lead sources</h3>
          <p className="mt-1 text-xs text-slate-500">
            Share of captured opportunities by channel.
          </p>
          {report.lead_sources.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-5 text-sm text-slate-500">
              No lead-source data for this period.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {report.lead_sources.map((lead) => (
                <li
                  key={lead.source}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="min-w-0 truncate font-medium text-slate-800">
                    {lead.source}
                  </span>
                  <span className="shrink-0 text-slate-600">
                    {lead.count} ({formatPercent(lead.percentage)})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Automation summary</h3>
          <p className="mt-1 text-xs text-slate-500">
            Review and outbound notification activity.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">Reviews</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {report.reviews.total} total · {report.reviews.delivered} delivered
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Notifications
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {report.notifications.total} total
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Reminders delivered
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {report.notifications.appointment_reminders_delivered}/
                {report.notifications.appointment_reminders_total}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Follow-ups delivered
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {report.notifications.service_follow_ups_delivered}/
                {report.notifications.service_follow_ups_total}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReportsPanelFallback() {
  return <ReportsSkeleton />;
}
