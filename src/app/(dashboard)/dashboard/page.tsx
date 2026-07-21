import type { Metadata } from "next";
import { Suspense } from "react";

import {
  RevenueDashboardPanel,
  RevenueDashboardPanelFallback,
} from "@/components/dashboard/revenue-dashboard-panel";

export const metadata: Metadata = {
  title: "Dashboard | Foreman",
};

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Dashboard</h2>
        <p className="mt-1.5 text-sm text-slate-600 sm:mt-2 sm:text-base">
          Revenue captured, jobs today, and conversion — what Foreman booked for your
          shop.
        </p>
      </div>

      <Suspense fallback={<RevenueDashboardPanelFallback />}>
        <RevenueDashboardPanel />
      </Suspense>
    </section>
  );
}
