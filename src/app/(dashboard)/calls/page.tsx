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
        <h2 className="text-2xl font-bold text-slate-900">Calls</h2>
        <p className="mt-2 text-slate-600">
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
