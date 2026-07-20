"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchCalendarStatus } from "@/lib/api/calendar";
import { useShop } from "@/components/dashboard/shop-provider";

type DashboardGettingStartedProps = {
  variant: "calls" | "jobs";
};

type CalendarBadgeState = "loading" | "connected" | "not_connected" | "hidden";

export function DashboardGettingStarted({ variant }: DashboardGettingStartedProps) {
  const { getToken } = useAuth();
  const { shopId } = useShop();
  const [calendarBadge, setCalendarBadge] = useState<CalendarBadgeState>(
    shopId ? "loading" : "hidden",
  );

  useEffect(() => {
    if (!shopId) {
      setCalendarBadge("hidden");
      return;
    }

    let cancelled = false;
    const resolvedShopId = shopId;

    async function loadCalendarStatus() {
      try {
        const token = await getToken();
        const status = await fetchCalendarStatus(resolvedShopId, token);
        if (!cancelled) {
          setCalendarBadge(status.connected ? "connected" : "not_connected");
        }
      } catch {
        if (!cancelled) {
          setCalendarBadge("not_connected");
        }
      }
    }

    void loadCalendarStatus();

    return () => {
      cancelled = true;
    };
  }, [getToken, shopId]);

  const calendarConnected = calendarBadge === "connected";

  const headline =
    variant === "calls"
      ? calendarConnected
        ? "Ready for calls — none in this shop yet"
        : "Your dashboard is ready — waiting for the first call"
      : calendarConnected
        ? "Calendar is connected — waiting for the first booking"
        : "No booked jobs yet — here's how to get started";

  const description = calendarConnected
    ? variant === "calls"
      ? "When customers call your Foreman number, handled calls will show up here automatically."
      : "When Foreman books an appointment on a call, the job and estimated revenue will appear here."
    : "Complete setup in Settings, then Foreman will populate this page automatically.";

  const steps =
    calendarConnected
      ? variant === "calls"
        ? [
            "Place a test call to your Foreman Twilio number.",
            "Let the agent collect intake and (optionally) book a job.",
            "Refresh this page — caller, outcome, and value will appear as the backend records them.",
          ]
        : [
            "Place a test call and complete a booking with the voice agent.",
            "Confirm the appointment email (Resend) and Google Calendar event were created.",
            "Refresh this page — booked jobs and revenue will show here.",
          ]
      : [
          "Connect Google Calendar in Settings so Foreman can check availability and book jobs.",
          "Configure business hours, services, and your service area in Settings.",
          variant === "calls"
            ? "Inbound calls handled by Foreman will appear here with caller, intent, outcome, and estimated value."
            : "When Foreman books a job during a call, it will show up here with schedule, service, and revenue.",
        ];

  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-lg">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-base font-semibold text-slate-900 sm:text-lg">{headline}</p>
          {calendarBadge === "loading" && (
            <span className="inline-flex animate-pulse rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              Checking calendar…
            </span>
          )}
          {calendarBadge === "connected" && (
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              Calendar connected
            </span>
          )}
          {calendarBadge === "not_connected" && (
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
              Calendar not connected
            </span>
          )}
        </div>

        <p className="mt-3 text-sm text-slate-600">{description}</p>

        <ol className="mt-6 space-y-4 text-left text-sm text-slate-700">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreman-navy text-xs font-semibold text-white">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
          {!calendarConnected && (
            <Link
              href="/settings"
              className="rounded-lg bg-foreman-navy px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Go to Settings
            </Link>
          )}
          {calendarConnected && variant === "jobs" && (
            <Link
              href="/calls"
              className="rounded-lg bg-foreman-navy px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              View Calls
            </Link>
          )}
          {calendarConnected && (
            <Link
              href="/settings"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Settings
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
