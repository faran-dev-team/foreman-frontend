"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { useShop } from "@/components/dashboard/shop-provider";
import { ApiError } from "@/lib/api/client";
import {
  fetchActiveLiveCalls,
  pollLiveListenSession,
  startLiveListen,
  stopLiveListen,
  takeOverLiveCall,
  type ActiveLiveCallItem,
  type LiveListenTakeOverResponse,
} from "@/lib/api/live-listen";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";

type ViewState = "loading" | "ready" | "error";

type MonitorState = {
  call: ActiveLiveCallItem;
  sessionId: string;
  transcript: string;
  callStatus: string;
  sessionStatus: "listening" | "ended" | "stopped";
  pollIntervalMs: number;
  audioUnavailableReason: string;
};

const ACTIVE_CALLS_POLL_INTERVAL_MS = 10_000;

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

function formatDuration(seconds?: number | null): string {
  if (seconds == null || seconds < 0) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
}

function priorityBadgeClass(priority: string): string {
  const key = priority.toUpperCase();
  if (key === "EMERGENCY") return "bg-red-100 text-red-800";
  if (key === "HIGH") return "bg-amber-100 text-amber-900";
  return "bg-slate-100 text-slate-700";
}

function LiveTranscriptSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-20 animate-pulse rounded-xl bg-slate-200" />
      <div className="h-48 animate-pulse rounded-xl bg-slate-200" />
    </div>
  );
}

export function LiveTranscriptPanel() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { shopId, loading: shopLoading, resolvingMe } = useShop();

  const [viewState, setViewState] = useState<ViewState>("loading");
  const [activeCalls, setActiveCalls] = useState<ActiveLiveCallItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [startingCallId, setStartingCallId] = useState<string | null>(null);
  const [stopping, setStopping] = useState(false);
  const [takingOver, setTakingOver] = useState(false);
  const [monitor, setMonitor] = useState<MonitorState | null>(null);
  const [takeOverResult, setTakeOverResult] =
    useState<LiveListenTakeOverResponse | null>(null);
  const [activeCallsRefreshing, setActiveCallsRefreshing] = useState(false);
  const [transcriptRefreshing, setTranscriptRefreshing] = useState(false);

  const transcriptScrollRef = useRef<HTMLDivElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const monitorRef = useRef<MonitorState | null>(null);

  useEffect(() => {
    monitorRef.current = monitor;
  }, [monitor]);

  const loadActiveCalls = useCallback(
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
          setErrorMessage("Sign in required to monitor live conversations.");
        }
        return;
      }
      if (resolvingMe || shopLoading) {
        if (!silent) {
          setViewState("loading");
        }
        return;
      }
      if (!shopId) {
        if (!silent) {
          setViewState("error");
          setErrorMessage("No shop resolved for this account.");
        }
        return;
      }

      if (!silent) {
        setActiveCallsRefreshing(true);
      }

      try {
        const data = await withClerkAuthRetry(getToken, (token) =>
          fetchActiveLiveCalls(shopId, token),
        );
        setActiveCalls(data.active_calls);
        setLastUpdatedAt(new Date());
        setErrorMessage(null);
        setViewState("ready");
      } catch (err) {
        if (silent) {
          return;
        }

        const message =
          err instanceof ApiError
            ? err.message
            : "Failed to load active calls.";
        setErrorMessage(message);
        setViewState("error");
      } finally {
        if (!silent) {
          setActiveCallsRefreshing(false);
        }
      }
    },
    [getToken, isLoaded, isSignedIn, resolvingMe, shopId, shopLoading],
  );

  useEffect(() => {
    void loadActiveCalls();
  }, [loadActiveCalls]);

  // Refresh active list while not monitoring a session.
  useEffect(() => {
    if (monitor || viewState === "error") return;
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return;
      }
      void loadActiveCalls({ silent: true });
    }, ACTIVE_CALLS_POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [loadActiveCalls, monitor, viewState]);

  // Poll transcript while monitoring.
  useEffect(() => {
    if (!monitor || !shopId) return;
    if (monitor.sessionStatus !== "listening") return;

    let cancelled = false;
    const intervalMs = Math.max(monitor.pollIntervalMs || 1500, 1000);

    const tick = async () => {
      const current = monitorRef.current;
      if (!current || cancelled) return;

      setTranscriptRefreshing(true);

      try {
        const session = await withClerkAuthRetry(getToken, (token) =>
          pollLiveListenSession(
            shopId,
            current.call.call_id,
            current.sessionId,
            token,
          ),
        );
        if (cancelled) return;

        setMonitor((prev) =>
          prev
            ? {
                ...prev,
                transcript: session.transcript ?? "",
                callStatus: session.call_status,
                sessionStatus: session.status,
              }
            : prev,
        );

        if (session.status !== "listening" || !session.is_active) {
          void loadActiveCalls({ silent: true });
        }
      } catch {
        // Keep last transcript; next poll may recover.
      } finally {
        if (!cancelled) {
          setTranscriptRefreshing(false);
        }
      }
    };

    const id = window.setInterval(() => {
      void tick();
    }, intervalMs);
    void tick();

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [
    getToken,
    loadActiveCalls,
    monitor,
    monitor?.call.call_id,
    monitor?.pollIntervalMs,
    monitor?.sessionId,
    monitor?.sessionStatus,
    shopId,
  ]);

  useEffect(() => {
    const box = transcriptScrollRef.current;
    if (!box) return;
    box.scrollTop = box.scrollHeight;
  }, [monitor?.transcript]);

  const handleStart = async (call: ActiveLiveCallItem) => {
    if (!shopId) return;
    setActionError(null);
    setTakeOverResult(null);
    setStartingCallId(call.call_id);

    try {
      const started = await withClerkAuthRetry(getToken, (token) =>
        startLiveListen(shopId, call.call_id, token),
      );
      setMonitor({
        call,
        sessionId: started.session_id,
        transcript: started.transcript ?? "",
        callStatus: started.call_status,
        sessionStatus: "listening",
        pollIntervalMs: started.poll_interval_ms ?? 1500,
        audioUnavailableReason:
          started.audio?.reason ||
          "Live audio is not available. You are viewing the conversation as text.",
      });
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? err.message
          : "Could not start transcript monitoring.",
      );
    } finally {
      setStartingCallId(null);
    }
  };

  const handleStop = async () => {
    if (!shopId || !monitor) return;
    setStopping(true);
    setActionError(null);

    try {
      await withClerkAuthRetry(getToken, (token) =>
        stopLiveListen(shopId, monitor.call.call_id, monitor.sessionId, token),
      );
      setMonitor((prev) =>
        prev ? { ...prev, sessionStatus: "stopped" } : prev,
      );
      await loadActiveCalls();
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? err.message
          : "Could not stop transcript monitoring.",
      );
    } finally {
      setStopping(false);
    }
  };

  const handleTakeOver = async () => {
    if (!shopId || !monitor) return;
    const confirmed = window.confirm(
      "Take over this call? The AI agent will be stopped and you will get the customer’s phone number to call them back.",
    );
    if (!confirmed) return;

    setTakingOver(true);
    setActionError(null);

    try {
      const result = await withClerkAuthRetry(getToken, (token) =>
        takeOverLiveCall(shopId, monitor.call.call_id, token, {
          sessionId: monitor.sessionId,
          reason: "Owner taking over from Live Transcript",
        }),
      );
      setTakeOverResult(result);
      setMonitor((prev) =>
        prev ? { ...prev, sessionStatus: "stopped" } : prev,
      );
      await loadActiveCalls();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Take over failed.",
      );
    } finally {
      setTakingOver(false);
    }
  };

  const leaveMonitor = () => {
    setMonitor(null);
    setTakeOverResult(null);
    setActionError(null);
    void loadActiveCalls();
  };

  if (viewState === "loading" && !monitor) {
    return <LiveTranscriptSkeleton />;
  }

  if (viewState === "error" && !monitor) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-800">
        <p className="font-medium">Could not load live conversations</p>
        <p className="mt-1">{errorMessage}</p>
        <button
          type="button"
          onClick={() => void loadActiveCalls()}
          className="mt-3 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-800"
        >
          Retry
        </button>
      </div>
    );
  }

  if (monitor) {
    const isListening = monitor.sessionStatus === "listening";
    const canTakeOver = monitor.call.capabilities?.take_over !== false;

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-semibold">Live transcript — not live audio</p>
          <p className="mt-1 text-amber-900/90">
            {monitor.audioUnavailableReason}
          </p>
          <p className="mt-2 text-xs text-amber-900/70">
            {transcriptRefreshing
              ? "Refreshing transcript…"
              : "Transcript polling is active."}
          </p>
        </div>

        {actionError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {actionError}
          </div>
        ) : null}

        {takeOverResult ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-950">
            <p className="font-semibold">Take over ready</p>
            <p className="mt-1">{takeOverResult.message}</p>
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-emerald-800/80">
                  Customer
                </dt>
                <dd className="font-medium">
                  {takeOverResult.customer_name?.trim() || "Unknown"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-emerald-800/80">
                  Phone
                </dt>
                <dd>
                  <a
                    href={`tel:${takeOverResult.customer_phone}`}
                    className="font-semibold text-foreman-accent hover:underline"
                  >
                    {takeOverResult.customer_phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-emerald-800/80">
                  AI stopped
                </dt>
                <dd>
                  {takeOverResult.ai_stopped ? "Yes" : "No — call manually"}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Monitoring
              </p>
              <h3 className="mt-1 truncate text-lg font-bold text-slate-900">
                {monitor.call.caller_name?.trim() ||
                  monitor.call.caller_phone ||
                  "Unknown caller"}
              </h3>
              <dl className="mt-2 grid gap-1 text-sm text-slate-600 sm:grid-cols-3">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">
                    Phone
                  </dt>
                  <dd className="break-all font-medium text-slate-800">
                    {monitor.call.caller_phone}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">
                    Call status
                  </dt>
                  <dd className="font-medium text-slate-800">
                    {monitor.callStatus}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">
                    Session
                  </dt>
                  <dd className="font-medium text-slate-800">
                    {monitor.sessionStatus}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
              {isListening ? (
                <>
                  <button
                    type="button"
                    onClick={() => void handleStop()}
                    disabled={stopping || takingOver}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
                  >
                    {stopping ? "Stopping…" : "Stop monitoring"}
                  </button>
                  {canTakeOver ? (
                    <button
                      type="button"
                      onClick={() => void handleTakeOver()}
                      disabled={takingOver || stopping}
                      className="w-full rounded-lg bg-foreman-accent px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 sm:w-auto"
                    >
                      {takingOver ? "Taking over…" : "Take over"}
                    </button>
                  ) : null}
                </>
              ) : (
                <button
                  type="button"
                  onClick={leaveMonitor}
                  className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 sm:w-auto"
                >
                  Back to active calls
                </button>
              )}
            </div>
          </div>

          <div
            ref={transcriptScrollRef}
            className="mt-4 max-h-[32rem] overflow-y-auto rounded-lg border border-slate-100 bg-slate-50/80 p-4"
          >
            {monitor.transcript.trim() ? (
              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-slate-800">
                {monitor.transcript}
              </pre>
            ) : (
              <p className="text-sm text-slate-500">
                Waiting for transcript updates…
                {isListening ? " Polling every few seconds." : ""}
              </p>
            )}
            <div ref={transcriptEndRef} />
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Stopping monitoring does not hang up the customer call.{" "}
            <Link
              href={`/calls/${monitor.call.call_id}`}
              className="font-medium text-foreman-accent hover:underline"
            >
              Open call details
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <p className="font-semibold">Monitor conversation as live text</p>
        <p className="mt-1 text-amber-900/90">
          Retell does not expose live call audio to third-party apps. Use this
          page to watch the transcript in real time, then take over if you need
          to call the customer yourself.
        </p>
      </div>

      {actionError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {actionError}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {activeCalls.length === 0
            ? "No active calls right now."
            : `${activeCalls.length} active call${activeCalls.length === 1 ? "" : "s"}`}
          {activeCallsRefreshing ? (
            <span className="text-slate-400"> · Refreshing…</span>
          ) : null}
          {lastUpdatedAt ? (
            <span className="text-slate-400">
              {" "}
              · Updated {formatWhen(lastUpdatedAt.toISOString())}
            </span>
          ) : null}
        </p>
        <button
          type="button"
          onClick={() => void loadActiveCalls()}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {activeCalls.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-800">
            No conversations to monitor
          </p>
          <p className="mt-1 text-sm text-slate-500">
            When a customer is talking with the AI agent, the call will appear
            here.
          </p>
          <Link
            href="/calls"
            className="mt-4 inline-block text-sm font-semibold text-foreman-accent hover:underline"
          >
            View call history
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <ul className="divide-y divide-slate-100">
            {activeCalls.map((call) => (
              <li
                key={call.call_id}
                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold text-slate-900">
                      {call.caller_name?.trim() ||
                        call.caller_phone ||
                        "Unknown caller"}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${priorityBadgeClass(call.priority)}`}
                    >
                      {call.priority}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-600">
                    {call.caller_phone}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Started {formatWhen(call.started_at)} · Duration{" "}
                    {formatDuration(call.duration_seconds)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleStart(call)}
                  disabled={startingCallId === call.call_id}
                  className="w-full shrink-0 rounded-lg bg-foreman-accent px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 sm:w-auto"
                >
                  {startingCallId === call.call_id
                    ? "Starting…"
                    : "Monitor conversation"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function LiveTranscriptPanelFallback() {
  return <LiveTranscriptSkeleton />;
}
