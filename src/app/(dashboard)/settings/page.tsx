import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Foreman",
};

export default function SettingsPage() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
      <p className="mt-2 text-slate-600">
        Business hours, services, service area, Google Calendar connection, and
        agent greeting will be configured here.
      </p>
      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Settings form placeholder — shop configuration UI coming next.
      </div>
    </section>
  );
}
