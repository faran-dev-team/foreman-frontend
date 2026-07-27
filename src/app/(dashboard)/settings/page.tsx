import type { Metadata } from "next";
import { Suspense } from "react";

import {
  GoogleCalendarConnect,
  GoogleCalendarConnectSkeleton,
} from "@/components/settings/google-calendar-connect";
import { ShopSettingsForms } from "@/components/settings/shop-settings-forms";

import { NotificationToggle } from "@/components/settings/notification-toggle";
import { NotificationPreferenceToggle } from "@/components/settings/notification-preference-toggle";

export const metadata: Metadata = {
  title: "Settings | Foreman",
};

export default function SettingsPage() {
  return (
    <section className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Settings</h2>
        <p className="mt-1.5 text-sm text-slate-600 sm:mt-2 sm:text-base">
          Manage integrations, shop configuration, and automation for reviews,
          reminders, and follow-ups.
        </p>
      </div>

      <NotificationPreferenceToggle />

      <NotificationToggle />

      <Suspense fallback={<GoogleCalendarConnectSkeleton />}>
        <GoogleCalendarConnect />
      </Suspense>

      <ShopSettingsForms />
    </section>
  );
}
