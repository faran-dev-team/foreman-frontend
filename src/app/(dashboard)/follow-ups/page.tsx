import type { Metadata } from "next";
import { Suspense } from "react";

import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero";
import {
  FollowUpsPanel,
  FollowUpsPanelFallback,
} from "@/components/follow-ups/follow-ups-panel";

export const metadata: Metadata = {
  title: "Follow-ups | Foreman",
};

export default function FollowUpsPage() {
  return (
    <section className="space-y-6">
      <DashboardPageHero
        title="Follow ups"
        lead="Track feedback emails after completed jobs."
        support="Check status, delivery, rating, and retry a send if it fails."
      />

      <Suspense fallback={<FollowUpsPanelFallback />}>
        <FollowUpsPanel />
      </Suspense>
    </section>
  );
}
