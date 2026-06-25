import type { Metadata } from "next";
import { Suspense } from "react";

import {
  GoogleCalendarConnect,
  GoogleCalendarConnectSkeleton,
} from "@/components/settings/google-calendar-connect";

export const metadata: Metadata = {
  title: "Settings | Foreman",
};

export default function SettingsPage() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="mt-2 text-slate-600">
          Manage integrations and shop configuration for your Foreman agent.
        </p>
      </div>

      <Suspense fallback={<GoogleCalendarConnectSkeleton />}>
        <GoogleCalendarConnect />
      </Suspense>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Business hours, services, service area, and agent greeting — coming next.
      </div>
    </section>
  );
}
