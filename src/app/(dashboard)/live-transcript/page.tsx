import type { Metadata } from "next";
import { Suspense } from "react";

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
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Live Transcript
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 sm:mt-2 sm:text-base">
          Watch active AI conversations as live text, then take over if you need
          to call the customer yourself. Live audio is not available.
        </p>
      </div>

      <Suspense fallback={<LiveTranscriptPanelFallback />}>
        <LiveTranscriptPanel />
      </Suspense>
    </section>
  );
}
