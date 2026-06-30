import { UserButton } from "@clerk/nextjs";

import { DashboardMain } from "@/components/dashboard/dashboard-main";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-foreman-navy text-white">
        <div className="border-b border-slate-700 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Foreman
          </p>
          <h1 className="mt-1 text-lg font-semibold">Owner Dashboard</h1>
        </div>

        <DashboardNav />

        <div className="border-t border-slate-700 px-4 py-4">
          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white px-8 py-4">
          <p className="text-sm text-slate-500">Foreman MVP · Owner portal</p>
        </header>
        <DashboardMain>{children}</DashboardMain>
      </div>
    </div>
  );
}
