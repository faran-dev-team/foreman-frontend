import type { Metadata } from "next";

import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero";
import { ReminderDetailPanel } from "@/components/reminders/reminder-detail-panel";

export const metadata: Metadata = {
  title: "Reminder detail | Foreman",
};

type ReminderDetailPageProps = {
  params: { reminderId: string };
};

export default function ReminderDetailPage({ params }: ReminderDetailPageProps) {
  return (
    <section className="space-y-6">
      <DashboardPageHero
        title="Reminder detail"
        lead="Delivery tracking for this appointment reminder."
        support="Retry the send if it failed."
      />

      <ReminderDetailPanel reminderId={params.reminderId} />
    </section>
  );
}
