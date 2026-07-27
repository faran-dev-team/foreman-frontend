import { getApiBaseUrl } from "@/lib/api/config";
import { apiFetch, ApiError } from "@/lib/api/client";

const REPORTS_BASE = "/api/v1/reports";

export type WeeklyReportPeriod = "current_week" | "last_7_days";
export type MonthlyReportPeriod = "current_month" | "previous_month";

export type ReportResponse = {
  metadata: {
    report_type: string;
    reporting_period: string;
    start_utc: string;
    end_utc: string;
    generated_at: string;
    shop_id: string;
    shop_name: string;
    timezone: string;
  };
  revenue: {
    total: number;
  };
  jobs: {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    confirmed: number;
    in_progress: number;
  };
  conversion: {
    conversion_rate: number;
    booked_jobs: number;
    eligible_calls: number;
  };
  calls: {
    captured: number;
    missed: number;
    total: number;
    capture_rate: number;
    missed_rate: number;
    average_duration_seconds: number;
  };
  ai_booking: {
    successful_bookings: number;
    eligible_calls: number;
    success_rate: number;
  };
  lead_sources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  reviews: {
    pending: number;
    scheduled: number;
    sent: number;
    delivered: number;
    failed: number;
    retrying: number;
    failed_permanent: number;
    total: number;
  };
  notifications: {
    appointment_reminders_total: number;
    appointment_reminders_delivered: number;
    service_follow_ups_total: number;
    service_follow_ups_delivered: number;
    total: number;
  };
};

function reportParams(shopId: string, period: string): string {
  return new URLSearchParams({ shop_id: shopId, period }).toString();
}

export async function fetchWeeklyReport(
  shopId: string,
  period: WeeklyReportPeriod,
  token?: string | null,
): Promise<ReportResponse> {
  return apiFetch<ReportResponse>(
    `${REPORTS_BASE}/weekly?${reportParams(shopId, period)}`,
    { token, cache: "no-store" },
  );
}

export async function fetchMonthlyReport(
  shopId: string,
  period: MonthlyReportPeriod,
  token?: string | null,
): Promise<ReportResponse> {
  return apiFetch<ReportResponse>(
    `${REPORTS_BASE}/monthly?${reportParams(shopId, period)}`,
    { token, cache: "no-store" },
  );
}

function parseFilename(contentDisposition: string | null, fallback: string): string {
  if (!contentDisposition) return fallback;
  const match = /filename="?([^"]+)"?/i.exec(contentDisposition);
  return match?.[1]?.trim() || fallback;
}

async function downloadExport(
  path: string,
  token?: string | null,
  fallbackFilename = "report-export",
): Promise<void> {
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    try {
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const body = (await response.json()) as { detail?: string };
        if (typeof body.detail === "string") {
          detail = body.detail;
        }
      } else {
        const text = await response.text();
        if (text.trim()) detail = text.trim();
      }
    } catch {
      // keep generic status detail
    }
    throw new ApiError(response.status, detail);
  }

  const blob = await response.blob();
  const filename = parseFilename(
    response.headers.get("content-disposition"),
    fallbackFilename,
  );

  const blobUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(blobUrl);
}

export async function downloadWeeklyCsv(
  shopId: string,
  period: WeeklyReportPeriod,
  token?: string | null,
): Promise<void> {
  return downloadExport(
    `${REPORTS_BASE}/weekly/export/csv?${reportParams(shopId, period)}`,
    token,
    "weekly-report.csv",
  );
}

export async function downloadWeeklyPdf(
  shopId: string,
  period: WeeklyReportPeriod,
  token?: string | null,
): Promise<void> {
  return downloadExport(
    `${REPORTS_BASE}/weekly/export/pdf?${reportParams(shopId, period)}`,
    token,
    "weekly-report.pdf",
  );
}

export async function downloadMonthlyCsv(
  shopId: string,
  period: MonthlyReportPeriod,
  token?: string | null,
): Promise<void> {
  return downloadExport(
    `${REPORTS_BASE}/monthly/export/csv?${reportParams(shopId, period)}`,
    token,
    "monthly-report.csv",
  );
}

export async function downloadMonthlyPdf(
  shopId: string,
  period: MonthlyReportPeriod,
  token?: string | null,
): Promise<void> {
  return downloadExport(
    `${REPORTS_BASE}/monthly/export/pdf?${reportParams(shopId, period)}`,
    token,
    "monthly-report.pdf",
  );
}
