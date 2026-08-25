import type { Metadata } from "next";

import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero";
import { ReviewDetailPanel } from "@/components/reviews/review-detail-panel";

export const metadata: Metadata = {
  title: "Review detail | Foreman",
};

type ReviewDetailPageProps = {
  params: { reviewId: string };
};

export default function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  return (
    <section className="space-y-6">
      <DashboardPageHero
        title="Review request"
        lead="Delivery tracking for this Google review request."
        support="Retry the send if it failed."
      />

      <ReviewDetailPanel reviewId={params.reviewId} />
    </section>
  );
}
