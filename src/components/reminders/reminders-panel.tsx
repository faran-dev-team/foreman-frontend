"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useShop } from "@/components/dashboard/shop-provider";
import { ApiError } from "@/lib/api/client";
import {
  fetchAppointmentReminders,
  fetchReminderStatusSummary,
  retryAppointmentReminder,
  scheduleAppointmentReminders,
  type ReminderStatusSummary,
  type ReminderSummary,
} from "@/lib/api/reminders";
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

function formatService(service?: string | null): string {
  if (!service?.trim()) return "—";
  return service
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bAc\b/g, "AC");
}

function formatReminderType(type: string): string {
  const key = type.toUpperCase();
  if (key === "24_HOUR") return "24-hour";
  if (key === "1_HOUR") return "1-hour";
  return type;
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

function SummaryCards({ summary }: { summary: ReminderStatusSummary }) {
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

function RemindersSkeleton() {
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

export function RemindersPanel() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { shopId, loading: shopLoading, resolvingMe } = useShop();

  const [viewState, setViewState] = useState<ViewState>("loading");
  const [items, setItems] = useState<ReminderSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<ReminderStatusSummary | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [appointmentIdInput, setAppointmentIdInput] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState<string | null>(null);

  const loadReminders = useCallback(async () => {
    if (!isLoaded) {
      setViewState("loading");
      return;
    }
    if (!isSignedIn) {
      setViewState("error");
      setErrorMessage("Sign in required to view appointment reminders.");
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
          fetchAppointmentReminders(shopId, token, {
            status: statusFilter || undefined,
            limit: 100,
          }),
        ),
        withClerkAuthRetry(getToken, (token) =>
          fetchReminderStatusSummary(shopId, token),
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
        setErrorMessage("Failed to load appointment reminders.");
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
    void loadReminders();
  }, [loadReminders]);

  const handleRetry = useCallback(
    async (reminderId: string) => {
      if (!shopId) return;
      setRetryingId(reminderId);
      try {
        await withClerkAuthRetry(getToken, (token) =>
          retryAppointmentReminder(shopId, reminderId, token, true),
        );
        await loadReminders();
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "Retry failed. Try again.";
        setErrorMessage(message);
      } finally {
        setRetryingId(null);
      }
    },
    [getToken, shopId, loadReminders],
  );

  const handleSchedule = useCallback(async () => {
    if (!shopId) return;
    const appointmentId = appointmentIdInput.trim();
    if (!appointmentId) {
      setScheduleMessage("Enter an appointment UUID to schedule reminders.");
      return;
    }

    setScheduling(true);
    setScheduleMessage(null);
    setErrorMessage(null);
    try {
      const result = await withClerkAuthRetry(getToken, (token) =>
        scheduleAppointmentReminders(shopId, appointmentId, token),
      );
      const count = result.items?.length ?? 0;
      setScheduleMessage(
        count > 0
          ? `Scheduled / refreshed ${count} reminder${count === 1 ? "" : "s"} for this appointment.`
          : "No reminders created (appointment may be ineligible or reminders already exist).",
      );
      setAppointmentIdInput("");
      await loadReminders();
    } catch (error) {
      setScheduleMessage(
        error instanceof ApiError
          ? error.message
          : "Could not schedule reminders for that appointment.",
      );
    } finally {
      setScheduling(false);
    }
  }, [appointmentIdInput, getToken, shopId, loadReminders]);

  const emptyHint = useMemo(() => {
    if (statusFilter) {
      return `No reminders with status “${statusFilter}”.`;
    }
    return "No appointment reminders yet. When a job is booked, Foreman schedules 24-hour and 1-hour reminder emails automatically.";
  }, [statusFilter]);

  if (
    !isLoaded ||
    resolvingMe ||
    shopLoading ||
    viewState === "loading" ||
    (!summary && viewState !== "error")
  ) {
    return <RemindersSkeleton />;
  }

  if (viewState === "error" && !summary) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm font-medium text-red-800">
          Unable to load reminders
        </p>
        <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
        <button
          type="button"
          onClick={() => void loadReminders()}
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
            {total} reminder{total === 1 ? "" : "s"}
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
            htmlFor="reminder-status"
          >
            Status
          </label>
          <select
            id="reminder-status"
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
            onClick={() => void loadReminders()}
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
            Reminder emails are sent by the backend worker
            (process_appointment_reminders.py).
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Scheduled</th>
                  <th className="px-4 py-3">Sent</th>
                  <th className="px-4 py-3">Attempts</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <Link
                        href={`/reminders/${row.id}`}
                        className="font-medium text-foreman-navy hover:underline"
                      >
                        {row.customer_name || "Customer"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatService(row.appointment_service)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatReminderType(row.reminder_type)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatWhen(row.scheduled_at || row.next_attempt_at)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatWhen(row.sent_at)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.attempt_count}
                      {row.retry_count > 0
                        ? ` · ${row.retry_count} retries`
                        : ""}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/reminders/${row.id}`}
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
          Idempotently create 24-hour and 1-hour reminders for an existing
          appointment UUID (same shop).
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={appointmentIdInput}
            onChange={(e) => setAppointmentIdInput(e.target.value)}
            placeholder="Appointment UUID"
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

export function RemindersPanelFallback() {
  return <RemindersSkeleton />;
}
