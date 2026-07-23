"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { useShop } from "@/components/dashboard/shop-provider";
import { ApiError } from "@/lib/api/client";
import {
  fetchReviewRequest,
  retryReviewRequest,
  type ReviewRequestDetail,
} from "@/lib/api/reviews";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";

function formatWhen(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatService(jobType: string): string {
  return jobType
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bAc\b/g, "AC");
}

function canRetry(status: string): boolean {
  const key = status.toUpperCase();
  return key === "FAILED" || key === "FAILED_PERMANENT";
}

export function ReviewDetailPanel({ reviewId }: { reviewId: string }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { shopId, loading: shopLoading, resolvingMe } = useShop();

  const [detail, setDetail] = useState<ReviewRequestDetail | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  const loadDetail = useCallback(async () => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setErrorMessage("Sign in required.");
      setLoading(false);
      return;
    }
    if (resolvingMe || shopLoading) {
      setLoading(true);
      return;
    }
    if (!shopId) {
      setErrorMessage("No shop resolved for this account.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await withClerkAuthRetry(getToken, (token) =>
        fetchReviewRequest(shopId, reviewId, token),
      );
      setDetail(data);
    } catch (error) {
      setDetail(null);
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Failed to load review request.",
      );
    } finally {
      setLoading(false);
    }
  }, [
    getToken,
    isLoaded,
    isSignedIn,
    shopId,
    shopLoading,
    resolvingMe,
    reviewId,
  ]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const handleRetry = async () => {
    if (!shopId || !detail) return;
    setRetrying(true);
    setErrorMessage(null);
    try {
      const updated = await withClerkAuthRetry(getToken, (token) =>
        retryReviewRequest(shopId, detail.id, token, true),
      );
      setDetail(updated);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : "Retry failed.",
      );
    } finally {
      setRetrying(false);
    }
  };

  if (loading || resolvingMe || shopLoading) {
    return (
      <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
    );
  }

  if (errorMessage && !detail) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm font-medium text-red-800">{errorMessage}</p>
        <button
          type="button"
          onClick={() => void loadDetail()}
          className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!detail) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/reviews"
          className="text-sm font-medium text-foreman-navy hover:underline"
        >
          ← Back to reviews
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadDetail()}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
          >
            Refresh
          </button>
          {canRetry(detail.status) ? (
            <button
              type="button"
              disabled={retrying}
              onClick={() => void handleRetry()}
              className="rounded-lg bg-foreman-navy px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {retrying ? "Retrying…" : "Retry send"}
            </button>
          ) : null}
        </div>
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Review request
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              {detail.customer.name}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {detail.customer.phone}
              {detail.customer.email ? ` · ${detail.customer.email}` : ""}
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
            {detail.status}
          </span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Job
            </dt>
            <dd className="mt-1 text-sm text-slate-900">
              {formatService(detail.job.job_type)} · {detail.job.status}
            </dd>
            <dd className="text-xs text-slate-500">
              Completed {formatWhen(detail.job.completed_at)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Channel
            </dt>
            <dd className="mt-1 text-sm text-slate-900">
              {detail.delivery.delivery_channel}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Review URL
            </dt>
            <dd className="mt-1 break-all text-sm text-foreman-navy">
              {detail.delivery.review_url ? (
                <a
                  href={detail.delivery.review_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {detail.delivery.review_url}
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Provider message
            </dt>
            <dd className="mt-1 text-sm text-slate-900">
              {detail.delivery.provider_message_id || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Scheduled
            </dt>
            <dd className="mt-1 text-sm text-slate-900">
              {formatWhen(detail.retry.scheduled_at)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Next attempt
            </dt>
            <dd className="mt-1 text-sm text-slate-900">
              {formatWhen(detail.retry.next_attempt_at)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Sent
            </dt>
            <dd className="mt-1 text-sm text-slate-900">
              {formatWhen(detail.delivery.sent_at)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Attempts / retries
            </dt>
            <dd className="mt-1 text-sm text-slate-900">
              {detail.retry.attempt_count} / {detail.retry.retry_count}
            </dd>
          </div>
        </dl>

        {detail.delivery.failure_reason ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {detail.delivery.failure_reason}
          </p>
        ) : null}
      </div>
    </div>
  );
}
