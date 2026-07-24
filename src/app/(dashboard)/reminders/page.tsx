import type { Metadata } from "next";
import { Suspense } from "react";

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
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Appointment reminders
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 sm:mt-2 sm:text-base">
          Track 24-hour and 1-hour reminder emails — status, delivery, and
          manual retry when a send fails.
        </p>
      </div>

      <Suspense fallback={<RemindersPanelFallback />}>
        <RemindersPanel />
      </Suspense>
    </section>
  );
}
