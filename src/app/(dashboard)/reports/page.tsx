import type { Metadata } from "next";
import { Suspense } from "react";

import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero";
import {
  ReportsPanel,
  ReportsPanelFallback,
} from "@/components/reports/reports-panel";

export const metadata: Metadata = {
  title: "Reports | Foreman",
};

export default function ReportsPage() {
  return (
    <section className="space-y-6">
      <DashboardPageHero
        title="Reports and exports"
        lead="Weekly and monthly business reports."
        support="Download CSV or PDF in one click."
      />

      <Suspense fallback={<ReportsPanelFallback />}>
        <ReportsPanel />
      </Suspense>
    </section>
  );
}
