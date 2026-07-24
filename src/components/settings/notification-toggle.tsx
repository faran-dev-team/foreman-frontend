"use client";

import React from "react";
import { useNotification } from "@/components/providers/NotificationProvider";
import { Bell, BellOff, Loader2, ShieldCheck, Zap, Radio } from "lucide-react";

export function NotificationToggle() {
  const { permission, fcmToken, isRegistering, requestPermission, unsubscribe } =
    useNotification();

  const isSubscribed = permission === "granted" && Boolean(fcmToken);

  const handleToggle = async () => {
    if (isRegistering) return;

    if (isSubscribed) {
      await unsubscribe();
    } else {
      await requestPermission();
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md sm:p-7">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Side: Icon & Title */}
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
              isSubscribed
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-slate-100 text-slate-500 border border-slate-200/80"
            }`}
          >
            {isSubscribed ? (
              <Bell className="h-6 w-6" />
            ) : (
              <BellOff className="h-6 w-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-lg font-semibold text-slate-900">
                Push Notifications
              </h3>
              {isSubscribed ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200/60">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
                  Disabled
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-600 max-w-xl leading-relaxed">
              Get real-time browser push alerts whenever customer calls, new jobs, or critical status updates arrive.
            </p>
          </div>
        </div>

        {/* Right Side: Web Radio / Toggle Switch UI/UX */}
        <div className="flex items-center gap-4 shrink-0">
          {permission === "denied" ? (
            <div className="text-left sm:text-right">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 border border-rose-200">
                Blocked in Browser
              </span>
              <p className="mt-1 text-xs text-slate-500">
                Allow notifications in site settings.
              </p>
            </div>
          ) : (
            <div className="flex items-center">
              {/* Radio / Toggle Switch Control */}
              <button
                type="button"
                role="switch"
                aria-checked={isSubscribed}
                disabled={isRegistering}
                onClick={handleToggle}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:opacity-50 ${
                  isSubscribed ? "bg-emerald-600" : "bg-slate-200"
                }`}
                aria-label="Toggle push notifications"
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                    isSubscribed ? "translate-x-5" : "translate-x-0"
                  }`}
                >
                  {isRegistering && (
                    <Loader2 className="h-3 w-3 animate-spin text-slate-600" />
                  )}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feature highlights grid */}
      <div className="mt-6 grid grid-cols-1 gap-3 pt-6 border-t border-slate-100 sm:grid-cols-3">
        <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-lg border border-slate-100">
          <Zap className="h-4 w-4 text-amber-500 shrink-0" />
          <span>Real-time dispatch alerts</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-lg border border-slate-100">
          <Radio className="h-4 w-4 text-blue-500 shrink-0" />
          <span>Background tab push support</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-lg border border-slate-100">
          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>Secure FCM token syncing</span>
        </div>
      </div>
    </div>
  );
}
