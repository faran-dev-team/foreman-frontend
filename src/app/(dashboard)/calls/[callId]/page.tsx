import type { Metadata } from "next";
import { Suspense } from "react";

import {
  CallDetailPanel,
  CallDetailPanelFallback,
} from "@/components/calls/call-detail-panel";
import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero";

export const metadata: Metadata = {
  title: "Call details | Foreman",
};

type CallDetailPageProps = {
  params: { callId: string };
};

export default function CallDetailPage({ params }: CallDetailPageProps) {
  return (
    <section className="space-y-6">
      <DashboardPageHero
        title="Call details"
        lead="Recording, intake, summary, and transcript for this call."
        support="Review what happened and how it was handled."
      />

      <Suspense fallback={<CallDetailPanelFallback />}>
        <CallDetailPanel callId={params.callId} />
      </Suspense>
    </section>
  );
}
