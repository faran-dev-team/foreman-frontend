import type { Metadata } from "next";

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
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Reminder detail
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 sm:mt-2 sm:text-base">
          Delivery tracking and retry for this appointment reminder.
        </p>
      </div>

      <ReminderDetailPanel reminderId={params.reminderId} />
    </section>
  );
}
