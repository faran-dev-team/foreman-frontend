import type { Metadata } from "next";
import { Suspense } from "react";

import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero";
import { JobsPanel, JobsPanelFallback } from "@/components/jobs/jobs-panel";

export const metadata: Metadata = {
  title: "Jobs | Foreman",
};

export default function JobsPage() {
  return (
    <section className="space-y-6">
      <DashboardPageHero
        title="Jobs"
        lead="Booked jobs and revenue from calls Foreman handled."
        support="See what is scheduled and what came in."
      />

      <Suspense fallback={<JobsPanelFallback />}>
        <JobsPanel />
      </Suspense>
    </section>
  );
}
