import type { Metadata } from "next";
import { Suspense } from "react";

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
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Reports & Exports
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 sm:mt-2 sm:text-base">
          Weekly and monthly business reports with one-click CSV and PDF export.
        </p>
      </div>

      <Suspense fallback={<ReportsPanelFallback />}>
        <ReportsPanel />
      </Suspense>
    </section>
  );
}
