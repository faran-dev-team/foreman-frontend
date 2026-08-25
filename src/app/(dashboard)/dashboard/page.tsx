import type { Metadata } from "next";
import { Suspense } from "react";

import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero";
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
      <DashboardPageHero
        title="Dashboard"
        lead="Revenue captured, call performance, lead sources, and live bookings."
        support="See what Foreman booked for your shop."
      />

      <Suspense fallback={<RevenueDashboardPanelFallback />}>
        <RevenueDashboardPanel />
      </Suspense>
    </section>
  );
}
