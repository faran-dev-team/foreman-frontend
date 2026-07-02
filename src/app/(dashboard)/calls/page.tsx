import type { Metadata } from "next";
import { Suspense } from "react";

import {
  CallsTable,
  CallsTableFallback,
} from "@/components/calls/calls-table";

export const metadata: Metadata = {
  title: "Calls | Foreman",
};

export default function CallsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Calls</h2>
        <p className="mt-1.5 text-sm text-slate-600 sm:mt-2 sm:text-base">
          Live and recent inbound calls — time, caller, intent, outcome, and
          estimated value.
        </p>
      </div>

      <Suspense fallback={<CallsTableFallback />}>
        <CallsTable />
      </Suspense>
    </section>
  );
}
