import type { Metadata } from "next";
import { Suspense } from "react";

import {
  GoogleCalendarConnect,
  GoogleCalendarConnectSkeleton,
} from "@/components/settings/google-calendar-connect";
import { ShopSettingsForms } from "@/components/settings/shop-settings-forms";

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

      <ShopSettingsForms />
    </section>
  );
}
