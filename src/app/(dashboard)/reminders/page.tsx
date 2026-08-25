import type { Metadata } from "next";
import { Suspense } from "react";

import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero";
import {
  RemindersPanel,
  RemindersPanelFallback,
} from "@/components/reminders/reminders-panel";

export const metadata: Metadata = {
  title: "Reminders | Foreman",
};

export default function RemindersPage() {
  return (
    <section className="space-y-6">
      <DashboardPageHero
        title="Appointment reminders"
        lead="Track reminder emails sent a day before and an hour before the visit."
        support="Check status, delivery, and retry a send if it fails."
      />

      <Suspense fallback={<RemindersPanelFallback />}>
        <RemindersPanel />
      </Suspense>
    </section>
  );
}
