import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calls | Foreman",
};

export default function CallsPage() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900">Calls</h2>
      <p className="mt-2 text-slate-600">
        Live and recent inbound calls will appear here — time, caller, intent,
        outcome, and estimated value.
      </p>
      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Calls table placeholder — connect to <code>/dashboard/*</code> API in a
        later phase.
      </div>
    </section>
  );
}
