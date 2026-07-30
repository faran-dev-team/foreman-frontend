import type { Metadata } from "next";
import { Suspense } from "react";

import {
  CallDetailPanel,
  CallDetailPanelFallback,
} from "@/components/calls/call-detail-panel";

export const metadata: Metadata = {
  title: "Call details | Foreman",
};

type CallDetailPageProps = {
  params: { callId: string };
};

export default function CallDetailPage({ params }: CallDetailPageProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Call details
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 sm:mt-2 sm:text-base">
          Recording, intake, summary, and transcript for this call.
        </p>
      </div>

      <Suspense fallback={<CallDetailPanelFallback />}>
        <CallDetailPanel callId={params.callId} />
      </Suspense>
    </section>
  );
}
