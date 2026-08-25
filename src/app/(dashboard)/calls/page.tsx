import type { Metadata } from "next";
import { Suspense } from "react";

import {
  CallsTable,
  CallsTableFallback,
} from "@/components/calls/calls-table";
import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero";

export const metadata: Metadata = {
  title: "Calls | Foreman",
};

export default function CallsPage() {
  return (
    <section className="space-y-6">
      <DashboardPageHero
        title="Calls"
        lead="Live and recent inbound calls."
        support="Time, caller, intent, outcome, and estimated value."
      />

      <Suspense fallback={<CallsTableFallback />}>
        <CallsTable />
      </Suspense>
    </section>
  );
}
