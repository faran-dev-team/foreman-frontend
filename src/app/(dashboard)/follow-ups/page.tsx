import type { Metadata } from "next";
import { Suspense } from "react";

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
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Post-service follow-ups
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 sm:mt-2 sm:text-base">
          Track feedback emails after completed jobs — status, delivery, rating,
          and manual retry when a send fails.
        </p>
      </div>

      <Suspense fallback={<FollowUpsPanelFallback />}>
        <FollowUpsPanel />
      </Suspense>
    </section>
  );
}
