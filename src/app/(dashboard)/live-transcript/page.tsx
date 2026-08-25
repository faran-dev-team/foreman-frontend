import type { Metadata } from "next";
import { Suspense } from "react";

import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero";
import {
  LiveTranscriptPanel,
  LiveTranscriptPanelFallback,
} from "@/components/live-transcript/live-transcript-panel";

export const metadata: Metadata = {
  title: "Live Transcript | Foreman",
};

export default function LiveTranscriptPage() {
  return (
    <section className="space-y-6">
      <DashboardPageHero
        title="Live Transcript"
        lead="Watch the conversation as live text."
        support="Take over if you need to call the customer. Live audio is not available."
      />

      <Suspense fallback={<LiveTranscriptPanelFallback />}>
        <LiveTranscriptPanel />
      </Suspense>
    </section>
  );
}
