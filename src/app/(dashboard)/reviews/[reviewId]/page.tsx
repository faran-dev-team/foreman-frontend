import type { Metadata } from "next";

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
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Review request
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 sm:mt-2 sm:text-base">
          Delivery tracking and retry for this Google review ask.
        </p>
      </div>

      <ReviewDetailPanel reviewId={params.reviewId} />
    </section>
  );
}
