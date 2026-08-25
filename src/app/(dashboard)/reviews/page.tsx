import type { Metadata } from "next";
import { Suspense } from "react";

import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero";
import {
  ReviewsPanel,
  ReviewsPanelFallback,
} from "@/components/reviews/reviews-panel";

export const metadata: Metadata = {
  title: "Reviews | Foreman",
};

export default function ReviewsPage() {
  return (
    <section className="space-y-6">
      <DashboardPageHero
        title="Review management"
        lead="Track Google review requests after completed jobs."
        support="Check status, delivery, and retry a send if it fails."
      />

      <Suspense fallback={<ReviewsPanelFallback />}>
        <ReviewsPanel />
      </Suspense>
    </section>
  );
}
