import type { Metadata } from "next";

import { FollowUpDetailPanel } from "@/components/follow-ups/follow-up-detail-panel";

export const metadata: Metadata = {
  title: "Follow-up detail | Foreman",
};

type FollowUpDetailPageProps = {
  params: { followUpId: string };
};

export default function FollowUpDetailPage({ params }: FollowUpDetailPageProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Follow-up detail
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 sm:mt-2 sm:text-base">
          Delivery tracking, retry, and staff-recorded customer feedback.
        </p>
      </div>

      <FollowUpDetailPanel followUpId={params.followUpId} />
    </section>
  );
}
