import type { Metadata } from "next";
import { Suspense } from "react";

import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero";
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
      <DashboardPageHero
        title="Settings"
        lead="Manage integrations, shop setup, and automation."
        support="Reviews, reminders, and follow ups."
      />

      <NotificationPreferenceToggle />

      <NotificationToggle />

      <Suspense fallback={<GoogleCalendarConnectSkeleton />}>
        <GoogleCalendarConnect />
      </Suspense>

      <ShopSettingsForms />
    </section>
  );
}
