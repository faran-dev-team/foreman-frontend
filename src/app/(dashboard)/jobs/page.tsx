import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs | Foreman",
};

export default function JobsPage() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900">Jobs</h2>
      <p className="mt-2 text-slate-600">
        Booked jobs and the Revenue Captured metric will live on this page.
      </p>
      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Jobs list placeholder — calendar view and revenue summary coming next.
      </div>
    </section>
  );
}
