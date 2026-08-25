import type { Metadata } from "next";

import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero";
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
      <DashboardPageHero
        title="Follow up detail"
        lead="Delivery tracking and customer feedback for this follow up."
        support="Retry the send if it failed."
      />

      <FollowUpDetailPanel followUpId={params.followUpId} />
    </section>
  );
}
