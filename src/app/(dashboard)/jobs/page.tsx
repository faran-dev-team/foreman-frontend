import type { Metadata } from "next";
import { Suspense } from "react";

import { JobsPanel, JobsPanelFallback } from "@/components/jobs/jobs-panel";

export const metadata: Metadata = {
  title: "Jobs | Foreman",
};

export default function JobsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Jobs</h2>
        <p className="mt-1.5 text-sm text-slate-600 sm:mt-2 sm:text-base">
          Booked jobs and revenue captured from Foreman-handled calls.
        </p>
      </div>

      <Suspense fallback={<JobsPanelFallback />}>
        <JobsPanel />
      </Suspense>
    </section>
  );
}
