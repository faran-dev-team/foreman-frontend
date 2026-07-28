"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { useShop } from "@/components/dashboard/shop-provider";
import { SettingsSection } from "@/components/settings/settings-section";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";
import { fetchCallDetail, fetchCallIntake } from "@/lib/api/calls";
import { ApiError } from "@/lib/api/client";
import type { CallDetail, CallIntake } from "@/lib/api/types";

type ViewState = "loading" | "ready" | "error";

function formatCallTime(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDuration(seconds?: number | null): string {
  if (seconds == null || seconds < 0) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
}

function formatStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatServiceLabel(service: string): string {
  return service.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function CallDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
      <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-48 rounded bg-slate-200" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-full rounded bg-slate-100" />
        </div>
      </div>
      <div className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white" />
      <div className="h-56 animate-pulse rounded-xl border border-slate-200 bg-white" />
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-slate-900">{value}</dd>
    </div>
  );
}

type CallDetailPanelProps = {
  callId: string;
};

export function CallDetailPanel({ callId }: CallDetailPanelProps) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { shopId } = useShop();

  const [viewState, setViewState] = useState<ViewState>("loading");
  const [call, setCall] = useState<CallDetail | null>(null);
  const [intake, setIntake] = useState<CallIntake | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    if (!isLoaded) {
      setViewState("loading");
      return;
    }

    if (!isSignedIn) {
      setViewState("error");
      setErrorMessage("Sign in required to view this call.");
      return;
    }

    setViewState("loading");
    setErrorMessage(null);

    try {
      const detail = await withClerkAuthRetry(getToken, (token) =>
        fetchCallDetail(callId, token),
      );

      if (shopId && detail.shop_id !== shopId) {
        setViewState("error");
        setErrorMessage("This call does not belong to your shop.");
        setCall(null);
        setIntake(null);
        return;
      }

      let nextIntake: CallIntake | null = null;
      try {
        nextIntake = await withClerkAuthRetry(getToken, (token) =>
          fetchCallIntake(callId, token),
        );
      } catch (intakeError) {
        if (!(intakeError instanceof ApiError && intakeError.status === 404)) {
          throw intakeError;
        }
      }

      setCall(detail);
      setIntake(nextIntake);
      setViewState("ready");
    } catch (error) {
      setViewState("error");
      setCall(null);
      setIntake(null);
      if (error instanceof ApiError) {
        setErrorMessage(
          error.status === 404 ? "Call not found." : error.message,
        );
      } else if (error instanceof TypeError) {
        setErrorMessage(
          "Cannot reach the Foreman API. Is the backend running on NEXT_PUBLIC_API_URL?",
        );
      } else {
        setErrorMessage("Failed to load call details.");
      }
    }
  }, [callId, getToken, shopId, isLoaded, isSignedIn]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  if (!isLoaded && viewState === "loading") {
    return <CallDetailSkeleton />;
  }

  if (viewState === "loading") {
    return <CallDetailSkeleton />;
  }

  if (viewState === "error" || !call) {
    return (
      <div className="space-y-4">
        <Link
          href="/calls"
          className="inline-flex text-sm font-medium text-foreman-navy hover:underline"
        >
          ← Back to Calls
        </Link>
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="text-sm font-medium text-red-800">Unable to load call</p>
          <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
          <button
            type="button"
            onClick={() => void loadDetail()}
            className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayName =
    call.caller_name?.trim() ||
    intake?.customer_name?.trim() ||
    call.caller_phone ||
    "Unknown caller";

  const recordingUrl = call.recording_url?.trim() || null;
  const summary = call.summary?.trim() || null;
  const transcript = call.transcript?.trim() || null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/calls"
          className="inline-flex text-sm font-medium text-foreman-navy hover:underline"
        >
          ← Back to Calls
        </Link>
        <button
          type="button"
          onClick={() => void loadDetail()}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <SettingsSection
        title={
          displayName.length > 48
            ? `${displayName.slice(0, 45)}…`
            : displayName
        }
        description="Call overview — who called, when, and how long."
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          <MetaItem label="Phone" value={call.caller_phone || "—"} />
          <MetaItem label="Status" value={formatStatus(call.call_status)} />
          <MetaItem label="Started" value={formatCallTime(call.started_at)} />
          <MetaItem
            label="Duration"
            value={formatDuration(call.call_duration_seconds)}
          />
        </dl>
      </SettingsSection>

      <SettingsSection
        title="Recording"
        description="Play the call recording from Retell when available."
      >
        {recordingUrl ? (
          <div className="space-y-3">
            <audio
              controls
              preload="metadata"
              className="w-full"
              src={recordingUrl}
            >
              Your browser does not support audio playback.
            </audio>
            <a
              href={recordingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm font-medium text-foreman-navy hover:underline"
            >
              Open recording in new tab
            </a>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            Recording not available yet. It usually appears after the call ends
            and Retell finishes processing.
          </p>
        )}
      </SettingsSection>

      <SettingsSection
        title="Customer intake"
        description="Details collected during the conversation."
      >
        {intake ? (
          <dl className="grid gap-4 sm:grid-cols-2">
            <MetaItem label="Name" value={intake.customer_name || "—"} />
            <MetaItem label="Phone" value={intake.phone || "—"} />
            <MetaItem label="Email" value={intake.email || "—"} />
            <MetaItem
              label="Service"
              value={
                intake.service ? formatServiceLabel(intake.service) : "—"
              }
            />
            <MetaItem label="City" value={intake.city || "—"} />
            <MetaItem
              label="Preferred date"
              value={intake.preferred_date || "—"}
            />
          </dl>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            No intake saved for this call yet.
          </p>
        )}
      </SettingsSection>

      <SettingsSection
        title="Summary"
        description="Short AI summary of what happened on the call."
      >
        {summary ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
            {summary}
          </p>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            No summary available for this call.
          </p>
        )}
      </SettingsSection>

      <SettingsSection
        title="Transcript"
        description="Full conversation text from the call."
      >
        {transcript ? (
          <div className="max-h-[28rem] overflow-y-auto rounded-lg border border-slate-100 bg-slate-50/80 p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800">
              {transcript}
            </pre>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            No transcript available for this call.
          </p>
        )}
      </SettingsSection>
    </div>
  );
}

export function CallDetailPanelFallback() {
  return <CallDetailSkeleton />;
}
