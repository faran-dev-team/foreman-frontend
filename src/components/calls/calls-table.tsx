"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { IntentBadge, OutcomeBadge } from "@/components/calls/call-badges";
import { DashboardGettingStarted } from "@/components/dashboard/dashboard-getting-started";
import { useShop } from "@/components/dashboard/shop-provider";
import { useJobsListQuery } from "@/hooks/use-dashboard-queries";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";
import { fetchCalls } from "@/lib/api/calls";
import { ApiError } from "@/lib/api/client";
import { enrichCallsWithJobOutcomes } from "@/lib/calls/enrich-call-outcomes";
import type { CallListItem } from "@/lib/api/types";

type ViewState = "loading" | "ready" | "error";

const CALLS_POLL_INTERVAL_MS = 15_000;
const CALLS_CACHE_TTL_MS = 60_000;
const PAGE_SIZE = 15;

type CallsCacheEntry = {
  calls: CallListItem[];
  total: number;
  lastUpdatedAt: Date;
  cachedAtMs: number;
};

let callsCache: CallsCacheEntry | null = null;

function getCallsCache(): CallsCacheEntry | null {
  if (!callsCache) {
    return null;
  }
  if (Date.now() - callsCache.cachedAtMs > CALLS_CACHE_TTL_MS) {
    callsCache = null;
    return null;
  }
  return callsCache;
}

function formatCallTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return new Intl.DateTimeFormat(undefined, {
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

function formatCaller(call: CallListItem): {
  primary: string;
  secondary?: string;
} {
  const rawNumber = (call.caller_number || "").trim();
  const isUnknownNumber =
    !rawNumber || rawNumber.toLowerCase() === "unknown" || rawNumber === "n/a";

  if (call.caller_name?.trim()) {
    return {
      primary: call.caller_name.trim(),
      secondary: isUnknownNumber ? undefined : rawNumber,
    };
  }

  if (isUnknownNumber) {
    return { primary: "Unknown caller" };
  }

  return { primary: rawNumber };
}

/* ------------------------------------------------------------------ */
/*  Filter types & helpers                                            */
/* ------------------------------------------------------------------ */

type OutcomeFilter = "all" | "booked" | "not_booked" | "escalated" | "missed";
type IntentFilter = "all" | "booking" | "quote" | "question" | "wrong_number" | "other";
type DateFilter = "all" | "today" | "week" | "month";

const OUTCOME_OPTIONS: { value: OutcomeFilter; label: string }[] = [
  { value: "all", label: "All outcomes" },
  { value: "booked", label: "Booked" },
  { value: "not_booked", label: "Not booked" },
  { value: "escalated", label: "Escalated" },
  { value: "missed", label: "Missed" },
];

const INTENT_OPTIONS: { value: IntentFilter; label: string }[] = [
  { value: "all", label: "All intents" },
  { value: "booking", label: "Booking" },
  { value: "quote", label: "Quote" },
  { value: "question", label: "Question" },
  { value: "wrong_number", label: "Wrong number" },
  { value: "other", label: "Other" },
];

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

function startOfMonth(date: Date): Date {
  const d = startOfDay(date);
  d.setDate(1);
  return d;
}

function passesDateFilter(iso: string, filter: DateFilter): boolean {
  if (filter === "all") return true;
  const callDate = new Date(iso);
  if (Number.isNaN(callDate.getTime())) return true;
  const now = new Date();
  if (filter === "today") return callDate >= startOfDay(now);
  if (filter === "week") return callDate >= startOfWeek(now);
  if (filter === "month") return callDate >= startOfMonth(now);
  return true;
}

/* ------------------------------------------------------------------ */
/*  Filter bar component                                              */
/* ------------------------------------------------------------------ */

function FilterBar({
  outcome,
  intent,
  dateRange,
  onOutcomeChange,
  onIntentChange,
  onDateRangeChange,
  onClear,
  hasActiveFilters,
  filteredCount,
  totalCount,
}: {
  outcome: OutcomeFilter;
  intent: IntentFilter;
  dateRange: DateFilter;
  onOutcomeChange: (v: OutcomeFilter) => void;
  onIntentChange: (v: IntentFilter) => void;
  onDateRangeChange: (v: DateFilter) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  filteredCount: number;
  totalCount: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <FilterSelect
          label="Outcome"
          value={outcome}
          options={OUTCOME_OPTIONS}
          onChange={(v) => onOutcomeChange(v as OutcomeFilter)}
        />
        <FilterSelect
          label="Intent"
          value={intent}
          options={INTENT_OPTIONS}
          onChange={(v) => onIntentChange(v as IntentFilter)}
        />
        <FilterSelect
          label="Date"
          value={dateRange}
          options={DATE_OPTIONS}
          onChange={(v) => onDateRangeChange(v as DateFilter)}
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
            </svg>
            Clear filters
          </button>
        )}

        {hasActiveFilters && (
          <span className="text-xs text-slate-500">
            {filteredCount} of {totalCount} calls
          </span>
        )}
      </div>
    </div>
  );
}

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const isActive = value !== "all";
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-foreman-navy/30 ${
        isActive
          ? "border-foreman-navy/30 bg-foreman-navy/5 text-foreman-navy"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
      }`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

/* ------------------------------------------------------------------ */
/*  Pagination controls                                               */
/* ------------------------------------------------------------------ */

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = buildPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6"
    >
      {/* Mobile: simple prev/next */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="inline-flex items-center text-sm text-slate-600">
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Desktop: full page numbers */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Page{" "}
          <span className="font-medium">{currentPage}</span>
          {" "}of{" "}
          <span className="font-medium">{totalPages}</span>
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeftIcon />
          </button>

          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="inline-flex h-9 w-9 items-center justify-center text-sm text-slate-400"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p as number)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition ${
                  p === currentPage
                    ? "bg-foreman-navy text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            ),
          )}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </nav>
  );
}

function buildPageNumbers(
  current: number,
  total: number,
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path
        fillRule="evenodd"
        d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path
        fillRule="evenodd"
        d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CallsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="animate-pulse border-b border-slate-200 bg-slate-50 px-6 py-3">
        <div className="h-4 w-full rounded bg-slate-200" />
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex gap-4 border-b border-slate-100 px-6 py-4 last:border-b-0"
        >
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-4 w-20 rounded bg-slate-200" />
          <div className="h-4 w-20 rounded bg-slate-200" />
          <div className="h-4 w-16 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export function CallsTable() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { shopId, loading: shopLoading } = useShop();
  const jobsQuery = useJobsListQuery();
  const cached = getCallsCache();

  const [viewState, setViewState] = useState<ViewState>(
    cached ? "ready" : "loading",
  );
  const [calls, setCalls] = useState<CallListItem[]>(cached?.calls ?? []);
  const [total, setTotal] = useState(cached?.total ?? 0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(
    cached?.lastUpdatedAt ?? null,
  );

  const loadCalls = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;

      if (!isLoaded) {
        if (!silent) {
          setViewState("loading");
        }
        return;
      }

      if (!isSignedIn) {
        if (!silent) {
          setViewState("error");
          setErrorMessage("Sign in required to load calls.");
        }
        return;
      }

      if (!shopId) {
        if (shopLoading) {
          if (!silent) {
            setViewState("loading");
          }
          return;
        }
        if (!silent) {
          setViewState("error");
          setErrorMessage(
            "No shop resolved for this account. Confirm Clerk sign-in and backend DEFAULT_SHOP_ID.",
          );
        }
        return;
      }

      if (!silent) {
        setViewState((prev) => (prev === "ready" ? prev : "loading"));
        setErrorMessage(null);
      }

      try {
        const response = await withClerkAuthRetry(getToken, (token) =>
          fetchCalls(shopId, token),
        );
        const nextCalls = response.calls ?? [];
        setCalls(nextCalls);
        setTotal(response.total ?? nextCalls.length);
        const now = new Date();
        setLastUpdatedAt(now);
        callsCache = {
          calls: nextCalls,
          total: response.total ?? nextCalls.length,
          lastUpdatedAt: now,
          cachedAtMs: Date.now(),
        };
        setViewState("ready");
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          setCalls([]);
          setTotal(0);
          const now = new Date();
          setLastUpdatedAt(now);
          callsCache = {
            calls: [],
            total: 0,
            lastUpdatedAt: now,
            cachedAtMs: Date.now(),
          };
          setViewState("ready");
          return;
        }

        if (silent) {
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
          setErrorMessage("Failed to load calls.");
        }
      }
    },
    [getToken, shopId, shopLoading, isLoaded, isSignedIn],
  );

  useEffect(() => {
    void loadCalls();
  }, [loadCalls]);

  useEffect(() => {
    if (!shopId || !isLoaded || !isSignedIn || shopLoading) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return;
      }
      void loadCalls({ silent: true });
    }, CALLS_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadCalls, shopId, isLoaded, isSignedIn, shopLoading]);

  const [currentPage, setCurrentPage] = useState(1);
  const tableTopRef = useRef<HTMLDivElement>(null);

  // Filter state
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>("all");
  const [intentFilter, setIntentFilter] = useState<IntentFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  const hasActiveFilters =
    outcomeFilter !== "all" || intentFilter !== "all" || dateFilter !== "all";

  const clearFilters = useCallback(() => {
    setOutcomeFilter("all");
    setIntentFilter("all");
    setDateFilter("all");
    setCurrentPage(1);
  }, []);

  const displayCalls = useMemo(
    () =>
      enrichCallsWithJobOutcomes(calls, jobsQuery.data?.jobs ?? []),
    [calls, jobsQuery.data?.jobs],
  );

  // Apply filters
  const filteredCalls = useMemo(() => {
    return displayCalls.filter((call) => {
      if (outcomeFilter !== "all") {
        const key = (call.outcome || "").toLowerCase();
        if (key !== outcomeFilter) return false;
      }
      if (intentFilter !== "all") {
        const key = (call.intent || "").toLowerCase();
        if (key !== intentFilter) return false;
      }
      if (!passesDateFilter(call.started_at, dateFilter)) return false;
      return true;
    });
  }, [displayCalls, outcomeFilter, intentFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCalls.length / PAGE_SIZE));

  // Reset to page 1 when filters or data change
  useEffect(() => {
    setCurrentPage(1);
  }, [outcomeFilter, intentFilter, dateFilter]);

  useEffect(() => {
    setCurrentPage((prev) => (prev > totalPages ? 1 : prev));
  }, [totalPages]);

  const paginatedCalls = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCalls.slice(start, start + PAGE_SIZE);
  }, [filteredCalls, currentPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      tableTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [],
  );

  const outcomeCounts = useMemo(() => {
    const counts = {
      booked: 0,
      not_booked: 0,
      escalated: 0,
      missed: 0,
      other: 0,
    };

    for (const call of displayCalls) {
      const key = (call.outcome || "").toLowerCase();
      if (key === "booked") counts.booked += 1;
      else if (key === "not_booked") counts.not_booked += 1;
      else if (key === "escalated") counts.escalated += 1;
      else if (key === "missed") counts.missed += 1;
      else counts.other += 1;
    }

    return counts;
  }, [displayCalls]);

  // Keep skeleton while Clerk/shop settle — never flash auth error early.
  if ((!isLoaded || (!shopId && shopLoading)) && viewState === "loading") {
    return (
      <div className="space-y-4">
        <CallsTableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-slate-500">
            {viewState === "ready"
              ? `${total} call${total === 1 ? "" : "s"}`
              : "Recent inbound calls"}
          </p>
          {viewState === "ready" && calls.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs">
              {outcomeCounts.booked > 0 && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-800">
                  {outcomeCounts.booked} booked
                </span>
              )}
              {outcomeCounts.not_booked > 0 && (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-800">
                  {outcomeCounts.not_booked} not booked
                </span>
              )}
              {outcomeCounts.escalated > 0 && (
                <span className="rounded-full bg-orange-50 px-2.5 py-1 font-medium text-orange-800">
                  {outcomeCounts.escalated} escalated
                </span>
              )}
              {outcomeCounts.missed > 0 && (
                <span className="rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-800">
                  {outcomeCounts.missed} missed
                </span>
              )}
              {outcomeCounts.other > 0 && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                  {outcomeCounts.other} in progress
                </span>
              )}
            </div>
          )}
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
          onClick={() => void loadCalls()}
          disabled={viewState === "loading"}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Refresh
        </button>
      </div>

      {viewState === "ready" && calls.length > 0 && (
        <FilterBar
          outcome={outcomeFilter}
          intent={intentFilter}
          dateRange={dateFilter}
          onOutcomeChange={setOutcomeFilter}
          onIntentChange={setIntentFilter}
          onDateRangeChange={setDateFilter}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
          filteredCount={filteredCalls.length}
          totalCount={displayCalls.length}
        />
      )}

      {viewState === "loading" && <CallsTableSkeleton />}

      {viewState === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="text-sm font-medium text-red-800">
            Unable to load calls
          </p>
          <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
          <button
            type="button"
            onClick={() => void loadCalls()}
            className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {viewState === "ready" && calls.length === 0 && (
        <DashboardGettingStarted variant="calls" />
      )}

      {viewState === "ready" && calls.length > 0 && filteredCalls.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
          <p className="text-sm font-medium text-slate-700">No calls match your filters</p>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting or clearing the filters above.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Clear all filters
          </button>
        </div>
      )}

      {viewState === "ready" && filteredCalls.length > 0 && (
        <>
          {/* Scroll anchor for page changes */}
          <div ref={tableTopRef} />

          {/* Mobile card list */}
          <ul className="space-y-3 sm:hidden">
            {paginatedCalls.map((call) => {
              const caller = formatCaller(call);
              return (
                <li key={call.id}>
                  <Link
                    href={`/calls/${call.id}`}
                    className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-foreman-accent/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {caller.primary}
                        </p>
                        {caller.secondary ? (
                          <p className="truncate text-xs text-slate-500">
                            {caller.secondary}
                          </p>
                        ) : null}
                        <p className="mt-1 text-xs text-slate-500">
                          {formatCallTime(call.started_at)}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-slate-900">
                        {formatCurrency(call.est_value_usd)}
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <IntentBadge intent={call.intent} />
                      <OutcomeBadge outcome={call.outcome} />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile pagination */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm sm:hidden">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

          {/* Desktop / tablet table */}
          <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm sm:block">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2.5 font-semibold text-slate-600 sm:px-6 sm:py-3">
                    Time
                  </th>
                  <th className="px-3 py-2.5 font-semibold text-slate-600 sm:px-6 sm:py-3">
                    Caller
                  </th>
                  <th className="px-3 py-2.5 font-semibold text-slate-600 sm:px-6 sm:py-3">
                    Intent
                  </th>
                  <th className="px-3 py-2.5 font-semibold text-slate-600 sm:px-6 sm:py-3">
                    Outcome
                  </th>
                  <th className="px-3 py-2.5 font-semibold text-slate-600 text-right sm:px-6 sm:py-3">
                    Est. value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCalls.map((call) => {
                  const caller = formatCaller(call);
                  return (
                    <tr
                      key={call.id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="whitespace-nowrap px-3 py-3 text-slate-900 sm:px-6 sm:py-4">
                        <Link
                          href={`/calls/${call.id}`}
                          className="block hover:text-foreman-navy hover:underline"
                        >
                          {formatCallTime(call.started_at)}
                        </Link>
                      </td>
                      <td className="min-w-0 px-3 py-3 sm:px-6 sm:py-4">
                        <Link
                          href={`/calls/${call.id}`}
                          className="block min-w-0"
                        >
                          <div className="truncate font-medium text-slate-900 hover:text-foreman-navy">
                            {caller.primary}
                          </div>
                          {caller.secondary && (
                            <div className="truncate text-xs text-slate-500">
                              {caller.secondary}
                            </div>
                          )}
                        </Link>
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4">
                        <Link href={`/calls/${call.id}`} className="block">
                          <IntentBadge intent={call.intent} />
                        </Link>
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4">
                        <Link href={`/calls/${call.id}`} className="block">
                          <OutcomeBadge outcome={call.outcome} />
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-right font-medium text-slate-900 sm:px-6 sm:py-4">
                        <Link
                          href={`/calls/${call.id}`}
                          className="block hover:text-foreman-navy hover:underline"
                        >
                          {formatCurrency(call.est_value_usd)}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <p className="border-t border-slate-100 px-3 py-2 text-xs text-slate-400 sm:px-6">
              Click a call to open details, recording, intake, and transcript.
              Intent and value fill in when intake is saved or a job is booked.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export function CallsTableFallback() {
  return <CallsTableSkeleton />;
}
