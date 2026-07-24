"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { useShop } from "@/components/dashboard/shop-provider";
import { ApiError } from "@/lib/api/client";
import {
  fetchFollowUp,
  retryFollowUp,
  submitFollowUpFeedback,
  type FollowUpDetail,
} from "@/lib/api/follow-ups";
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
  return status.toUpperCase() === "FAILED";
}

export function FollowUpDetailPanel({ followUpId }: { followUpId: string }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { shopId, loading: shopLoading, resolvingMe } = useShop();

  const [detail, setDetail] = useState<FollowUpDetail | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

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
        fetchFollowUp(shopId, followUpId, token),
      );
      setDetail(data);
      if (data.feedback.rating != null) {
        setRating(data.feedback.rating);
      }
      if (data.feedback.feedback) {
        setFeedbackText(data.feedback.feedback);
      }
    } catch (error) {
      setDetail(null);
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Failed to load follow-up.",
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
    followUpId,
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
        retryFollowUp(shopId, detail.id, token, true),
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

  const handleSubmitFeedback = async () => {
    if (!shopId || !detail) return;
    setSubmittingFeedback(true);
    setFeedbackMessage(null);
    setErrorMessage(null);
    try {
      const updated = await withClerkAuthRetry(getToken, (token) =>
        submitFollowUpFeedback(
          shopId,
          detail.id,
          rating,
          token,
          feedbackText,
        ),
      );
      setDetail(updated);
      setFeedbackMessage(
        "Feedback saved. Owner notification is sent best-effort by the API.",
      );
    } catch (error) {
      setFeedbackMessage(
        error instanceof ApiError
          ? error.message
          : "Could not save feedback.",
      );
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading || resolvingMe || shopLoading) {
    return <div className="h-64 animate-pulse rounded-xl bg-slate-200" />;
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
          href="/follow-ups"
          className="text-sm font-medium text-foreman-navy hover:underline"
        >
          ← Back to follow-ups
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
              Service follow-up
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
            <dd className="mt-1 font-mono text-xs text-slate-400">
              {detail.job.id}
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
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Owner notified
            </dt>
            <dd className="mt-1 text-sm text-slate-900">
              {detail.feedback.owner_notified
                ? `Yes · ${formatWhen(detail.feedback.owner_notified_at)}`
                : "No"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Feedback submitted
            </dt>
            <dd className="mt-1 text-sm text-slate-900">
              {formatWhen(detail.feedback.submitted_at)}
            </dd>
          </div>
        </dl>

        {detail.delivery.failure_reason ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {detail.delivery.failure_reason}
          </p>
        ) : null}

        {detail.feedback.owner_notification_failure_reason ? (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Owner notify: {detail.feedback.owner_notification_failure_reason}
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900">
          Record customer feedback
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Staff can save a 1–5 rating here (authenticated API). There is no
          public customer form in this pass.
        </p>

        {detail.feedback.rating != null ? (
          <p className="mt-3 text-sm text-slate-700">
            Current rating:{" "}
            <span className="font-semibold">{detail.feedback.rating}/5</span>
            {detail.feedback.feedback
              ? ` — “${detail.feedback.feedback}”`
              : ""}
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-3 sm:max-w-md">
          <label className="text-xs font-medium text-slate-600" htmlFor="rating">
            Rating
          </label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} / 5
              </option>
            ))}
          </select>

          <label
            className="text-xs font-medium text-slate-600"
            htmlFor="feedback-text"
          >
            Comment (optional)
          </label>
          <textarea
            id="feedback-text"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={3}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Customer comments…"
          />

          <button
            type="button"
            disabled={submittingFeedback}
            onClick={() => void handleSubmitFeedback()}
            className="rounded-lg bg-foreman-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-50 sm:w-fit"
          >
            {submittingFeedback ? "Saving…" : "Save feedback"}
          </button>
          {feedbackMessage ? (
            <p className="text-xs text-slate-600">{feedbackMessage}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
