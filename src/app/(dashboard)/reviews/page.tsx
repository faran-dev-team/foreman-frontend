import type { Metadata } from "next";
import { Suspense } from "react";

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
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Review management
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 sm:mt-2 sm:text-base">
          Track Google review requests after completed jobs — status, delivery,
          and manual retry when a send fails.
        </p>
      </div>

      <Suspense fallback={<ReviewsPanelFallback />}>
        <ReviewsPanel />
      </Suspense>
    </section>
  );
}
